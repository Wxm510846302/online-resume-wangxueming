(function initQuestionnaireAdmin(global) {
  "use strict";

  const api = global.QuestionnaireApi;
  const $ = (selector) => document.querySelector(selector);
  const STATUS_META = {
    DRAFT: { label: "草稿", className: "draft" },
    PUBLISHED: { label: "已发布", className: "published" },
    CLOSED: { label: "已下线", className: "closed" },
  };
  const TYPE_LABELS = {
    SINGLE_CHOICE: "单选题",
    MULTIPLE_CHOICE: "多选题",
    TEXT: "文本题",
    IMAGE: "图片题",
  };
  const CREATE_GUARD_KEY = "__kkhcQuestionnaireCreateGuard";
  const state = {
    env: "test",
    theme: "dark",
    currentScreen: "list",
    creatingQuestionnaire: false,
    pendingCreateRequestId: "",
    miniProgramConfig: { configured: false, visible: false, questionnaireId: "", questionnaireTitle: "", questionnaireStatus: "", updatedAt: "", selectedQuestionnaireId: "", options: [], loading: false, saving: false, error: "", sequence: 0 },
    list: { keyword: "", status: "", page: 1, size: 20, total: 0, totalPages: 1, items: [], loading: false, error: "", sequence: 0 },
    editor: { id: "", data: null, loading: false, error: "", dirty: false, errors: {}, sequence: 0 },
    responses: { questionnaireId: "", title: "", page: 1, size: 20, total: 0, totalPages: 1, items: [], selectedId: "", userId: "", submittedFrom: "", submittedTo: "", loading: false, error: "", detailLoading: false, detailError: "", detail: null, sequence: 0 },
    confirmResolver: null,
    toastTimer: null,
    blobUrls: new Set(),
    shareLinkRequests: new Set(),
  };

  function escapeHtml(value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  }

  function numberOrDefault(value, fallback) {
    return value === undefined || value === null || value === "" ? fallback : Number(value);
  }

  function createRequestId() {
    if (global.crypto && typeof global.crypto.randomUUID === "function") return global.crypto.randomUUID();
    // 本地 file:// 环境可能没有 randomUUID，降级生成同格式标识仍可保障一次创建只落一条记录。
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (token) => {
      const random = Math.floor(Math.random() * 16);
      const value = token === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  function statusBadge(status) {
    const meta = STATUS_META[status] || { label: status || "未知", className: "closed" };
    return `<span class="status-badge ${meta.className}">${escapeHtml(meta.label)}</span>`;
  }

  function showToast(message, type = "success") {
    const toast = $("#toast");
    global.clearTimeout(state.toastTimer);
    toast.textContent = message;
    toast.className = `toast ${type}`;
    state.toastTimer = global.setTimeout(() => toast.classList.add("hidden"), 3200);
  }

  async function copyText(text) {
    const value = String(text || "").trim();
    if (!value) throw new Error("没有可复制的链接");
    try {
      if (global.navigator.clipboard && global.isSecureContext) {
        await global.navigator.clipboard.writeText(value);
        return;
      }
    } catch (error) {
      // 浏览器可能因 iframe 权限拒绝现代剪贴板接口，继续使用兼容方案。
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      if (!document.execCommand("copy")) throw new Error("当前浏览器不允许访问剪贴板");
    } finally {
      textarea.remove();
    }
  }

  async function copyQuestionnaireShareLink(button, id, type) {
    const requestKey = `${id}:${type}`;
    if (!id || state.shareLinkRequests.has(requestKey)) return;
    state.shareLinkRequests.add(requestKey);
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "生成中…";
    try {
      const data = await api.generateQuestionnaireShareLink(id, type);
      await copyText(data && data.link);
      const label = type === "SHORT_LINK" ? "微信短链" : "通用链接";
      showToast(`${label}已复制，有效期 ${Number(data.expiresInDays) || 30} 天`);
    } catch (error) {
      showToast(error.message || "分享链接生成失败", "error");
    } finally {
      state.shareLinkRequests.delete(requestKey);
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  function setHidden(selector, hidden) {
    $(selector)?.classList.toggle("hidden", hidden);
  }

  function setScreen(screen) {
    state.currentScreen = screen;
    ["list", "editor", "responses"].forEach((name) => setHidden(`#${name}Screen`, name !== screen));
    // 新建入口只在列表页展示，避免编辑过程中再次误建空草稿。
    $("#newQuestionnaireBtn")?.classList.toggle("hidden", screen !== "list");
    syncNewQuestionnaireButton();
  }

  function readInitialConfig() {
    const params = new URLSearchParams(global.location.search);
    state.env = params.get("env") === "prod" ? "prod" : "test";
    state.theme = params.get("theme") === "light" ? "light" : "dark";
    applyRuntimeConfig();
  }

  function applyRuntimeConfig() {
    api.configure(state.env);
    document.body.classList.toggle("theme-light", state.theme === "light");
    $("#envBadge").textContent = state.env === "prod" ? "正式环境" : "测试环境";
    $("#envBadge").classList.toggle("is-prod", state.env === "prod");
    const config = api.getConfig();
    const warning = $("#configWarning");
    warning.textContent = config.writeEnabled ? "" : "生产问卷接口未配置，当前页面已禁止写操作。请完成生产认证与 HTTPS 接入后再启用。";
    warning.classList.toggle("hidden", config.writeEnabled);
    syncNewQuestionnaireButton();
    syncEditorControls();
    renderMiniProgramConfig();
  }

  function syncNewQuestionnaireButton() {
    const button = $("#newQuestionnaireBtn");
    if (!button) return;
    button.disabled = state.creatingQuestionnaire || !api.getConfig().writeEnabled;
    button.textContent = state.creatingQuestionnaire ? "正在创建…" : "新建问卷";
  }

  function syncEditorControls() {
    const data = state.editor.data;
    const readOnly = !data || data.status === "PUBLISHED" || !api.getConfig().writeEnabled;
    ["#saveQuestionnaireBtn", "#publishFromEditorBtn", "#addQuestionBtn", "#addFirstQuestionBtn"].forEach((selector) => {
      const element = $(selector);
      if (element) element.disabled = readOnly;
    });
  }

  async function confirmAction({ title, message, confirmText = "确认", danger = true }) {
    if (state.confirmResolver) state.confirmResolver(false);
    $("#confirmTitle").textContent = title;
    $("#confirmMessage").textContent = message;
    $("#confirmOkBtn").textContent = confirmText;
    $("#confirmOkBtn").className = `btn ${danger ? "btn-danger" : "btn-primary"}`;
    setHidden("#confirmModal", false);
    return new Promise((resolve) => { state.confirmResolver = resolve; });
  }

  function finishConfirm(result) {
    setHidden("#confirmModal", true);
    const resolver = state.confirmResolver;
    state.confirmResolver = null;
    if (resolver) resolver(result);
  }

  async function confirmDiscardEditor() {
    if (!state.editor.dirty) return true;
    return confirmAction({ title: "放弃未保存修改？", message: "当前问卷的未保存修改将丢失，此操作无法撤销。", confirmText: "放弃修改" });
  }

  function renderMiniProgramConfig() {
    const config = state.miniProgramConfig;
    const select = $("#miniQuestionnaireSelect");
    if (!select) return;
    const currentName = config.loading && !config.questionnaireTitle
      ? "读取中…"
      : config.visible
        ? config.questionnaireTitle || "问卷名称读取失败"
        : "不显示问卷入口";
    $("#currentMiniQuestionnaireName").textContent = currentName;
    $("#currentMiniQuestionnaireMeta").textContent = config.visible
      ? `已于 ${formatDateTime(config.updatedAt)} 生效；小程序入口与页面标题使用此名称。`
      : "小程序“我的”页面不会显示问卷入口；接口异常时也默认隐藏。";
    const questionnaireOptions = config.options.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.title)}</option>`).join("");
    select.innerHTML = `<option value="">不显示任何问卷</option>${questionnaireOptions}`;
    select.value = config.selectedQuestionnaireId;
    select.disabled = config.loading || config.saving;
    const saveButton = $("#saveMiniQuestionnaireBtn");
    const currentSelection = config.visible ? config.questionnaireId : "";
    saveButton.disabled = config.loading
      || config.saving
      || !api.getConfig().writeEnabled
      || select.value === currentSelection;
    saveButton.textContent = config.saving ? "正在保存…" : "保存配置";
    setHidden("#miniProgramConfigError", !config.error);
    $("#miniProgramConfigErrorMessage").textContent = config.error;
  }

  async function loadMiniProgramConfig() {
    const sequence = ++state.miniProgramConfig.sequence;
    state.miniProgramConfig.loading = true;
    state.miniProgramConfig.error = "";
    renderMiniProgramConfig();
    try {
      const [config, options] = await Promise.all([
        api.getMiniProgramQuestionnaireConfig(),
        api.listMiniProgramQuestionnaireOptions(),
      ]);
      if (sequence !== state.miniProgramConfig.sequence) return;
      state.miniProgramConfig.configured = Boolean(config && config.configured);
      state.miniProgramConfig.visible = Boolean(config && config.visible);
      state.miniProgramConfig.questionnaireId = config && config.questionnaireId ? config.questionnaireId : "";
      state.miniProgramConfig.questionnaireTitle = config && config.questionnaireTitle ? config.questionnaireTitle : "";
      state.miniProgramConfig.questionnaireStatus = config && config.questionnaireStatus ? config.questionnaireStatus : "";
      state.miniProgramConfig.updatedAt = config && config.updatedAt ? config.updatedAt : "";
      state.miniProgramConfig.options = options && Array.isArray(options.items) ? options.items : [];
      state.miniProgramConfig.selectedQuestionnaireId = state.miniProgramConfig.visible ? state.miniProgramConfig.questionnaireId : "";
    } catch (error) {
      if (sequence !== state.miniProgramConfig.sequence) return;
      state.miniProgramConfig.error = error.message || "小程序展示配置加载失败";
      state.miniProgramConfig.options = [];
    } finally {
      if (sequence === state.miniProgramConfig.sequence) {
        state.miniProgramConfig.loading = false;
        renderMiniProgramConfig();
        renderList();
      }
    }
  }

  async function saveMiniProgramConfig() {
    const config = state.miniProgramConfig;
    const selectedId = config.selectedQuestionnaireId;
    const selected = config.options.find((item) => item.id === selectedId);
    const currentSelection = config.visible ? config.questionnaireId : "";
    if (config.saving || selectedId === currentSelection || (selectedId && !selected)) return;
    const hiding = !selectedId;
    const confirmed = await confirmAction({
      title: hiding ? "隐藏小程序问卷入口？" : "切换小程序展示问卷？",
      message: hiding
        ? "保存后，小程序“我的”页面将不再显示任何问卷入口。"
        : `保存后，小程序将立即展示“${selected.title}”，入口名称也会同步更新。`,
      confirmText: hiding ? "确认隐藏" : "保存并生效",
      danger: hiding,
    });
    if (!confirmed) return;
    config.saving = true;
    config.error = "";
    renderMiniProgramConfig();
    try {
      await api.setMiniProgramQuestionnaire(selectedId);
      showToast(hiding ? "小程序问卷入口已隐藏" : `“${selected.title}”已在小程序生效`);
      await loadMiniProgramConfig();
    } catch (error) {
      config.error = error.message || "小程序展示配置保存失败";
      showToast(config.error, "error");
    } finally {
      config.saving = false;
      renderMiniProgramConfig();
    }
  }

  function loadListScreen() {
    // 两块数据并行刷新，让列表标记与当前生效配置保持一致。
    return Promise.allSettled([loadMiniProgramConfig(), loadList()]);
  }

  function renderList() {
    const list = state.list;
    setHidden("#listLoading", !list.loading);
    setHidden("#listError", !list.error || list.loading);
    setHidden("#listEmpty", list.loading || Boolean(list.error) || list.items.length > 0);
    setHidden("#listTableWrap", list.loading || Boolean(list.error) || list.items.length === 0);
    setHidden("#listPager", list.loading || Boolean(list.error) || list.items.length === 0);
    $("#listErrorMessage").textContent = list.error;
    $("#listTotal").textContent = `共 ${list.total} 条`;
    $("#listPageInfo").textContent = `${list.page} / ${list.totalPages}`;
    $("#listPrevBtn").disabled = list.page <= 1;
    $("#listNextBtn").disabled = list.page >= list.totalPages;
    $("#questionnaireRows").innerHTML = list.items.map((item) => {
      const actions = [];
      if (item.status !== "PUBLISHED") actions.push(`<button class="btn btn-text" data-action="edit" data-id="${escapeHtml(item.id)}">编辑</button>`);
      if (item.status === "DRAFT" || item.status === "CLOSED") actions.push(`<button class="btn btn-text" data-action="publish" data-id="${escapeHtml(item.id)}" data-version="${item.version}">发布</button>`);
      if (item.status === "PUBLISHED") {
        actions.push(`<button class="btn btn-text" data-action="copy-share-link" data-id="${escapeHtml(item.id)}" data-link-type="SHORT_LINK">复制微信短链</button>`);
        actions.push(`<button class="btn btn-text" data-action="copy-share-link" data-id="${escapeHtml(item.id)}" data-link-type="URL_LINK">复制通用链接</button>`);
        actions.push(`<button class="btn btn-text danger" data-action="close" data-id="${escapeHtml(item.id)}" data-version="${item.version}">下线</button>`);
      }
      actions.push(`<button class="btn btn-text" data-action="responses" data-id="${escapeHtml(item.id)}" data-title="${escapeHtml(item.title)}">答卷</button>`);
      if (item.status === "DRAFT") actions.push(`<button class="btn btn-text danger" data-action="delete" data-id="${escapeHtml(item.id)}" data-version="${item.version}">删除</button>`);
      const activeBadge = state.miniProgramConfig.visible && item.id === state.miniProgramConfig.questionnaireId ? '<span class="active-mini-badge">小程序展示中</span>' : "";
      return `<tr>
        <td class="title-cell" data-label="问卷名称"><strong>${escapeHtml(item.title)}${activeBadge}</strong><small>ID：${escapeHtml(item.id)}</small></td>
        <td data-label="状态">${statusBadge(item.status)}</td><td data-label="题目 / 答卷">${Number(item.questionCount) || 0} 题 / ${Number(item.responseCount) || 0} 份</td>
        <td data-label="更新时间">${escapeHtml(formatDateTime(item.updatedAt))}</td><td data-label="发布时间">${escapeHtml(formatDateTime(item.publishedAt))}</td>
        <td data-label="操作"><div class="table-actions">${actions.join("")}</div></td></tr>`;
    }).join("");
  }

  async function loadList() {
    const sequence = ++state.list.sequence;
    state.list.loading = true;
    state.list.error = "";
    renderList();
    try {
      const data = await api.listQuestionnaires({ keyword: state.list.keyword, status: state.list.status, page: state.list.page, size: state.list.size });
      if (sequence !== state.list.sequence) return;
      state.list.items = Array.isArray(data.items) ? data.items : [];
      state.list.total = Number(data.total) || 0;
      state.list.page = Number(data.page) || 1;
      state.list.totalPages = Math.max(1, Number(data.totalPages) || 1);
    } catch (error) {
      if (sequence !== state.list.sequence) return;
      state.list.error = error.message || "问卷列表加载失败";
      state.list.items = [];
    } finally {
      if (sequence === state.list.sequence) { state.list.loading = false; renderList(); }
    }
  }

  async function createQuestionnaire() {
    // 页面锁与 window 共享 Promise 同时生效，即使脚本被重复挂载也只会发送一次创建请求。
    if (!api.getConfig().writeEnabled || state.creatingQuestionnaire) return;
    state.creatingQuestionnaire = true;
    syncNewQuestionnaireButton();
    let guard = global[CREATE_GUARD_KEY];
    if (!guard) {
      state.pendingCreateRequestId = state.pendingCreateRequestId || createRequestId();
      guard = {
        requestId: state.pendingCreateRequestId,
        promise: api.createQuestionnaire({
          title: "新问卷",
          description: "",
          requestId: state.pendingCreateRequestId,
        }),
      };
      global[CREATE_GUARD_KEY] = guard;
    } else {
      state.pendingCreateRequestId = guard.requestId;
    }
    try {
      const data = await guard.promise;
      state.pendingCreateRequestId = "";
      openEditorData(data);
      showToast("问卷草稿已创建");
    } catch (error) {
      // 明确收到业务错误时允许下次创建使用新标识；断网/超时则沿用原标识安全重试。
      if (!["NETWORK_ERROR", "REQUEST_TIMEOUT"].includes(error.code)) state.pendingCreateRequestId = "";
      showToast(error.message || "创建失败", "error");
    } finally {
      if (global[CREATE_GUARD_KEY] === guard) delete global[CREATE_GUARD_KEY];
      state.creatingQuestionnaire = false;
      syncNewQuestionnaireButton();
    }
  }

  async function openEditor(id) {
    setScreen("editor");
    state.editor = { id, data: null, loading: true, error: "", dirty: false, errors: {}, sequence: state.editor.sequence + 1 };
    renderEditorState();
    const sequence = state.editor.sequence;
    try {
      const data = await api.getQuestionnaire(id);
      if (sequence !== state.editor.sequence) return;
      state.editor.data = normalizeEditorData(data);
    } catch (error) {
      if (sequence !== state.editor.sequence) return;
      state.editor.error = error.message || "问卷配置加载失败";
    } finally {
      if (sequence === state.editor.sequence) { state.editor.loading = false; renderEditorState(); }
    }
  }

  function openEditorData(data) {
    state.editor = { id: data.id, data: normalizeEditorData(data), loading: false, error: "", dirty: false, errors: {}, sequence: state.editor.sequence + 1 };
    setScreen("editor");
    renderEditorState();
  }

  function normalizeEditorData(data) {
    return {
      ...data,
      title: data.title || "",
      description: data.description || "",
      maxSubmissionsPerUser: numberOrDefault(data.maxSubmissionsPerUser, 1),
      questions: [...(data.questions || [])].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder)).map((question, index) => ({
        ...question,
        sortOrder: index + 1,
        description: question.description || "",
        config: { ...(question.config || {}) },
        options: [...(question.options || [])].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder)).map((option, optionIndex) => ({ ...option, sortOrder: optionIndex + 1 })),
      })),
    };
  }

  function renderEditorState() {
    const editor = state.editor;
    setHidden("#editorLoading", !editor.loading);
    setHidden("#editorError", !editor.error || editor.loading);
    setHidden("#editorContent", editor.loading || Boolean(editor.error) || !editor.data);
    $("#editorErrorMessage").textContent = editor.error;
    if (editor.data) renderEditor();
  }

  function questionErrorSummary(index) {
    const prefix = `questions[${index}]`;
    return Object.entries(state.editor.errors).filter(([field]) => field.startsWith(prefix)).map(([, message]) => message);
  }

  function renderEditor() {
    const data = state.editor.data;
    if (!data) return;
    const readOnly = data.status === "PUBLISHED" || !api.getConfig().writeEnabled;
    $("#editorHeading").textContent = state.editor.dirty ? `${data.title || "未命名问卷"}（未保存）` : (data.title || "未命名问卷");
    $("#editorStatusBadge").outerHTML = statusBadge(data.status).replace("status-badge", "status-badge" ).replace(">", ` id="editorStatusBadge">`);
    $("#titleInput").value = data.title;
    $("#titleInput").disabled = readOnly;
    $("#descriptionInput").value = data.description;
    $("#descriptionInput").disabled = readOnly;
    $("#maxSubmissionsInput").value = data.maxSubmissionsPerUser;
    $("#maxSubmissionsInput").disabled = readOnly;
    $("#descriptionCount").textContent = data.description.length;
    $("#titleError").textContent = state.editor.errors.title || "";
    $("#maxSubmissionsError").textContent = state.editor.errors.maxSubmissionsPerUser || "";
    $("#questionCount").textContent = `${data.questions.length} / 100`;
    setHidden("#publishedNotice", data.status !== "PUBLISHED");
    setHidden("#questionEmpty", data.questions.length > 0);
    $("#questionNav").innerHTML = data.questions.map((question, index) => `<button type="button" data-scroll-question="${index}">${index + 1}. ${escapeHtml(question.title || TYPE_LABELS[question.type] || "未命名题目")}</button>`).join("");
    $("#questionEditorList").innerHTML = data.questions.map((question, index) => renderQuestionCard(question, index, readOnly)).join("");
    $("#saveQuestionnaireBtn").textContent = state.editor.dirty ? "保存草稿" : "已保存";
    $("#saveQuestionnaireBtn").disabled = readOnly || !state.editor.dirty;
    $("#publishFromEditorBtn").disabled = readOnly || data.questions.length === 0;
    $("#publishFromEditorBtn").classList.toggle("hidden", data.status === "PUBLISHED");
    $("#addQuestionBtn").disabled = readOnly || data.questions.length >= 100;
    $("#addFirstQuestionBtn").disabled = readOnly;
  }

  function renderQuestionCard(question, index, readOnly) {
    const errors = questionErrorSummary(index);
    const base = `questions[${index}]`;
    const fieldError = (suffixes) => suffixes.map((suffix) => state.editor.errors[`${base}.${suffix}`]).find(Boolean) || "";
    const titleFieldError = fieldError(["title"]);
    const descriptionFieldError = fieldError(["description"]);
    const optionsFieldError = fieldError(["options", "optionLabels", "optionUnique"]);
    const configFieldError = fieldError(["config"]);
    const options = (question.options || []).map((option, optionIndex) => `<div class="option-row">
      <span>${optionIndex + 1}</span><input data-q-index="${index}" data-option-index="${optionIndex}" data-field="option-label" maxlength="100" value="${escapeHtml(option.label)}" ${readOnly ? "disabled" : ""} />
      <button class="btn btn-text option-move" data-q-action="option-up" data-q-index="${index}" data-option-index="${optionIndex}" type="button" ${readOnly || optionIndex === 0 ? "disabled" : ""}>上移</button>
      <button class="btn btn-text option-move" data-q-action="option-down" data-q-index="${index}" data-option-index="${optionIndex}" type="button" ${readOnly || optionIndex === question.options.length - 1 ? "disabled" : ""}>下移</button>
      <button class="btn btn-text danger" data-q-action="option-delete" data-q-index="${index}" data-option-index="${optionIndex}" type="button" ${readOnly || question.options.length <= 2 ? "disabled" : ""}>删除</button>
    </div>`).join("");
    let config = "";
    if (["SINGLE_CHOICE", "MULTIPLE_CHOICE"].includes(question.type)) {
      config = `<div class="config-panel"><div class="section-heading"><strong>选项配置（2–20 项）</strong><button class="btn btn-secondary" data-q-action="option-add" data-q-index="${index}" type="button" ${readOnly || question.options.length >= 20 ? "disabled" : ""}>添加选项</button></div><div class="option-list">${options}</div>${optionsFieldError ? `<p class="field-error">${escapeHtml(optionsFieldError)}</p>` : ""}${question.type === "MULTIPLE_CHOICE" ? `<div class="config-grid" style="margin-top:12px"><label class="field"><span>最少选择</span><input type="number" min="1" max="20" data-q-index="${index}" data-config="minSelections" value="${numberOrDefault(question.config.minSelections, 1)}" ${readOnly ? "disabled" : ""}></label><label class="field"><span>最多选择</span><input type="number" min="1" max="20" data-q-index="${index}" data-config="maxSelections" value="${numberOrDefault(question.config.maxSelections, Math.max(2, question.options.length))}" ${readOnly ? "disabled" : ""}></label></div>${configFieldError ? `<p class="field-error">${escapeHtml(configFieldError)}</p>` : ""}` : ""}</div>`;
    } else if (question.type === "TEXT") {
      config = `<div class="config-panel"><div class="config-grid"><label class="field"><span>最少字数</span><input type="number" min="0" max="5000" data-q-index="${index}" data-config="minLength" value="${numberOrDefault(question.config.minLength, 0)}" ${readOnly ? "disabled" : ""}></label><label class="field"><span>最多字数</span><input type="number" min="0" max="5000" data-q-index="${index}" data-config="maxLength" value="${numberOrDefault(question.config.maxLength, 1000)}" ${readOnly ? "disabled" : ""}></label></div>${configFieldError ? `<p class="field-error">${escapeHtml(configFieldError)}</p>` : ""}</div>`;
    } else if (question.type === "IMAGE") {
      config = `<div class="config-panel"><div class="config-grid"><label class="field"><span>最少图片</span><input type="number" min="0" max="9" data-q-index="${index}" data-config="minImages" value="${numberOrDefault(question.config.minImages, question.required ? 1 : 0)}" ${readOnly ? "disabled" : ""}></label><label class="field"><span>最多图片</span><input type="number" min="1" max="9" data-q-index="${index}" data-config="maxImages" value="${numberOrDefault(question.config.maxImages, 9)}" ${readOnly ? "disabled" : ""}></label></div>${configFieldError ? `<p class="field-error">${escapeHtml(configFieldError)}</p>` : ""}</div>`;
    }
    return `<article id="question-editor-${index}" class="panel question-editor-card">
      <div class="question-card-head"><div class="question-number"><strong>第 ${index + 1} 题</strong><span class="subtle">${escapeHtml(TYPE_LABELS[question.type] || question.type)}</span></div>
      <div class="question-card-actions"><button class="btn btn-text" data-q-action="up" data-q-index="${index}" type="button" ${readOnly || index === 0 ? "disabled" : ""}>上移</button><button class="btn btn-text" data-q-action="down" data-q-index="${index}" type="button" ${readOnly || index === state.editor.data.questions.length - 1 ? "disabled" : ""}>下移</button><button class="btn btn-text" data-q-action="copy" data-q-index="${index}" type="button" ${readOnly || state.editor.data.questions.length >= 100 ? "disabled" : ""}>复制</button><button class="btn btn-text danger" data-q-action="delete" data-q-index="${index}" type="button" ${readOnly ? "disabled" : ""}>删除</button></div></div>
      <div class="question-grid">
        <label class="field"><span>题型</span><select data-q-index="${index}" data-field="type" ${readOnly ? "disabled" : ""}>${Object.entries(TYPE_LABELS).map(([type, label]) => `<option value="${type}" ${question.type === type ? "selected" : ""}>${label}</option>`).join("")}</select></label>
        <label class="checkbox-field"><input type="checkbox" data-q-index="${index}" data-field="required" ${question.required ? "checked" : ""} ${readOnly ? "disabled" : ""}> 必填题</label>
        <label class="field"><span>题目标题 <em>*</em></span><input data-q-index="${index}" data-field="title" maxlength="200" value="${escapeHtml(question.title)}" ${readOnly ? "disabled" : ""}>${titleFieldError ? `<small class="field-error">${escapeHtml(titleFieldError)}</small>` : ""}</label>
        <label class="field span-all"><span>题目说明</span><textarea rows="2" maxlength="500" data-q-index="${index}" data-field="description" ${readOnly ? "disabled" : ""}>${escapeHtml(question.description)}</textarea>${descriptionFieldError ? `<small class="field-error">${escapeHtml(descriptionFieldError)}</small>` : ""}</label>
        ${config}
      </div>${errors.length ? `<p class="card-error-summary">${escapeHtml(errors.join("；"))}</p>` : ""}</article>`;
  }

  function defaultQuestion(type = "SINGLE_CHOICE") {
    const choice = ["SINGLE_CHOICE", "MULTIPLE_CHOICE"].includes(type);
    return { id: null, type, title: "", description: "", required: true, sortOrder: 1, config: type === "MULTIPLE_CHOICE" ? { minSelections: 1, maxSelections: 2 } : type === "TEXT" ? { minLength: 0, maxLength: 1000 } : type === "IMAGE" ? { minImages: 1, maxImages: 9 } : {}, options: choice ? [{ id: null, label: "选项 1", sortOrder: 1 }, { id: null, label: "选项 2", sortOrder: 2 }] : [] };
  }

  function markEditorDirty() {
    state.editor.dirty = true;
    state.editor.errors = {};
    $("#editorHeading").textContent = `${state.editor.data.title || "未命名问卷"}（未保存）`;
    $("#saveQuestionnaireBtn").textContent = "保存草稿";
    syncEditorControls();
    $("#saveQuestionnaireBtn").disabled = false;
  }

  function updateSortOrders() {
    state.editor.data.questions.forEach((question, index) => {
      question.sortOrder = index + 1;
      (question.options || []).forEach((option, optionIndex) => { option.sortOrder = optionIndex + 1; });
    });
  }

  function validateEditor({ forPublish = false } = {}) {
    const data = state.editor.data;
    const errors = {};
    const title = data.title.trim();
    if (!title || title.length > 100) errors.title = "问卷标题长度必须为 1–100 字";
    if (data.description.length > 1000) errors.description = "问卷说明不能超过 1000 字";
    if (!Number.isInteger(data.maxSubmissionsPerUser) || data.maxSubmissionsPerUser < 1 || data.maxSubmissionsPerUser > 100) errors.maxSubmissionsPerUser = "每个用户提交次数必须为 1–100 的整数";
    if (forPublish && data.questions.length === 0) errors.questions = "发布前至少需要 1 道题";
    if (data.questions.length > 100) errors.questions = "题目不能超过 100 道";
    data.questions.forEach((question, index) => {
      const base = `questions[${index}]`;
      const qTitle = question.title.trim();
      if (!qTitle || qTitle.length > 200) errors[`${base}.title`] = `第 ${index + 1} 题标题长度必须为 1–200 字`;
      if (question.description.length > 500) errors[`${base}.description`] = `第 ${index + 1} 题说明不能超过 500 字`;
      if (!TYPE_LABELS[question.type]) errors[`${base}.type`] = `第 ${index + 1} 题题型无效`;
      if (["SINGLE_CHOICE", "MULTIPLE_CHOICE"].includes(question.type)) {
        const options = question.options || [];
        if (options.length < 2 || options.length > 20) errors[`${base}.options`] = `第 ${index + 1} 题需要 2–20 个选项`;
        const labels = options.map((option) => option.label.trim());
        if (labels.some((label) => !label || label.length > 100)) errors[`${base}.optionLabels`] = `第 ${index + 1} 题选项文本长度必须为 1–100 字`;
        if (new Set(labels).size !== labels.length) errors[`${base}.optionUnique`] = `第 ${index + 1} 题选项不能重名`;
        if (question.type === "MULTIPLE_CHOICE") {
          const min = Number(question.config.minSelections);
          const max = Number(question.config.maxSelections);
          if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || min > max || max > options.length) errors[`${base}.config`] = `第 ${index + 1} 题选择范围需满足 1 ≤ 最少 ≤ 最多 ≤ 选项数`;
        }
      }
      if (question.type === "TEXT") {
        const min = Number(question.config.minLength);
        const max = Number(question.config.maxLength);
        if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || min > max || max > 5000) errors[`${base}.config`] = `第 ${index + 1} 题字数需满足 0 ≤ 最少 ≤ 最多 ≤ 5000`;
      }
      if (question.type === "IMAGE") {
        const min = Number(question.config.minImages);
        const max = Number(question.config.maxImages);
        if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || min > max || max > 9 || max < 1) errors[`${base}.config`] = `第 ${index + 1} 题图片数需满足 0 ≤ 最少 ≤ 最多 ≤ 9，最多至少为 1`;
      }
    });
    state.editor.errors = errors;
    return Object.keys(errors).length === 0;
  }

  function editorPayload() {
    updateSortOrders();
    return { version: state.editor.data.version, title: state.editor.data.title.trim(), description: state.editor.data.description.trim(), maxSubmissionsPerUser: state.editor.data.maxSubmissionsPerUser, questions: state.editor.data.questions.map((question) => ({ id: question.id || null, type: question.type, title: question.title.trim(), description: question.description.trim(), required: Boolean(question.required), sortOrder: question.sortOrder, config: { ...question.config }, options: (question.options || []).map((option) => ({ id: option.id || null, label: option.label.trim(), sortOrder: option.sortOrder })) })) };
  }

  function applyServerFieldErrors(error) {
    const fieldErrors = error && error.data && Array.isArray(error.data.fieldErrors) ? error.data.fieldErrors : [];
    if (!fieldErrors.length) return false;
    const mapped = {};
    fieldErrors.forEach((item) => {
      if (!item || !item.field) return;
      mapped[item.field] = item.message || item.reason || "字段配置不合法";
    });
    if (!Object.keys(mapped).length) return false;
    state.editor.errors = mapped;
    renderEditor();
    return true;
  }

  async function saveEditor({ silent = false } = {}) {
    if (!validateEditor()) { renderEditor(); showToast("请修正问卷配置后再保存", "error"); return null; }
    const button = $("#saveQuestionnaireBtn");
    button.disabled = true; button.textContent = "保存中…";
    try {
      const data = await api.updateQuestionnaire(state.editor.id, editorPayload());
      state.editor.data = normalizeEditorData(data);
      state.editor.dirty = false;
      state.editor.errors = {};
      renderEditor();
      if (!silent) showToast("问卷草稿已保存");
      return state.editor.data;
    } catch (error) {
      applyServerFieldErrors(error);
      if (error.code === "OPTIMISTIC_LOCK_CONFLICT") showToast("问卷已被其他操作更新，请刷新后重试", "error");
      else showToast(error.message || "保存失败", "error");
      return null;
    } finally { syncEditorControls(); }
  }

  async function publishFromEditor() {
    if (!validateEditor({ forPublish: true })) { renderEditor(); showToast("请完成并修正问卷配置后再发布", "error"); return; }
    if (state.editor.dirty && !(await saveEditor({ silent: true }))) return;
    const ok = await confirmAction({ title: "发布问卷？", message: "发布后小程序用户可立即填写，且题目配置将变为只读。", confirmText: "确认发布", danger: false });
    if (!ok) return;
    try {
      const result = await api.publishQuestionnaire(state.editor.id, state.editor.data.version);
      state.editor.data = { ...state.editor.data, ...result };
      state.editor.dirty = false;
      renderEditor();
      showToast("问卷已发布");
      await loadMiniProgramConfig();
    } catch (error) { applyServerFieldErrors(error); showToast(error.message || "发布失败", "error"); }
  }

  async function runListLifecycle(action, id, version) {
    const config = {
      publish: { title: "发布问卷？", message: "发布后小程序用户将可以看到并提交此问卷，题目配置会变为只读。", confirmText: "确认发布", call: () => api.publishQuestionnaire(id, version), danger: false },
      close: { title: "下线问卷？", message: "下线后将立即禁止新提交，正在填写的用户提交时也会收到问卷已结束提示。", confirmText: "确认下线", call: () => api.closeQuestionnaire(id, version), danger: true },
      delete: { title: "删除草稿？", message: "草稿及其全部题目配置将永久删除，此操作无法撤销。", confirmText: "永久删除", call: () => api.deleteQuestionnaire(id, version), danger: true },
    }[action];
    if (!config || !(await confirmAction(config))) return;
    try { await config.call(); showToast(action === "publish" ? "问卷已发布" : action === "close" ? "问卷已下线" : "草稿已删除"); await loadListScreen(); }
    catch (error) { showToast(error.message || "操作失败", "error"); }
  }

  function releaseBlobUrls() {
    state.blobUrls.forEach((url) => api.revokeBlobUrl(url));
    state.blobUrls.clear();
  }

  async function openResponses(questionnaireId, title) {
    releaseBlobUrls();
    state.responses = { questionnaireId, title, page: 1, size: 20, total: 0, totalPages: 1, items: [], selectedId: "", userId: "", submittedFrom: "", submittedTo: "", loading: false, error: "", detailLoading: false, detailError: "", detail: null, sequence: state.responses.sequence + 1 };
    $("#responseUserIdInput").value = ""; $("#submittedFromInput").value = ""; $("#submittedToInput").value = "";
    setScreen("responses");
    $("#responsesHeading").textContent = `${title} · 答卷`;
    await loadResponses();
  }

  function toIso(localValue) {
    if (!localValue) return "";
    const date = new Date(localValue);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  }

  async function loadResponses() {
    const responses = state.responses;
    const sequence = ++responses.sequence;
    responses.loading = true; responses.error = ""; renderResponses();
    try {
      const data = await api.listResponses(responses.questionnaireId, { userId: responses.userId, submittedFrom: toIso(responses.submittedFrom), submittedTo: toIso(responses.submittedTo), page: responses.page, size: responses.size });
      if (sequence !== responses.sequence) return;
      responses.items = Array.isArray(data.items) ? data.items : [];
      responses.total = Number(data.total) || 0;
      responses.page = Number(data.page) || 1;
      responses.totalPages = Math.max(1, Number(data.totalPages) || 1);
      if (!responses.items.some((item) => item.responseId === responses.selectedId)) {
        responses.selectedId = ""; responses.detail = null; responses.detailError = "";
      }
    } catch (error) { if (sequence === responses.sequence) { responses.error = error.message || "答卷列表加载失败"; responses.items = []; } }
    finally { if (sequence === responses.sequence) { responses.loading = false; renderResponses(); } }
  }

  function renderResponses() {
    const responses = state.responses;
    $("#responsesCount").textContent = `共 ${responses.total} 份`;
    setHidden("#responsesLoading", !responses.loading);
    setHidden("#responsesError", !responses.error || responses.loading);
    setHidden("#responsesEmpty", responses.loading || Boolean(responses.error) || responses.items.length > 0);
    setHidden("#responsesPager", responses.loading || Boolean(responses.error) || responses.items.length === 0);
    $("#responsesErrorMessage").textContent = responses.error;
    $("#responsesPageInfo").textContent = `${responses.page} / ${responses.totalPages}`;
    $("#responsesPrevBtn").disabled = responses.page <= 1;
    $("#responsesNextBtn").disabled = responses.page >= responses.totalPages;
    $("#responseItems").innerHTML = responses.loading || responses.error ? "" : responses.items.map((item) => `<button class="response-item ${item.responseId === responses.selectedId ? "active" : ""}" data-response-id="${escapeHtml(item.responseId)}" type="button"><strong>${escapeHtml(item.userId || "未知用户")}</strong><span>答卷 ${escapeHtml(item.responseId)}</span><span>提交于 ${escapeHtml(formatDateTime(item.submittedAt))} · 问卷 V${Number(item.questionnaireVersion) || 1}</span></button>`).join("");
    renderResponseDetail();
  }

  async function loadResponseDetail(responseId) {
    releaseBlobUrls();
    state.responses.selectedId = responseId; state.responses.detailLoading = true; state.responses.detailError = ""; state.responses.detail = null; renderResponses();
    try { state.responses.detail = await api.getResponse(responseId); }
    catch (error) { state.responses.detailError = error.message || "答卷详情加载失败"; }
    finally { state.responses.detailLoading = false; renderResponses(); if (state.responses.detail) loadDetailImages(); }
  }

  function answerDisplay(answer) {
    if (answer.displayValue !== null && answer.displayValue !== undefined && answer.displayValue !== "") return String(answer.displayValue);
    if (Array.isArray(answer.rawValue)) return answer.rawValue.length ? answer.rawValue.join("、") : "未作答";
    return answer.rawValue === null || answer.rawValue === undefined || answer.rawValue === "" ? "未作答" : String(answer.rawValue);
  }

  function renderResponseDetail() {
    const responses = state.responses;
    setHidden("#responseDetailPlaceholder", responses.detailLoading || Boolean(responses.detailError) || Boolean(responses.detail));
    setHidden("#responseDetailLoading", !responses.detailLoading);
    setHidden("#responseDetailError", !responses.detailError || responses.detailLoading);
    setHidden("#responseDetail", !responses.detail || responses.detailLoading || Boolean(responses.detailError));
    $("#responseDetailErrorMessage").textContent = responses.detailError;
    if (!responses.detail) return;
    const detail = responses.detail;
    const answers = [...(detail.answers || [])].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));
    $("#responseDetail").innerHTML = `<header class="response-meta"><div class="response-meta-title"><h2>${escapeHtml(detail.questionnaireTitle)}</h2><button class="btn btn-danger" type="button" data-delete-response="${escapeHtml(detail.responseId)}" ${api.getConfig().writeEnabled ? "" : "disabled"}>删除答卷</button></div><p>答卷 ID：${escapeHtml(detail.responseId)}</p><p>用户：${escapeHtml(detail.userId)} · 问卷 V${Number(detail.questionnaireVersion) || 1}</p><p>提交时间：${escapeHtml(formatDateTime(detail.submittedAt))}</p></header>${answers.map((answer, index) => `<section class="answer-card"><h3>${index + 1}. ${escapeHtml(answer.title)} <span class="subtle">${escapeHtml(TYPE_LABELS[answer.questionType] || answer.questionType)}</span></h3>${answer.questionType === "IMAGE" ? `<div class="answer-images">${(answer.images || []).map((image, imageIndex) => `<button class="answer-image-btn" type="button" data-blob-index="${index}-${imageIndex}" disabled><span class="image-loading" data-image-placeholder="${index}-${imageIndex}">图片加载中…</span></button>`).join("") || "<p>未上传图片</p>"}</div>` : `<p>${escapeHtml(answerDisplay(answer))}</p>`}</section>`).join("")}`;
  }

  // 删除成功后释放图片预览资源，并重新加载当前答卷分页。
  async function deleteSelectedResponse(responseId) {
    const confirmed = await confirmAction({ title: "删除答卷？", message: "答卷、全部答案及其上传图片将永久删除。删除后该用户可以重新填写本问卷，此操作无法撤销。", confirmText: "永久删除", danger: true });
    if (!confirmed) return;
    try {
      await api.deleteResponse(responseId);
      releaseBlobUrls();
      state.responses.selectedId = ""; state.responses.detail = null; state.responses.detailError = "";
      if (state.responses.items.length === 1 && state.responses.page > 1) state.responses.page -= 1;
      showToast("答卷已删除");
      await loadResponses();
    } catch (error) { showToast(error.message || "答卷删除失败", "error"); }
  }

  async function loadDetailImages() {
    const detail = state.responses.detail;
    if (!detail) return;
    const responseId = detail.responseId;
    const answers = [...(detail.answers || [])].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));
    const tasks = [];
    answers.forEach((answer, answerIndex) => (answer.images || []).forEach((image, imageIndex) => {
      tasks.push(api.getImageBlobUrl(image.contentUrl).then((blobUrl) => {
        if (!state.responses.detail || state.responses.detail.responseId !== responseId) { api.revokeBlobUrl(blobUrl); return; }
        state.blobUrls.add(blobUrl);
        const button = document.querySelector(`[data-blob-index="${answerIndex}-${imageIndex}"]`);
        if (!button) { api.revokeBlobUrl(blobUrl); state.blobUrls.delete(blobUrl); return; }
        button.disabled = false; button.dataset.blobUrl = blobUrl; button.innerHTML = `<img src="${escapeHtml(blobUrl)}" alt="${escapeHtml(answer.title)} 第 ${imageIndex + 1} 张图片">`;
      }).catch((error) => {
        const placeholder = document.querySelector(`[data-image-placeholder="${answerIndex}-${imageIndex}"]`);
        if (placeholder) placeholder.textContent = error.message || "图片加载失败";
      }));
    }));
    await Promise.allSettled(tasks);
  }

  function handleEditorInput(event) {
    const data = state.editor.data;
    if (!data || data.status === "PUBLISHED") return;
    if (event.target === $("#titleInput")) data.title = event.target.value;
    else if (event.target === $("#descriptionInput")) { data.description = event.target.value; $("#descriptionCount").textContent = data.description.length; }
    else if (event.target === $("#maxSubmissionsInput")) data.maxSubmissionsPerUser = Number(event.target.value);
    else {
      const qIndex = Number(event.target.dataset.qIndex);
      if (!Number.isInteger(qIndex) || !data.questions[qIndex]) return;
      const question = data.questions[qIndex];
      const field = event.target.dataset.field;
      if (field === "title" || field === "description") question[field] = event.target.value;
      else if (field === "required") question.required = event.target.checked;
      else if (field === "option-label") question.options[Number(event.target.dataset.optionIndex)].label = event.target.value;
      else if (event.target.dataset.config) question.config[event.target.dataset.config] = Number(event.target.value);
      else return;
    }
    markEditorDirty();
  }

  function handleEditorChange(event) {
    const qIndex = Number(event.target.dataset.qIndex);
    if (!Number.isInteger(qIndex) || event.target.dataset.field !== "type") return;
    const old = state.editor.data.questions[qIndex];
    const replacement = defaultQuestion(event.target.value);
    state.editor.data.questions[qIndex] = { ...replacement, id: old.id, title: old.title, description: old.description, required: old.required, sortOrder: old.sortOrder };
    markEditorDirty(); renderEditor();
  }

  function handleQuestionAction(button) {
    const action = button.dataset.qAction;
    const qIndex = Number(button.dataset.qIndex);
    const questions = state.editor.data.questions;
    const question = questions[qIndex];
    if (!question) return;
    if (action === "up" && qIndex > 0) [questions[qIndex - 1], questions[qIndex]] = [questions[qIndex], questions[qIndex - 1]];
    if (action === "down" && qIndex < questions.length - 1) [questions[qIndex + 1], questions[qIndex]] = [questions[qIndex], questions[qIndex + 1]];
    if (action === "copy") {
      const clone = JSON.parse(JSON.stringify(question)); clone.id = null; clone.title = `${clone.title}（副本）`; clone.options.forEach((option) => { option.id = null; }); questions.splice(qIndex + 1, 0, clone);
    }
    if (action === "delete") questions.splice(qIndex, 1);
    if (action === "option-add") question.options.push({ id: null, label: `选项 ${question.options.length + 1}`, sortOrder: question.options.length + 1 });
    const optionIndex = Number(button.dataset.optionIndex);
    if (action === "option-delete" && question.options.length > 2) question.options.splice(optionIndex, 1);
    if (action === "option-up" && optionIndex > 0) [question.options[optionIndex - 1], question.options[optionIndex]] = [question.options[optionIndex], question.options[optionIndex - 1]];
    if (action === "option-down" && optionIndex < question.options.length - 1) [question.options[optionIndex + 1], question.options[optionIndex]] = [question.options[optionIndex], question.options[optionIndex + 1]];
    updateSortOrders(); markEditorDirty(); renderEditor();
  }

  function addQuestion() {
    if (!state.editor.data || state.editor.data.questions.length >= 100) return;
    state.editor.data.questions.push(defaultQuestion()); updateSortOrders(); markEditorDirty(); renderEditor();
    global.requestAnimationFrame(() => $(`#question-editor-${state.editor.data.questions.length - 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function bindEvents() {
    $("#miniQuestionnaireSelect").addEventListener("change", (event) => {
      state.miniProgramConfig.selectedQuestionnaireId = event.target.value;
      renderMiniProgramConfig();
    });
    $("#saveMiniQuestionnaireBtn").addEventListener("click", saveMiniProgramConfig);
    $("#retryMiniProgramConfigBtn").addEventListener("click", loadMiniProgramConfig);
    $("#filterForm").addEventListener("submit", (event) => { event.preventDefault(); state.list.keyword = $("#keywordInput").value.trim(); state.list.status = $("#statusFilter").value; state.list.page = 1; loadList(); });
    $("#resetFilterBtn").addEventListener("click", () => { $("#keywordInput").value = ""; $("#statusFilter").value = ""; state.list.keyword = ""; state.list.status = ""; state.list.page = 1; loadList(); });
    $("#retryListBtn").addEventListener("click", loadList);
    $("#listPrevBtn").addEventListener("click", () => { if (state.list.page > 1) { state.list.page -= 1; loadList(); } });
    $("#listNextBtn").addEventListener("click", () => { if (state.list.page < state.list.totalPages) { state.list.page += 1; loadList(); } });
    $("#newQuestionnaireBtn").addEventListener("click", createQuestionnaire);
    $("#questionnaireRows").addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]"); if (!button) return;
      const { action, id, title } = button.dataset;
      if (action === "edit") openEditor(id);
      else if (action === "responses") openResponses(id, title);
      else if (action === "copy-share-link") copyQuestionnaireShareLink(button, id, button.dataset.linkType);
      else runListLifecycle(action, id, Number(button.dataset.version));
    });
    $("#backFromEditorBtn").addEventListener("click", async () => { if (await confirmDiscardEditor()) { setScreen("list"); loadListScreen(); } });
    $("#retryEditorBtn").addEventListener("click", () => openEditor(state.editor.id));
    $("#saveQuestionnaireBtn").addEventListener("click", () => saveEditor());
    $("#publishFromEditorBtn").addEventListener("click", publishFromEditor);
    $("#addQuestionBtn").addEventListener("click", addQuestion); $("#addFirstQuestionBtn").addEventListener("click", addQuestion);
    $("#editorContent").addEventListener("input", handleEditorInput);
    $("#editorContent").addEventListener("change", handleEditorChange);
    $("#questionEditorList").addEventListener("click", (event) => { const button = event.target.closest("[data-q-action]"); if (button) handleQuestionAction(button); });
    $("#questionNav").addEventListener("click", (event) => { const button = event.target.closest("[data-scroll-question]"); if (button) $(`#question-editor-${button.dataset.scrollQuestion}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); });
    $("#backFromResponsesBtn").addEventListener("click", () => { releaseBlobUrls(); setScreen("list"); loadListScreen(); });
    $("#responseFilterForm").addEventListener("submit", (event) => { event.preventDefault(); state.responses.userId = $("#responseUserIdInput").value.trim(); state.responses.submittedFrom = $("#submittedFromInput").value; state.responses.submittedTo = $("#submittedToInput").value; state.responses.page = 1; loadResponses(); });
    $("#resetResponseFilterBtn").addEventListener("click", () => { $("#responseUserIdInput").value = ""; $("#submittedFromInput").value = ""; $("#submittedToInput").value = ""; state.responses.userId = ""; state.responses.submittedFrom = ""; state.responses.submittedTo = ""; state.responses.page = 1; loadResponses(); });
    $("#retryResponsesBtn").addEventListener("click", loadResponses);
    $("#responsesPrevBtn").addEventListener("click", () => { if (state.responses.page > 1) { state.responses.page -= 1; loadResponses(); } });
    $("#responsesNextBtn").addEventListener("click", () => { if (state.responses.page < state.responses.totalPages) { state.responses.page += 1; loadResponses(); } });
    $("#responseItems").addEventListener("click", (event) => { const item = event.target.closest("[data-response-id]"); if (item) loadResponseDetail(item.dataset.responseId); });
    $("#responseDetail").addEventListener("click", (event) => {
      const deleteButton = event.target.closest("[data-delete-response]");
      if (deleteButton) { deleteSelectedResponse(deleteButton.dataset.deleteResponse); return; }
      const button = event.target.closest("[data-blob-url]"); if (!button) return; $("#fullImage").src = button.dataset.blobUrl; setHidden("#imageModal", false);
    });
    $("#closeImageBtn").addEventListener("click", () => setHidden("#imageModal", true));
    $("#confirmCancelBtn").addEventListener("click", () => finishConfirm(false)); $("#confirmOkBtn").addEventListener("click", () => finishConfirm(true));
    $("#tokenBtn").addEventListener("click", () => { $("#tokenInput").value = ""; setHidden("#tokenModal", false); });
    $("#tokenCancelBtn").addEventListener("click", () => setHidden("#tokenModal", true));
    $("#tokenSaveBtn").addEventListener("click", () => { api.saveDevToken($("#tokenInput").value); setHidden("#tokenModal", true); showToast("联调令牌已更新"); if (state.currentScreen === "list") loadListScreen(); });
    global.addEventListener("beforeunload", (event) => { if (!state.editor.dirty) return; event.preventDefault(); event.returnValue = ""; });
    global.addEventListener("message", (event) => {
      if (event.source !== global.parent || !event.data || typeof event.data !== "object") return;
      if (event.origin !== "null" && event.origin !== global.location.origin) return;
      if (event.data.type === "kkhc-theme-change") { state.theme = event.data.theme === "light" ? "light" : "dark"; applyRuntimeConfig(); }
      if (event.data.type === "kkhc-questionnaire-config") {
        const nextEnv = event.data.env === "prod" ? "prod" : "test";
        const changed = nextEnv !== state.env;
        state.env = nextEnv; state.theme = event.data.theme === "light" ? "light" : "dark"; applyRuntimeConfig();
        if (changed) { if (state.currentScreen === "list") loadListScreen(); else showToast("接口环境已切换，请返回列表重新加载", "error"); }
      }
    });
  }

  readInitialConfig();
  bindEvents();
  renderMiniProgramConfig();
  renderList();
  loadListScreen();
}(window));
