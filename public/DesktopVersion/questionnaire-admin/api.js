(function attachQuestionnaireApi(global) {
  "use strict";

  const DEV_TOKEN_STORAGE_KEY = "kkhc_questionnaire_admin_token";
  // 问卷管理端的测试与生产入口统一走已启用 HTTPS 的线上服务。
  const QUESTIONNAIRE_API_BASE_URL = "https://wechat-miniprogram-survey.kkhuacai08.cn";
  const API_BASES = {
    test: QUESTIONNAIRE_API_BASE_URL,
    prod: QUESTIONNAIRE_API_BASE_URL,
  };
  let env = "test";

  class ApiError extends Error {
    constructor({ code = "NETWORK_ERROR", message = "网络异常，请稍后重试", status = 0, data = null, requestId = "" } = {}) {
      super(message);
      this.name = "QuestionnaireApiError";
      this.code = code;
      this.status = status;
      this.data = data;
      this.requestId = requestId;
    }
  }

  function getAdminToken() {
    return global.localStorage.getItem(DEV_TOKEN_STORAGE_KEY) || "dev-admin-token-change-me";
  }

  function getAuthorizationHeader() {
    // 线上负载均衡仅放行标准 Authorization 请求头，令牌值仍沿用现有本地配置。
    return `Bearer ${getAdminToken()}`;
  }

  function getBaseUrl() {
    const baseUrl = API_BASES[env];
    if (!baseUrl) {
      throw new ApiError({ code: "API_NOT_CONFIGURED", message: "生产问卷接口未配置" });
    }
    return baseUrl;
  }

  function queryString(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
    });
    const text = query.toString();
    return text ? `?${text}` : "";
  }

  async function request(path, { method = "GET", body, signal } = {}) {
    let response;
    try {
      response = await global.fetch(`${getBaseUrl()}${path}`, {
        method,
        signal,
        // 管理数据必须读取实时字段，避免接口结构升级后复用旧 GET 响应。
        cache: "no-store",
        headers: {
          "Authorization": getAuthorizationHeader(),
          "Content-Type": "application/json; charset=UTF-8",
          // 线上负载均衡未放行 X-Request-Id，省略后由服务端自动生成并返回。
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error && error.name === "AbortError") throw error;
      throw new ApiError({ message: "无法连接问卷服务，请检查服务是否已启动" });
    }

    let envelope = null;
    try {
      envelope = await response.json();
    } catch (error) {
      throw new ApiError({ code: `HTTP_${response.status}`, message: "服务返回了无法识别的响应", status: response.status });
    }
    if (response.ok && envelope && envelope.code === "OK") return envelope.data;
    throw new ApiError({
      code: envelope && envelope.code ? envelope.code : `HTTP_${response.status}`,
      message: envelope && envelope.message ? envelope.message : "请求失败",
      status: response.status,
      data: envelope && envelope.data,
      requestId: envelope && envelope.requestId,
    });
  }

  async function getImageBlobUrl(contentUrl) {
    let response;
    try {
      const url = /^https?:\/\//i.test(contentUrl) ? contentUrl : `${getBaseUrl()}${contentUrl}`;
      response = await global.fetch(url, { cache: "no-store", headers: { "Authorization": getAuthorizationHeader() } });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError({ message: "图片加载失败" });
    }
    if (!response.ok) {
      let envelope = null;
      try { envelope = await response.json(); } catch (ignored) { /* binary endpoint may not return JSON */ }
      throw new ApiError({
        code: envelope && envelope.code ? envelope.code : `HTTP_${response.status}`,
        message: envelope && envelope.message ? envelope.message : "图片无权访问或已失效",
        status: response.status,
      });
    }
    return global.URL.createObjectURL(await response.blob());
  }

  const api = {
    ApiError,
    configure(nextEnv) { env = nextEnv === "prod" ? "prod" : "test"; },
    getConfig() { return { env, baseUrl: API_BASES[env], writeEnabled: Boolean(API_BASES[env]) }; },
    saveDevToken(token) {
      const value = String(token || "").trim();
      if (value) global.localStorage.setItem(DEV_TOKEN_STORAGE_KEY, value);
      else global.localStorage.removeItem(DEV_TOKEN_STORAGE_KEY);
    },
    listQuestionnaires(params) { return request(`/api/admin/questionnaires${queryString(params)}`); },
    createQuestionnaire(payload) { return request("/api/admin/questionnaires", { method: "POST", body: payload }); },
    getQuestionnaire(id) { return request(`/api/admin/questionnaires/${encodeURIComponent(id)}`); },
    updateQuestionnaire(id, payload) { return request(`/api/admin/questionnaires/${encodeURIComponent(id)}`, { method: "PUT", body: payload }); },
    deleteQuestionnaire(id, version) { return request(`/api/admin/questionnaires/${encodeURIComponent(id)}${queryString({ version })}`, { method: "DELETE" }); },
    publishQuestionnaire(id, version) { return request(`/api/admin/questionnaires/${encodeURIComponent(id)}/publish`, { method: "POST", body: { version } }); },
    closeQuestionnaire(id, version) { return request(`/api/admin/questionnaires/${encodeURIComponent(id)}/close`, { method: "POST", body: { version } }); },
    // 微信 AppSecret 只保存在后端；管理页面仅请求已经生成好的可复制链接。
    generateQuestionnaireShareLink(id, type) { return request(`/api/admin/questionnaires/${encodeURIComponent(id)}/share-link`, { method: "POST", body: { type } }); },
    getMiniProgramQuestionnaireConfig() { return request("/api/admin/mini-program/questionnaire"); },
    listMiniProgramQuestionnaireOptions() { return request("/api/admin/mini-program/questionnaire/options"); },
    // null 表示隐藏入口；具体问卷 ID 表示立即切换并显示。
    setMiniProgramQuestionnaire(questionnaireId) { return request("/api/admin/mini-program/questionnaire", { method: "PUT", body: { questionnaireId: questionnaireId || null } }); },
    listResponses(id, params) { return request(`/api/admin/questionnaires/${encodeURIComponent(id)}/responses${queryString(params)}`); },
    getResponse(responseId) { return request(`/api/admin/responses/${encodeURIComponent(responseId)}`); },
    // 单份答卷删除由服务端原子清理答案与绑定图片。
    deleteResponse(responseId) { return request(`/api/admin/responses/${encodeURIComponent(responseId)}`, { method: "DELETE" }); },
    getImageBlobUrl,
    revokeBlobUrl(url) { if (url && url.startsWith("blob:")) global.URL.revokeObjectURL(url); },
  };

  global.QuestionnaireApi = api;
}(window));
