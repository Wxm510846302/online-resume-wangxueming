const runtimeConfig = window.APP_CONFIG_CENTER || {};
const apiBaseUrl = String(runtimeConfig.apiBaseUrl || '').replace(/\/$/, '');
let apiToken = readStoredCloudToken();
// 配置中心复用桌面主工程的 STS 体系，文件直传业务 OSS，不经过 uniCloud 云存储。
const OSS_UPLOAD_CONFIG = {
  endpoint: 'https://drh-bucket.oss-cn-beijing.aliyuncs.com',
  directory: 'mp/app/AppConfigCenter/uploads/',
  stsPath: '/kk/cms/token/sts',
  apiBases: {
    test: 'https://test-kkapi.likeduoduiyi.cn',
    prod: 'https://kapi.likeduoduiyi.cn'
  }
};

// 接收 DesktopVersion 的主题消息，让内嵌工具与宿主保持一致，同时不影响独立打开时的浅色外观。
window.addEventListener('message', (event) => {
  try {
    const isTrustedOrigin = window.location.origin === 'null' || event.origin === window.location.origin;
    if (!isTrustedOrigin) return;
    if (event.data?.type === 'kkhc-theme-change') {
      document.documentElement.dataset.hostTheme = event.data.theme === 'dark' ? 'dark' : 'light';
      return;
    }
    if (event.data?.type === 'kkhc-app-config-context') {
      document.documentElement.dataset.hostTheme = event.data.theme === 'dark' ? 'dark' : 'light';
      apiToken = Number(event.data.tokenExpiresAt) > Date.now() ? String(event.data.token || '') : '';
      boot();
    }
  } catch (error) {
    console.warn('同步宿主主题失败', error);
  }
});

// 静态部署时将 API 路径拼到独立后端；同源部署时保持原始相对路径。
function resolveApiUrl(path) {
  return apiBaseUrl ? `${apiBaseUrl}/${String(path).replace(/^\//, '')}` : path;
}

const api = {
  async request(path, options = {}) {
    const response = await fetch(resolveApiUrl(path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-user-name': encodeURIComponent('运营同学'),
        ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
        ...(options.headers || {})
      }
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) throw new Error(data.message || '请求失败');
    return data;
  },
  get(path) {
    return this.request(path);
  },
  post(path, body) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) });
  }
};

const state = {
  sceneGroups: [],
  scenes: [],
  currentScene: null,
  currentConfig: null,
  formData: {},
  environment: 'test'
};

const labels = {
  environment: { test: '测试环境', prod: '线上环境' },
  status: { success: '上传成功', fail: '上传失败', enabled: '上传成功', saved: '上传成功' }
};

const el = {
  view: document.querySelector('#view'),
  title: document.querySelector('#page-title'),
  breadcrumb: document.querySelector('#breadcrumb'),
  status: document.querySelector('#service-status'),
  topbarAction: document.querySelector('#quick-create'),
  toast: document.querySelector('#toast')
};

el.topbarAction.addEventListener('click', () => navigate('/upload'));
window.addEventListener('hashchange', renderRoute);

boot();

async function boot() {
  await checkHealth();
  if (!apiToken) {
    renderAuthRequired();
    return;
  }
  try {
    await loadScenes();
    renderRoute();
  } catch (error) {
    renderServiceError(error);
  }
}

function readStoredCloudToken() {
  try {
    const session = JSON.parse(window.localStorage.getItem('kkhc_auth_session') || '{}');
    return Number(session.appConfigTokenExpiresAt) > Date.now() ? String(session.appConfigToken || '') : '';
  } catch (error) {
    console.warn('读取配置中心云端会话失败', error);
    return '';
  }
}

function renderAuthRequired() {
  setPage('需要云端认证', 'App运营配置中心 / 登录状态');
  el.view.innerHTML = `
    <div class="empty">
      <strong>请退出管理后台后重新登录</strong>
      <span>重新登录会自动获取配置中心的短期云端访问令牌。</span>
    </div>
  `;
}

function renderServiceError(error) {
  setPage('服务暂不可用', 'App运营配置中心 / 服务异常');
  el.view.innerHTML = `
    <div class="empty">
      <strong>配置中心加载失败</strong>
      <span>${escapeHtml(error?.message || '请稍后重试')}</span>
    </div>
  `;
}

async function checkHealth() {
  try {
    await api.get('/health');
    el.status.textContent = '服务正常';
    el.status.className = 'status-dot tag green';
  } catch {
    el.status.textContent = '服务异常';
    el.status.className = 'status-dot tag red';
  }
}

async function loadScenes(keyword = '') {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
  const data = await api.get(`/api/scenes${query}`);
  state.sceneGroups = data.groups;
  state.scenes = data.groups.flatMap((group) => group.scenes.map((scene) => ({ ...scene, groupName: group.groupName, groupCode: group.groupCode })));
}

function renderRoute() {
  // 默认展示场景模板，保持与原 Postman 替代工具的首页体验一致。
  const hash = location.hash.replace(/^#/, '') || '/upload';
  const parts = hash.split('/').filter(Boolean);
  const path = parts[0];
  setActiveNav(path);
  // 顶部操作只用于二级配置表单返回，一级列表不重复展示入口按钮。
  el.topbarAction.hidden = !(path === 'upload' && Boolean(parts[1]));

  if (path === 'upload' && parts[1]) return renderUploadForm({ sceneCode: parts[1], copyId: parts[2] });
  if (path === 'upload') return renderScenePicker();
  renderRecords();
}

function setPage(title, breadcrumb) {
  el.title.textContent = title;
  el.breadcrumb.textContent = breadcrumb;
}

function setActiveNav(path) {
  document.querySelectorAll('[data-nav]').forEach((item) => {
    item.classList.toggle('active', item.dataset.nav === (path === 'upload' ? 'upload' : 'records'));
  });
}

async function renderRecords() {
  setPage('配置记录', 'App运营配置中心 / 配置记录');
  el.view.innerHTML = `
    <form class="toolbar compact" id="filter-form">
      <div class="field">
        <label>场景搜索</label>
        <input name="keyword" placeholder="商品直购、签到、圈子标签" />
      </div>
      <div class="button-row">
        <button class="button primary" type="submit">搜索</button>
        <button class="button" type="button" id="reset-filter">重置</button>
      </div>
    </form>
    <div id="list-container"></div>
  `;
  document.querySelector('#filter-form').addEventListener('submit', (event) => {
    event.preventDefault();
    loadConfigList(new FormData(event.currentTarget));
  });
  document.querySelector('#reset-filter').addEventListener('click', () => {
    document.querySelector('#filter-form').reset();
    loadConfigList();
  });
  await loadConfigList();
}

async function loadConfigList(formData) {
  const params = new URLSearchParams();
  if (formData?.get('keyword')) params.set('keyword', formData.get('keyword'));
  const data = await api.get(`/api/configs?${params.toString()}`);
  const container = document.querySelector('#list-container');
  if (!data.items.length) {
    container.innerHTML = `
      <div class="empty">
        <strong>暂无配置记录</strong>
        <span>你可以点击“上传配置”新增一条配置上传记录</span>
      </div>
    `;
    return;
  }
  container.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>场景</th>
            <th>配置时间</th>
            <th>配置人</th>
            <th>状态结果</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>${data.items.map(renderConfigRow).join('')}</tbody>
      </table>
    </div>
  `;
  container.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => copyConfig(button.dataset.copy, button.dataset.scene));
  });
}

function renderConfigRow(item) {
  return `
    <tr>
      <td>
        <strong>${escapeHtml(item.sceneName)}</strong>
        <div class="muted">${envTag(item.environment)}</div>
      </td>
      <td>${formatTime(item.createdAt)}</td>
      <td>${escapeHtml(item.operatorName || '-')}</td>
      <td>${statusTag(item.status)}</td>
      <td><button class="button" data-copy="${item.id}" data-scene="${item.sceneCode}">复制</button></td>
    </tr>
  `;
}

async function copyConfig(id, sceneCode) {
  navigate(`/upload/${sceneCode}/${id}`);
}

async function renderScenePicker() {
  setPage('上传配置', 'App运营配置中心 / 上传配置');
  el.view.innerHTML = `
    <div class="scene-search">
      <input id="scene-search" placeholder="搜索配置场景，例如 商品、签到、圈子标签" />
    </div>
    <div id="scene-groups"></div>
  `;
  document.querySelector('#scene-search').addEventListener('input', debounce(async (event) => {
    await loadScenes(event.target.value);
    renderSceneGroups();
  }, 180));
  renderSceneGroups();
}

function renderSceneGroups() {
  const container = document.querySelector('#scene-groups');
  if (!state.sceneGroups.length) {
    container.innerHTML = `<div class="empty">没有找到相关配置场景。</div>`;
    return;
  }
  container.innerHTML = state.sceneGroups.map((group) => `
    <section class="scene-group">
      <h2>${escapeHtml(group.groupName)}</h2>
      <div class="scene-grid">
        ${group.scenes.map((scene) => `
          <article class="scene-card">
            <div class="scene-card-title">${escapeHtml(scene.sceneName)}</div>
            <button class="button primary" data-scene="${scene.sceneCode}">选择</button>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');
  container.querySelectorAll('[data-scene]').forEach((button) => {
    button.addEventListener('click', () => navigate(`/upload/${button.dataset.scene}`));
  });
}

async function renderUploadForm({ sceneCode, copyId }) {
  const scene = state.scenes.find((item) => item.sceneCode === sceneCode);
  if (!scene) {
    showToast('配置场景不存在');
    navigate('/upload');
    return;
  }
  const copied = copyId ? (await api.get(`/api/configs/${copyId}`)).item : null;
  state.currentScene = scene;
  state.currentConfig = copied;
  state.environment = copied?.environment || 'test';
  state.formData = copied?.businessData || getDefaults(scene);

  setPage(scene.sceneName, `App运营配置中心 / 上传配置 / ${scene.sceneName}`);
  el.view.innerHTML = `
    <div class="form-layout">
      <form class="form-panel" id="config-form">
        <!-- 将基础信息和业务参数拆成清晰区块，避免长表单失去定位感。 -->
        <section class="form-section form-section-compact">
          <div class="section-heading">
            <div>
              <h2 class="section-title">基础信息</h2>
              <p class="section-description">确认当前配置场景和目标环境。</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="field">
              <label>配置场景</label>
              <input value="${escapeAttr(scene.sceneName)}" disabled />
            </div>
            <div class="field">
              <label>上传环境</label>
              <select name="environment">
                <option value="test" ${selected(state.environment, 'test')}>测试环境</option>
                <option value="prod" ${selected(state.environment, 'prod')}>线上环境</option>
              </select>
            </div>
          </div>
        </section>
        <section class="form-section">
          <div class="section-heading">
            <div>
              <h2 class="section-title">配置参数</h2>
              <p class="section-description">填写文本或上传素材，右侧会同步生成请求内容。</p>
            </div>
            <span class="section-count">${scene.formSchema.length} 项</span>
          </div>
          <div id="business-fields" class="form-grid"></div>
        </section>
        <div class="form-actions">
          <div id="form-error" class="error-text" role="alert"></div>
          <div class="button-row">
            <button class="button" type="button" id="cancel-form">取消</button>
            <button class="button primary" type="submit">确认上传</button>
          </div>
        </div>
      </form>
      <aside class="side-panel">
        <!-- 预览固定在独立窄栏中，长 JSON 只在代码框内部滚动。 -->
        <div class="preview-heading">
          <div>
            <h2 class="section-title">请求预览</h2>
            <p class="section-description">根据左侧字段实时生成</p>
          </div>
          <span class="tag blue">实时同步</span>
        </div>
        <div class="preview-block">
          <div class="preview-label">系统生成内容</div>
          <pre class="code-preview" id="generated-preview"></pre>
        </div>
        <div class="safety-note"><strong>发送说明</strong><span>测试环境会真实发送请求；线上环境由服务端拦截，不会实际发送。</span></div>
      </aside>
    </div>
  `;
  renderBusinessFields();
  updateGeneratedPreview();
  document.querySelector('#config-form').addEventListener('input', syncFormState);
  document.querySelector('#config-form').addEventListener('change', syncFormState);
  document.querySelector('#config-form').addEventListener('submit', submitConfig);
  document.querySelector('#cancel-form').addEventListener('click', () => navigate('/records'));
}

function renderBusinessFields() {
  document.querySelector('#business-fields').innerHTML = state.currentScene.formSchema.map(renderField).join('');
  bindDynamicButtons();
  bindFileInputs();
}

function renderField(item) {
  if (item.type === 'goodsTable') return tableField(item, ['goodsId', 'pic', 'totalStock'], ['商品ID', '商品图片 pic', '总库存 totalStock']);
  if (item.type === 'rewardTable') return tableField(item, ['name', 'huacaiCoin'], ['天数名称 name', '奖励华彩豆 huacaiCoin']);
  if (item.type === 'skuCollectionTable') return tableField(item, ['sku', 'backgroundUrl', 'category', 'backgroundType'], ['SKU', '背景图 backgroundUrl', '分类ID category', '背景类型 backgroundType']);
  if (item.type === 'keyImageTable') return tableField(item, ['key', 'imageUrl'], ['SKU', '按钮图片']);
  if (['lines', 'imageLines'].includes(item.type)) {
    const value = Array.isArray(state.formData[item.name]) ? state.formData[item.name].join('\n') : state.formData[item.name] || '';
    return `<div class="field full"><label>${escapeHtml(item.label)}</label><textarea name="biz.${item.name}" placeholder="一行一个">${escapeHtml(value)}</textarea></div>`;
  }
  if (item.type === 'textarea') return `<div class="field full"><label>${escapeHtml(item.label)}</label><textarea name="biz.${item.name}">${escapeHtml(state.formData[item.name] || '')}</textarea></div>`;
  if (item.type === 'select') {
    return `
      <div class="field">
        <label>${escapeHtml(item.label)}</label>
        <select name="biz.${item.name}">
          ${(item.options || []).map((option) => `<option value="${escapeAttr(option.value)}" ${selected(state.formData[item.name], option.value)}>${escapeHtml(option.label)}</option>`).join('')}
        </select>
      </div>
    `;
  }
  if (['image', 'excel'].includes(item.type)) return fileField(item);
  return `<div class="field"><label>${escapeHtml(item.label)}</label><input name="biz.${item.name}" type="${inputType(item.type)}" value="${escapeAttr(state.formData[item.name] ?? '')}" /></div>`;
}

function tableField(item, keys, heads) {
  const rows = state.formData[item.name] || [];
  return `
    <div class="full">
      <div class="button-row table-title">
        <strong>${escapeHtml(item.label)}</strong>
        <button class="button" type="button" data-add-row="${item.name}">添加一行</button>
      </div>
      <div class="dynamic-table">
        <table>
          <thead><tr>${heads.map((head) => `<th>${escapeHtml(head)}</th>`).join('')}<th>操作</th></tr></thead>
          <tbody>
            ${rows.map((row, index) => `
              <tr>
                ${keys.map((key) => `<td><input data-table="${item.name}" data-row="${index}" data-key="${key}" value="${escapeAttr(row[key] ?? defaultCellValue(key))}" /></td>`).join('')}
                <td><button class="button danger" type="button" data-remove-row="${index}" data-table="${item.name}">删除</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function fileField(item) {
  const value = state.formData[item.name] || '';
  const accept = item.type === 'excel' ? '.xls,.xlsx' : 'image/png,image/jpeg';
  const uploadId = `upload-${item.name}`;
  const fileDescription = item.type === 'excel' ? '支持 XLS、XLSX 文件' : '支持 PNG、JPG，建议上传清晰原图';
  return `
    <div class="field image-field">
      <label>${escapeHtml(item.label)}</label>
      <div class="upload-control">
        <div class="upload-preview ${value ? 'has-file' : ''}">
          ${item.type === 'image' && value
            ? `<img class="image-preview" src="${escapeAttr(value)}" alt="${escapeAttr(item.label)}" />`
            : `<div class="upload-placeholder" aria-hidden="true">${item.type === 'excel' ? 'XLS' : 'IMG'}</div>`}
        </div>
        <div class="upload-content">
          <input name="biz.${item.name}" value="${escapeAttr(value)}" placeholder="上传后自动填入 URL" />
          <div class="upload-meta">
            <label class="button upload-button" for="${escapeAttr(uploadId)}">选择文件</label>
            <span>${value ? '已上传，可重新选择文件' : fileDescription}</span>
          </div>
          <input class="visually-hidden" id="${escapeAttr(uploadId)}" type="file" data-upload="${item.name}" data-upload-type="${item.type}" accept="${accept}" />
        </div>
      </div>
    </div>
  `;
}

function bindDynamicButtons() {
  document.querySelectorAll('[data-add-row]').forEach((button) => {
    button.addEventListener('click', () => {
      const table = button.dataset.addRow;
      state.formData[table] = state.formData[table] || [];
      state.formData[table].push(emptyRowFor(table));
      renderBusinessFields();
      updateGeneratedPreview();
    });
  });
  document.querySelectorAll('[data-remove-row]').forEach((button) => {
    button.addEventListener('click', () => {
      state.formData[button.dataset.table].splice(Number(button.dataset.removeRow), 1);
      renderBusinessFields();
      updateGeneratedPreview();
    });
  });
}

function bindFileInputs() {
  document.querySelectorAll('[data-upload]').forEach((input) => {
    input.addEventListener('change', async () => {
      if (!input.files?.[0]) return;
      const file = input.files[0];
      const uploadButton = document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
      try {
        if (file.size > 5 * 1024 * 1024) throw new Error('文件大小不能超过 5MB');
        input.disabled = true;
        if (uploadButton) uploadButton.textContent = '上传中…';
        const uploaded = await uploadFileToOss(file, state.environment);
        state.formData[input.dataset.upload] = uploaded.url;
        renderBusinessFields();
        updateGeneratedPreview();
        showToast('上传成功');
      } catch (error) {
        const formError = document.querySelector('#form-error');
        if (formError) formError.textContent = error.message || '上传失败，请稍后重试';
        input.disabled = false;
        if (uploadButton) uploadButton.textContent = '重新选择';
        showToast(error.message || '文件上传失败');
      }
    });
  });
}

async function uploadFileToOss(file, environment) {
  try {
    const token = await getOssStsToken(environment);
    const extension = getSafeFileExtension(file.name);
    const dateDirectory = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    const objectKey = `${OSS_UPLOAD_CONFIG.directory}${dateDirectory}/${Date.now()}-${createRandomId()}${extension}`;
    const expiration = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const policy = btoa(JSON.stringify({
      expiration,
      conditions: [
        ['content-length-range', 0, 5 * 1024 * 1024],
        ['starts-with', '$key', OSS_UPLOAD_CONFIG.directory]
      ]
    }));
    const signature = await hmacSha1Base64(token.accessKeySecret, policy);
    const formData = new FormData();
    formData.append('key', objectKey);
    formData.append('OSSAccessKeyId', token.accessKeyId);
    formData.append('policy', policy);
    formData.append('Signature', signature);
    formData.append('x-oss-security-token', token.securityToken);
    formData.append('success_action_status', '200');
    formData.append('x-oss-object-acl', 'public-read');
    formData.append('file', file, file.name);

    const response = await fetch(OSS_UPLOAD_CONFIG.endpoint, { method: 'POST', body: formData });
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || `OSS 上传失败：${response.status}`);
    }
    return { objectKey, url: `${OSS_UPLOAD_CONFIG.endpoint}/${objectKey}` };
  } catch (error) {
    throw new Error(error?.message || 'OSS 上传失败，请稍后重试');
  }
}

async function getOssStsToken(environment) {
  try {
    const apiBase = OSS_UPLOAD_CONFIG.apiBases[environment] || OSS_UPLOAD_CONFIG.apiBases.prod;
    const response = await fetch(`${apiBase}${OSS_UPLOAD_CONFIG.stsPath}`);
    const result = await response.json();
    if (!response.ok || result.status !== 200) throw new Error(result.message || '获取 OSS 临时凭证失败');
    const raw = result.data || {};
    const token = {
      accessKeyId: String(raw.accessKeyId || ''),
      accessKeySecret: String(raw.accessKeySecret || ''),
      securityToken: String(raw.tokenSecret || raw.securityToken || '')
    };
    if (!token.accessKeyId || !token.accessKeySecret || !token.securityToken) throw new Error('OSS 临时凭证不完整');
    return token;
  } catch (error) {
    throw new Error(error?.message || '获取 OSS 临时凭证失败');
  }
}

async function hmacSha1Base64(secret, message) {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    return bytesToBase64(new Uint8Array(signature));
  } catch (error) {
    throw new Error(`生成 OSS 上传签名失败：${error.message}`);
  }
}

function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function getSafeFileExtension(fileName) {
  const matched = String(fileName || '').toLowerCase().match(/\.(png|jpe?g|xls|xlsx)$/);
  return matched ? matched[0] : '';
}

function createRandomId() {
  try {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    return Math.random().toString(16).slice(2, 18);
  }
}

function syncFormState(event) {
  const target = event.target;
  if (target.name === 'environment') state.environment = target.value;
  if (target.name?.startsWith('biz.')) {
    const key = target.name.slice(4);
    state.formData[key] = normalizeValue(target);
  }
  if (target.dataset.row !== undefined) {
    const table = target.dataset.table;
    const row = state.formData[table][Number(target.dataset.row)];
    row[target.dataset.key] = normalizeValue(target);
  }
  updateGeneratedPreview();
}

function updateGeneratedPreview() {
  const preview = document.querySelector('#generated-preview');
  if (!preview || !state.currentScene) return;
  const endpoint = state.currentScene.endpoints?.[state.environment];
  preview.textContent = JSON.stringify({
    requestUrl: endpoint,
    requestPayload: previewPayload(state.currentScene, state.formData)
  }, null, 2);
}

function previewPayload(scene, data) {
  const payload = { ...data };
  if (scene.payloadKind === 'flexible') {
    return {
      code: payload.code || scene.generatedCode,
      name: payload.name || scene.defaultName,
      content: payload
    };
  }
  return payload;
}

async function submitConfig(event) {
  event.preventDefault();
  syncAllInputs();
  document.querySelector('#form-error').textContent = '';
  if (state.environment === 'test' && !window.confirm('将实际请求测试环境接口，确认继续上传吗？')) return;
  if (state.environment === 'prod' && !window.confirm('线上环境不会实际发送，只会生成一条失败记录用于留痕，确认继续吗？')) return;
  const payload = {
    baseInfo: {
      sceneCode: state.currentScene.sceneCode,
      environment: state.environment
    },
    businessData: state.formData,
    saveMode: 'upload'
  };

  try {
    const data = await api.post('/api/configs', payload);
    if (data.item.status === 'success') {
      showToast(`上传成功，配置已提交到${labels.environment[state.environment]}`);
    } else {
      showToast(data.item.errorMessage || '上传失败，请检查配置参数后重试');
    }
    navigate('/records');
  } catch (error) {
    document.querySelector('#form-error').textContent = error.message;
    showToast('上传失败，请检查配置参数后重试');
  }
}

function syncAllInputs() {
  document.querySelectorAll('#config-form input, #config-form select, #config-form textarea').forEach((input) => {
    if (input.type !== 'file') syncFormState({ target: input });
  });
}

function getDefaults(scene) {
  const data = {};
  scene.formSchema.forEach((item) => {
    if (item.defaultValue !== undefined) data[item.name] = item.defaultValue;
    else if (item.type === 'goodsTable') data[item.name] = [{ goodsId: '', pic: '', totalStock: '' }];
    else if (item.type === 'rewardTable') data[item.name] = defaultRewards();
    else if (item.type === 'skuCollectionTable') data[item.name] = [{ sku: '', backgroundUrl: '', category: '', backgroundType: 'pic' }];
    else if (item.type === 'keyImageTable') data[item.name] = [{ key: '', imageUrl: '' }];
    else if (item.type === 'select') data[item.name] = item.options?.[0]?.value ?? '';
    else if (['lines', 'imageLines'].includes(item.type)) data[item.name] = [];
    else data[item.name] = '';
  });
  return data;
}

function emptyRowFor(table) {
  if (table === 'items' && state.currentScene.sceneCode === 'direct_goods') return { goodsId: '', pic: '', totalStock: '' };
  if (table === 'items' && state.currentScene.sceneCode === 'sku_collection') return { sku: '', backgroundUrl: '', category: '', backgroundType: 'pic' };
  if (table === 'items') return { key: '', imageUrl: '' };
  if (table === 'rewards') return { name: '', huacaiCoin: '' };
  return {};
}

function defaultRewards() {
  const beans = [1, 1, 2, 2, 3, 3, 10];
  return beans.map((count, index) => ({
    name: index === 6 ? '第7天(多重奖励)' : `第${index + 1}天`,
    huacaiCoin: count
  }));
}

function defaultCellValue(key) {
  return key === 'backgroundType' ? 'pic' : '';
}

function normalizeValue(target) {
  if (target.type === 'number') return target.value === '' ? '' : Number(target.value);
  if (target.tagName === 'TEXTAREA' && target.placeholder === '一行一个') {
    return target.value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  }
  return target.value;
}

function inputType(type) {
  if (type === 'number') return 'number';
  if (type === 'date') return 'date';
  if (type === 'url') return 'url';
  return 'text';
}

function envTag(value) {
  return `<span class="tag ${value === 'prod' ? 'red' : ''}">${labels.environment[value] || value}</span>`;
}

function statusTag(value) {
  return `<span class="tag ${value === 'fail' ? 'red' : 'green'}">${labels.status[value] || value}</span>`;
}

function formatTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('zh-CN', { hour12: false });
}

function navigate(path) {
  location.hash = path;
}

function selected(a, b) {
  return String(a) === String(b) ? 'selected' : '';
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function escapeAttr(value = '') {
  return escapeHtml(value);
}

function showToast(message) {
  el.toast.textContent = message;
  el.toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    el.toast.hidden = true;
  }, 2600);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
