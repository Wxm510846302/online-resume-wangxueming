const API_ENV_STORAGE_KEY = "kkhc_api_env";
const THEME_STORAGE_KEY = "kkhc_theme_mode";
const AUTH_STORAGE_KEY = "kkhc_auth_session";
const LANDING_H5_BASE_STORAGE_KEY = "kkhc_landing_h5_base";
const AUTH_ACCOUNTS = [
  {
    accountId: "admin-dz",
    usernameHash: "7fe02546b4a8b82dd1350453b7a6d320cd4380b6984c352b0f1678879471ac20",
    passwordHash: "03da7e701f69bce218a3317680e541bedf94a9069bd04b9d215e507d757f2d0c",
    role: "最高权限管理员",
    permission: "super_admin",
    defaultView: "rules",
    allowedViews: ["rules", "feedback", "landing", "h5Activity", "pianoPractice", "shareMaterials", "pushTool"],
  },
  {
    accountId: "user-kk",
    usernameHash: "4cb649e728f021821bd65bcb41b00d232adc600004fa687289fc8c87d8b18420",
    passwordHash: "6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090",
    role: "问题反馈子账号",
    permission: "feedback_only",
    defaultView: "feedback",
    allowedViews: ["feedback"],
  },
];
const AUTH_ACCOUNT_MAP = new Map(AUTH_ACCOUNTS.map((account) => [account.accountId, account]));
const LANDING_OSS_CONFIG = {
  endpoint: "https://drh-bucket.oss-cn-beijing.aliyuncs.com",
  bucket: "drh-bucket",
  configDirectory: "mp/app/LandingPages/configs/",
  imageDirectory: "mp/app/LandingPages/images/",
  configBaseUrl: "https://drh-bucket.oss-cn-beijing.aliyuncs.com/mp/app/LandingPages/configs/",
  stsPath: "/kk/cms/token/sts",
};
const SHARE_MATERIAL_SKU_OPTIONS = [
  { value: "1", label: "1 国画" },
  { value: "3", label: "3 书法" },
  { value: "4", label: "4 钢琴" },
  { value: "5", label: "5 声乐" },
  { value: "6", label: "6 联营" },
  { value: "7", label: "7 舞蹈瑜伽俱乐部" },
  { value: "8", label: "8 萨克斯" },
  { value: "11", label: "11 养生" },
  { value: "12", label: "12 太极" },
  { value: "13", label: "13 舞蹈" },
  { value: "14", label: "14 朗诵" },
  { value: "16", label: "16 直营" },
  { value: "17", label: "17 商城" },
  { value: "18", label: "18 声乐-月课" },
  { value: "19", label: "19 非洲鼓" },
  { value: "20", label: "20 口琴" },
  { value: "21", label: "21 华彩乐园" },
  { value: "22", label: "22 冥想瑜伽" },
  { value: "23", label: "23 戏曲越剧" },
  { value: "24", label: "24 摄影" },
  { value: "25", label: "25 美妆" },
  { value: "26", label: "26 营养" },
  { value: "27", label: "27 AI技能课" },
  { value: "28", label: "28 自媒体课" },
  { value: "30", label: "30 社团" },
];
const SHARE_MATERIAL_TABS = [
  {
    key: "miniCover",
    code: "homeworkShareMiniCover",
    title: "SKU 封面",
    description: "不同 SKU 作业的小程序封面素材",
    columns: ["sku", "media", "actions"],
    uniqueSku: true,
    ordered: false,
    mediaTypes: ["image"],
    structure: "list",
  },
  {
    key: "courseRecommend",
    code: "homeworkShareCourseRecommend",
    title: "课程推荐",
    description: "小程序内课程推荐区的 SKU 推荐图和推荐顺序",
    columns: ["order", "sku", "media", "actions"],
    uniqueSku: true,
    ordered: true,
    uniqueOrder: true,
    mediaTypes: ["image"],
    structure: "list",
  },
  {
    key: "popup",
    code: "homeworkSharePopup",
    title: "弹窗图",
    description: "小程序内弹窗图，保存已有 SKU 会覆盖原配置",
    columns: ["sku", "media", "actions"],
    uniqueSku: true,
    ordered: false,
    mediaTypes: ["image"],
    structure: "list",
    overwriteSku: true,
  },
  {
    key: "defaultBackground",
    code: "homeworkShareDefaultBackground",
    title: "默认背景",
    description: "默认背景图支持按 SKU 上传、编辑名称和调整顺序",
    columns: ["order", "media", "mediaType", "name", "actions"],
    skuScoped: true,
    ordered: true,
    uniqueOrder: true,
    mediaTypes: ["image", "video"],
    structure: "skuMap",
  },
];
const SHARE_MATERIAL_TAB_MAP = new Map(SHARE_MATERIAL_TABS.map((tab) => [tab.key, tab]));
const SHARE_MATERIAL_CODES = SHARE_MATERIAL_TABS.map((tab) => tab.code);
const LANDING_BOTTOM_SAFE_AREA = 34;
const LANDING_DEFAULT_H5_BASE_URL = "https://static-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/LandingPage/kkhc.html";
const API_ENV_CONFIG = {
  test: {
    label: "测试",
    baseUrl: "https://test-kkapi.likeduoduiyi.cn/sae-gateway/kkhc-bizcenter-lms/userPackage",
    feedbackBaseUrl: "https://test-kkapi.likeduoduiyi.cn",
    appBaseUrl: "https://test-kkapi.likeduoduiyi.cn",
  },
  prod: {
    label: "正式",
    baseUrl: "https://kapi.likeduoduiyi.cn/sae-gateway/kkhc-bizcenter-lms/userPackage",
    feedbackBaseUrl: "https://kapi.likeduoduiyi.cn",
    appBaseUrl: "https://kapi.likeduoduiyi.cn",
  },
};
const featureMetaLocal = [
  {
    featureCode: "SKU",
    featureName: "SKU",
    valueType: 3,
    supportOps: ["=", "!=", "IN", "NOT_IN"],
    enumValues: ["钢琴", "朗诵", "声乐", "美妆", "ALL"],
  },
  {
    featureCode: "COURSE_TYPE",
    featureName: "课程类型",
    valueType: 3,
    supportOps: ["=", "IN"],
    enumValues: ["体验课", "正价课", "ALL", "一对一", "小班课", "大班课"],
  },
  {
    featureCode: "AMOUNT",
    featureName: "累计课程消费金额",
    valueType: 1,
    supportOps: ["<", "<=", "=", ">=", ">"],
    enumValues: null,
  },
  {
    featureCode: "STATUS",
    featureName: "课程状态",
    valueType: 3,
    supportOps: ["=", "IN"],
    enumValues: ["待服务", "服务中", "上课中", "已结束"],
  },
  {
    featureCode: "CITY",
    featureName: "城市",
    valueType: 3,
    supportOps: ["=", "IN"],
    enumValues: ["北京", "上海", "广州", "深圳", "杭州", "成都", "武汉", "西安", "南京", "重庆"],
  },
  {
    featureCode: "GENDER",
    featureName: "性别",
    valueType: 3,
    supportOps: ["="],
    enumValues: ["男", "女"],
  },
  {
    featureCode: "AGE",
    featureName: "年龄",
    valueType: 1,
    supportOps: [">", ">=", "<", "<=", "=", "!="],
    enumValues: null,
  },
];

let localRules = [
  {
    id: 1,
    ruleCode: "RULE_001",
    name: "朗诵正价课无待服务",
    ruleSql: "SELECT DISTINCT union_id FROM dwd_app_user_detail_info_df WHERE sku='朗诵' AND course_type='正价课' ...",
    status: 1,
    userCount: "计算中",
    lastUpdateEmpName: "王五",
    lastUpdateTime: "2026-03-31 09:20:11",
    conditions: [],
  },
  {
    id: 2,
    ruleCode: "RULE_002",
    name: "男性50岁以上无上课中",
    ruleSql: "SELECT * FROM dwd_app_user_detail_info_df WHERE course_type='ALL' AND age>50 ...",
    status: 2,
    userCount: "12,345",
    lastUpdateEmpName: "赵六",
    lastUpdateTime: "2026-03-30 17:40:03",
    conditions: [],
  },
];

const FEEDBACK_STATUS_OPTIONS = [
  "待处理",
  "处理中",
  "设计如此",
  "重复BUG",
  "业务问题",
  "二方系统问题",
  "三方系统问题",
  "UI问题",
  "已解决",
  "无法重现",
  "延期处理",
  "不予解决",
];

let feedbackItems = [
  {
    id: 101,
    unionId: "u_8f3a12b9d001",
    version: "6.8.2",
    platform: "iOS 17.4",
    brand: "iPhone 15 Pro",
    description: "直播间进入后页面黑屏，返回再次进入偶发恢复。",
    status: "UI问题",
    uploadTime: "2026-04-17 09:12:43",
    updateTime: "2026-04-17 10:20:11",
    remark: "已转设计复核首屏渲染。",
  },
  {
    id: 102,
    unionId: "u_8f3a12b9d002",
    version: "6.8.1",
    platform: "Android 14",
    brand: "HUAWEI Mate 60",
    description: "购买成功后课程页未立即刷新，需要手动退出重进。用户反馈在支付完成返回课程列表后，页面仍然显示未购买状态，底部按钮文案没有更新，继续点击会再次进入购买流程；只有完全退出当前页面并重新进入后，课程状态、按钮文案和订单信息才会一起刷新，问题在弱网环境下出现频率更高。",
    status: "二方系统问题",
    uploadTime: "2026-04-17 08:43:20",
    updateTime: "2026-04-17 11:05:30",
    remark: "排查订单状态同步链路。",
  },
  {
    id: 103,
    unionId: "u_8f3a12b9d003",
    version: "6.8.0",
    platform: "Android 13",
    brand: "Xiaomi 14",
    description: "问题反馈上传日志按钮点击后无明显提示，但日志实际已上传。",
    status: "设计如此",
    uploadTime: "2026-04-16 18:14:07",
    updateTime: "2026-04-16 19:02:18",
    remark: "当前交互不做提示，后续可优化。",
  },
  {
    id: 104,
    unionId: "u_8f3a12b9d004",
    version: "6.8.2",
    platform: "iOS 16.7",
    brand: "iPhone 13",
    description: "课程分享海报生成失败，连续出现两次。",
    status: "已解决",
    uploadTime: "2026-04-16 15:24:15",
    updateTime: "2026-04-17 09:41:00",
    remark: "缓存失效问题已修复。",
  },
];
const localFeedbackItems = feedbackItems;
let apiFeedbackItems = [];

let localLandingItems = [
  {
    id: 1,
    name: "2026春季声乐招募",
    businessTypeComment: "声乐",
    content: JSON.stringify({
      schemaVersion: 1,
      pageKey: "spring-vocal-2026",
      renderer: { mode: "dynamic-json", configJsonUrl: "" },
      hero: {
        title: "春季声乐班招生",
        subtitle: "名额有限，赶快报名！",
        bannerImageUrl: "",
      },
      cta: { text: "按钮", link: "" },
      theme: { primaryColor: "#2563eb" },
      sections: [{ type: "richText", content: "名额有限，赶快报名！" }],
      materials: [],
    }, null, 2),
    h5Url: "https://h5.activity.com/landing-page?pageKey=spring-vocal-2026",
    creator: "TODO GUYU",
    createTime: "2026-04-29 19:28:00",
  },
];
let landingItems = localLandingItems;
let apiLandingItems = [];
let localShareMaterialItems = SHARE_MATERIAL_CODES.map((code) => ({
  id: null,
  code,
  name: SHARE_MATERIAL_TABS.find((tab) => tab.code === code)?.title || code,
  content: "[]",
  createTime: "",
  updateTime: "",
}));
let shareMaterialItems = localShareMaterialItems;

function getStoredApiEnv() {
  const stored = window.localStorage.getItem(API_ENV_STORAGE_KEY);
  return API_ENV_CONFIG[stored] ? stored : "prod";
}

function getStoredTheme() {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

function getStoredLandingH5Base() {
  return window.localStorage.getItem(LANDING_H5_BASE_STORAGE_KEY) || LANDING_DEFAULT_H5_BASE_URL;
}

function rememberLandingH5BaseUrl(value) {
  const next = String(value || "").trim();
  if (!next) return;
  state.landingH5BaseUrl = next;
  window.localStorage.setItem(LANDING_H5_BASE_STORAGE_KEY, next);
  if (landingH5BaseFormInput) landingH5BaseFormInput.value = next;
}

function getAuthAccountById(accountId) {
  return AUTH_ACCOUNT_MAP.get(accountId) || null;
}

function hydrateAuthUser(account, username) {
  if (!account) return null;
  return {
    accountId: account.accountId,
    username: username || account.accountId,
    role: account.role,
    permission: account.permission,
    defaultView: account.defaultView,
    allowedViews: [...account.allowedViews],
    authType: "hashed_local",
  };
}

function getStoredAuth() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const legacyAccountId = parsed?.permission === "super_admin" ? "admin-dz" : null;
    const account = getAuthAccountById(parsed?.accountId || legacyAccountId);
    if (parsed?.authType === "hashed_local" && account) return hydrateAuthUser(account, parsed?.username);
  } catch (error) {
    // ignore invalid auth cache
  }
  return null;
}

const initialAuthUser = getStoredAuth();

const state = {
  authUser: initialAuthUser,
  currentView: initialAuthUser?.defaultView || "rules",
  pageCurrent: 1,
  pageSize: 18,
  searchName: "",
  statusFilters: [],
  dataSource: "api",
  apiEnv: getStoredApiEnv(),
  theme: getStoredTheme(),
  mode: "create",
  editingId: null,
  useSqlMode: false,
  apiTotal: 0,
  apiRules: [],
  apiFeatureMeta: null,
  totalPages: 1,
  form: { ruleCode: "", name: "", sql: "", conditions: [] },
  feedbackFilters: {
    unionId: "",
    version: "",
    description: "",
    remark: "",
    brands: [],
    uploadDateStart: "",
    uploadDateEnd: "",
    updateDateStart: "",
    updateDateEnd: "",
    statuses: [],
  },
  feedbackEditingId: null,
  feedbackDateModalType: null,
  feedbackStatusSaving: false,
  feedbackApiTotal: 0,
  feedbackApiPages: 1,
  feedbackApiOverview: {
    total: 0,
    pending: 0,
    resolved: 0,
    latestUpdate: "-",
  },
  feedbackOverviewKey: "",
  landingFilters: {
    name: "",
  },
  landingFormMode: "create",
  landingEditingId: null,
  landingSaving: false,
  landingPublishDraft: null,
  landingApiTotal: 0,
  landingApiPages: 1,
  landingH5BaseUrl: getStoredLandingH5Base(),
  landingForm: null,
  landingEditorSelectedId: null,
  landingPageKeyManuallyEdited: false,
  landingHeroTitleManuallyEdited: false,
  landingLastNameValue: "",
  shareMaterialsLoading: false,
  shareMaterialsSavingCode: "",
  shareMaterialActiveTab: SHARE_MATERIAL_TABS[0].key,
  shareMaterialSkuFilter: SHARE_MATERIAL_SKU_OPTIONS[0].value,
  shareMaterialModalMode: "create",
  shareMaterialEditingId: null,
  sidebarOpen: true,
};

const authView = document.querySelector("#authView");
const appShell = document.querySelector("#appShell");
const sidebar = document.querySelector("#sidebar");
const sidebarBackdrop = document.querySelector("#sidebarBackdrop");
const sidebarToggleBtn = document.querySelector("#sidebarToggleBtn");
const loginForm = document.querySelector("#loginForm");
const loginUsername = document.querySelector("#loginUsername");
const loginPassword = document.querySelector("#loginPassword");
const loginError = document.querySelector("#loginError");
const logoutBtn = document.querySelector("#logoutBtn");
const currentUsername = document.querySelector("#currentUsername");
const currentUserRole = document.querySelector("#currentUserRole");
const navItems = document.querySelectorAll(".nav-item");
const pageTitle = document.querySelector("#pageTitle");
const pageSubtitle = document.querySelector("#pageSubtitle");
const rulesPage = document.querySelector("#rulesPage");
const feedbackPage = document.querySelector("#feedbackPage");
const landingPage = document.querySelector("#landingPage");
const h5ActivityPage = document.querySelector("#h5ActivityPage");
const h5ActivityFrame = document.querySelector("#h5ActivityFrame");
const pianoPracticePage = document.querySelector("#pianoPracticePage");
const pianoPracticeFrame = document.querySelector("#pianoPracticeFrame");
const pushToolPage = document.querySelector("#pushToolPage");
const pushToolFrame = document.querySelector("#pushToolFrame");
const shareMaterialsPage = document.querySelector("#shareMaterialsPage");
const landingOverview = document.querySelector("#landingOverview");
const listView = document.querySelector("#listView");
const formView = document.querySelector("#formView");
const landingListView = document.querySelector("#landingListView");
const landingFormView = document.querySelector("#landingFormView");
const ruleTableBody = document.querySelector("#ruleTableBody");
const pageInfo = document.querySelector("#pageInfo");
const condTpl = document.querySelector("#condTpl");
const sqlModal = document.querySelector("#sqlModal");
const sqlModalContent = document.querySelector("#sqlModalContent");
const dataSourceTag = document.querySelector("#dataSourceTag");
const dataSourceToggleBtn = document.querySelector("#dataSourceToggleBtn");
const createBtn = document.querySelector("#createBtn");
const pageInput = document.querySelector("#pageInput");
const firstPageBtn = document.querySelector("#firstPage");
const lastPageBtn = document.querySelector("#lastPage");
const goPageBtn = document.querySelector("#goPageBtn");
const testEnvBtn = document.querySelector("#testEnvBtn");
const prodEnvBtn = document.querySelector("#prodEnvBtn");
const themeToggleBtn = document.querySelector("#themeToggleBtn");
const refreshRulesBtn = document.querySelector("#refreshRulesBtn");
const metricDataSource = document.querySelector("#metricDataSource");
const metricEnv = document.querySelector("#metricEnv");
const metricTotalRules = document.querySelector("#metricTotalRules");
const metricPageState = document.querySelector("#metricPageState");
const metricEnabledRules = document.querySelector("#metricEnabledRules");
const metricDisabledRules = document.querySelector("#metricDisabledRules");
const metricViewMode = document.querySelector("#metricViewMode");
const metricSummary = document.querySelector("#metricSummary");
const feedbackSearchUnionId = document.querySelector("#feedbackSearchUnionId");
const feedbackSearchVersion = document.querySelector("#feedbackSearchVersion");
const feedbackSearchDescription = document.querySelector("#feedbackSearchDescription");
const feedbackSearchRemark = document.querySelector("#feedbackSearchRemark");
const feedbackBrandFilterBtn = document.querySelector("#feedbackBrandFilterBtn");
const feedbackBrandFilterPanel = document.querySelector("#feedbackBrandFilterPanel");
const feedbackUploadDateToggleBtn = document.querySelector("#feedbackUploadDateToggleBtn");
const feedbackUpdateDateToggleBtn = document.querySelector("#feedbackUpdateDateToggleBtn");
const feedbackStatusFilterBtn = document.querySelector("#feedbackStatusFilterBtn");
const feedbackStatusFilterPanel = document.querySelector("#feedbackStatusFilterPanel");
const refreshFeedbackBtn = document.querySelector("#refreshFeedbackBtn");
const feedbackTableBody = document.querySelector("#feedbackTableBody");
const feedbackMetricTotal = document.querySelector("#feedbackMetricTotal");
const feedbackMetricUpdated = document.querySelector("#feedbackMetricUpdated");
const feedbackMetricPending = document.querySelector("#feedbackMetricPending");
const feedbackMetricResolved = document.querySelector("#feedbackMetricResolved");
const feedbackMetricSummary = document.querySelector("#feedbackMetricSummary");
const feedbackStatusModal = document.querySelector("#feedbackStatusModal");
const feedbackStatusSelect = document.querySelector("#feedbackStatusSelect");
const feedbackRemarkInput = document.querySelector("#feedbackRemarkInput");
const saveFeedbackStatusBtn = document.querySelector("#saveFeedbackStatusBtn");
const feedbackModalUnionId = document.querySelector("#feedbackModalUnionId");
const feedbackModalVersion = document.querySelector("#feedbackModalVersion");
const feedbackModalDescription = document.querySelector("#feedbackModalDescription");
const feedbackContentModal = document.querySelector("#feedbackContentModal");
const feedbackContentModalTitle = document.querySelector("#feedbackContentModalTitle");
const feedbackContentModalText = document.querySelector("#feedbackContentModalText");
const feedbackDateModal = document.querySelector("#feedbackDateModal");
const feedbackDateModalTitle = document.querySelector("#feedbackDateModalTitle");
const feedbackDateStartInput = document.querySelector("#feedbackDateStartInput");
const feedbackDateEndInput = document.querySelector("#feedbackDateEndInput");
const feedbackPageInfo = document.querySelector("#feedbackPageInfo");
const feedbackPageInput = document.querySelector("#feedbackPageInput");
const feedbackFirstPageBtn = document.querySelector("#feedbackFirstPage");
const feedbackLastPageBtn = document.querySelector("#feedbackLastPage");
const feedbackGoPageBtn = document.querySelector("#feedbackGoPageBtn");
const feedbackPrevPageBtn = document.querySelector("#feedbackPrevPage");
const feedbackNextPageBtn = document.querySelector("#feedbackNextPage");
const landingSearchName = document.querySelector("#landingSearchName");
const landingTableBody = document.querySelector("#landingTableBody");
const landingMetricTotal = document.querySelector("#landingMetricTotal");
const landingMetricUpdated = document.querySelector("#landingMetricUpdated");
const landingMetricRenderer = document.querySelector("#landingMetricRenderer");
const landingMetricSummary = document.querySelector("#landingMetricSummary");
const refreshLandingBtn = document.querySelector("#refreshLandingBtn");
const createLandingBtn = document.querySelector("#createLandingBtn");
const landingPageInfo = document.querySelector("#landingPageInfo");
const landingPageInput = document.querySelector("#landingPageInput");
const landingFirstPageBtn = document.querySelector("#landingFirstPage");
const landingLastPageBtn = document.querySelector("#landingLastPage");
const landingGoPageBtn = document.querySelector("#landingGoPageBtn");
const landingPrevPageBtn = document.querySelector("#landingPrevPage");
const landingNextPageBtn = document.querySelector("#landingNextPage");
const landingFormTitle = document.querySelector("#landingFormTitle");
const landingNameInput = document.querySelector("#landingNameInput");
const landingBusinessInput = document.querySelector("#landingBusinessInput");
const landingPageKeyInput = document.querySelector("#landingPageKeyInput");
const landingH5BaseFormInput = document.querySelector("#landingH5BaseFormInput");
const landingH5UrlOutput = document.querySelector("#landingH5UrlOutput");
const landingHeroTitleInput = document.querySelector("#landingHeroTitleInput");
const landingHeroSubtitleInput = document.querySelector("#landingHeroSubtitleInput");
const landingButtonTextInput = document.querySelector("#landingButtonTextInput");
const landingButtonIdInput = document.querySelector("#landingButtonIdInput");
const landingButtonEventInput = document.querySelector("#landingButtonEventInput");
const landingButtonSkuField = document.querySelector("#landingButtonSkuField");
const landingButtonSkuInput = document.querySelector("#landingButtonSkuInput");
const landingButtonLinkField = document.querySelector("#landingButtonLinkField");
const landingButtonLinkInput = document.querySelector("#landingButtonLinkInput");
const landingButtonJsField = document.querySelector("#landingButtonJsField");
const landingButtonBridgeActionInput = document.querySelector("#landingButtonBridgeActionInput");
const landingButtonBridgeParamsInput = document.querySelector("#landingButtonBridgeParamsInput");
const landingButtonImageUrlInput = document.querySelector("#landingButtonImageUrlInput");
const clearLandingButtonImageUrlBtn = document.querySelector("#clearLandingButtonImageUrlBtn");
const landingButtonImagePreview = document.querySelector("#landingButtonImagePreview");
const landingButtonModeButtons = document.querySelectorAll("[data-landing-button-mode]");
const landingThemeColorInput = document.querySelector("#landingThemeColorInput");
const landingBannerUrlInput = document.querySelector("#landingBannerUrlInput");
const landingImageUploadBox = document.querySelector("#landingImageUploadBox");
const clearLandingImageUrlBtn = document.querySelector("#clearLandingImageUrlBtn");
const landingConfigJsonUrlInput = document.querySelector("#landingConfigJsonUrlInput");
const landingMaterialUrlsInput = document.querySelector("#landingMaterialUrlsInput");
const landingContentInput = document.querySelector("#landingContentInput");
const landingConfigPreview = document.querySelector("#landingConfigPreview");
const saveLandingBtn = document.querySelector("#saveLandingBtn");
const copyLandingUrlBtn = document.querySelector("#copyLandingUrlBtn");
const copyLandingConfigBtn = document.querySelector("#copyLandingConfigBtn");
const landingCanvas = document.querySelector("#landingCanvas");
const landingLayerList = document.querySelector("#landingLayerList");
const landingInspectorSubtitle = document.querySelector("#landingInspectorSubtitle");
const landingDeleteComponentBtn = document.querySelector("#landingDeleteComponentBtn");
const landingImagePanel = document.querySelector("#landingImagePanel");
const landingHotspotPanel = document.querySelector("#landingHotspotPanel");
const landingButtonPanel = document.querySelector("#landingButtonPanel");
const landingHotspotXInput = document.querySelector("#landingHotspotXInput");
const landingHotspotIdInput = document.querySelector("#landingHotspotIdInput");
const landingHotspotYInput = document.querySelector("#landingHotspotYInput");
const landingHotspotWInput = document.querySelector("#landingHotspotWInput");
const landingHotspotHInput = document.querySelector("#landingHotspotHInput");
const landingHotspotEventInput = document.querySelector("#landingHotspotEventInput");
const landingHotspotSkuField = document.querySelector("#landingHotspotSkuField");
const landingHotspotSkuInput = document.querySelector("#landingHotspotSkuInput");
const landingHotspotLinkField = document.querySelector("#landingHotspotLinkField");
const landingHotspotLinkInput = document.querySelector("#landingHotspotLinkInput");
const landingHotspotJsField = document.querySelector("#landingHotspotJsField");
const landingHotspotBridgeActionInput = document.querySelector("#landingHotspotBridgeActionInput");
const landingHotspotBridgeParamsInput = document.querySelector("#landingHotspotBridgeParamsInput");
const landingButtonXInput = document.querySelector("#landingButtonXInput");
const landingButtonYInput = document.querySelector("#landingButtonYInput");
const landingButtonWInput = document.querySelector("#landingButtonWInput");
const landingButtonHInput = document.querySelector("#landingButtonHInput");
const landingButtonSafeAreaInput = document.querySelector("#landingButtonSafeAreaInput");
const landingButtonFloatAboveImageInput = document.querySelector("#landingButtonFloatAboveImageInput");
const landingCreateModal = document.querySelector("#landingCreateModal");
const closeLandingCreateModal = document.querySelector("#closeLandingCreateModal");
const cancelLandingCreateBtn = document.querySelector("#cancelLandingCreateBtn");
const confirmLandingCreateBtn = document.querySelector("#confirmLandingCreateBtn");
const landingCreateNameInput = document.querySelector("#landingCreateNameInput");
const landingCreateBusinessInput = document.querySelector("#landingCreateBusinessInput");
const landingPublishModal = document.querySelector("#landingPublishModal");
const closeLandingPublishModal = document.querySelector("#closeLandingPublishModal");
const cancelLandingPublishBtn = document.querySelector("#cancelLandingPublishBtn");
const confirmLandingPublishBtn = document.querySelector("#confirmLandingPublishBtn");
const downloadLandingHtmlBtn = document.querySelector("#downloadLandingHtmlBtn");
const downloadLandingJsonBtn = document.querySelector("#downloadLandingJsonBtn");
const landingPublishHtmlPreview = document.querySelector("#landingPublishHtmlPreview");
const landingPublishJsonPreview = document.querySelector("#landingPublishJsonPreview");
const landingPublishHtmlName = document.querySelector("#landingPublishHtmlName");
const landingPublishJsonName = document.querySelector("#landingPublishJsonName");
const landingPublishResult = document.querySelector("#landingPublishResult");
const refreshShareMaterialsBtn = document.querySelector("#refreshShareMaterialsBtn");
const createShareMaterialBtn = document.querySelector("#createShareMaterialBtn");
const saveShareMaterialsPageBtn = document.querySelector("#saveShareMaterialsPageBtn");
const shareMaterialStatus = document.querySelector("#shareMaterialStatus");
const shareMaterialTabs = document.querySelector("#shareMaterialTabs");
const shareMaterialSkuFilterWrap = document.querySelector("#shareMaterialSkuFilterWrap");
const shareMaterialSkuFilter = document.querySelector("#shareMaterialSkuFilter");
const shareMaterialTableHead = document.querySelector("#shareMaterialTableHead");
const shareMaterialTableBody = document.querySelector("#shareMaterialTableBody");
const shareMaterialMetricTab = document.querySelector("#shareMaterialMetricTab");
const shareMaterialMetricTotal = document.querySelector("#shareMaterialMetricTotal");
const shareMaterialMetricScope = document.querySelector("#shareMaterialMetricScope");
const shareMaterialMetricUpdated = document.querySelector("#shareMaterialMetricUpdated");
const shareMaterialMetricSummary = document.querySelector("#shareMaterialMetricSummary");
const shareMaterialModal = document.querySelector("#shareMaterialModal");
const shareMaterialModalTitle = document.querySelector("#shareMaterialModalTitle");
const closeShareMaterialModal = document.querySelector("#closeShareMaterialModal");
const cancelShareMaterialBtn = document.querySelector("#cancelShareMaterialBtn");
const saveShareMaterialBtn = document.querySelector("#saveShareMaterialBtn");
const shareMaterialOrderField = document.querySelector("#shareMaterialOrderField");
const shareMaterialOrderInput = document.querySelector("#shareMaterialOrderInput");
const shareMaterialSkuField = document.querySelector("#shareMaterialSkuField");
const shareMaterialSkuInput = document.querySelector("#shareMaterialSkuInput");
const shareMaterialNameField = document.querySelector("#shareMaterialNameField");
const shareMaterialNameInput = document.querySelector("#shareMaterialNameInput");
const shareMaterialUrlInput = document.querySelector("#shareMaterialUrlInput");
const uploadShareMaterialBtn = document.querySelector("#uploadShareMaterialBtn");
const shareMaterialUploadBox = document.querySelector("#shareMaterialUploadBox");
const shareMaterialUploadHint = document.querySelector("#shareMaterialUploadHint");
const shareMaterialTypeField = document.querySelector("#shareMaterialTypeField");
const shareMaterialTypeInput = document.querySelector("#shareMaterialTypeInput");
const shareMaterialPreview = document.querySelector("#shareMaterialPreview");
const shareMaterialViewerModal = document.querySelector("#shareMaterialViewerModal");
const shareMaterialViewerTitle = document.querySelector("#shareMaterialViewerTitle");
const shareMaterialViewerBody = document.querySelector("#shareMaterialViewerBody");
const closeShareMaterialViewer = document.querySelector("#closeShareMaterialViewer");
let toastTimer = null;
let landingImageUrlMeasureTimer = null;
let landingButtonImageUrlMeasureTimer = null;

function isLoggedIn() {
  return Boolean(
    state.authUser?.authType === "hashed_local"
    && getAuthAccountById(state.authUser?.accountId),
  );
}

function persistAuthSession(user) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function clearAuthSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function ensureToastEl() {
  let toast = document.querySelector("#appToast");
  if (toast) return toast;
  toast = document.createElement("div");
  toast.id = "appToast";
  toast.className = "app-toast hidden";
  document.body.appendChild(toast);
  return toast;
}

function showToast(message, type = "success") {
  const toast = ensureToastEl();
  toast.textContent = message;
  toast.className = `app-toast ${type}`;
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.className = "app-toast hidden";
  }, 2200);
}

function setButtonLoading(button, isLoading, loadingText = "处理中...") {
  if (!button) return;
  if (isLoading) {
    if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    button.classList.add("is-loading");
    return;
  }
  button.textContent = button.dataset.originalText || button.textContent;
  button.disabled = false;
  delete button.dataset.originalText;
  button.classList.remove("is-loading");
}

function updateTableDragState(wrap) {
  if (!wrap) return;
  wrap.classList.toggle("can-drag-x", wrap.scrollWidth > wrap.clientWidth + 4);
}

function setupTableDragScroll() {
  document.querySelectorAll(".table-wrap").forEach((wrap) => {
    if (wrap.dataset.dragScrollBound !== "true") {
      let isDragging = false;
      let moved = false;
      let startX = 0;
      let startScrollLeft = 0;

      const stopDragging = () => {
        if (!isDragging) return;
        isDragging = false;
        wrap.classList.remove("is-dragging");
        document.body.classList.remove("drag-scroll-lock");
        wrap.dataset.dragMoved = moved ? "true" : "";
        window.setTimeout(() => {
          delete wrap.dataset.dragMoved;
        }, 0);
      };

      wrap.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;
        if (wrap.scrollWidth <= wrap.clientWidth + 4) return;
        if (event.target.closest("button, a, input, textarea, select, label, .link")) return;
        isDragging = true;
        moved = false;
        startX = event.clientX;
        startScrollLeft = wrap.scrollLeft;
        wrap.classList.add("is-dragging");
        document.body.classList.add("drag-scroll-lock");
      });

      wrap.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        const deltaX = event.clientX - startX;
        if (Math.abs(deltaX) > 3) moved = true;
        wrap.scrollLeft = startScrollLeft - deltaX;
        event.preventDefault();
      });

      wrap.addEventListener("mouseleave", stopDragging);
      wrap.addEventListener("mouseup", stopDragging);
      window.addEventListener("mouseup", stopDragging);
      wrap.addEventListener("dragstart", (event) => event.preventDefault());
      wrap.addEventListener("click", (event) => {
        if (wrap.dataset.dragMoved !== "true") return;
        event.preventDefault();
        event.stopPropagation();
      }, true);

      wrap.dataset.dragScrollBound = "true";
    }

    updateTableDragState(wrap);
  });
}

function getAllowedViews(user = state.authUser) {
  if (Array.isArray(user?.allowedViews) && user.allowedViews.length) {
    return user.allowedViews;
  }
  return ["rules", "feedback", "landing", "h5Activity", "pianoPractice", "shareMaterials", "pushTool"];
}

function canAccessView(view, user = state.authUser) {
  return getAllowedViews(user).includes(view);
}

function ensureCurrentViewAccessible() {
  if (canAccessView(state.currentView)) return;
  const fallbackView = state.authUser?.defaultView && canAccessView(state.authUser.defaultView)
    ? state.authUser.defaultView
    : getAllowedViews()[0]
      || "rules";
  state.currentView = fallbackView;
}

function renderNavPermissions() {
  navItems.forEach((item) => {
    item.classList.toggle("hidden", !canAccessView(item.dataset.view));
  });
}

function renderAuthState() {
  const loggedIn = isLoggedIn();
  document.documentElement.classList.toggle("auth-restored", loggedIn);
  if (loggedIn) ensureCurrentViewAccessible();
  document.body.classList.toggle("auth-locked", !loggedIn);
  authView.classList.toggle("hidden", loggedIn);
  appShell.classList.toggle("hidden", !loggedIn);
  renderNavPermissions();
  if (currentUsername) currentUsername.textContent = state.authUser?.username || "管理员";
  if (currentUserRole) currentUserRole.textContent = state.authUser?.role || AUTH_ACCOUNTS[0].role;
  if (!loggedIn) {
    state.currentView = "rules";
    if (loginUsername) loginUsername.value = "";
    if (loginPassword) loginPassword.value = "";
    loginError?.classList.add("hidden");
  }
}

async function sha256Hex(input) {
  if (!window.crypto?.subtle) {
    throw new Error("当前环境不支持安全登录校验，请在 HTTPS 或 localhost 环境打开");
  }
  const bytes = new TextEncoder().encode(input);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function renderSidebarState() {
  if (!appShell) return;
  appShell.classList.toggle("sidebar-collapsed", !state.sidebarOpen);
  sidebarBackdrop?.classList.toggle("hidden", !state.sidebarOpen || window.innerWidth > 980);
  if (sidebarToggleBtn) {
    sidebarToggleBtn.setAttribute("aria-pressed", state.sidebarOpen ? "true" : "false");
    sidebarToggleBtn.setAttribute("aria-label", state.sidebarOpen ? "收起菜单" : "打开菜单");
  }
  if (sidebar) {
    sidebar.setAttribute("aria-hidden", state.sidebarOpen ? "false" : "true");
  }
}

function toggleSidebar(forceOpen) {
  state.sidebarOpen = typeof forceOpen === "boolean" ? forceOpen : !state.sidebarOpen;
  renderSidebarState();
}

async function handleLogin(event) {
  event.preventDefault();
  const username = loginUsername.value.trim();
  const password = loginPassword.value;
  let matchedAccount = null;
  try {
    const [usernameHash, passwordHash] = await Promise.all([
      sha256Hex(username),
      sha256Hex(password),
    ]);
    matchedAccount = AUTH_ACCOUNTS.find((account) => (
      usernameHash === account.usernameHash && passwordHash === account.passwordHash
    )) || null;
  } catch (error) {
    window.alert(error.message || "登录失败，请检查运行环境");
    return;
  }

  if (!matchedAccount) {
    loginError?.classList.remove("hidden");
    loginPassword.focus();
    loginPassword.select();
    return;
  }

  state.authUser = {
    ...hydrateAuthUser(matchedAccount, username),
    loggedInAt: new Date().toISOString(),
  };
  state.currentView = matchedAccount.defaultView;
  persistAuthSession(state.authUser);
  renderAuthState();
  syncViewState();
  refreshCurrentViewPage();
}

function handleLogout() {
  state.authUser = null;
  clearAuthSession();
  renderAuthState();
  loginUsername?.focus();
}

function statusText(status) {
  return status === 1 ? "已启用" : "已禁用";
}

function feedbackStatusClass(status) {
  if (status === "已解决") return "resolved";
  if (["无法重现", "延期处理", "不予解决", "设计如此", "重复BUG"].includes(status)) return "muted";
  return "pending";
}

function feedbackStatusToCode(status) {
  const idx = FEEDBACK_STATUS_OPTIONS.indexOf(status);
  return idx >= 0 ? idx : null;
}

function feedbackCodeToStatus(code) {
  if (Number.isFinite(code) && FEEDBACK_STATUS_OPTIONS[code]) {
    return FEEDBACK_STATUS_OPTIONS[code];
  }
  return `分类${code}`;
}

function syncFeedbackItemsWithSource() {
  feedbackItems = isApiMode() ? apiFeedbackItems : localFeedbackItems;
}

function getSelectedValues(selectEl) {
  if (!selectEl) return [];
  return Array.from(selectEl.selectedOptions).map((option) => option.value).filter(Boolean);
}

function getCheckedValues(panelEl) {
  if (!panelEl) return [];
  return Array.from(panelEl.querySelectorAll("input[type='checkbox']:checked")).map((input) => input.value);
}

function getFilterOptions(type) {
  if (type === "brand") {
    return Array.from(new Set(feedbackItems.map((item) => item.brand)))
      .sort((a, b) => a.localeCompare(b, "zh-CN"))
      .map((value) => ({ value, label: value }));
  }
  return FEEDBACK_STATUS_OPTIONS.map((value) => ({ value, label: value }));
}

function getFilterSelectedValues(type) {
  return type === "brand" ? state.feedbackFilters.brands : state.feedbackFilters.statuses;
}

function setFilterSelectedValues(type, values) {
  if (type === "brand") {
    state.feedbackFilters.brands = values;
    return;
  }
  state.feedbackFilters.statuses = values;
}

function setFeedbackStatusSubmitting(isSubmitting) {
  state.feedbackStatusSaving = isSubmitting;
  if (!saveFeedbackStatusBtn) return;
  saveFeedbackStatusBtn.disabled = isSubmitting;
  saveFeedbackStatusBtn.textContent = isSubmitting ? "提交中..." : "确认保存";
}

function updatePagerDisplay(totalPage, totalCount) {
  const text = `第 ${state.pageCurrent} / ${totalPage} 页，共 ${totalCount} 条`;
  if (pageInfo) pageInfo.textContent = text;
  if (feedbackPageInfo) feedbackPageInfo.textContent = text;
  if (landingPageInfo) landingPageInfo.textContent = text;
  if (pageInput) pageInput.value = state.pageCurrent;
  if (feedbackPageInput) feedbackPageInput.value = state.pageCurrent;
  if (landingPageInput) landingPageInput.value = state.pageCurrent;
}

function getFilterButtonLabel(type, values) {
  const base = type === "brand" ? "品牌" : "状态";
  if (!values.length) return base;
  if (values.length <= 2) return `${base} · ${values.join("、")}`;
  return `${base} · 已选 ${values.length} 项`;
}

function renderFilterPanel(type) {
  const panel = type === "brand" ? feedbackBrandFilterPanel : feedbackStatusFilterPanel;
  const button = type === "brand" ? feedbackBrandFilterBtn : feedbackStatusFilterBtn;
  if (!panel || !button) return;

  const options = getFilterOptions(type);
  const selectedValues = getFilterSelectedValues(type);
  const selectedSet = new Set(selectedValues);
  const query = panel.dataset.query || "";
  const filtered = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  button.textContent = getFilterButtonLabel(type, selectedValues);
  button.classList.toggle("active", selectedValues.length > 0);

  const selectedChips = selectedValues.map((value) => `
    <span class="filter-chip">
      <span>${value}</span>
      <button type="button" class="filter-chip-close" data-remove="${value}">×</button>
    </span>
  `).join("");

  const optionList = filtered.length
    ? filtered.map((option) => `
      <label class="filter-picker-option">
        <input type="checkbox" value="${option.value}" ${selectedSet.has(option.value) ? "checked" : ""} />
        <span>${option.label}</span>
      </label>
    `).join("")
    : '<div class="filter-picker-empty">没有匹配项</div>';

  panel.innerHTML = `
    <div class="filter-picker">
      <input class="filter-picker-search" type="search" placeholder="搜索名称" value="${query}" />
      <div class="filter-picker-tools">
        <span class="filter-picker-count">匹配 ${filtered.length} 项</span>
        <button type="button" class="link" data-action="select-all">全选当前结果</button>
        <button type="button" class="link" data-action="clear">清空已选</button>
        <button type="button" class="btn btn-light" data-action="done">完成</button>
      </div>
      <div class="filter-picker-chips ${selectedValues.length ? "" : "hidden"}">${selectedChips}</div>
      <div class="filter-picker-options">${optionList}</div>
    </div>
  `;

  panel.querySelector(".filter-picker-search")?.addEventListener("input", (event) => {
    panel.dataset.query = event.target.value;
    renderFilterPanel(type);
  });

  panel.querySelectorAll(".filter-picker-option input").forEach((input) => {
    input.addEventListener("change", () => {
      const current = new Set(getFilterSelectedValues(type));
      if (input.checked) current.add(input.value);
      else current.delete(input.value);
      setFilterSelectedValues(type, Array.from(current));
      renderFeedbackFilters();
      renderFilterPanel(type);
    });
  });

  panel.querySelectorAll(".filter-chip-close").forEach((chipBtn) => {
    chipBtn.addEventListener("click", () => {
      setFilterSelectedValues(type, getFilterSelectedValues(type).filter((value) => value !== chipBtn.dataset.remove));
      renderFeedbackFilters();
      renderFilterPanel(type);
    });
  });

  panel.querySelector("[data-action='select-all']")?.addEventListener("click", () => {
    const current = new Set(getFilterSelectedValues(type));
    filtered.forEach((option) => current.add(option.value));
    setFilterSelectedValues(type, Array.from(current));
    renderFeedbackFilters();
    renderFilterPanel(type);
  });

  panel.querySelector("[data-action='clear']")?.addEventListener("click", () => {
    setFilterSelectedValues(type, []);
    renderFeedbackFilters();
    renderFilterPanel(type);
  });

  panel.querySelector("[data-action='done']")?.addEventListener("click", () => {
    panel.classList.add("hidden");
    applyFeedbackQuery();
  });
}

async function applyFeedbackQuery() {
  state.pageCurrent = 1;
  state.feedbackFilters.unionId = feedbackSearchUnionId?.value.trim() || "";
  state.feedbackFilters.version = feedbackSearchVersion?.value.trim() || "";
  state.feedbackFilters.description = feedbackSearchDescription?.value.trim() || "";
  state.feedbackFilters.remark = feedbackSearchRemark?.value.trim() || "";
  state.feedbackFilters.brands = getCheckedValues(feedbackBrandFilterPanel);
  state.feedbackFilters.statuses = getCheckedValues(feedbackStatusFilterPanel);
  feedbackBrandFilterPanel?.classList.add("hidden");
  feedbackStatusFilterPanel?.classList.add("hidden");
  renderFeedbackFilters();
    if (isApiMode()) {
    await queryFeedbackItems();
  }
  renderFeedbackTable();
}

function getFeedbackResolvedStatuses() {
  return ["已解决", "不予解决", "设计如此"];
}

function getFeedbackPendingExcludedStatuses() {
  return [...getFeedbackResolvedStatuses(), "无法重现", "延期处理"];
}

function buildFeedbackOverview(items, totalOverride = items.length) {
  const resolvedStatuses = getFeedbackResolvedStatuses();
  const pendingExcludedStatuses = getFeedbackPendingExcludedStatuses();
  const list = Array.isArray(items) ? items.slice() : [];
  const latestUpdate = list
    .map((item) => String(item.updateTime || "").trim())
    .filter(Boolean)
    .sort((a, b) => (a < b ? 1 : -1))[0] || "-";

  return {
    total: Number(totalOverride || 0),
    pending: list.filter((item) => !pendingExcludedStatuses.includes(item.status)).length,
    resolved: list.filter((item) => resolvedStatuses.includes(item.status)).length,
    latestUpdate,
  };
}

function getFeedbackOverviewKey() {
  return JSON.stringify({
    env: state.apiEnv,
    source: state.dataSource,
    filters: state.feedbackFilters,
  });
}

function filteredFeedbackItems() {
  return feedbackItems
    .filter((item) => !state.feedbackFilters.unionId || item.unionId.includes(state.feedbackFilters.unionId))
    .filter((item) => !state.feedbackFilters.version || item.version.includes(state.feedbackFilters.version))
    .filter((item) => !state.feedbackFilters.description || item.description.includes(state.feedbackFilters.description))
    .filter((item) => !state.feedbackFilters.remark || String(item.remark || "").includes(state.feedbackFilters.remark))
    .filter((item) => state.feedbackFilters.brands.length === 0 || state.feedbackFilters.brands.includes(item.brand))
    .filter((item) => {
      const uploadDate = item.uploadTime.slice(0, 10);
      return !state.feedbackFilters.uploadDateStart || uploadDate >= state.feedbackFilters.uploadDateStart;
    })
    .filter((item) => {
      const uploadDate = item.uploadTime.slice(0, 10);
      return !state.feedbackFilters.uploadDateEnd || uploadDate <= state.feedbackFilters.uploadDateEnd;
    })
    .filter((item) => {
      const updateDate = item.updateTime.slice(0, 10);
      return !state.feedbackFilters.updateDateStart || updateDate >= state.feedbackFilters.updateDateStart;
    })
    .filter((item) => {
      const updateDate = item.updateTime.slice(0, 10);
      return !state.feedbackFilters.updateDateEnd || updateDate <= state.feedbackFilters.updateDateEnd;
    })
    .filter((item) => state.feedbackFilters.statuses.length === 0 || state.feedbackFilters.statuses.includes(item.status))
    .sort((a, b) => (a.updateTime > b.updateTime ? -1 : 1));
}

function renderFeedbackFilters() {
  if (feedbackSearchUnionId) feedbackSearchUnionId.value = state.feedbackFilters.unionId;
  if (feedbackSearchVersion) feedbackSearchVersion.value = state.feedbackFilters.version;
  if (feedbackSearchDescription) feedbackSearchDescription.value = state.feedbackFilters.description;
  if (feedbackSearchRemark) feedbackSearchRemark.value = state.feedbackFilters.remark;
  if (feedbackBrandFilterBtn) feedbackBrandFilterBtn.textContent = getFilterButtonLabel("brand", state.feedbackFilters.brands);
  if (feedbackStatusFilterBtn) feedbackStatusFilterBtn.textContent = getFilterButtonLabel("status", state.feedbackFilters.statuses);
  if (feedbackBrandFilterBtn) feedbackBrandFilterBtn.classList.toggle("active", state.feedbackFilters.brands.length > 0);
  if (feedbackStatusFilterBtn) feedbackStatusFilterBtn.classList.toggle("active", state.feedbackFilters.statuses.length > 0);
  if (feedbackUploadDateToggleBtn) {
    feedbackUploadDateToggleBtn.classList.toggle("active", !!(state.feedbackFilters.uploadDateStart || state.feedbackFilters.uploadDateEnd));
  }
  if (feedbackUpdateDateToggleBtn) {
    feedbackUpdateDateToggleBtn.classList.toggle("active", !!(state.feedbackFilters.updateDateStart || state.feedbackFilters.updateDateEnd));
  }
}

function renderFeedbackOverview() {
  const localOverview = buildFeedbackOverview(filteredFeedbackItems());
  const overview = isApiMode() ? state.feedbackApiOverview : localOverview;

  if (feedbackMetricTotal) feedbackMetricTotal.textContent = String(overview.total || 0);
  if (feedbackMetricPending) feedbackMetricPending.textContent = String(overview.pending || 0);
  if (feedbackMetricResolved) feedbackMetricResolved.textContent = String(overview.resolved || 0);
  if (feedbackMetricUpdated) {
    feedbackMetricUpdated.textContent = overview.latestUpdate && overview.latestUpdate !== "-"
      ? `最近更新 ${overview.latestUpdate}`
      : "最近 24 小时 0 条更新";
  }
  if (feedbackMetricSummary) {
    const bits = [];
    if (state.feedbackFilters.unionId) bits.push(`unionId：${state.feedbackFilters.unionId}`);
    if (state.feedbackFilters.version) bits.push(`版本：${state.feedbackFilters.version}`);
    if (state.feedbackFilters.description) bits.push(`描述：${state.feedbackFilters.description}`);
    if (state.feedbackFilters.remark) bits.push(`备注：${state.feedbackFilters.remark}`);
    if (state.feedbackFilters.brands.length) bits.push(`品牌：${state.feedbackFilters.brands.join(" / ")}`);
    if (state.feedbackFilters.uploadDateStart || state.feedbackFilters.uploadDateEnd) {
      bits.push(`上传时间：${state.feedbackFilters.uploadDateStart || "开始"} ~ ${state.feedbackFilters.uploadDateEnd || "结束"}`);
    }
    if (state.feedbackFilters.updateDateStart || state.feedbackFilters.updateDateEnd) {
      bits.push(`修改时间：${state.feedbackFilters.updateDateStart || "开始"} ~ ${state.feedbackFilters.updateDateEnd || "结束"}`);
    }
    if (state.feedbackFilters.statuses.length) bits.push(`状态：${state.feedbackFilters.statuses.join(" / ")}`);
    feedbackMetricSummary.textContent = bits.length ? bits.join(" / ") : "全部反馈";
  }
}

function renderExpandableText(text, fieldType) {
  const safeText = String(text || "-");
  return `
    <div class="feedback-cell-text">
      <div class="${fieldType === "remark" ? "feedback-remark" : "feedback-desc"}">${safeText}</div>
      <button class="link feedback-expand" data-field="${fieldType}">查看</button>
    </div>
  `;
}

async function copyTextToClipboard(text) {
  if (!text) return false;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function safeFileName(value, fallback = "landing-page") {
  return String(value || fallback)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 80) || fallback;
}

const LANDING_NAME_WORD_MAP = [
  ["落地页", "landingPage"],
  ["配置", "config"],
  ["领取", "claim"],
  ["春季", "spring"],
  ["秋季", "autumn"],
  ["冬季", "winter"],
  ["夏季", "summer"],
  ["声乐", "vocal"],
  ["钢琴", "piano"],
  ["朗诵", "recite"],
  ["美妆", "beauty"],
  ["招募", "recruit"],
  ["招生", "enroll"],
  ["测试", "test"],
  ["正式", "prod"],
  ["活动", "activity"],
  ["课程", "course"],
  ["福利", "benefit"],
  ["会员", "member"],
  ["新手", "beginner"],
  ["指南", "guide"],
  ["开开华彩", "kkhc"],
  ["华彩", "huacai"],
  ["开开", "kk"],
  ["名师", "teacher"],
  ["天团", "team"],
].sort((a, b) => b[0].length - a[0].length);

const LANDING_PINYIN_INITIAL_MAP = {
  一: "y", 二: "e", 三: "s", 四: "s", 五: "w", 六: "l", 七: "q", 八: "b", 九: "j", 十: "s",
  开: "k", 华: "h", 彩: "c", 名: "m", 师: "s", 天: "t", 团: "t", 测: "c", 试: "s",
  领: "l", 取: "q", 落: "l", 地: "d", 页: "y", 配: "p", 置: "z", 春: "c", 季: "j",
  声: "s", 乐: "y", 招: "z", 募: "m", 生: "s", 钢: "g", 琴: "q",
  朗: "l", 诵: "s", 美: "m", 妆: "z", 活: "h", 动: "d", 课: "k", 程: "c",
  福: "f", 利: "l", 会: "h", 员: "y", 新: "x", 手: "s", 指: "z", 南: "n",
  业: "y", 务: "w", 老: "l", 黄: "h", 文: "w", 静: "j", 院: "y", 长: "z",
};

function toLandingCamelCase(tokens, fallback = "landingPage") {
  const normalized = tokens
    .map((token) => String(token || "").trim())
    .filter(Boolean);
  if (!normalized.length) return fallback;
  const [first, ...rest] = normalized;
  const lowerFirst = first.replace(/^[A-Z]/, (letter) => letter.toLowerCase());
  return [lowerFirst, ...rest.map((token) => token.replace(/^[a-z]/, (letter) => letter.toUpperCase()))].join("").slice(0, 80) || fallback;
}

function makeLandingPageKeyFromName(name) {
  const raw = String(name || "").trim();
  if (!raw) return "landingPage";
  const tokens = [];
  let index = 0;
  while (index < raw.length) {
    const rest = raw.slice(index);
    const asciiMatch = rest.match(/^[a-zA-Z0-9]+/);
    if (asciiMatch) {
      tokens.push(asciiMatch[0]);
      index += asciiMatch[0].length;
      continue;
    }
    const matchedWord = LANDING_NAME_WORD_MAP.find(([word]) => rest.startsWith(word));
    if (matchedWord) {
      tokens.push(matchedWord[1]);
      index += matchedWord[0].length;
      continue;
    }
    const char = raw[index];
    if (/[\u4e00-\u9fff]/.test(char)) tokens.push(LANDING_PINYIN_INITIAL_MAP[char] || "");
    index += 1;
  }
  return safeFileName(toLandingCamelCase(tokens), "landingPage");
}

function renderFeedbackTable() {
  if (!feedbackTableBody) return;
  const allList = filteredFeedbackItems();
  let totalCount = allList.length;
  let totalPage = Math.max(1, Math.ceil(totalCount / state.pageSize));
  let list = allList;
    if (isApiMode()) {
    totalCount = state.feedbackApiTotal || allList.length;
    totalPage = Math.max(1, state.feedbackApiPages || Math.ceil(totalCount / state.pageSize));
  } else {
    if (state.pageCurrent > totalPage) {
      state.pageCurrent = totalPage;
      return renderFeedbackTable();
    }
    const start = (state.pageCurrent - 1) * state.pageSize;
    list = allList.slice(start, start + state.pageSize);
  }
  state.totalPages = totalPage;
  feedbackTableBody.innerHTML = "";
  list.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.unionId}</td>
      <td><button class="link copy-union-id">复制</button></td>
      <td>${item.version}</td>
      <td>${item.platform}</td>
      <td>${item.brand}</td>
      <td>${renderExpandableText(item.description, "description")}</td>
      <td><span class="pill feedback-pill ${feedbackStatusClass(item.status)}">${item.status}</span></td>
      <td>${item.uploadTime}</td>
      <td>${item.updateTime}</td>
      <td>${renderExpandableText(item.remark || "-", "remark")}</td>
      <td>
        <div class="op-btns">
          <button class="link download-log">下载日志</button>
          <button class="link edit-feedback-status">修改状态</button>
        </div>
      </td>
    `;
    tr.querySelector(".copy-union-id").addEventListener("click", async () => {
      try {
        await copyTextToClipboard(item.unionId);
      } catch (_) {}
    });
    tr.querySelector(".download-log").addEventListener("click", () => {
      if (item.logUrl) {
        window.open(item.logUrl, "_blank", "noopener,noreferrer");
        return;
      }
      window.alert(`未查询到日志下载链接：${item.unionId}`);
    });
    tr.querySelector(".edit-feedback-status").addEventListener("click", () => {
      openFeedbackStatusModal(item.id);
    });
    feedbackTableBody.appendChild(tr);
    tr.querySelectorAll(".feedback-expand").forEach((button) => {
      button.addEventListener("click", () => {
        const field = button.dataset.field;
        openFeedbackContentModal(field === "remark" ? "备注" : "用户描述", field === "remark" ? (item.remark || "-") : item.description);
      });
    });
  });
  updatePagerDisplay(totalPage, totalCount);
  renderDataSourceTag();
  renderEnvSwitch();
  renderFeedbackOverview();
  setupTableDragScroll();
}

function renderFeedbackStatusOptions() {
  if (feedbackStatusSelect) {
    feedbackStatusSelect.innerHTML = FEEDBACK_STATUS_OPTIONS.map((status) => `<option value="${status}">${status}</option>`).join("");
  }
}

function renderFeedbackBrandOptions() {
  renderFilterPanel("brand");
  renderFilterPanel("status");
}

function toggleFilterPanel(type) {
  const isBrand = type === "brand";
  const current = isBrand ? feedbackBrandFilterPanel : feedbackStatusFilterPanel;
  const other = isBrand ? feedbackStatusFilterPanel : feedbackBrandFilterPanel;
  if (!current) return;
  const willOpen = current.classList.contains("hidden");
  other?.classList.add("hidden");
  if (willOpen) renderFilterPanel(type);
  current.classList.toggle("hidden", !willOpen);
}

function openFeedbackStatusModal(id) {
  const item = feedbackItems.find((entry) => entry.id === id);
  if (!item || !feedbackStatusModal) return;
  setFeedbackStatusSubmitting(false);
  state.feedbackEditingId = id;
  if (feedbackModalUnionId) feedbackModalUnionId.textContent = item.unionId;
  if (feedbackModalVersion) feedbackModalVersion.textContent = item.version;
  if (feedbackModalDescription) feedbackModalDescription.textContent = item.description;
  if (feedbackStatusSelect) feedbackStatusSelect.value = item.status;
  if (feedbackRemarkInput) feedbackRemarkInput.value = item.remark || "";
  feedbackStatusModal.classList.remove("hidden");
}

function closeFeedbackStatusModal() {
  if (state.feedbackStatusSaving) return;
  state.feedbackEditingId = null;
  feedbackStatusModal?.classList.add("hidden");
}

function openFeedbackContentModal(title, text) {
  if (!feedbackContentModal) return;
  if (feedbackContentModalTitle) feedbackContentModalTitle.textContent = title;
  if (feedbackContentModalText) feedbackContentModalText.textContent = text || "-";
  feedbackContentModal.classList.remove("hidden");
}

function closeFeedbackContentModal() {
  feedbackContentModal?.classList.add("hidden");
}

function openFeedbackDateModal(type) {
  state.feedbackDateModalType = type;
  if (!feedbackDateModal) return;
  const isUpload = type === "upload";
  const startValue = isUpload ? state.feedbackFilters.uploadDateStart : state.feedbackFilters.updateDateStart;
  const endValue = isUpload ? state.feedbackFilters.uploadDateEnd : state.feedbackFilters.updateDateEnd;
  if (feedbackDateModalTitle) feedbackDateModalTitle.textContent = isUpload ? "选择上传时间" : "选择修改时间";
  if (feedbackDateStartInput) feedbackDateStartInput.value = startValue;
  if (feedbackDateEndInput) feedbackDateEndInput.value = endValue;
  feedbackDateModal.classList.remove("hidden");
}

function closeFeedbackDateModal() {
  state.feedbackDateModalType = null;
  feedbackDateModal?.classList.add("hidden");
}

function saveFeedbackDateFilter() {
  if (!state.feedbackDateModalType) return;
  const isUpload = state.feedbackDateModalType === "upload";
  const startValue = feedbackDateStartInput?.value || "";
  const endValue = feedbackDateEndInput?.value || "";

  if (isUpload) {
    state.feedbackFilters.uploadDateStart = startValue;
    state.feedbackFilters.uploadDateEnd = endValue;
  } else {
    state.feedbackFilters.updateDateStart = startValue;
    state.feedbackFilters.updateDateEnd = endValue;
  }

  closeFeedbackDateModal();
  applyFeedbackQuery();
}

async function saveFeedbackStatus() {
  if (state.feedbackStatusSaving) return;
  const item = feedbackItems.find((entry) => entry.id === state.feedbackEditingId);
  if (!item) return;
  const nextStatus = feedbackStatusSelect?.value || item.status;
  const nextRemark = feedbackRemarkInput?.value.trim() || "";

  if (isApiMode()) {
    const nextCode = feedbackStatusToCode(nextStatus);
    if (nextCode === null) {
      window.alert("状态值无效，无法提交");
      return;
    }
    try {
      setFeedbackStatusSubmitting(true);
      await changeFeedbackStatusByApi({
        id: item.id,
        comment: nextRemark,
        problemClassification: nextCode,
      });
      setFeedbackStatusSubmitting(false);
      closeFeedbackStatusModal();
      await queryFeedbackItems({ refreshOverview: true });
      renderFeedbackTable();
    } catch (error) {
      setFeedbackStatusSubmitting(false);
      window.alert(`修改状态失败：${error.message}`);
    }
    return;
  }

  item.status = nextStatus;
  item.remark = nextRemark;
  item.updateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  closeFeedbackStatusModal();
  renderFeedbackTable();
}

function makeLandingPageKey(name = "") {
  return makeLandingPageKeyFromName(name);
}

function normalizeLandingPageKey(value, fallbackName = "") {
  const normalized = String(value || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 80);
  return normalized || makeLandingPageKey(fallbackName);
}

const LANDING_SKU_NAME_TO_ID = {
  国画: "1",
  书法: "3",
  钢琴: "4",
  声乐: "5",
  联营: "6",
  舞蹈瑜伽俱乐部: "7",
  萨克斯: "8",
  养生: "11",
  太极: "12",
  舞蹈: "13",
  朗诵: "14",
  直营: "16",
  商城: "17",
  "声乐-月课": "18",
  非洲鼓: "19",
  口琴: "20",
  华彩乐园: "21",
  冥想瑜伽: "22",
  戏曲越剧: "23",
  摄影: "24",
  美妆: "25",
  营养: "26",
  AI技能课: "27",
  自媒体课: "28",
  社团: "30",
};

function normalizeLandingSkuId(value) {
  const raw = String(value || "").trim();
  if (!raw) return "5";
  return LANDING_SKU_NAME_TO_ID[raw] || raw;
}

function getLandingBusinessLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const option = landingCreateBusinessInput
    ? Array.from(landingCreateBusinessInput.options).find((item) => item.value === raw)
    : null;
  return option ? option.textContent.trim() : raw;
}

function makeLandingConfigJsonFileName(pageKey) {
  return `${safeFileName(pageKey, "landingPage")}-${Date.now()}`;
}

function makeLandingComponentId(type = "component") {
  return `${type}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function collectLandingControlIds(components = [], excludeId = "") {
  const excluded = String(excludeId || "").trim();
  const ids = new Set();
  components.forEach((component) => {
    const componentId = String(component?.id || "").trim();
    if (component?.type === "button" && componentId && componentId !== excluded) ids.add(componentId);
    if (component?.type !== "image") return;
    (component.hotzones || []).forEach((hotzone) => {
      const hotzoneId = String(hotzone?.id || "").trim();
      if (hotzoneId && hotzoneId !== excluded) ids.add(hotzoneId);
    });
  });
  return ids;
}

function makeLandingDefaultControlId(type = "component", components = []) {
  const prefix = type === "hotspot" ? "hotspot" : type === "button" ? "button" : "component";
  const ids = collectLandingControlIds(components);
  let index = 1;
  let candidate = `${prefix}${index}`;
  while (ids.has(candidate)) {
    index += 1;
    candidate = `${prefix}${index}`;
  }
  return candidate;
}

function findLandingDuplicateControlId(components = []) {
  const seen = new Map();
  for (const component of components) {
    if (!component) continue;
    const componentId = String(component.id || "").trim();
    if (component.type === "button" && !componentId) return { id: "", second: component, empty: true };
    if (component.type === "button" && componentId) {
      if (seen.has(componentId)) return { id: componentId, first: seen.get(componentId), second: component };
      seen.set(componentId, component);
    }
    if (component.type !== "image") continue;
    for (const hotzone of component.hotzones || []) {
      const hotzoneId = String(hotzone.id || "").trim();
      if (!hotzoneId) return { id: "", second: hotzone, empty: true };
      if (seen.has(hotzoneId)) return { id: hotzoneId, first: seen.get(hotzoneId), second: hotzone };
      seen.set(hotzoneId, hotzone);
    }
  }
  return null;
}

function getLandingControlLabel(control = {}) {
  if (control?.type === "button") return control.name || "按钮";
  return control?.name || "热区";
}

function applyLandingEditableControlId(target, nextId, components = [], label = "控件") {
  const currentId = String(target?.id || "").trim();
  const cleanId = String(nextId || "").trim();
  if (!target) return false;
  if (!cleanId) {
    showToast(`${label} ID 不能为空`, "error");
    return false;
  }
  if (cleanId !== currentId && collectLandingControlIds(components, currentId).has(cleanId)) {
    showToast(`${label} ID 不能重复`, "error");
    return false;
  }
  target.id = cleanId;
  state.landingEditorSelectedId = cleanId;
  return true;
}

function createLandingComponent(type = "image", overrides = {}) {
  const common = {
    id: overrides.id || makeLandingComponentId(type),
    type,
    name: overrides.name || "",
  };
  if (type === "hotspot") {
    return {
      ...common,
      name: overrides.name || "热区 1",
      x: Number(overrides.x ?? 19),
      y: Number(overrides.y ?? 75),
      width: Number(overrides.width ?? 117),
      height: Number(overrides.height ?? 39),
      event: overrides.event || (overrides.link ? "jump" : "claim"),
      sku: normalizeLandingSkuId(overrides.sku),
      link: overrides.link || "",
      jsMethod: overrides.jsMethod || overrides.js || "",
      bridgeAction: overrides.bridgeAction || overrides.jsMethod || overrides.js || "showShareDialog",
      bridgeParams: overrides.bridgeParams || "",
    };
  }
  if (type === "button") {
    return {
      ...common,
      name: overrides.name || "按钮",
      text: overrides.text || "按钮",
      event: overrides.event || (overrides.link ? "jump" : "claim"),
      sku: normalizeLandingSkuId(overrides.sku),
      link: overrides.link || "",
      jsMethod: overrides.jsMethod || overrides.js || "",
      bridgeAction: overrides.bridgeAction || overrides.jsMethod || overrides.js || "showShareDialog",
      bridgeParams: overrides.bridgeParams || "",
      imageUrl: overrides.imageUrl || "",
      positionMode: overrides.positionMode || overrides.mode || "bottom",
      floatAboveImage: overrides.floatAboveImage === true,
      bottomSafeArea: overrides.bottomSafeArea,
      color: overrides.color || "#1677ff",
      x: Number(overrides.x ?? 32),
      y: Number(overrides.y ?? 620),
      width: Number(overrides.width ?? 311),
      height: Number(overrides.height ?? 48),
      naturalWidth: Number(overrides.naturalWidth ?? 0),
      naturalHeight: Number(overrides.naturalHeight ?? 0),
    };
  }
  return {
    ...common,
    name: overrides.name || "图片",
    imageUrl: Object.prototype.hasOwnProperty.call(overrides, "imageUrl")
      ? String(overrides.imageUrl || "")
      : "https://picsum.photos/seed/activity/800/1200",
    height: Number(overrides.height ?? 0),
    naturalWidth: Number(overrides.naturalWidth ?? 375),
    naturalHeight: Number(overrides.naturalHeight ?? overrides.height ?? 560),
    hotzones: Array.isArray(overrides.hotzones) ? overrides.hotzones : [],
  };
}

function getLandingComponents(config = {}) {
  if (Array.isArray(config.components) && config.components.length) {
    return config.components.map((component) => createLandingComponent(component.type, component));
  }
  const heroImage = config.hero?.bannerImageUrl || "https://picsum.photos/seed/activity/800/1200";
  return [
    createLandingComponent("image", {
      id: "image_default",
      imageUrl: heroImage,
      hotzones: Array.isArray(config.hotzones) ? config.hotzones : [],
    }),
  ];
}

function toLandingRatio(value, base) {
  const number = Number(value || 0);
  const source = Number(base || 0);
  if (!source) return 0;
  return Number((number / source).toFixed(6));
}

function withLandingComponentRatios(component, canvas = { width: 375, height: 812 }) {
  if (!component || typeof component !== "object") return component;
  const canvasWidth = Number(canvas.width || 375);
  const canvasHeight = Number(canvas.height || 812);
  if (component.type === "image") {
    const imageHeight = getLandingImageHeight(component);
    return {
      ...component,
      baseWidth: canvasWidth,
      baseHeight: imageHeight,
      hotzones: (component.hotzones || []).map((hotzone) => ({
        ...hotzone,
        xRatio: toLandingRatio(hotzone.x, canvasWidth),
        yRatio: toLandingRatio(hotzone.y, imageHeight),
        widthRatio: toLandingRatio(hotzone.width, canvasWidth),
        heightRatio: toLandingRatio(hotzone.height, imageHeight),
      })),
    };
  }
  if (component.type === "button") {
    const mode = component.positionMode || "bottom";
    const rect = getLandingButtonRect(component);
    return {
      ...component,
      height: rect.height,
      baseWidth: canvasWidth,
      baseHeight: mode === "fixed" || mode === "top" || mode === "bottom" ? canvasHeight : canvasWidth,
      xRatio: toLandingRatio(rect.x, canvasWidth),
      yRatio: toLandingRatio(rect.y, mode === "fixed" || mode === "top" || mode === "bottom" ? canvasHeight : canvasWidth),
      widthRatio: toLandingRatio(rect.width, canvasWidth),
      heightRatio: toLandingRatio(rect.height, canvasWidth),
    };
  }
  return component;
}

function findLandingComponent(id, components = state.landingForm?.config?.components || []) {
  return components.find((component) => component.id === id) || null;
}

function getLandingHotzoneWithParent(id, components = state.landingForm?.config?.components || []) {
  for (const component of components) {
    if (component.type !== "image") continue;
    const hotzone = (component.hotzones || []).find((item) => item.id === id);
    if (hotzone) return { hotzone, parent: component };
  }
  return null;
}

function getLandingSelectedImageComponent(components = getLandingComponents(state.landingForm?.config || {})) {
  const selected = findLandingComponent(state.landingEditorSelectedId, components);
  return selected?.type === "image" ? selected : null;
}

function getLandingTargetImageComponent(components = getLandingComponents(state.landingForm?.config || {})) {
  const selectedImage = getLandingSelectedImageComponent(components);
  if (selectedImage) return selectedImage;
  const parent = getLandingHotzoneWithParent(state.landingEditorSelectedId, components)?.parent;
  if (parent) return parent;
  const imageComponents = components.filter((component) => component.type === "image");
  return imageComponents.length === 1 ? imageComponents[0] : null;
}

function getLandingComponentTop(componentId, components = state.landingForm?.config?.components || []) {
  let top = 0;
  for (const component of components) {
    if (component.id === componentId) return top;
    if (component.type === "image") top += getLandingImageHeight(component);
    if (component.type === "button" && !landingButtonAllowsImageOverlap(component)) {
      const rect = getLandingButtonRect(component);
      top += Math.max(0, rect.y - top) + rect.height;
    }
  }
  return top;
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function getLandingImageHeight(component = {}) {
  const explicitHeight = Number(component.height || 0);
  if (explicitHeight > 0) return explicitHeight;
  const naturalWidth = Number(component.naturalWidth || 375);
  const naturalHeight = Number(component.naturalHeight || 560);
  if (naturalWidth > 0 && naturalHeight > 0) return Math.round((375 * naturalHeight) / naturalWidth);
  return 560;
}

function updateLandingImageNaturalSize(component, imageElement) {
  if (!component || !imageElement?.naturalWidth || !imageElement?.naturalHeight) return false;
  const nextHeight = Math.round((375 * imageElement.naturalHeight) / imageElement.naturalWidth);
  const changed = component.naturalWidth !== imageElement.naturalWidth
    || component.naturalHeight !== imageElement.naturalHeight
    || component.height !== nextHeight;
  component.naturalWidth = imageElement.naturalWidth;
  component.naturalHeight = imageElement.naturalHeight;
  component.height = nextHeight;
  return changed;
}

function loadLandingImageMeta(url) {
  return new Promise((resolve) => {
    const raw = String(url || "").trim();
    if (!raw) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = raw;
  });
}

function loadLandingImageFileMeta(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    const cleanup = () => URL.revokeObjectURL(objectUrl);
    img.onload = () => {
      const meta = { width: img.naturalWidth, height: img.naturalHeight };
      cleanup();
      resolve(meta);
    };
    img.onerror = () => {
      cleanup();
      resolve(null);
    };
    img.src = objectUrl;
  });
}

function getLandingButtonImageSize(meta = {}, button = {}) {
  const naturalWidth = Number(meta.width || meta.naturalWidth || 0);
  const naturalHeight = Number(meta.height || meta.naturalHeight || 0);
  if (!naturalWidth || !naturalHeight) return null;
  const maxWidth = Math.max(32, 375 - Number(button.x || 0));
  const maxHeight = Math.max(24, 754 - Number(button.y || 0) - getLandingButtonBottomSafeArea(button));
  const scale = Math.min(1, maxWidth / naturalWidth, maxHeight / naturalHeight);
  return {
    width: Math.max(32, Math.round(naturalWidth * scale)),
    height: Math.max(24, Math.round(naturalHeight * scale)),
    naturalWidth,
    naturalHeight,
  };
}

function applyLandingButtonImageSize(button, meta = {}) {
  const size = getLandingButtonImageSize(meta, button);
  if (!button || !size) return false;
  const changed = button.naturalWidth !== size.naturalWidth
    || button.naturalHeight !== size.naturalHeight
    || button.width !== size.width
    || button.height !== size.height;
  button.naturalWidth = size.naturalWidth;
  button.naturalHeight = size.naturalHeight;
  button.width = size.width;
  button.height = size.height;
  return changed;
}

function normalizeLandingHotzoneRect(rect, imageComponent = {}) {
  const imageHeight = getLandingImageHeight(imageComponent);
  const width = clampNumber(rect.width, 20, 375);
  const height = clampNumber(rect.height, 20, imageHeight);
  return {
    x: clampNumber(rect.x, 0, Math.max(0, 375 - width)),
    y: clampNumber(rect.y, 0, Math.max(0, imageHeight - height)),
    width,
    height,
  };
}

function getLandingHotzoneRect(hotzone = {}) {
  return {
    x: Number(hotzone.x || 0),
    y: Number(hotzone.y || 0),
    width: Number(hotzone.width || 20),
    height: Number(hotzone.height || 20),
  };
}

function landingRectsOverlap(a, b) {
  return a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
}

function landingHotzoneOverlapsSiblings(rect, imageComponent = {}, hotzoneId = "") {
  const candidate = normalizeLandingHotzoneRect(rect, imageComponent);
  return (imageComponent.hotzones || []).some((hotzone) => {
    if (hotzone.id === hotzoneId) return false;
    return landingRectsOverlap(candidate, normalizeLandingHotzoneRect(getLandingHotzoneRect(hotzone), imageComponent));
  });
}

function findAvailableLandingHotzoneRect(imageComponent = {}, preferredRect = {}, hotzoneId = "") {
  const initialRect = normalizeLandingHotzoneRect(preferredRect, imageComponent);
  if (!landingHotzoneOverlapsSiblings(initialRect, imageComponent, hotzoneId)) return initialRect;

  const imageHeight = getLandingImageHeight(imageComponent);
  const step = 12;
  for (let y = 0; y <= imageHeight - initialRect.height; y += step) {
    for (let x = 0; x <= 375 - initialRect.width; x += step) {
      const candidate = normalizeLandingHotzoneRect({ ...initialRect, x, y }, imageComponent);
      if (!landingHotzoneOverlapsSiblings(candidate, imageComponent, hotzoneId)) return candidate;
    }
  }
  return null;
}

function applyLandingHotzoneRect(hotzone, imageComponent, rect) {
  const candidate = normalizeLandingHotzoneRect(rect, imageComponent);
  if (landingHotzoneOverlapsSiblings(candidate, imageComponent, hotzone.id)) return false;
  hotzone.x = candidate.x;
  hotzone.y = candidate.y;
  hotzone.width = candidate.width;
  hotzone.height = candidate.height;
  return true;
}

function findLandingOverlappingHotzones(components = []) {
  for (const component of components) {
    if (component.type !== "image") continue;
    const hotzones = component.hotzones || [];
    for (let i = 0; i < hotzones.length; i += 1) {
      for (let j = i + 1; j < hotzones.length; j += 1) {
        if (landingRectsOverlap(
          normalizeLandingHotzoneRect(getLandingHotzoneRect(hotzones[i]), component),
          normalizeLandingHotzoneRect(getLandingHotzoneRect(hotzones[j]), component),
        )) {
          return {
            image: component,
            first: hotzones[i],
            second: hotzones[j],
          };
        }
      }
    }
  }
  return null;
}

function findLandingInvalidButtonOverlap(components = []) {
  for (const button of components) {
    if (button.type !== "button" || !landingButtonMustStayInFlow(button)) continue;
    const rect = normalizeLandingButtonRect(getLandingButtonRect(button), components, button);
    if (landingButtonOverlapsImages(rect, components)) return button;
  }
  return null;
}

function getLandingImageRects(components = []) {
  const rects = [];
  let top = 0;
  components.forEach((component) => {
    if (component.type === "image") {
      const height = getLandingImageHeight(component);
      rects.push({
        id: component.id,
        x: 0,
        y: top,
        width: 375,
        height,
      });
      top += height;
      return;
    }
    if (component.type === "button" && landingButtonMustStayInFlow(component)) {
      const rect = getLandingButtonRect(component);
      top += Math.max(0, rect.y - top) + rect.height;
    }
  });
  return rects;
}

function getLandingCanvasContentHeight(components = []) {
  const imageBottom = getLandingImageRects(components).reduce((max, rect) => Math.max(max, rect.y + rect.height), 0);
  const buttonBottom = components
    .filter((component) => component.type === "button")
    .reduce((max, button) => Math.max(max, Number(button.y || 0) + Number(button.height || 48)), 0);
  return Math.max(812, imageBottom, buttonBottom);
}

function getLandingButtonRect(button = {}) {
  const mode = button.positionMode || "bottom";
  const rawHeight = Number(button.height || 48);
  const visualHeight = button.imageUrl && (mode === "top" || mode === "bottom")
    ? Math.max(48, rawHeight)
    : rawHeight;
  return {
    x: Number(button.x || 0),
    y: Number(button.y || 0),
    width: Number(button.width || 311),
    height: visualHeight,
  };
}

function formatLandingPixelValue(value, fallback = 0) {
  const number = Number(value);
  return String(Number.isFinite(number) ? Math.round(number) : fallback);
}

function setLandingInputValue(input, value, fallback = 0) {
  if (!input || document.activeElement === input) return;
  input.value = formatLandingPixelValue(value, fallback);
}

function landingButtonAllowsImageOverlap(button = {}) {
  const mode = button.positionMode || "bottom";
  return mode === "fixed" || (button.floatAboveImage === true && (mode === "top" || mode === "bottom"));
}

function landingButtonMustStayInFlow(button = {}) {
  return (button.positionMode || "bottom") === "flow";
}

function getLandingScreenButtonY(button = {}) {
  const height = getLandingButtonRect(button).height;
  const mode = button.positionMode || "bottom";
  if (mode === "top") return 0;
  if (mode === "bottom") return Math.max(0, 754 - height - getLandingButtonBottomSafeArea(button));
  return Number(button.y || 0);
}

function getLandingButtonBottomSafeArea(button = {}) {
  const canvasConfig = state.landingForm?.config?.canvas || {};
  const enabled = typeof canvasConfig.enableBottomSafeArea === "boolean"
    ? canvasConfig.enableBottomSafeArea
    : button.bottomSafeArea !== false;
  return enabled ? LANDING_BOTTOM_SAFE_AREA : 0;
}

function getLandingScreenMaxY(button = {}) {
  return Math.max(0, 754 - getLandingButtonRect(button).height - getLandingButtonBottomSafeArea(button));
}

function normalizeLandingButtonRect(rect, components = [], button = {}) {
  const contentHeight = getLandingCanvasContentHeight(components);
  const width = clampNumber(rect.width, 32, 375);
  const isScreenButton = ["top", "bottom", "fixed"].includes(button.positionMode || "");
  const minHeight = button.imageUrl && ["top", "bottom"].includes(button.positionMode || "") ? 48 : 24;
  const height = clampNumber(rect.height, minHeight, isScreenButton ? 754 : Math.max(minHeight, contentHeight + 120));
  const maxY = isScreenButton
    ? Math.max(0, 754 - height - getLandingButtonBottomSafeArea(button))
    : Math.max(0, contentHeight + 120 - height);
  return {
    x: clampNumber(rect.x, 0, Math.max(0, 375 - width)),
    y: clampNumber(rect.y, 0, maxY),
    width,
    height,
  };
}

function landingButtonOverlapsImages(rect, components = []) {
  return getLandingImageRects(components).some((imageRect) => landingRectsOverlap(rect, imageRect));
}

function getLandingButtonPreferredRect(button = {}, components = []) {
  const rect = getLandingButtonRect(button);
  const mode = button.positionMode || "bottom";
  if (mode === "top" || mode === "bottom") return { ...rect, y: getLandingScreenButtonY(button) };
  if (mode === "fixed") {
    return {
      ...rect,
      x: clampNumber(rect.x, 0, Math.max(0, 375 - rect.width)),
      y: clampNumber(rect.y, 0, getLandingScreenMaxY(button)),
    };
  }
  return rect;
}

function findAvailableLandingButtonRect(button = {}, components = [], preferredRect = null) {
  const initial = normalizeLandingButtonRect(preferredRect || getLandingButtonPreferredRect(button, components), components, button);
  if (!landingButtonMustStayInFlow(button) || !landingButtonOverlapsImages(initial, components)) return initial;

  const step = 8;
  const contentHeight = getLandingCanvasContentHeight(components);
  const maxY = contentHeight + 120 - initial.height;
  for (let y = initial.y; y <= maxY; y += step) {
    const candidate = normalizeLandingButtonRect({ ...initial, y }, components, button);
    if (!landingButtonOverlapsImages(candidate, components)) return candidate;
  }
  for (let y = initial.y - step; y >= 0; y -= step) {
    const candidate = normalizeLandingButtonRect({ ...initial, y }, components, button);
    if (!landingButtonOverlapsImages(candidate, components)) return candidate;
  }
  return null;
}

function applyLandingButtonRect(button, components = [], rect = null) {
  const candidate = findAvailableLandingButtonRect(button, components, rect);
  if (!candidate) return false;
  button.x = candidate.x;
  button.y = candidate.y;
  button.width = candidate.width;
  button.height = candidate.height;
  return true;
}

function normalizeLandingButtonLayouts(components = []) {
  let flowTop = 0;
  components.forEach((component) => {
    if (component.type === "image") {
      flowTop += getLandingImageHeight(component);
      return;
    }
    if (component.type !== "button") return;
    if (component.imageUrl && ["top", "bottom"].includes(component.positionMode || "") && Number(component.height || 0) < 48) {
      component.height = 48;
    }
    if (landingButtonMustStayInFlow(component)) {
      component.y = flowTop;
      flowTop += Number(component.height || 48);
      return;
    }
    if ((component.positionMode || "bottom") === "top" || (component.positionMode || "bottom") === "bottom") {
      component.y = getLandingScreenButtonY(component);
    }
  });
  return components;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseLandingContent(content) {
  const raw = String(content || "").trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) {
    const configJsonUrl = getLandingConfigJsonName(raw);
    return {
      ...createDefaultLandingConfig(),
      renderer: { mode: "dynamic-json", configJsonUrl },
      dataSource: {
        type: "oss-json",
        configJsonUrl,
        configJsonOssUrl: raw,
      },
      publish: {
        configJsonUrl,
        configJsonOssUrl: raw,
      },
    };
  }
  try {
    return JSON.parse(raw);
  } catch (_) {
    return {
      schemaVersion: 1,
      pageKey: makeLandingPageKey(),
      renderer: { mode: "legacy-html", configJsonUrl: "" },
      hero: { title: "", subtitle: "", bannerImageUrl: "" },
      cta: { text: "按钮", link: "" },
      theme: { primaryColor: "#2563eb" },
      sections: [{ type: "richText", content: raw }],
      materials: [],
    };
  }
}

function createDefaultLandingConfig() {
  return {
    schemaVersion: 1,
    pageKey: makeLandingPageKey(),
    renderer: {
      mode: "dynamic-json",
      configJsonUrl: "",
    },
    canvas: {
      width: 375,
      height: 812,
      enableBottomSafeArea: true,
    },
    hero: {
      title: "领取专属课程权益",
      subtitle: "限时福利，提交信息后顾问联系",
      bannerImageUrl: "https://picsum.photos/seed/activity/800/1200",
    },
    cta: {
      text: "按钮",
      link: "",
    },
    theme: {
      primaryColor: "#2563eb",
    },
    sections: [
      {
        type: "richText",
        content: "填写活动说明、领取规则、课程卖点等内容。",
      },
    ],
    materials: [],
    components: [
      createLandingComponent("image", {
        id: "image_default",
        imageUrl: "https://picsum.photos/seed/activity/800/1200",
      }),
    ],
  };
}

function normalizeLandingRecord(item = {}) {
  const config = parseLandingContent(item.content) || createDefaultLandingConfig();
  const normalizedId = item.id ?? item.landingPageId ?? config.landingPageId ?? null;
  const normalizedH5Url = String(item.h5Url || config.h5Url || "");
  return {
    id: normalizedId,
    name: String(item.name || ""),
    businessTypeComment: String(item.businessTypeComment || ""),
    content: typeof item.content === "string" ? item.content : JSON.stringify(config, null, 2),
    h5Url: normalizedH5Url,
    creator: String(item.creator || item.createUser || item.creatorName || ""),
    createTime: String(item.createTime || item.createdTime || ""),
    config: {
      ...config,
      landingPageId: normalizedId,
      h5Url: normalizedH5Url || config.h5Url || "",
      components: getLandingComponents(config),
    },
  };
}

async function hydrateLandingRecordConfig(record) {
  const contentUrl = String(record?.content || "").trim();
  if (!/^https?:\/\//i.test(contentUrl)) return record;
  const response = await fetch(contentUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`读取 OSS 配置失败：${response.status}`);
  const remoteConfig = await response.json();
  const configJsonUrl = getLandingConfigJsonName(
    remoteConfig?.renderer?.configJsonUrl ||
    remoteConfig?.publish?.configJsonUrl ||
    contentUrl
  );
  const nextConfig = {
    ...remoteConfig,
    landingPageId: record.id ?? remoteConfig.landingPageId ?? null,
    h5Url: record.h5Url || remoteConfig.h5Url || "",
    renderer: {
      ...(remoteConfig.renderer || {}),
      mode: "dynamic-json",
      configJsonUrl,
    },
    dataSource: {
      ...(remoteConfig.dataSource || {}),
      type: "oss-json",
      configJsonUrl,
      configJsonOssUrl: contentUrl,
    },
    publish: {
      ...(remoteConfig.publish || {}),
      h5Url: record.h5Url || remoteConfig.publish?.h5Url || remoteConfig.h5Url || "",
      configJsonUrl,
      configJsonOssUrl: contentUrl,
    },
  };
  return {
    ...record,
    config: {
      ...nextConfig,
      components: getLandingComponents(nextConfig),
    },
  };
}

function syncLandingItemsWithSource() {
  landingItems = isApiMode() ? apiLandingItems : localLandingItems;
}

function landingApiRequest(path, options = {}) {
  const apiBase = API_ENV_CONFIG[state.apiEnv]?.appBaseUrl || API_ENV_CONFIG.prod.appBaseUrl;
  return fetch(`${apiBase}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
    .then((resp) => resp.json().then((json) => ({ resp, json })))
    .then(({ resp, json }) => {
      if (!resp.ok || json.status !== 200) {
        throw new Error(json.message || "领取落地页接口请求失败");
      }
      return json.data;
    });
}

function getLandingSavedId(data) {
  if (!data || typeof data !== "object") return data ?? null;
  return data.id ?? data.landingPageId ?? data.pageId ?? data.data?.id ?? data.data?.landingPageId ?? null;
}

async function findSavedLandingPageId({ name, h5Url }) {
  const params = new URLSearchParams({
    pageCurrent: "1",
    pageSize: "10",
  });
  if (name) params.set("nameLike", name);
  const data = await landingApiRequest(`/sae-gateway/kkhc-bizcenter-app/landingPage/landingPageQuery?${params.toString()}`);
  const records = Array.isArray(data?.records) ? data.records : [];
  const exact = records.find((record) => String(record.h5Url || "") === String(h5Url || ""))
    || records.find((record) => String(record.name || "") === String(name || ""));
  return getLandingSavedId(exact);
}

function flexibleConfigApiRequest(path, options = {}) {
  const apiBase = API_ENV_CONFIG[state.apiEnv]?.appBaseUrl || API_ENV_CONFIG.prod.appBaseUrl;
  return fetch(`${apiBase}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
    .then((resp) => resp.json().then((json) => ({ resp, json })))
    .then(({ resp, json }) => {
      if (!resp.ok || json.status !== 200) {
        throw new Error(json.message || "灵活配置接口请求失败");
      }
      return json.data;
    });
}

function getShareMaterialTab(key = state.shareMaterialActiveTab) {
  return SHARE_MATERIAL_TAB_MAP.get(key) || SHARE_MATERIAL_TABS[0];
}

function getShareMaterialSkuLabel(value) {
  return SHARE_MATERIAL_SKU_OPTIONS.find((item) => String(item.value) === String(value))?.label || value || "-";
}

function normalizeShareMaterialConfig(raw = {}, code = "") {
  const normalizedCode = raw.code || code;
  const tab = SHARE_MATERIAL_TABS.find((item) => item.code === normalizedCode);
  return {
    id: raw.id ?? null,
    code: normalizedCode,
    name: raw.name || tab?.title || normalizedCode,
    content: raw.content == null || raw.content === "null" ? "" : String(raw.content),
    createTime: raw.createTime || "",
    updateTime: raw.updateTime || "",
  };
}

function parseShareMaterialContent(config, tab = getShareMaterialTab()) {
  const raw = String(config?.content || "").trim();
  const fallback = tab.structure === "skuMap" ? { skuMaterials: {} } : [];
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (tab.structure === "skuMap") {
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return { skuMaterials: parsed.skuMaterials || parsed.materialsBySku || parsed || {} };
      }
      return fallback;
    }
    return Array.isArray(parsed) ? parsed : Array.isArray(parsed?.records) ? parsed.records : fallback;
  } catch (_) {
    return fallback;
  }
}

function serializeShareMaterialContent(data) {
  return JSON.stringify(data, null, 2);
}

function getShareMaterialConfig(tab = getShareMaterialTab()) {
  return shareMaterialItems.find((item) => item.code === tab.code) || normalizeShareMaterialConfig({}, tab.code);
}

function getShareMaterialRows(tab = getShareMaterialTab()) {
  const parsed = parseShareMaterialContent(getShareMaterialConfig(tab), tab);
  const rows = tab.structure === "skuMap"
    ? (parsed.skuMaterials?.[state.shareMaterialSkuFilter] || [])
    : parsed;
  return rows
    .map((item, index) => ({
      id: item.id || `${tab.key}-${item.sku || state.shareMaterialSkuFilter || "all"}-${index}`,
      sku: item.sku || "",
      skuName: item.skuName || getShareMaterialSkuLabel(item.sku),
      name: item.name || "",
      mediaUrl: item.mediaUrl || item.imageUrl || item.videoUrl || item.url || "",
      mediaType: item.mediaType || item.type || "image",
      sort: Number(item.sort || item.order || index + 1),
    }))
    .sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
}

function updateShareMaterialConfigRows(tab, rows) {
  const current = getShareMaterialConfig(tab);
  const normalizedRows = rows.map((row) => {
    if (tab.key === "miniCover") {
      return {
        id: row.id,
        sku: row.sku,
        skuName: row.skuName || getShareMaterialSkuLabel(row.sku),
        mediaUrl: row.mediaUrl,
      };
    }
    return row;
  });
  let contentData;
  if (tab.structure === "skuMap") {
    const parsed = parseShareMaterialContent(current, tab);
    contentData = {
      skuMaterials: {
        ...(parsed.skuMaterials || {}),
        [state.shareMaterialSkuFilter]: normalizedRows,
      },
    };
  } else {
    contentData = normalizedRows;
  }
  const next = {
    ...current,
    content: serializeShareMaterialContent(contentData),
    dirty: true,
  };
  shareMaterialItems = SHARE_MATERIAL_CODES.map((code) => (
    code === tab.code
      ? next
      : shareMaterialItems.find((item) => item.code === code) || normalizeShareMaterialConfig({}, code)
  ));
  return next;
}

function syncShareMaterialItems(records = {}) {
  shareMaterialItems = SHARE_MATERIAL_CODES.map((code) => (
    normalizeShareMaterialConfig(records[code] || localShareMaterialItems.find((item) => item.code === code) || {}, code)
  ));
}

async function queryShareMaterialItems() {
  if (!isApiMode()) {
    syncShareMaterialItems(Object.fromEntries(localShareMaterialItems.map((item) => [item.code, item])));
    return;
  }
  const codeList = SHARE_MATERIAL_CODES.join(",");
  const data = await flexibleConfigApiRequest(`/sae-gateway/kkhc-bizcenter-app/flexibleConfig/queryFlexibleConfigMap?codeList=${encodeURIComponent(codeList)}`);
  syncShareMaterialItems(data?.flexibleConfigMap || {});
}

async function fetchShareMaterialConfig(tab = getShareMaterialTab()) {
  if (!isApiMode()) {
    return normalizeShareMaterialConfig(localShareMaterialItems.find((item) => item.code === tab.code) || {}, tab.code);
  }
  const data = await flexibleConfigApiRequest(`/sae-gateway/kkhc-bizcenter-app/flexibleConfig/getOneFlexibleConfig?code=${encodeURIComponent(tab.code)}`);
  return normalizeShareMaterialConfig(data || {}, tab.code);
}

function setShareMaterialStatus(message = "", type = "info") {
  if (!shareMaterialStatus) return;
  shareMaterialStatus.textContent = message;
  shareMaterialStatus.className = `share-material-status ${message ? "" : "hidden"} ${type}`;
}

function renderShareMaterialSelectOptions(selectEl, includeAll = false) {
  if (!selectEl) return;
  selectEl.innerHTML = [
    ...(includeAll ? [{ value: "", label: "全部 SKU" }] : []),
    ...SHARE_MATERIAL_SKU_OPTIONS,
  ].map((item) => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`).join("");
}

function renderShareMaterialTabs() {
  if (!shareMaterialTabs) return;
  shareMaterialTabs.innerHTML = SHARE_MATERIAL_TABS.map((tab) => `
    <button class="${tab.key === state.shareMaterialActiveTab ? "active" : ""}" data-share-tab="${escapeHtml(tab.key)}" type="button">
      <strong>${escapeHtml(tab.title)}</strong>
      <span>${escapeHtml(tab.description)}</span>
    </button>
  `).join("");
  shareMaterialTabs.querySelectorAll("[data-share-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.shareMaterialActiveTab = button.dataset.shareTab;
      renderShareMaterials();
      refreshShareMaterialActiveConfig();
    });
  });
}

function renderShareMaterialPreviewBox(url, type, target = shareMaterialPreview) {
  if (!target) return;
  const cleanUrl = String(url || "").trim();
  if (!cleanUrl) {
    target.innerHTML = '<span>点击或拖拽上传素材</span>';
    return;
  }
  target.innerHTML = type === "video"
    ? `<video src="${escapeHtml(cleanUrl)}" controls></video>`
    : `<img src="${escapeHtml(cleanUrl)}" alt="素材预览" />`;
}

function reorderShareMaterialRowsByInsertion(rows, rowId, nextSort) {
  const targetIndex = rows.findIndex((row) => String(row.id) === String(rowId));
  if (targetIndex < 0) return rows;
  const orderedRows = rows
    .map((row, index) => ({ ...row, __originalIndex: index }))
    .sort((a, b) => {
      const sortDiff = Number(a.sort || 0) - Number(b.sort || 0);
      return sortDiff || a.__originalIndex - b.__originalIndex;
    });
  const currentIndex = orderedRows.findIndex((row) => String(row.id) === String(rowId));
  const [target] = orderedRows.splice(currentIndex, 1);
  const insertIndex = Math.min(Math.max(Number(nextSort) - 1, 0), orderedRows.length);
  orderedRows.splice(insertIndex, 0, target);
  return orderedRows.map(({ __originalIndex, ...row }, index) => ({
    ...row,
    sort: index + 1,
  }));
}

function updateShareMaterialRowOrder(rowId, nextSort) {
  const tab = getShareMaterialTab();
  if (!tab.ordered) return;
  const normalizedSort = Number(nextSort);
  if (!Number.isInteger(normalizedSort) || normalizedSort < 1) {
    window.alert("顺序必须是大于 0 的整数");
    renderShareMaterials();
    return;
  }
  const rows = getShareMaterialRows(tab);
  const target = rows.find((row) => String(row.id) === String(rowId));
  if (!target) return;
  const previousSort = Number(target.sort || 0);
  if (normalizedSort === previousSort) return;
  updateShareMaterialConfigRows(tab, reorderShareMaterialRowsByInsertion(rows, rowId, normalizedSort));
  renderShareMaterials();
  showToast("顺序已调整，点击页面右上角保存后生效", "success");
}

function updateShareMaterialRowName(rowId, nextName, options = {}) {
  const { render = true } = options;
  const tab = getShareMaterialTab();
  const rows = getShareMaterialRows(tab);
  const target = rows.find((row) => String(row.id) === String(rowId));
  if (!target) return;
  target.name = String(nextName || "").trim();
  updateShareMaterialConfigRows(tab, rows);
  if (render) {
    renderShareMaterials();
    showToast("名称已更新，点击页面右上角保存后生效", "success");
  } else {
    renderShareMaterialOverview();
  }
}

function updateShareMaterialRowType(rowId, nextType) {
  const tab = getShareMaterialTab();
  const rows = getShareMaterialRows(tab);
  const target = rows.find((row) => String(row.id) === String(rowId));
  if (!target) return;
  target.mediaType = nextType === "video" ? "video" : "image";
  updateShareMaterialConfigRows(tab, rows);
  renderShareMaterials();
  showToast("类型已更新，点击页面右上角保存后生效", "success");
}

function getShareMaterialAccept(tab = getShareMaterialTab()) {
  return tab.mediaTypes.includes("video") ? "image/*,video/*" : "image/*";
}

function isShareMaterialFileAccepted(file, tab = getShareMaterialTab()) {
  if (!file) return false;
  if (tab.mediaTypes.includes("video") && file.type?.startsWith("video/")) return true;
  return file.type?.startsWith("image/");
}

async function uploadShareMaterialFile(file) {
  const tab = getShareMaterialTab();
  if (!file) return;
  if (!isShareMaterialFileAccepted(file, tab)) {
    window.alert(tab.mediaTypes.includes("video") ? "请选择图片或视频文件" : "请选择图片文件");
    return;
  }
  const previousHint = shareMaterialUploadHint?.textContent || "";
  try {
    shareMaterialUploadBox?.classList.add("is-uploading");
    setButtonLoading(uploadShareMaterialBtn, true, "上传中...");
    if (shareMaterialUploadHint) shareMaterialUploadHint.textContent = "正在上传到 OSS...";
    const mediaType = file.type?.startsWith("video/") ? "video" : "image";
    const result = await uploadShareMaterialToOss(file, tab, mediaType);
    if (shareMaterialUrlInput) shareMaterialUrlInput.value = result.url;
    if (shareMaterialTypeInput && tab.mediaTypes.includes(mediaType)) shareMaterialTypeInput.value = mediaType;
    renderShareMaterialPreviewBox(result.url, mediaType);
    showToast("素材已上传到 OSS", "success");
  } catch (error) {
    showToast(`素材上传失败：${error.message}`, "error");
  } finally {
    if (shareMaterialUploadHint) shareMaterialUploadHint.textContent = previousHint;
    shareMaterialUploadBox?.classList.remove("is-uploading", "is-dragover");
    setButtonLoading(uploadShareMaterialBtn, false);
  }
}

function openShareMaterialFilePicker() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = getShareMaterialAccept();
  input.addEventListener("change", () => {
    const [file] = input.files || [];
    uploadShareMaterialFile(file);
  }, { once: true });
  input.click();
}

function renderShareMaterialTable() {
  const tab = getShareMaterialTab();
  const rows = getShareMaterialRows(tab);
  if (shareMaterialTableHead) {
    const labels = {
      order: "顺序",
      sku: "SKU",
      name: "名称",
      media: "素材",
      mediaType: "类型",
      actions: "操作",
    };
    shareMaterialTableHead.innerHTML = `<tr>${tab.columns.map((column) => `<th>${labels[column]}</th>`).join("")}</tr>`;
  }
  if (!shareMaterialTableBody) return;
  if (!rows.length) {
    shareMaterialTableBody.innerHTML = `<tr><td colspan="${tab.columns.length}" class="empty-cell">暂无配置</td></tr>`;
    return;
  }
  const list = rows;
  shareMaterialTableBody.innerHTML = "";
  list.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = tab.columns.map((column) => {
      if (column === "order") {
        return `
          <td>
            <input class="share-material-order-input" type="number" min="1" step="1" value="${escapeHtml(row.sort || 1)}" />
          </td>
        `;
      }
      if (column === "sku") return `<td>${escapeHtml(getShareMaterialSkuLabel(row.sku))}</td>`;
      if (column === "name") {
        return `
          <td>
            <input class="share-material-name-input" value="${escapeHtml(row.name || "")}" placeholder="请输入名称" title="可直接编辑名称，回车确认" />
          </td>
        `;
      }
      if (column === "media") {
        return `
          <td>
            <button class="share-material-thumb" type="button">
              ${row.mediaType === "video"
                ? row.mediaUrl
                  ? `<video src="${escapeHtml(row.mediaUrl)}" muted preload="metadata" playsinline></video><span class="share-material-play-badge">视频</span>`
                  : `<span>无素材</span>`
                : row.mediaUrl ? `<img src="${escapeHtml(row.mediaUrl)}" alt="${escapeHtml(row.name || row.skuName || "素材")}" />` : "<span>无素材</span>"}
            </button>
          </td>
        `;
      }
      if (column === "mediaType") {
        return `
          <td>
            <span class="share-material-type-badge">${row.mediaType === "video" ? "视频" : "图片"}</span>
          </td>
        `;
      }
      return `
        <td>
          <div class="op-btns">
            <button class="link share-edit" type="button">编辑</button>
            <button class="link danger share-delete" type="button">删除</button>
          </div>
        </td>
      `;
    }).join("");
    const orderInput = tr.querySelector(".share-material-order-input");
    orderInput?.addEventListener("change", () => updateShareMaterialRowOrder(row.id, orderInput.value));
    orderInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        orderInput.blur();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        orderInput.value = row.sort || 1;
        orderInput.blur();
      }
    });
    const nameInput = tr.querySelector(".share-material-name-input");
    nameInput?.addEventListener("input", () => updateShareMaterialRowName(row.id, nameInput.value, { render: false }));
    nameInput?.addEventListener("change", () => updateShareMaterialRowName(row.id, nameInput.value));
    nameInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        nameInput.blur();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        nameInput.value = row.name || "";
        nameInput.blur();
      }
    });
    tr.querySelector(".share-material-thumb")?.addEventListener("click", () => openShareMaterialViewer(row));
    tr.querySelector(".share-edit")?.addEventListener("click", () => openShareMaterialModal("edit", row.id));
    tr.querySelector(".share-delete")?.addEventListener("click", () => deleteShareMaterial(row.id));
    shareMaterialTableBody.appendChild(tr);
  });
}

function renderShareMaterialOverview() {
  const tab = getShareMaterialTab();
  const rows = getShareMaterialRows(tab);
  const config = getShareMaterialConfig(tab);
  if (shareMaterialMetricTab) shareMaterialMetricTab.textContent = tab.title;
  if (shareMaterialMetricTotal) shareMaterialMetricTotal.textContent = String(rows.length);
  if (shareMaterialMetricScope) shareMaterialMetricScope.textContent = tab.skuScoped ? getShareMaterialSkuLabel(state.shareMaterialSkuFilter) : "全部 SKU";
  if (shareMaterialMetricUpdated) shareMaterialMetricUpdated.textContent = config.updateTime || config.createTime || "-";
  if (shareMaterialMetricSummary) {
    const dirty = config.dirty ? " / 有未保存修改" : "";
    shareMaterialMetricSummary.textContent = `${tab.description}${dirty}`;
  }
  if (saveShareMaterialsPageBtn) {
    saveShareMaterialsPageBtn.disabled = !config.dirty;
    saveShareMaterialsPageBtn.textContent = config.dirty ? "保存" : "已保存";
  }
}

function renderShareMaterials() {
  const tab = getShareMaterialTab();
  renderShareMaterialTabs();
  renderShareMaterialSelectOptions(shareMaterialSkuFilter);
  if (shareMaterialSkuFilter) shareMaterialSkuFilter.value = state.shareMaterialSkuFilter;
  shareMaterialSkuFilterWrap?.classList.toggle("hidden", !tab.skuScoped);
  renderShareMaterialTable();
  renderShareMaterialOverview();
  renderDataSourceTag();
  renderEnvSwitch();
  setupTableDragScroll();
}

async function refreshShareMaterials(options = {}) {
  const { showErrorAlert = true } = options;
  state.shareMaterialsLoading = true;
  setButtonLoading(refreshShareMaterialsBtn, true, "刷新中...");
  setShareMaterialStatus("");
  try {
    await queryShareMaterialItems();
    shareMaterialItems = shareMaterialItems.map((item) => ({ ...item, dirty: false }));
    renderShareMaterials();
    setShareMaterialStatus("");
    return { ok: true };
  } catch (error) {
    setShareMaterialStatus(`加载失败：${error.message}`, "error");
    if (showErrorAlert) window.alert(`作业分享素材加载失败：${error.message}`);
    return { ok: false, error };
  } finally {
    state.shareMaterialsLoading = false;
    setButtonLoading(refreshShareMaterialsBtn, false);
  }
}

async function refreshShareMaterialActiveConfig() {
  const tab = getShareMaterialTab();
  try {
    const item = await fetchShareMaterialConfig(tab);
    shareMaterialItems = shareMaterialItems.map((config) => (config.code === tab.code ? { ...item, dirty: false } : config));
    renderShareMaterials();
  } catch (error) {
    setShareMaterialStatus(`单项配置拉取失败：${error.message}`, "error");
  }
}

async function persistShareMaterialConfig(tab, config) {
  const payload = {
    id: config.id,
    code: tab.code,
    name: tab.title,
    content: config.content,
  };
  if (isApiMode()) {
    return normalizeShareMaterialConfig(await flexibleConfigApiRequest("/sae-gateway/kkhc-bizcenter-app/flexibleConfig/saveFlexibleConfig", {
      method: "POST",
      body: payload,
    }), tab.code);
  }
  const saved = {
    ...payload,
    updateTime: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
  localShareMaterialItems = localShareMaterialItems.map((item) => (item.code === tab.code ? normalizeShareMaterialConfig(saved, tab.code) : item));
  return normalizeShareMaterialConfig(saved, tab.code);
}

async function saveShareMaterialActiveConfig() {
  const tab = getShareMaterialTab();
  const config = getShareMaterialConfig(tab);
  setButtonLoading(saveShareMaterialsPageBtn, true, "保存中...");
  let shouldRender = false;
  try {
    const saved = await persistShareMaterialConfig(tab, config);
    shareMaterialItems = shareMaterialItems.map((item) => (item.code === tab.code ? { ...saved, dirty: false } : item));
    shouldRender = true;
    showToast("作业分享素材配置已保存", "success");
  } catch (error) {
    window.alert(`保存失败：${error.message}`);
  } finally {
    setButtonLoading(saveShareMaterialsPageBtn, false);
    if (shouldRender) renderShareMaterials();
  }
}

function openShareMaterialModal(mode = "create", rowId = null) {
  const tab = getShareMaterialTab();
  const rows = getShareMaterialRows(tab);
  const row = rows.find((item) => String(item.id) === String(rowId));
  state.shareMaterialModalMode = mode;
  state.shareMaterialEditingId = rowId;
  if (shareMaterialModalTitle) shareMaterialModalTitle.textContent = `${mode === "edit" ? "编辑" : "新增"}${tab.title}`;
  const isDefaultBackground = tab.key === "defaultBackground";
  shareMaterialOrderField?.classList.toggle("hidden", !tab.ordered);
  shareMaterialSkuField?.classList.toggle("hidden", isDefaultBackground);
  shareMaterialNameField?.classList.toggle("hidden", !isDefaultBackground);
  shareMaterialTypeField?.classList.toggle("hidden", !isDefaultBackground);
  renderShareMaterialSelectOptions(shareMaterialSkuInput);
  if (shareMaterialSkuInput) shareMaterialSkuInput.value = row?.sku || SHARE_MATERIAL_SKU_OPTIONS[0].value;
  if (shareMaterialOrderInput) shareMaterialOrderInput.value = row?.sort || (rows.length + 1);
  if (shareMaterialNameInput) shareMaterialNameInput.value = row?.name || "";
  if (shareMaterialUrlInput) shareMaterialUrlInput.value = row?.mediaUrl || "";
  if (shareMaterialTypeInput) shareMaterialTypeInput.value = row?.mediaType || tab.mediaTypes[0] || "image";
  if (shareMaterialUploadHint) {
    shareMaterialUploadHint.textContent = tab.mediaTypes.includes("video")
      ? "支持图片或视频素材，上传后自动回填 URL"
      : "支持图片素材，上传后自动回填 URL";
  }
  renderShareMaterialPreviewBox(row?.mediaUrl || "", row?.mediaType || tab.mediaTypes[0] || "image");
  shareMaterialModal?.classList.remove("hidden");
}

function closeShareMaterialDialog() {
  shareMaterialModal?.classList.add("hidden");
  state.shareMaterialEditingId = null;
}

function buildShareMaterialModalRow() {
  const tab = getShareMaterialTab();
  const rows = getShareMaterialRows(tab);
  const editing = rows.find((item) => String(item.id) === String(state.shareMaterialEditingId));
  const sku = tab.skuScoped ? state.shareMaterialSkuFilter : shareMaterialSkuInput?.value || "";
  const mediaType = tab.mediaTypes.length > 1 ? shareMaterialTypeInput?.value || "image" : tab.mediaTypes[0] || "image";
  const row = {
    id: editing?.id || `${tab.key}-${Date.now()}`,
    sku,
    skuName: getShareMaterialSkuLabel(sku),
    name: shareMaterialNameInput?.value.trim() || editing?.name || getShareMaterialSkuLabel(sku),
    mediaUrl: shareMaterialUrlInput?.value.trim() || "",
    mediaType,
    sort: tab.ordered ? Number(shareMaterialOrderInput?.value || rows.length + 1) : editing?.sort || rows.length + 1,
  };
  if (tab.key === "miniCover") {
    return {
      id: row.id,
      sku: row.sku,
      skuName: row.skuName,
      mediaUrl: row.mediaUrl,
    };
  }
  return row;
}

function confirmShareMaterialFromModal() {
  const tab = getShareMaterialTab();
  const nextRow = buildShareMaterialModalRow();
  const rows = getShareMaterialRows(tab);
  if (!nextRow.mediaUrl) {
    window.alert("请填写素材 URL");
    return;
  }
  if (tab.skuScoped && !nextRow.name) {
    window.alert("请填写素材名称");
    return;
  }
  const isEditing = state.shareMaterialModalMode === "edit";
  const sameSku = rows.find((row) => row.sku === nextRow.sku && String(row.id) !== String(nextRow.id));
  if (tab.uniqueSku && sameSku && !tab.overwriteSku) {
    window.alert("一个 SKU 只能配置一个生效内容");
    return;
  }
  let nextRows = rows.filter((row) => String(row.id) !== String(nextRow.id));
  if (tab.overwriteSku) nextRows = nextRows.filter((row) => row.sku !== nextRow.sku);
  if (isEditing || !tab.uniqueSku || !sameSku) nextRows.push(nextRow);
  if (tab.ordered) {
    nextRows = reorderShareMaterialRowsByInsertion(nextRows, nextRow.id, Number(nextRow.sort || nextRows.length));
  } else {
    nextRows.sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
  }
  updateShareMaterialConfigRows(tab, nextRows);
  closeShareMaterialDialog();
  renderShareMaterials();
  showToast("已加入列表，点击页面右上角保存后生效", "success");
}

async function deleteShareMaterial(rowId) {
  const tab = getShareMaterialTab();
  if (!window.confirm("确认删除该配置内容吗？")) return;
  const rows = getShareMaterialRows(tab).filter((row) => String(row.id) !== String(rowId));
  updateShareMaterialConfigRows(tab, rows);
  renderShareMaterials();
  showToast("已从列表移除，点击页面右上角保存后生效", "success");
}

function openShareMaterialViewer(row) {
  if (shareMaterialViewerTitle) shareMaterialViewerTitle.textContent = row.name || row.skuName || "素材预览";
  renderShareMaterialPreviewBox(row.mediaUrl, row.mediaType, shareMaterialViewerBody);
  shareMaterialViewerModal?.classList.remove("hidden");
}

function closeShareMaterialViewerDialog() {
  shareMaterialViewerModal?.classList.add("hidden");
}

async function getLandingOssStsToken() {
  return landingApiRequest(LANDING_OSS_CONFIG.stsPath);
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

async function hmacSha1Base64(secret, message) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return arrayBufferToBase64(signature);
}

function normalizeLandingStsToken(raw = {}) {
  return {
    accessKeyId: raw.accessKeyId || raw.AccessKeyId || raw.access_key_id || "",
    accessKeySecret: raw.accessKeySecret || raw.AccessKeySecret || raw.access_key_secret || "",
    securityToken: raw.tokenSecret || raw.securityToken || raw.SecurityToken || raw.token || raw.Token || "",
  };
}

async function uploadLandingFileToOss({ content, file, fileName, directory, pageKey, contentType = "application/octet-stream", maxSize = 10 * 1024 * 1024 }) {
  const token = normalizeLandingStsToken(await getLandingOssStsToken());
  if (!token.accessKeyId || !token.accessKeySecret || !token.securityToken) {
    throw new Error("OSS STS 凭证不完整");
  }
  const safeName = fileName || `${Date.now()}`;
  const objectKey = `${directory}${safeName}`;
  const expire = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const policy = btoa(JSON.stringify({
    expiration: expire,
    conditions: [
      ["content-length-range", 0, maxSize],
      ["starts-with", "$key", directory],
    ],
  }));
  const signature = await hmacSha1Base64(token.accessKeySecret, policy);
  const formData = new FormData();
  formData.append("key", objectKey);
  formData.append("OSSAccessKeyId", token.accessKeyId);
  formData.append("policy", policy);
  formData.append("Signature", signature);
  formData.append("x-oss-security-token", token.securityToken);
  formData.append("success_action_status", "200");
  formData.append("x-oss-object-acl", "public-read");
  formData.append("file", file || new Blob([content], { type: contentType }), safeName);

  const response = await fetch(LANDING_OSS_CONFIG.endpoint, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `OSS 上传失败：${response.status}`);
  }
  return {
    objectKey,
    fileName: safeName,
    url: `${LANDING_OSS_CONFIG.endpoint}/${objectKey}`,
  };
}

async function uploadLandingJsonToOss({ config, pageKey, fileName }) {
  return uploadLandingFileToOss({
    content: JSON.stringify(config, null, 2),
    fileName: getLandingConfigJsonName(fileName) || safeFileName(pageKey, "landing-page"),
    directory: LANDING_OSS_CONFIG.configDirectory,
    pageKey,
    contentType: "application/json",
    maxSize: 2 * 1024 * 1024,
  });
}

async function uploadLandingImageToOss(file, pageKey) {
  const originalName = file?.name || "";
  const dotIndex = originalName.lastIndexOf(".");
  const rawBase = dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName;
  const rawExt = dotIndex > 0 ? originalName.slice(dotIndex + 1) : "png";
  const safeBase = safeFileName(rawBase, "image");
  const ext = rawExt.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "png";
  const timestamp = Date.now();
  return uploadLandingFileToOss({
    file,
    fileName: `${safeBase}-${timestamp}.${ext}`,
    directory: LANDING_OSS_CONFIG.imageDirectory,
    pageKey,
    contentType: file.type || "image/png",
    maxSize: 20 * 1024 * 1024,
  });
}

async function uploadShareMaterialToOss(file, tab, mediaType = "image") {
  const originalName = file?.name || "";
  const dotIndex = originalName.lastIndexOf(".");
  const rawBase = dotIndex > 0 ? originalName.slice(0, dotIndex) : originalName;
  const rawExt = dotIndex > 0 ? originalName.slice(dotIndex + 1) : mediaType === "video" ? "mp4" : "png";
  const safeBase = safeFileName(rawBase, mediaType === "video" ? "video" : "image");
  const ext = rawExt.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || (mediaType === "video" ? "mp4" : "png");
  const timestamp = Date.now();
  const maxSize = mediaType === "video" ? 200 * 1024 * 1024 : 20 * 1024 * 1024;
  return uploadLandingFileToOss({
    file,
    fileName: `${safeBase}-${timestamp}.${ext}`,
    directory: `${LANDING_OSS_CONFIG.imageDirectory}homework-share/${safeFileName(tab?.key || "material", "material")}/`,
    pageKey: `homework-share-${tab?.key || "material"}`,
    contentType: file.type || (mediaType === "video" ? "video/mp4" : "image/png"),
    maxSize,
  });
}

async function queryLandingItems() {
  const params = new URLSearchParams({
    pageCurrent: String(state.pageCurrent),
    pageSize: String(state.pageSize),
  });
  if (state.landingFilters.name) params.set("nameLike", state.landingFilters.name);

  const data = await landingApiRequest(`/sae-gateway/kkhc-bizcenter-app/landingPage/landingPageQuery?${params.toString()}`);
  apiLandingItems = (data?.records || []).map(normalizeLandingRecord);
  state.landingApiTotal = Number(data?.total || apiLandingItems.length || 0);
  state.landingApiPages = Math.max(1, Number(data?.pages || Math.ceil(state.landingApiTotal / Math.max(1, state.pageSize))));
  state.pageCurrent = Math.max(1, Math.min(Number(data?.current || state.pageCurrent || 1), state.landingApiPages));
  syncLandingItemsWithSource();
}

async function fetchLandingDetail(id) {
  const data = await landingApiRequest(`/sae-gateway/kkhc-bizcenter-app/landingPage/getLandingPageDetail?id=${encodeURIComponent(id)}`);
  return hydrateLandingRecordConfig(normalizeLandingRecord(data));
}

function buildLandingH5Url({ id, pageKey, configJsonUrl, baseUrl = state.landingH5BaseUrl }) {
  const base = String(baseUrl || "").trim() || getStoredLandingH5Base();
  const configUrl = getLandingConfigJsonName(configJsonUrl);
  try {
    const url = new URL(base);
    if (configUrl) url.searchParams.set("configUrl", configUrl);
    else if (id) url.searchParams.set("landingPageId", id);
    else url.searchParams.set("pageKey", pageKey || makeLandingPageKey());
    return url.toString();
  } catch (_) {
    const sep = base.includes("?") ? "&" : "?";
    if (configUrl) return `${base}${sep}configUrl=${encodeURIComponent(configUrl)}`;
    return `${base}${sep}${id ? `landingPageId=${encodeURIComponent(id)}` : `pageKey=${encodeURIComponent(pageKey || makeLandingPageKey())}`}`;
  }
}

function getLandingConfigJsonName(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const ensureJsonSuffix = (name) => {
    const clean = String(name || "").trim().replace(/\.json$/i, "");
    return clean ? `${clean}.json` : "";
  };
  try {
    const url = new URL(raw);
    return ensureJsonSuffix(decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || ""));
  } catch (_) {
    return ensureJsonSuffix(raw.split("?")[0].split("#")[0].split("/").filter(Boolean).pop() || raw);
  }
}

function getLandingConfigIdentity(record = {}) {
  const stripJsonSuffix = (value) => String(value || "").trim().replace(/\.json$/i, "");
  const configCandidates = [
    record.config?.publish?.configJsonOssUrl,
    record.config?.dataSource?.configJsonOssUrl,
    record.config?.renderer?.configJsonUrl,
    record.config?.publish?.configJsonUrl,
    record.config?.dataSource?.configJsonUrl,
  ];
  const content = String(record.content || "").trim();
  if (/^https?:\/\//i.test(content)) {
    configCandidates.unshift(content);
  } else if (content.startsWith("{")) {
    try {
      const parsed = JSON.parse(content);
      configCandidates.push(
        parsed?.publish?.configJsonOssUrl,
        parsed?.dataSource?.configJsonOssUrl,
        parsed?.renderer?.configJsonUrl,
        parsed?.publish?.configJsonUrl,
        parsed?.dataSource?.configJsonUrl
      );
    } catch (_) {
      // 非标准 JSON 内容不作为唯一 ID 来源。
    }
  }

  for (const candidate of configCandidates) {
    const configName = getLandingConfigJsonName(candidate);
    if (configName) return stripJsonSuffix(configName);
  }

  const h5Url = String(record.h5Url || record.config?.h5Url || record.config?.publish?.h5Url || "").trim();
  if (!h5Url) return "";
  try {
    const url = new URL(h5Url);
    return stripJsonSuffix(url.searchParams.get("configUrl"));
  } catch (_) {
    const match = h5Url.match(/[?&]configUrl=([^&#]+)/);
    return stripJsonSuffix(match ? decodeURIComponent(match[1]) : "");
  }
}

function buildLandingRendererHtml() {
  const configBaseUrl = LANDING_OSS_CONFIG.configBaseUrl;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>领取落地页</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    #app { width: 100%; max-width: 430px; margin: 0 auto; min-height: 100vh; background: #fff; position: relative; }
    .image { position: relative; width: 100%; }
    .image > img { width: 100%; height: auto; display: block; }
    .hotspot { position: absolute; border: 0; background: transparent; padding: 0; cursor: pointer; }
    .button { position: absolute; z-index: 2; display: block; border: 0; border-radius: 12px; padding: 0; margin: 0; color: #fff; font-weight: 700; line-height: 1; cursor: pointer; overflow: hidden; appearance: none; -webkit-appearance: none; }
    .button.has-image { background: transparent !important; }
    .button img { position: absolute; inset: 0; width: 100% !important; height: 100% !important; max-width: none; max-height: none; object-fit: fill; display: block; border-radius: inherit; pointer-events: none; }
    .button span { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
    .flow-slot { position: relative; width: 100%; pointer-events: none; }
    .flow-slot .button { pointer-events: auto; }
    .safe-area-spacer { width: 100%; height: ${LANDING_BOTTOM_SAFE_AREA}px; pointer-events: none; }
    .fixed-layer { position: fixed; left: 50%; top: 0; bottom: 0; width: 100%; max-width: 430px; height: auto; transform: translateX(-50%); pointer-events: none; z-index: 10; }
    .fixed-layer .button { pointer-events: auto; }
    .loading-mask { display: none; position: fixed; left: 0; top: 0; right: 0; bottom: 0; z-index: 9999; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.18); }
    .loading-box { min-width: 108px; padding: 12px 18px; border-radius: 14px; background: rgba(15, 23, 42, 0.86); color: #fff; font-size: 15px; text-align: center; }
    .error { padding: 24px; color: #991b1b; line-height: 1.7; }
  </style>
</head>
<body>
  <main id="app"></main>
  <div class="fixed-layer" id="fixedLayer"></div>
  <div class="loading-mask" id="landingLoading"><div class="loading-box">加载中...</div></div>
  <script>
    function getQueryParam(name) {
      var query = window.location.search.replace(/^\\?/, "").split("&");
      for (var i = 0; i < query.length; i += 1) {
        var pair = query[i].split("=");
        if (decodeURIComponent(pair[0] || "") === name) return decodeURIComponent(pair.slice(1).join("=") || "");
      }
      return "";
    }
    var configUrl = getQueryParam("configUrl");
    var landingPageId = getQueryParam("landingPageId");
    var configBaseUrl = "${configBaseUrl}";
    var fallbackApi = landingPageId
      ? "/sae-gateway/kkhc-bizcenter-app/landingPage/getLandingPageDetail?id=" + encodeURIComponent(landingPageId)
      : "";
    var loadingTimer = null;
    function setLoading(show) {
      var el = document.querySelector("#landingLoading");
      if (!el) return;
      el.style.display = show ? "flex" : "none";
      if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
      }
      if (show) {
        loadingTimer = setTimeout(function () {
          setLoading(false);
        }, 8000);
      }
    }
    function clearLoadingSoon(delay) {
      setTimeout(function () {
        setLoading(false);
      }, delay || 0);
    }
    window.addEventListener("pageshow", function () {
      clearLoadingSoon(0);
    });
    window.addEventListener("pagehide", function () {
      setLoading(false);
    });
    window.addEventListener("focus", function () {
      clearLoadingSoon(0);
    });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) clearLoadingSoon(0);
    });
    function px(value, scale) {
      var realScale = scale || 1;
      return Math.round(Number(value || 0) * realScale) + "px";
    }
    function ratioPx(value, sourceSize, targetSize) {
      var base = Number(sourceSize || 0);
      var target = Number(targetSize || 0);
      if (!base || !target) return Math.round(Number(value || 0)) + "px";
      return Math.round((Number(value || 0) / base) * target) + "px";
    }
    function percent(value) {
      return (Number(value || 0) * 100).toFixed(4) + "%";
    }
    function getRatio(item, ratioKey, valueKey, baseSize) {
      if (item && item[ratioKey] !== undefined && item[ratioKey] !== null && item[ratioKey] !== "") {
        return Number(item[ratioKey]) || 0;
      }
      var base = Number(baseSize || 0);
      if (!base) return 0;
      return Number(item && item[valueKey] || 0) / base;
    }
    function getScaledPx(item, valueKey, ratioKey, baseSize, targetSize, fallback) {
      var raw = item && item[valueKey] !== undefined && item[valueKey] !== null && item[valueKey] !== "" ? Number(item[valueKey]) : NaN;
      var base = Number(baseSize || 0);
      var target = Number(targetSize || 0);
      if (raw > 0 && base > 0 && target > 0) return Math.round(raw * target / base);
      var ratio = getRatio(item, ratioKey, valueKey, base);
      if (ratio > 0 && target > 0) return Math.round(ratio * target);
      return Math.round(Number(fallback || 0));
    }
    function syncFixedLayer(app, fixedLayer) {
      if (!app || !fixedLayer) return;
      var rect = app.getBoundingClientRect();
      fixedLayer.style.left = Math.round(rect.left) + "px";
      fixedLayer.style.width = Math.round(rect.width || app.clientWidth || 375) + "px";
      fixedLayer.style.maxWidth = "none";
      fixedLayer.style.transform = "none";
      fixedLayer.style.top = "0px";
      fixedLayer.style.bottom = "0px";
      fixedLayer.style.height = "auto";
    }
    function isAndroidWebView() {
      return /Android/i.test(navigator.userAgent || "");
    }
    function getLandingBottomInset(config) {
      var safeArea = config && config.canvas && config.canvas.enableBottomSafeArea === false ? 0 : ${LANDING_BOTTOM_SAFE_AREA};
      return safeArea + (isAndroidWebView() && safeArea > 0 ? 36 : 0);
    }
    function getVisibleViewportHeight() {
      if (window.visualViewport && window.visualViewport.height) {
        return window.visualViewport.height + (window.visualViewport.offsetTop || 0);
      }
      return window.innerHeight || document.documentElement.clientHeight || 0;
    }
    function getButtonMetrics(item, layerWidth, layerHeight, config) {
      var canvasWidth = getCanvasWidth(config);
      var canvasHeight = getCanvasHeight(config);
      var fallbackLeft = Math.round(32 * layerWidth / canvasWidth);
      var fallbackWidth = Math.round(311 * layerWidth / canvasWidth);
      var fallbackHeight = Math.round(48 * layerWidth / canvasWidth);
      var leftPx = getScaledPx(item, "x", "xRatio", canvasWidth, layerWidth, fallbackLeft);
      var widthPx = getScaledPx(item, "width", "widthRatio", canvasWidth, layerWidth, fallbackWidth);
      var heightPx = getScaledPx(item, "height", "heightRatio", canvasWidth, layerWidth, fallbackHeight);
      var mode = item && item.positionMode || "bottom";
      if (item && item.imageUrl && (mode === "top" || mode === "bottom") && heightPx < 48) heightPx = 48;
      if (widthPx > layerWidth) widthPx = layerWidth;
      if (leftPx + widthPx > layerWidth) leftPx = Math.max(0, layerWidth - widthPx);
      return {
        left: leftPx,
        width: widthPx,
        height: heightPx,
        layerHeight: layerHeight,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight
      };
    }
    function getCanvasWidth(config) {
      return Number(config && config.canvas && config.canvas.width) || 375;
    }
    function getCanvasHeight(config) {
      return Number(config && config.canvas && config.canvas.height) || 812;
    }
    function resolveConfigUrl(value) {
      var raw = String(value || "").trim();
      if (!raw) return "";
      if (/^https?:\\/\\//i.test(raw)) return raw;
      if (!/\\.json(?:[?#].*)?$/i.test(raw)) raw += ".json";
      return configBaseUrl + raw.replace(/^\\/+/, "");
    }
    function getImageHeight(item) {
      var height = Number(item.height || 0);
      if (height > 0) return height;
      var naturalWidth = Number(item.naturalWidth || 375);
      var naturalHeight = Number(item.naturalHeight || 560);
      return naturalWidth > 0 && naturalHeight > 0 ? Math.round((375 * naturalHeight) / naturalWidth) : 560;
    }
    var skuNameToId = {
      "国画": "1", "书法": "3", "钢琴": "4", "声乐": "5", "联营": "6", "舞蹈瑜伽俱乐部": "7",
      "萨克斯": "8", "养生": "11", "太极": "12", "舞蹈": "13", "朗诵": "14", "直营": "16",
      "商城": "17", "声乐-月课": "18", "非洲鼓": "19", "口琴": "20", "华彩乐园": "21",
      "冥想瑜伽": "22", "戏曲越剧": "23", "摄影": "24", "美妆": "25", "营养": "26",
      "AI技能课": "27", "自媒体课": "28", "社团": "30"
    };
    function normalizeSkuId(value) {
      var raw = String(value || "").trim();
      return skuNameToId[raw] || raw || "5";
    }
    function loadJson(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            callback(null, JSON.parse(xhr.responseText));
          } catch (error) {
            callback(error);
          }
          return;
        }
        callback(new Error("请求失败：" + xhr.status));
      };
      xhr.onerror = function () { callback(new Error("网络请求失败")); };
      xhr.send();
    }
    function postBridgeMessage(payload) {
      if (window.jsToFlutter && typeof window.jsToFlutter.postMessage === "function") {
        window.jsToFlutter.postMessage(JSON.stringify(payload));
        return true;
      }
      return false;
    }
    var landingCurrentConfig = null;
    var landingViewTracked = false;
    var landingNativeParams = {};
    var landingNativeParamsReady = false;
    var landingNativeParamsRequested = false;
    var landingTrackQueue = [];
    var landingTrackTimer = null;
    var landingTrackEndpoint = "https://splendid-web-tracking.cn-beijing.log.aliyuncs.com/logstores/real-works-comment-tracking/track";
    var landingTestTrackEndpoint = "https://test-splendid-web-tracking.cn-beijing.log.aliyuncs.com/logstores/test-real-works-comment-tracking/track";
    function makeLandingTrackUuid() {
      if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
      return "h5_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
    }
    function normalizeLandingNativeParams(raw) {
      var value = raw;
      if (typeof raw === "string") {
        try {
          value = JSON.parse(raw);
        } catch (_) {
          value = {};
        }
      }
      if (!value || typeof value !== "object") return {};
      return value.data && typeof value.data === "object" ? value.data : value;
    }
    window.commonParamsCallback = function (raw) {
      landingNativeParams = normalizeLandingNativeParams(raw);
      landingNativeParamsReady = true;
      flushLandingTrackQueue();
    };
    function requestLandingNativeParams() {
      if (landingNativeParamsRequested) return;
      landingNativeParamsRequested = true;
      if (!postBridgeMessage({ action: "commonParams" })) {
        landingNativeParamsReady = true;
        flushLandingTrackQueue();
        return;
      }
      landingTrackTimer = setTimeout(function () {
        if (landingNativeParamsReady) return;
        landingNativeParamsReady = true;
        flushLandingTrackQueue();
      }, 3500);
    }
    function getLandingTrackingPageId(config) {
      function stripJsonSuffix(value) {
        var raw = String(value || "").trim();
        if (!raw) return "";
        try {
          var url = new URL(raw);
          raw = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || "");
        } catch (_) {
          raw = raw.split("?")[0].split("#")[0].split("/").filter(Boolean).pop() || raw;
        }
        return raw.replace(/\\.json$/i, "");
      }
      function getConfigIdFromUrl(value) {
        var raw = String(value || "").trim();
        if (!raw) return "";
        try {
          var url = new URL(raw);
          var queryConfigUrl = url.searchParams.get("configUrl");
          if (queryConfigUrl) return stripJsonSuffix(queryConfigUrl);
        } catch (_) {
          var match = raw.match(/[?&]configUrl=([^&#]+)/);
          if (match) return stripJsonSuffix(decodeURIComponent(match[1]));
        }
        return stripJsonSuffix(raw);
      }
      var candidates = [
        config && config.renderer && config.renderer.configJsonUrl,
        config && config.publish && config.publish.jsonFileName,
        config && config.publish && config.publish.configJsonUrl,
        config && config.publish && config.publish.configJsonOssUrl,
        config && config.dataSource && config.dataSource.configJsonUrl,
        config && config.dataSource && config.dataSource.configJsonOssUrl,
        configUrl,
        config && config.h5Url,
        config && config.publish && config.publish.h5Url
      ];
      for (var i = 0; i < candidates.length; i += 1) {
        var configId = getConfigIdFromUrl(candidates[i]);
        if (configId) return configId;
      }
      return String(config && (config.pageKey || config.landingPageId || config.id || config.pageId) || landingPageId || "");
    }
    function getLandingControlId(item, typedKey) {
      if (!item) return "";
      return String(item[typedKey] || item.id || item.componentId || item.controlId || "");
    }
    function buildLandingClickChannelId(item) {
      var inAppChannelId = String(landingNativeParams.channelId || "");
      var inAppCategory = String(landingNativeParams.category || "");
      var h5ChannelId = String(item && item.channelId || "");
      var h5Category = normalizeSkuId(item && item.sku);
      h5Category = h5Category && Number(h5Category) > 0 ? String(h5Category) : "";
      var cachedInAppCategory = !inAppCategory && /null$/.test(inAppChannelId) ? "null" : inAppCategory;
      if (!h5Category) return inAppChannelId || h5ChannelId;
      if (!inAppChannelId) return h5ChannelId || h5Category;
      if (cachedInAppCategory && inAppChannelId.indexOf(cachedInAppCategory) >= 0) {
        return inAppChannelId.replace(cachedInAppCategory, h5Category);
      }
      return h5Category;
    }
    function landingPreferTestTrackFromUrl() {
      var v = getQueryParam("slsEnv");
      if (v === "test" || v === "0") return true;
      if (getQueryParam("slsTest") === "1") return true;
      v = getQueryParam("isRelease");
      if (v === "false" || v === "0") return true;
      return false;
    }
    function buildLandingTrackPayload(config, eventName, item) {
      var isHotspot = eventName === "hotspotClick";
      var isButton = eventName === "buttonClick";
      var pageId = getLandingTrackingPageId(config);
      var payload = {
        uuid: landingNativeParams.uuid || makeLandingTrackUuid(),
        action: isHotspot ? "Landing_Page_Hotspot_Click" : isButton ? "Landing_Page_Button_Click" : "Landing_Page_View",
        unionId: landingNativeParams.unionId || landingNativeParams.unionid || "",
        position: isHotspot ? "Landing_Page_Hotspot" : isButton ? "Landing_Page_Button" : "Landing_Page",
        version: landingNativeParams.version || "",
        buildId: landingNativeParams.buildId || "",
        landingPageId: pageId,
        platformVersion: landingNativeParams.platformVersion || "",
        interaction: isHotspot || isButton ? "click" : "impression"
      };
      if (landingNativeParams.platform) payload.platform = landingNativeParams.platform;
      if (landingNativeParams.brand) payload.brand = landingNativeParams.brand;
      if (!isHotspot && !isButton) {
        if (landingNativeParams.channelId) payload.channelId = String(landingNativeParams.channelId);
        if (landingNativeParams.category) payload.category = String(landingNativeParams.category);
      }
      if (isHotspot || isButton) payload.channelId = buildLandingClickChannelId(item);
      if (isHotspot) payload.hotspotId = getLandingControlId(item, "hotspotId");
      if (isButton) payload.buttonId = getLandingControlId(item, "buttonId");
      return payload;
    }
    function getLandingTrackEndpoint() {
      if (landingPreferTestTrackFromUrl()) return landingTestTrackEndpoint;
      return landingNativeParams.isRelease === false || landingNativeParams.isRelease === "false"
        ? landingTestTrackEndpoint
        : landingTrackEndpoint;
    }
    function sendLandingTrack(payload) {
      var query = [];
      for (var key in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, key) && payload[key] !== undefined && payload[key] !== null) {
          query.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(payload[key])));
        }
      }
      if (!query.length) return;
      var url = getLandingTrackEndpoint() + "?APIVersion=0.6.0&" + query.join("&");
      try {
        if (typeof fetch === "function") {
          fetch(url, { method: "GET", mode: "no-cors", cache: "no-store", keepalive: true });
          return;
        }
      } catch (_) {}
      var img = new Image();
      img.src = url;
    }
    function flushLandingTrackQueue() {
      if (!landingNativeParamsReady) return;
      if (landingTrackTimer) {
        clearTimeout(landingTrackTimer);
        landingTrackTimer = null;
      }
      var queue = landingTrackQueue.splice(0, landingTrackQueue.length);
      for (var i = 0; i < queue.length; i += 1) {
        sendLandingTrack(buildLandingTrackPayload(queue[i].config, queue[i].eventName, queue[i].item));
      }
    }
    function trackLandingEvent(config, eventName, item) {
      landingTrackQueue.push({ config: config || landingCurrentConfig || {}, eventName: eventName, item: item || null });
      requestLandingNativeParams();
      flushLandingTrackQueue();
    }
    function trackLandingPageView(config) {
      if (landingViewTracked) return;
      var viewWaitStart = Date.now();
      function trySendViewImpression() {
        if (landingViewTracked) return;
        if (landingNativeParamsReady || Date.now() - viewWaitStart >= 4000) {
          landingViewTracked = true;
          sendLandingTrack(buildLandingTrackPayload(config, "view", null));
          return;
        }
        setTimeout(trySendViewImpression, 30);
      }
      trySendViewImpression();
    }
    function trackLandingComponentClick(item) {
      if (!item) return;
      if (item.type === "button") {
        trackLandingEvent(landingCurrentConfig, "buttonClick", item);
        return;
      }
      trackLandingEvent(landingCurrentConfig, "hotspotClick", item);
    }
    function setNavigationTitle(config) {
      var title = "";
      if (config && config.hero && config.hero.title) title = String(config.hero.title);
      if (!title && config && config.title) title = String(config.title);
      if (!title) return;
      document.title = title;
      postBridgeMessage({
        action: "setNavigationTitle",
        title: title
      });
    }
    function normalizeJumpUrl(url) {
      var raw = String(url || "").trim();
      if (!raw) return "";
      if (/^\\/\\//.test(raw)) return window.location.protocol + raw;
      if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return raw;
      if (/^www\\./i.test(raw)) return "https://" + raw;
      return raw;
    }
    function navigateToUrl(url, item) {
      var targetUrl = normalizeJumpUrl(url);
      if (!targetUrl) {
        setLoading(false);
        return;
      }
      if (/^\\//.test(targetUrl)) {
        postBridgeMessage({
          action: "nativeRoutePush",
          path: targetUrl,
          extra: {
            componentId: getLandingControlId(item, item && item.type === "button" ? "buttonId" : "hotspotId"),
            componentType: item && item.type ? item.type : ""
          }
        });
        clearLoadingSoon(1200);
        return;
      }
      if (postBridgeMessage({
        action: "openUrlInCurrentWebView",
        url: targetUrl,
        title: document.title || "",
        from: "landingPage",
        componentId: getLandingControlId(item, item && item.type === "button" ? "buttonId" : "hotspotId"),
        componentType: item && item.type ? item.type : ""
      })) {
        clearLoadingSoon(1200);
        return;
      }
      var link = document.createElement("a");
      link.href = targetUrl;
      link.target = "_self";
      link.rel = "noopener";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(function () {
        if (window.location.href !== targetUrl) window.location.assign(targetUrl);
      }, 80);
    }
    function bindTap(element, item) {
      var touchHandled = false;
      element.addEventListener("touchend", function (event) {
        touchHandled = true;
        event.preventDefault();
        clickAction(item);
        setTimeout(function () {
          touchHandled = false;
        }, 450);
      }, false);
      element.onclick = function () {
        if (touchHandled) return;
        clickAction(item);
      };
    }
    function clickAction(item) {
      trackLandingComponentClick(item);
      var url = item.link || "";
      setLoading(true);
      if ((item.event || "") === "claim") {
        var claimChannelId = buildLandingClickChannelId(item);
        var claimPayload = {
          action: "wxWorkOpenHelperWithLeads",
          category: normalizeSkuId(item.sku)
        };
        if (claimChannelId) claimPayload.channelId = claimChannelId;
        var claimComponentId = getLandingControlId(item, item && item.type === "button" ? "buttonId" : "hotspotId");
        if (claimComponentId) claimPayload.componentId = claimComponentId;
        if (item.type) claimPayload.componentType = item.type;
        if (!postBridgeMessage(claimPayload)) setLoading(false);
        return;
      }
      if ((item.event || "") === "custom") {
        try {
          var bridgeAction = item.bridgeAction || item.jsMethod || "showShareDialog";
          var bridgeParams = {};
          if (item.bridgeParams) {
            bridgeParams = typeof item.bridgeParams === "string" ? JSON.parse(item.bridgeParams) : item.bridgeParams;
          }
          var payload = {};
          for (var key in bridgeParams) {
            if (Object.prototype.hasOwnProperty.call(bridgeParams, key)) payload[key] = bridgeParams[key];
          }
          payload.action = bridgeAction;
          if (item.sku && !payload.sku) payload.sku = normalizeSkuId(item.sku);
          if (item.link && !payload.link) payload.link = item.link;
          var customComponentId = getLandingControlId(item, item && item.type === "button" ? "buttonId" : "hotspotId");
          if (customComponentId && !payload.componentId) payload.componentId = customComponentId;
          if (item.type && !payload.componentType) payload.componentType = item.type;
          if (!postBridgeMessage(payload)) setLoading(false);
        } catch (error) {
          console.error("桥接事件执行失败", error);
          setLoading(false);
        }
        return;
      }
      if ((item.event || "") === "jump" && url) {
        navigateToUrl(url, item);
        return;
      }
      if (!(item.event || "") && url) {
        navigateToUrl(url, item);
        return;
      }
      setLoading(false);
    }
    function makeButton(item, scale, fixed, config) {
      var btn = document.createElement("button");
      var layerWidth = fixed ? (document.querySelector("#fixedLayer").clientWidth || 375) : (document.querySelector("#app").clientWidth || 375);
      var layerHeight = window.innerHeight || getCanvasHeight(config || {});
      btn.className = "button";
      if (item.id) btn.setAttribute("data-button-id", item.id);
      var metrics = getButtonMetrics(item, layerWidth, layerHeight, config);
      btn.style.left = metrics.left + "px";
      btn.style.width = metrics.width + "px";
      btn.style.height = metrics.height + "px";
      if (fixed && item.positionMode === "bottom") {
        var safeArea = getLandingBottomInset(config);
        btn.style.top = "auto";
        btn.style.bottom = safeArea + "px";
        btn.setAttribute("data-fixed-bottom", "1");
        btn.setAttribute("data-safe-bottom", safeArea);
      } else if (fixed && item.positionMode === "top") {
        btn.style.bottom = "auto";
        btn.style.top = "0px";
      } else {
        btn.style.bottom = "auto";
        var yBase = fixed ? metrics.canvasHeight : metrics.canvasWidth;
        var yTarget = fixed ? layerHeight : layerWidth;
        var topPx = getScaledPx(item, "y", "yRatio", yBase, yTarget, 0);
        btn.style.top = topPx + "px";
      }
      btn.style.background = item.color || "#1677ff";
      if (item.imageUrl) btn.classList.add("has-image");
      btn.innerHTML = item.imageUrl ? '<img src="' + item.imageUrl + '" alt="">' : '<span>' + (item.text || "按钮") + '</span>';
      bindTap(btn, item);
      return btn;
    }
    function syncBottomButtons() {
      var buttons = document.querySelectorAll('[data-fixed-bottom="1"]');
      if (!buttons.length) return;
      var viewportHeight = getVisibleViewportHeight();
      for (var i = 0; i < buttons.length; i += 1) {
        var button = buttons[i];
        var safeBottom = Number(button.getAttribute("data-safe-bottom") || 0);
        var height = button.offsetHeight || Number((button.style.height || "").replace("px", "")) || 48;
        if (isAndroidWebView() && viewportHeight) {
          button.style.top = Math.max(0, Math.round(viewportHeight - height - safeBottom)) + "px";
          button.style.bottom = "auto";
        } else {
          button.style.top = "auto";
          button.style.bottom = safeBottom + "px";
        }
      }
    }
    function makeFlowButton(item, scale, config) {
      var slot = document.createElement("div");
      slot.className = "flow-slot";
      var layerWidth = document.querySelector("#app").clientWidth || 375;
      var slotHeight = getButtonMetrics(item, layerWidth, window.innerHeight || getCanvasHeight(config || {}), config || {}).height;
      slot.style.height = slotHeight + "px";
      var flowItem = {};
      for (var key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) flowItem[key] = item[key];
      }
      flowItem.y = 0;
      var btn = makeButton(flowItem, scale, false, config || {});
      btn.style.top = "0px";
      slot.appendChild(btn);
      return slot;
    }
    function render(config) {
      var app = document.querySelector("#app");
      var fixedLayer = document.querySelector("#fixedLayer");
      app.innerHTML = "";
      fixedLayer.innerHTML = "";
      syncFixedLayer(app, fixedLayer);
      var scale = app.clientWidth / 375;
      var canvasWidth = getCanvasWidth(config);
      var components = config.components || [];
      var topSpacer = 0;
      var bottomSpacer = 0;
      var safeArea = getLandingBottomInset(config);
      for (var s = 0; s < components.length; s += 1) {
        var spacerItem = components[s];
        if (!spacerItem || spacerItem.type !== "button") continue;
        var spacerMode = spacerItem.positionMode || "bottom";
        var spacerOverImage = spacerItem.floatAboveImage === true && (spacerMode === "top" || spacerMode === "bottom");
        if (spacerOverImage) continue;
        var spacerHeight = getButtonMetrics(spacerItem, app.clientWidth, window.innerHeight || getCanvasHeight(config || {}), config || {}).height;
        if (spacerMode === "top") topSpacer = Math.max(topSpacer, spacerHeight);
        if (spacerMode === "bottom") bottomSpacer = Math.max(bottomSpacer, spacerHeight + safeArea);
      }
      if (topSpacer) {
        var topNode = document.createElement("div");
        topNode.className = "safe-area-spacer";
        topNode.style.height = topSpacer + "px";
        app.appendChild(topNode);
      }
      for (var i = 0; i < components.length; i += 1) {
        var item = components[i];
        if (item.type === "image") {
          var wrap = document.createElement("section");
          wrap.className = "image";
          wrap.innerHTML = '<img src="' + (item.imageUrl || "") + '" alt="">';
          var hotzones = item.hotzones || [];
          for (var j = 0; j < hotzones.length; j += 1) {
            var hotzone = hotzones[j];
            if (!hotzone.type) hotzone.type = "hotspot";
            var hit = document.createElement("button");
            hit.className = "hotspot";
            if (hotzone.id) hit.setAttribute("data-hotspot-id", hotzone.id);
            var imageBaseHeight = getImageHeight(item);
            hit.style.left = percent(getRatio(hotzone, "xRatio", "x", canvasWidth));
            hit.style.top = percent(getRatio(hotzone, "yRatio", "y", imageBaseHeight));
            hit.style.width = percent(getRatio(hotzone, "widthRatio", "width", canvasWidth));
            hit.style.height = percent(getRatio(hotzone, "heightRatio", "height", imageBaseHeight));
            bindTap(hit, hotzone);
            wrap.appendChild(hit);
          }
          app.appendChild(wrap);
        } else if (item.type === "button") {
          if ((item.positionMode || "bottom") === "flow") {
            app.appendChild(makeFlowButton(item, scale, config));
            continue;
          }
          var mode = item.positionMode || "bottom";
          var fixed = mode === "top" || mode === "bottom" || mode === "fixed";
          (fixed ? fixedLayer : app).appendChild(makeButton(item, scale, fixed, config));
        }
      }
      if (bottomSpacer || !config.canvas || config.canvas.enableBottomSafeArea !== false) {
        var spacer = document.createElement("div");
        spacer.className = "safe-area-spacer";
        spacer.style.height = (bottomSpacer || safeArea) + "px";
        app.appendChild(spacer);
      }
      syncBottomButtons();
      if (!window.__landingViewportBound) {
        window.__landingViewportBound = true;
        if (window.visualViewport) {
          window.visualViewport.addEventListener("resize", syncBottomButtons);
          window.visualViewport.addEventListener("scroll", syncBottomButtons);
        }
        window.addEventListener("resize", syncBottomButtons);
      }
    }
    function showError(error) {
      document.querySelector("#app").innerHTML = '<div class="error">落地页配置加载失败：' + error.message + '</div>';
    }
    function renderLoadedConfig(config) {
      landingCurrentConfig = config || {};
      setNavigationTitle(config);
      render(config);
      trackLandingPageView(config);
    }
    function main() {
      requestLandingNativeParams();
      if (configUrl) {
        loadJson(resolveConfigUrl(configUrl), function (error, config) {
          if (error) return showError(error);
          renderLoadedConfig(config);
        });
        return;
      }
      if (fallbackApi) {
        loadJson(fallbackApi, function (error, data) {
          if (error) return showError(error);
          var content = data && data.data ? data.data.content : null;
          if (typeof content === "string" && /^https?:\\/\\//i.test(content)) {
            loadJson(content, function (configError, remoteConfig) {
              if (configError) return showError(configError);
              renderLoadedConfig(remoteConfig);
            });
            return;
          }
          var config = typeof content === "string" ? JSON.parse(content) : content;
          renderLoadedConfig(config);
        });
        return;
      }
      try {
        throw new Error("缺少 configUrl 参数");
      } catch (error) {
        showError(error);
      }
    }
    main();
  </script>
</body>
</html>
`;
}

function getLandingFormConfigFromInputs(overrides = {}) {
  const existing = state.landingForm?.config || createDefaultLandingConfig();
  const components = getLandingComponents(existing);
  const canvas = {
    width: 375,
    height: 812,
    enableBottomSafeArea: landingButtonSafeAreaInput?.checked !== false,
  };
  const ratioComponents = components.map((component) => withLandingComponentRatios(component, canvas));
  const imageComponent = components.find((component) => component.type === "image");
  const buttonComponent = components.find((component) => component.type === "button");
  const imageUrls = components
    .filter((component) => component.type === "image" && component.imageUrl)
    .map((component) => ({ type: "image", url: component.imageUrl, componentId: component.id }));
  const buttonImageUrls = components
    .filter((component) => component.type === "button" && component.imageUrl)
    .map((component) => ({ type: "buttonImage", url: component.imageUrl, componentId: component.id }));
  const manualMaterials = String(landingMaterialUrlsInput?.value || "")
    .split(/\n+/)
    .map((url) => url.trim())
    .filter(Boolean)
    .map((url) => ({ type: "image", url }));
  const materials = [...imageUrls, ...buttonImageUrls, ...manualMaterials]
    .filter((item, index, list) => list.findIndex((entry) => entry.url === item.url) === index);
  const content = landingContentInput?.value.trim() || "";
  const namePageKey = makeLandingPageKey(landingNameInput?.value.trim() || existing.hero?.title || "");
  const pageKey = normalizeLandingPageKey(overrides.pageKey || namePageKey || landingPageKeyInput?.value || existing.pageKey, landingNameInput?.value.trim() || existing.hero?.title || "");
  const rawConfigJsonUrl = overrides.configJsonUrl ?? landingConfigJsonUrlInput?.value.trim() ?? "";
  const configJsonUrl = getLandingConfigJsonName(rawConfigJsonUrl || pageKey);
  const landingPageId = overrides.landingPageId ?? existing.landingPageId ?? null;
  const h5Url = overrides.h5Url ?? existing.h5Url ?? "";
  const landingTitle = landingNameInput?.value.trim() || landingHeroTitleInput?.value.trim() || "";
  return {
    ...existing,
    schemaVersion: 1,
    title: landingTitle,
    pageKey,
    landingPageId,
    h5Url,
    renderer: {
      mode: "dynamic-json",
      configJsonUrl,
      fallback: landingPageId ? "landingPageDetail" : "pageKey",
    },
    dataSource: {
      type: configJsonUrl ? "oss-json" : "landing-page-api",
      configJsonUrl,
      landingPageId,
    },
    canvas,
    hero: {
      title: landingTitle,
      subtitle: landingHeroSubtitleInput?.value.trim() || "",
      bannerImageUrl: imageComponent?.imageUrl || landingBannerUrlInput?.value.trim() || "",
    },
    cta: {
      text: buttonComponent?.text || landingButtonTextInput?.value.trim() || "按钮",
      event: buttonComponent?.event || landingButtonEventInput?.value || "claim",
      sku: normalizeLandingSkuId(buttonComponent?.sku || landingButtonSkuInput?.value),
      link: buttonComponent?.link || landingButtonLinkInput?.value.trim() || "",
      bridgeAction: buttonComponent?.bridgeAction || landingButtonBridgeActionInput?.value || "showShareDialog",
      bridgeParams: buttonComponent?.bridgeParams || landingButtonBridgeParamsInput?.value.trim() || "",
      imageUrl: buttonComponent?.imageUrl || landingButtonImageUrlInput?.value.trim() || "",
    },
    theme: {
      primaryColor: buttonComponent?.color || landingThemeColorInput?.value || "#1677ff",
    },
    sections: [
      {
        type: "richText",
        content,
      },
    ],
    materials,
    components: ratioComponents,
    hotzones: ratioComponents.flatMap((component) => component.type === "image" ? (component.hotzones || []) : []),
    publish: {
      h5BaseUrl: landingH5BaseFormInput?.value.trim() || state.landingH5BaseUrl,
      h5Url,
      configJsonUrl,
    },
    updatedAt: new Date().toISOString(),
  };
}

function updateLandingGeneratedFields() {
  if (!state.landingForm) return;
  syncLandingHeroTitleFromName();
  const base = landingH5BaseFormInput?.value.trim() || state.landingH5BaseUrl;
  const config = getLandingFormConfigFromInputs();
  const h5Url = buildLandingH5Url({
    id: state.landingFormMode === "edit" ? state.landingEditingId : null,
    pageKey: config.pageKey,
    configJsonUrl: config.renderer?.configJsonUrl,
    baseUrl: base,
  });
  config.h5Url = h5Url;
  config.publish = {
    ...(config.publish || {}),
    h5BaseUrl: base,
    h5Url,
  };
  state.landingForm.config = config;
  state.landingForm.h5Url = h5Url;
  if (landingH5UrlOutput) landingH5UrlOutput.value = state.landingForm.h5Url;
  if (landingConfigPreview) landingConfigPreview.textContent = JSON.stringify(config, null, 2);
}

function refreshLandingHotspotSurface() {
  renderLandingCanvas();
  renderLandingLayers();
  updateLandingGeneratedFields();
}

function getLandingSelectedComponent() {
  const components = state.landingForm?.config?.components || [];
  return findLandingComponent(state.landingEditorSelectedId, components) || components[0] || null;
}

function setLandingEditorSelected(id) {
  state.landingEditorSelectedId = id;
  renderLandingEditor();
}

function renderLandingCanvas() {
  if (!landingCanvas || !state.landingForm?.config) return;
  const components = getLandingComponents(state.landingForm.config);
  const previousScrollTop = landingCanvas.scrollTop;
  landingCanvas.innerHTML = "";
  let maxBottom = 812;
  let flowTop = 0;
  const screenButtons = components.filter((component) => component.type === "button" && !landingButtonMustStayInFlow(component));
  const topSpacer = screenButtons
    .filter((button) => (button.positionMode || "bottom") === "top" && !landingButtonAllowsImageOverlap(button))
    .reduce((max, button) => Math.max(max, getLandingButtonRect(button).height), 0);
  const bottomSpacer = screenButtons
    .filter((button) => (button.positionMode || "bottom") === "bottom" && !landingButtonAllowsImageOverlap(button))
    .reduce((max, button) => Math.max(max, getLandingButtonRect(button).height + getLandingButtonBottomSafeArea(button)), 0);
  const canvasSafeAreaSpacer = state.landingForm.config.canvas?.enableBottomSafeArea === false ? 0 : LANDING_BOTTOM_SAFE_AREA;
  const screenLayer = screenButtons.length ? document.createElement("div") : null;
  if (screenLayer) {
    screenLayer.className = "landing-screen-button-layer";
    landingCanvas.appendChild(screenLayer);
  }
  if (topSpacer) {
    const spacer = document.createElement("div");
    spacer.className = "landing-button-screen-spacer";
    spacer.style.height = `${topSpacer}px`;
    landingCanvas.appendChild(spacer);
    flowTop += topSpacer;
    maxBottom = Math.max(maxBottom, flowTop);
  }

  components.forEach((component, index) => {
    if (component.type === "image") {
      const imageWrap = document.createElement("div");
      imageWrap.role = "button";
      imageWrap.tabIndex = 0;
      imageWrap.className = `landing-canvas-image ${component.id === state.landingEditorSelectedId ? "selected" : ""}`;
      const imageHeight = getLandingImageHeight(component);
      imageWrap.style.height = component.imageUrl ? "auto" : `${imageHeight}px`;
      imageWrap.dataset.componentId = component.id;
      imageWrap.innerHTML = component.imageUrl
        ? `<img src="${escapeHtml(component.imageUrl)}" alt="${escapeHtml(component.name)}" />`
        : `<div class="landing-empty-image">暂无图片</div>`;
      if (component.imageUrl) {
        const imageEl = imageWrap.querySelector("img");
        const refreshImageSize = () => {
          if (!updateLandingImageNaturalSize(component, imageEl)) return;
          state.landingForm.config.components = components;
          renderLandingEditor();
        };
        imageEl?.addEventListener("load", refreshImageSize, { once: true });
        if (imageEl?.complete) refreshImageSize();
      }
      imageWrap.addEventListener("click", () => setLandingEditorSelected(component.id));
      imageWrap.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setLandingEditorSelected(component.id);
        }
      });
      landingCanvas.appendChild(imageWrap);
      flowTop += imageHeight;

      (component.hotzones || []).forEach((hotzone, hotzoneIndex) => {
        const hotzoneBtn = document.createElement("button");
        hotzoneBtn.type = "button";
        hotzoneBtn.className = `landing-hotzone-box ${hotzone.id === state.landingEditorSelectedId ? "selected" : ""}`;
        hotzoneBtn.style.left = `${Number(hotzone.x || 0)}px`;
        hotzoneBtn.style.top = `${Number(hotzone.y || 0)}px`;
        hotzoneBtn.style.width = `${Number(hotzone.width || 100)}px`;
        hotzoneBtn.style.height = `${Number(hotzone.height || 40)}px`;
        hotzoneBtn.dataset.componentId = hotzone.id;
        hotzoneBtn.innerHTML = `<span>热区 ${hotzoneIndex + 1}</span><i></i>`;
        hotzoneBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          setLandingEditorSelected(hotzone.id);
        });
        bindLandingHotzonePointer(hotzoneBtn, hotzone, component);
        imageWrap.appendChild(hotzoneBtn);
      });
      maxBottom = Math.max(maxBottom, getLandingComponentTop(component.id, components) + imageHeight);
      maxBottom = Math.max(maxBottom, flowTop);
      return;
    }

    if (component.type === "button") {
      if (landingButtonMustStayInFlow(component)) {
        const rect = getLandingButtonRect(component);
        const slot = document.createElement("div");
        slot.className = "landing-button-flow-slot";
        slot.style.height = `${rect.height}px`;
        slot.style.position = "relative";
        landingCanvas.appendChild(slot);
        flowTop += rect.height;
        maxBottom = Math.max(maxBottom, flowTop);
        slot.appendChild(createLandingButtonElement(component, components, index, true));
      }
    }
  });
  if (bottomSpacer || canvasSafeAreaSpacer) {
    const spacerHeight = Math.max(bottomSpacer, canvasSafeAreaSpacer);
    const spacer = document.createElement("div");
    spacer.className = "landing-button-screen-spacer";
    spacer.style.height = `${spacerHeight}px`;
    landingCanvas.appendChild(spacer);
    flowTop += spacerHeight;
    maxBottom = Math.max(maxBottom, flowTop);
  }
  screenButtons.forEach((component, index) => {
    const buttonEl = createLandingButtonElement(component, components, index, false);
    buttonEl.style.top = `${getLandingScreenButtonY(component)}px`;
    screenLayer?.appendChild(buttonEl);
  });
  landingCanvas.style.minHeight = "";
  landingCanvas.dataset.contentHeight = String(maxBottom);
  requestAnimationFrame(() => {
    landingCanvas.scrollTop = Math.min(previousScrollTop, Math.max(0, landingCanvas.scrollHeight - landingCanvas.clientHeight));
  });
}

function createLandingButtonElement(component, components, index, isFlow) {
  const buttonEl = document.createElement("button");
  buttonEl.type = "button";
  const buttonMode = component.positionMode || "bottom";
  const editableMode = buttonMode === "fixed" || buttonMode === "flow";
  const visualRect = getLandingButtonRect(component);
  buttonEl.className = `landing-canvas-button mode-${buttonMode} ${component.imageUrl ? "has-image" : ""} ${isFlow ? "is-flow" : "is-screen"} ${editableMode ? "is-draggable" : "is-locked"} ${component.id === state.landingEditorSelectedId ? "selected" : ""}`;
  buttonEl.style.left = `${visualRect.x}px`;
  buttonEl.style.top = isFlow ? "0px" : `${Number(component.y || 0)}px`;
  buttonEl.style.width = `${visualRect.width}px`;
  buttonEl.style.height = `${visualRect.height}px`;
  buttonEl.style.background = component.color || "#1677ff";
  buttonEl.dataset.componentId = component.id;
  buttonEl.innerHTML = component.imageUrl
    ? `<img src="${escapeHtml(component.imageUrl)}" alt="${escapeHtml(component.text || "按钮素材")}" /><i></i>`
    : `<span>${escapeHtml(component.text || "按钮")}</span><i></i>`;
  if (component.imageUrl) {
    const imageEl = buttonEl.querySelector("img");
    const refreshImageSize = () => {
      if (component.naturalWidth && component.naturalHeight) return;
      if (!applyLandingButtonImageSize(component, imageEl)) return;
      state.landingForm.config.components = components;
      renderLandingEditor();
    };
    imageEl?.addEventListener("load", refreshImageSize, { once: true });
    if (imageEl?.complete) refreshImageSize();
  }
  buttonEl.addEventListener("click", (event) => {
    event.stopPropagation();
    setLandingEditorSelected(component.id);
  });
  bindLandingButtonPointer(buttonEl, component, components);
  return buttonEl;
}

function bindLandingHotzonePointer(element, hotzone, imageComponent) {
  const startPointer = (event, mode) => {
    if (state.landingFormMode === "detail") return;
    event.preventDefault();
    event.stopPropagation();
    try {
      element.setPointerCapture?.(event.pointerId);
    } catch (_) {}
    const imageRect = element.parentElement.getBoundingClientRect();
    state.landingEditorSelectedId = hotzone.id;
    renderLandingLayers();
    renderLandingInspector();
    const scaleX = 375 / imageRect.width;
    const scaleY = getLandingImageHeight(imageComponent) / imageRect.height;
    const startX = event.clientX;
    const startY = event.clientY;
    const initial = {
      x: Number(hotzone.x || 0),
      y: Number(hotzone.y || 0),
      width: Number(hotzone.width || 100),
      height: Number(hotzone.height || 40),
    };

    const move = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) * scaleX;
      const dy = (moveEvent.clientY - startY) * scaleY;
      const maxW = 375;
      const maxH = getLandingImageHeight(imageComponent);
      let candidate;
      if (mode === "resize") {
        candidate = {
          ...initial,
          width: clampNumber(initial.width + dx, 20, maxW - initial.x),
          height: clampNumber(initial.height + dy, 20, maxH - initial.y),
        };
      } else {
        candidate = {
          ...initial,
          x: clampNumber(initial.x + dx, 0, maxW - initial.width),
          y: clampNumber(initial.y + dy, 0, maxH - initial.height),
        };
      }
      if (!applyLandingHotzoneRect(hotzone, imageComponent, candidate)) return;
      const components = getLandingComponents(state.landingForm.config);
      const pair = getLandingHotzoneWithParent(hotzone.id, components);
      if (pair) {
        Object.assign(pair.hotzone, getLandingHotzoneRect(hotzone));
      }
      state.landingForm.config.components = components;
      renderLandingCanvas();
      renderLandingLayers();
      renderLandingInspector();
      updateLandingGeneratedFields();
    };

    const stop = () => {
      try {
        element.releasePointerCapture?.(event.pointerId);
      } catch (_) {}
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  element.addEventListener("pointerdown", (event) => {
    if (event.target.tagName.toLowerCase() === "i") return;
    startPointer(event, "move");
  });
  element.querySelector("i")?.addEventListener("pointerdown", (event) => startPointer(event, "resize"));
}

function bindLandingButtonPointer(element, buttonComponent, components = []) {
  const startPointer = (event, mode) => {
    if (state.landingFormMode === "detail") return;
    const buttonMode = buttonComponent.positionMode || "bottom";
    if (buttonMode !== "fixed" && buttonMode !== "flow") return;
    event.preventDefault();
    event.stopPropagation();
    try {
      element.setPointerCapture?.(event.pointerId);
    } catch (_) {}
    state.landingEditorSelectedId = buttonComponent.id;
    renderLandingLayers();
    renderLandingInspector();
    const pointerRect = element.offsetParent?.getBoundingClientRect() || landingCanvas.getBoundingClientRect();
    const scaleX = 375 / pointerRect.width;
    const scaleY = 754 / Math.max(1, pointerRect.height || landingCanvas.clientHeight);
    const startX = event.clientX;
    const startY = event.clientY;
    const initial = getLandingButtonRect(buttonComponent);

    const move = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) * scaleX;
      const dy = (moveEvent.clientY - startY) * scaleY;
      const lockedY = buttonMode === "top" || buttonMode === "bottom"
        ? getLandingScreenButtonY(buttonComponent)
        : initial.y;
      const candidate = mode === "resize"
        ? {
          ...initial,
          y: buttonMode === "fixed" || buttonMode === "flow" ? initial.y : lockedY,
          width: clampNumber(initial.width + dx, 32, Math.max(32, 375 - initial.x)),
          height: clampNumber(
            initial.height + dy,
            24,
            buttonMode === "fixed"
              ? Math.max(24, 754 - initial.y - getLandingButtonBottomSafeArea(buttonComponent))
              : 754,
          ),
        }
        : {
          ...initial,
          x: clampNumber(initial.x + dx, 0, 375 - initial.width),
          y: buttonMode === "fixed"
            ? clampNumber(initial.y + dy, 0, getLandingScreenMaxY(buttonComponent))
            : lockedY,
        };
      if (!applyLandingButtonRect(buttonComponent, components, candidate)) return;
      state.landingForm.config.components = components;
      renderLandingCanvas();
      renderLandingLayers();
      renderLandingInspector();
      updateLandingGeneratedFields();
    };

    const stop = () => {
      try {
        element.releasePointerCapture?.(event.pointerId);
      } catch (_) {}
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  element.addEventListener("pointerdown", (event) => {
    if (event.target.tagName.toLowerCase() === "i") return;
    startPointer(event, "move");
  });
  element.querySelector("i")?.addEventListener("pointerdown", (event) => startPointer(event, "resize"));
}

function updateLandingSelectedHotspotFromInputs(options = {}) {
  if (!state.landingForm?.config || state.landingFormMode === "detail") return false;
  const shouldRender = options.render !== false;
  const silent = options.silent === true;
  const shouldSyncRect = options.syncRect !== false;
  const components = getLandingComponents(state.landingForm.config);
  const pair = getLandingHotzoneWithParent(state.landingEditorSelectedId, components);
  if (!pair) {
    if (!silent) showToast("当前热区不存在，请重新选择热区", "error");
    return false;
  }
  const { hotzone, parent } = pair;
  if (!applyLandingEditableControlId(hotzone, landingHotspotIdInput?.value || hotzone.id, components, "热区")) {
    if (shouldRender) renderLandingInspector();
    return false;
  }
  if (shouldSyncRect) {
    const candidate = {
      x: Number(landingHotspotXInput?.value || 0),
      y: Number(landingHotspotYInput?.value || 0),
      width: Number(landingHotspotWInput?.value || 1),
      height: Number(landingHotspotHInput?.value || 1),
    };
    if (!applyLandingHotzoneRect(hotzone, parent, candidate)) {
      if (!silent) showToast("热区不能重叠", "error");
      if (shouldRender) renderLandingInspector();
      return false;
    }
  }
  hotzone.event = landingHotspotEventInput?.value || "claim";
  hotzone.sku = normalizeLandingSkuId(landingHotspotSkuInput?.value);
  hotzone.link = landingHotspotLinkInput?.value.trim() || "";
  hotzone.bridgeAction = landingHotspotBridgeActionInput?.value || "showShareDialog";
  hotzone.bridgeParams = landingHotspotBridgeParamsInput?.value.trim() || "";
  state.landingForm.config.components = components;
  if (shouldRender) {
    renderLandingEditor();
  } else {
    updateLandingGeneratedFields();
  }
  return true;
}

function renderLandingHotspotEventFields(eventType = "claim") {
  landingHotspotSkuField?.classList.toggle("hidden", eventType !== "claim");
  landingHotspotLinkField?.classList.toggle("hidden", eventType !== "jump");
  landingHotspotJsField?.classList.toggle("hidden", eventType !== "custom");
}

function renderLandingButtonImagePreview(imageUrl = "") {
  if (!landingButtonImagePreview) return;
  landingButtonImagePreview.innerHTML = imageUrl
    ? `<img src="${escapeHtml(imageUrl)}" alt="按钮图片素材预览" />`
    : "<span>⇧</span><small>可配置按钮图片素材</small>";
}

function scheduleLandingButtonImageMeasure(imageUrl) {
  window.clearTimeout(landingButtonImageUrlMeasureTimer);
  landingButtonImageUrlMeasureTimer = window.setTimeout(async () => {
    const meta = await loadLandingImageMeta(imageUrl);
    if (!meta?.width || !meta?.height) return;
    mutateLandingSelectedComponent((component) => {
      if (component.type !== "button" || component.imageUrl !== imageUrl) return;
      applyLandingButtonImageSize(component, meta);
    });
  }, 350);
}

function setLandingButtonModeActive(mode = "bottom") {
  landingButtonModeButtons.forEach((button) => {
    const active = button.dataset.landingButtonMode === mode;
    button.classList.toggle("active", active);
  });
}

function renderLandingButtonEventFields(eventType = "claim") {
  landingButtonSkuField?.classList.toggle("hidden", eventType !== "claim");
  landingButtonLinkField?.classList.toggle("hidden", eventType !== "jump");
  landingButtonJsField?.classList.toggle("hidden", eventType !== "custom");
}

function updateLandingSelectedButtonFromInputs(nextMode = null) {
  if (!state.landingForm?.config || state.landingFormMode === "detail") return false;
  const components = getLandingComponents(state.landingForm.config);
  const button = findLandingComponent(state.landingEditorSelectedId, components);
  if (!button || button.type !== "button") return false;
  if (!applyLandingEditableControlId(button, landingButtonIdInput?.value || button.id, components, "按钮")) {
    renderLandingInspector();
    return false;
  }
  state.landingForm.config.canvas = {
    ...(state.landingForm.config.canvas || {}),
    width: 375,
    height: 812,
    enableBottomSafeArea: landingButtonSafeAreaInput?.checked !== false,
  };
  if (nextMode) button.positionMode = nextMode;
  const effectiveMode = button.positionMode || "bottom";
  button.floatAboveImage = landingButtonFloatAboveImageInput?.checked === true && (effectiveMode === "top" || effectiveMode === "bottom");
  button.text = landingButtonTextInput?.value.trim() || "按钮";
  button.event = landingButtonEventInput?.value || "claim";
  button.sku = normalizeLandingSkuId(landingButtonSkuInput?.value);
  button.link = landingButtonLinkInput?.value.trim() || "";
  button.bridgeAction = landingButtonBridgeActionInput?.value || "showShareDialog";
  button.bridgeParams = landingButtonBridgeParamsInput?.value.trim() || "";
  const previousImageUrl = button.imageUrl || "";
  button.imageUrl = landingButtonImageUrlInput?.value.trim() || "";
  button.color = landingThemeColorInput?.value || "#1677ff";
  if (button.imageUrl && button.imageUrl !== previousImageUrl) {
    scheduleLandingButtonImageMeasure(button.imageUrl);
  }
  const candidate = nextMode
    ? getLandingButtonPreferredRect(button, components)
    : {
      x: Number(landingButtonXInput?.value || 0),
      y: Number(landingButtonYInput?.value || 0),
      width: Number(landingButtonWInput?.value || 1),
      height: Number(landingButtonHInput?.value || 1),
    };
  if (!applyLandingButtonRect(button, components, candidate)) {
    showToast("当前按钮模式不能与背景图重叠", "error");
    renderLandingInspector();
    return false;
  }
  state.landingForm.config.components = components;
  renderLandingCanvas();
  renderLandingLayers();
  renderLandingInspector();
  updateLandingGeneratedFields();
  return true;
}

function moveLandingComponent(fromIndex, toIndex) {
  if (!state.landingForm?.config || state.landingFormMode === "detail") return;
  const components = getLandingComponents(state.landingForm.config);
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= components.length || toIndex >= components.length) return;
  const [moved] = components.splice(fromIndex, 1);
  components.splice(toIndex, 0, moved);
  state.landingForm.config.components = normalizeLandingButtonLayouts(components);
  state.landingEditorSelectedId = moved.id;
  renderLandingEditor();
}

function renderLandingLayers() {
  if (!landingLayerList || !state.landingForm?.config) return;
  const components = getLandingComponents(state.landingForm.config);
  const layerItems = [];
  components.forEach((component, componentIndex) => {
    layerItems.push({
      id: component.id,
      label: component.name || "组件",
      type: component.type,
      componentIndex,
      draggable: true,
    });
    if (component.type === "image") {
      (component.hotzones || []).forEach((hotzone, index) => {
        layerItems.push({
          id: hotzone.id,
          label: hotzone.name || `热区 ${index + 1}`,
          type: "hotspot",
          componentIndex,
          draggable: false,
        });
      });
    }
  });
  landingLayerList.innerHTML = layerItems.map((item, index) => `
    <button type="button" class="landing-layer-item ${item.id === state.landingEditorSelectedId ? "active" : ""} ${item.draggable ? "is-draggable" : "is-child"}" data-layer-id="${escapeHtml(item.id)}" data-component-index="${item.componentIndex}" draggable="${item.draggable ? "true" : "false"}">
      <span>${index + 1}</span>
      <strong>${escapeHtml(item.label)}</strong>
    </button>
  `).join("");
  landingLayerList.querySelectorAll("[data-layer-id]").forEach((button) => {
    button.addEventListener("click", () => setLandingEditorSelected(button.dataset.layerId));
    if (button.draggable) {
      button.addEventListener("dragstart", (event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", button.dataset.componentIndex);
        button.classList.add("dragging");
      });
      button.addEventListener("dragend", () => button.classList.remove("dragging"));
    }
    button.addEventListener("dragover", (event) => {
      if (!button.classList.contains("is-draggable")) return;
      event.preventDefault();
      button.classList.add("drag-over");
    });
    button.addEventListener("dragleave", () => button.classList.remove("drag-over"));
    button.addEventListener("drop", (event) => {
      if (!button.classList.contains("is-draggable")) return;
      event.preventDefault();
      button.classList.remove("drag-over");
      const fromIndex = Number(event.dataTransfer.getData("text/plain"));
      const toIndex = Number(button.dataset.componentIndex);
      moveLandingComponent(fromIndex, toIndex);
    });
  });
}

function renderLandingInspector() {
  if (!state.landingForm?.config) return;
  const components = getLandingComponents(state.landingForm.config);
  const selected = getLandingSelectedComponent();
  const selectedHotzone = components
    .filter((component) => component.type === "image")
    .flatMap((component) => component.hotzones || [])
    .find((hotzone) => hotzone.id === state.landingEditorSelectedId);
  const kind = selectedHotzone ? "hotspot" : selected?.type;

  landingImagePanel?.classList.toggle("hidden", kind !== "image");
  landingHotspotPanel?.classList.toggle("hidden", kind !== "hotspot");
  landingButtonPanel?.classList.toggle("hidden", kind !== "button");
  landingDeleteComponentBtn?.classList.toggle("hidden", !kind);
  if (landingInspectorSubtitle) {
    const label = kind === "image" ? "正在编辑：图片" : kind === "hotspot" ? "正在编辑：热区" : kind === "button" ? "正在编辑：按钮" : "请选择一个组件";
    landingInspectorSubtitle.textContent = label;
  }

  if (kind === "image" && selected) {
    if (landingBannerUrlInput) landingBannerUrlInput.value = selected.imageUrl || "";
  }
  if (kind === "hotspot" && selectedHotzone) {
    if (landingHotspotIdInput) landingHotspotIdInput.value = selectedHotzone.id || "";
    setLandingInputValue(landingHotspotXInput, selectedHotzone.x, 0);
    setLandingInputValue(landingHotspotYInput, selectedHotzone.y, 0);
    setLandingInputValue(landingHotspotWInput, selectedHotzone.width, 100);
    setLandingInputValue(landingHotspotHInput, selectedHotzone.height, 40);
    if (landingHotspotEventInput) landingHotspotEventInput.value = selectedHotzone.event || "claim";
    if (landingHotspotSkuInput) landingHotspotSkuInput.value = normalizeLandingSkuId(selectedHotzone.sku);
    if (landingHotspotLinkInput) landingHotspotLinkInput.value = selectedHotzone.link || "";
    if (landingHotspotBridgeActionInput) landingHotspotBridgeActionInput.value = selectedHotzone.bridgeAction || selectedHotzone.jsMethod || "showShareDialog";
    if (landingHotspotBridgeParamsInput) landingHotspotBridgeParamsInput.value = selectedHotzone.bridgeParams || "";
    renderLandingHotspotEventFields(selectedHotzone.event || "claim");
  } else {
    renderLandingHotspotEventFields("claim");
  }
  if (kind === "button" && selected) {
    if (landingButtonIdInput) landingButtonIdInput.value = selected.id || "";
    setLandingInputValue(landingButtonXInput, selected.x, 0);
    setLandingInputValue(landingButtonYInput, selected.y, 0);
    setLandingInputValue(landingButtonWInput, selected.width, 311);
    setLandingInputValue(landingButtonHInput, selected.height, 48);
    if (landingButtonTextInput) landingButtonTextInput.value = selected.text || "";
    if (landingButtonImageUrlInput) landingButtonImageUrlInput.value = selected.imageUrl || "";
    if (landingButtonEventInput) landingButtonEventInput.value = selected.event || "claim";
    if (landingButtonSkuInput) landingButtonSkuInput.value = normalizeLandingSkuId(selected.sku);
    if (landingButtonLinkInput) landingButtonLinkInput.value = selected.link || "";
    if (landingButtonBridgeActionInput) landingButtonBridgeActionInput.value = selected.bridgeAction || selected.jsMethod || "showShareDialog";
    if (landingButtonBridgeParamsInput) landingButtonBridgeParamsInput.value = selected.bridgeParams || "";
    if (landingThemeColorInput) landingThemeColorInput.value = selected.color || "#1677ff";
    if (landingButtonSafeAreaInput) {
      landingButtonSafeAreaInput.checked = state.landingForm.config.canvas?.enableBottomSafeArea !== false;
      landingButtonSafeAreaInput.disabled = false;
    }
    if (landingButtonFloatAboveImageInput) {
      const mode = selected.positionMode || "bottom";
      const enabled = mode === "top" || mode === "bottom";
      landingButtonFloatAboveImageInput.checked = enabled && selected.floatAboveImage === true;
      landingButtonFloatAboveImageInput.disabled = state.landingFormMode === "detail" || !enabled;
    }
    setLandingButtonModeActive(selected.positionMode || "bottom");
    renderLandingButtonEventFields(selected.event || "claim");
    renderLandingButtonImagePreview(selected.imageUrl || "");
  } else {
    if (landingButtonSafeAreaInput) {
      landingButtonSafeAreaInput.checked = state.landingForm.config.canvas?.enableBottomSafeArea !== false;
      landingButtonSafeAreaInput.disabled = false;
    }
    if (landingButtonFloatAboveImageInput) {
      landingButtonFloatAboveImageInput.checked = false;
      landingButtonFloatAboveImageInput.disabled = true;
    }
    setLandingButtonModeActive("bottom");
    renderLandingButtonEventFields("claim");
    renderLandingButtonImagePreview("");
  }
}

function renderLandingEditor() {
  if (!state.landingForm?.config) return;
  state.landingForm.config.components = normalizeLandingButtonLayouts(getLandingComponents(state.landingForm.config));
  if (!state.landingEditorSelectedId) {
    state.landingEditorSelectedId = state.landingForm.config.components[0]?.id || null;
  }
  renderLandingCanvas();
  renderLandingLayers();
  renderLandingInspector();
  updateLandingGeneratedFields();
}

function mutateLandingSelectedComponent(updater) {
  if (!state.landingForm?.config) return;
  const components = getLandingComponents(state.landingForm.config);
  const selectedId = state.landingEditorSelectedId;
  const component = components.find((item) => item.id === selectedId);
  if (component) {
    updater(component);
  } else {
    const parent = components.find((item) => item.type === "image" && (item.hotzones || []).some((hotzone) => hotzone.id === selectedId));
    const hotzone = parent?.hotzones?.find((item) => item.id === selectedId);
    if (hotzone) updater(hotzone, parent);
  }
  state.landingForm.config.components = components;
  renderLandingCanvas();
  renderLandingLayers();
  renderLandingInspector();
  updateLandingGeneratedFields();
}

async function applyLandingUploadedImage(file) {
  if (!file || state.landingFormMode === "detail") return;
  const selected = getLandingSelectedComponent();
  if (!selected || selected.type !== "image") {
    showToast("请先选择一个图片组件", "error");
    return;
  }
  if (!file.type?.startsWith("image/")) {
    showToast("请选择图片文件", "error");
    return;
  }
  const statusText = landingImageUploadBox?.querySelector("small");
  const previousText = statusText?.textContent || "点击或拖拽上传";
  try {
    landingImageUploadBox?.classList.add("is-uploading");
    if (statusText) statusText.textContent = "上传中...";
    const pageKey = normalizeLandingPageKey(landingPageKeyInput?.value || state.landingForm.config.pageKey);
    const result = await uploadLandingImageToOss(file, pageKey);
    const imageMeta = await loadLandingImageMeta(result.url);
    mutateLandingSelectedComponent((component) => {
      if (component.type !== "image") return;
      component.imageUrl = result.url;
      if (imageMeta?.width && imageMeta?.height) {
        component.naturalWidth = imageMeta.width;
        component.naturalHeight = imageMeta.height;
        component.height = Math.round((375 * imageMeta.height) / imageMeta.width);
      }
    });
    showToast("图片已上传到 OSS", "success");
  } catch (error) {
    showToast(`图片上传失败：${error.message}`, "error");
  } finally {
    if (statusText) statusText.textContent = previousText;
    landingImageUploadBox?.classList.remove("is-uploading", "is-dragover");
  }
}

async function applyLandingUploadedButtonImage(file) {
  if (!file || state.landingFormMode === "detail") return;
  const selected = getLandingSelectedComponent();
  if (!selected || selected.type !== "button") {
    showToast("请先选择一个按钮组件", "error");
    return;
  }
  if (!file.type?.startsWith("image/")) {
    showToast("请选择图片文件", "error");
    return;
  }
  const statusText = landingButtonImagePreview?.querySelector("small");
  const previousText = statusText?.textContent || "可配置按钮图片素材";
  try {
    landingButtonImagePreview?.classList.add("is-uploading");
    if (statusText) statusText.textContent = "上传中...";
    const pageKey = normalizeLandingPageKey(landingPageKeyInput?.value || state.landingForm.config.pageKey);
    const result = await uploadLandingImageToOss(file, pageKey);
    const imageMeta = await loadLandingImageFileMeta(file) || await loadLandingImageMeta(result.url);
    if (landingButtonImageUrlInput) landingButtonImageUrlInput.value = result.url;
    mutateLandingSelectedComponent((component) => {
      if (component.type !== "button") return;
      component.imageUrl = result.url;
      if (imageMeta?.width && imageMeta?.height) {
        applyLandingButtonImageSize(component, imageMeta);
      }
    });
    showToast("按钮素材已上传到 OSS", "success");
  } catch (error) {
    showToast(`按钮素材上传失败：${error.message}`, "error");
  } finally {
    if (statusText) statusText.textContent = previousText;
    landingButtonImagePreview?.classList.remove("is-uploading", "is-dragover");
  }
}

function openLandingImageFilePicker() {
  if (state.landingFormMode === "detail") return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", () => {
    const [file] = input.files || [];
    applyLandingUploadedImage(file);
  }, { once: true });
  input.click();
}

function openLandingButtonImageFilePicker() {
  if (state.landingFormMode === "detail") return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.addEventListener("change", () => {
    const [file] = input.files || [];
    applyLandingUploadedButtonImage(file);
  }, { once: true });
  input.click();
}

function deleteLandingSelectedComponent() {
  if (!state.landingForm?.config || state.landingFormMode === "detail" || !state.landingEditorSelectedId) return;
  const selectedId = state.landingEditorSelectedId;
  let components = getLandingComponents(state.landingForm.config);
  const beforeLength = components.length;
  components = components.filter((component) => component.id !== selectedId);
  if (components.length === beforeLength) {
    components.forEach((component) => {
      if (component.type === "image") {
        component.hotzones = (component.hotzones || []).filter((hotzone) => hotzone.id !== selectedId);
      }
    });
  }
  if (!components.length) components = [createLandingComponent("image")];
  state.landingForm.config.components = components;
  state.landingEditorSelectedId = components[0]?.id || null;
  renderLandingEditor();
}

function fillLandingForm(record) {
  const config = record.config || createDefaultLandingConfig();
  const section = Array.isArray(config.sections) ? config.sections.find((item) => item.type === "richText") : null;
  config.components = getLandingComponents(config);
  state.landingEditorSelectedId = config.components[0]?.id || null;
  if (landingNameInput) landingNameInput.value = record.name || "";
  if (landingBusinessInput) landingBusinessInput.value = record.businessTypeComment || "";
  const pageKey = config.pageKey || makeLandingPageKey(record.name || config.hero?.title || "");
  if (landingPageKeyInput) landingPageKeyInput.value = pageKey;
  if (landingH5BaseFormInput) landingH5BaseFormInput.value = state.landingH5BaseUrl;
  if (landingHeroTitleInput) landingHeroTitleInput.value = config.hero?.title || "";
  if (landingHeroSubtitleInput) landingHeroSubtitleInput.value = config.hero?.subtitle || "";
  if (landingButtonTextInput) landingButtonTextInput.value = config.cta?.text || "按钮";
  if (landingButtonLinkInput) landingButtonLinkInput.value = config.cta?.link || "";
  if (landingButtonImageUrlInput) landingButtonImageUrlInput.value = config.cta?.imageUrl || "";
  if (landingThemeColorInput) landingThemeColorInput.value = config.theme?.primaryColor || "#2563eb";
  if (landingButtonSafeAreaInput) landingButtonSafeAreaInput.checked = config.canvas?.enableBottomSafeArea !== false;
  if (landingBannerUrlInput) landingBannerUrlInput.value = config.hero?.bannerImageUrl || "";
  if (landingConfigJsonUrlInput) {
    const existingConfigName = config.renderer?.configJsonUrl || "";
    const shouldReuseConfigName = ["detail", "edit"].includes(state.landingFormMode) && existingConfigName;
    landingConfigJsonUrlInput.value = shouldReuseConfigName
      ? existingConfigName
      : makeLandingConfigJsonFileName(pageKey);
  }
  if (landingMaterialUrlsInput) {
    landingMaterialUrlsInput.value = (config.materials || [])
      .map((item) => item.url || item)
      .filter(Boolean)
      .join("\n");
  }
  if (landingContentInput) landingContentInput.value = section?.content || "";
  state.landingForm.config = config;
  state.landingLastNameValue = landingNameInput?.value || "";
  state.landingHeroTitleManuallyEdited = Boolean(
    landingHeroTitleInput?.value
    && landingNameInput?.value
    && landingHeroTitleInput.value.trim() !== landingNameInput.value.trim()
  );
  renderLandingEditor();
}

function setLandingFormReadonly(readonly) {
  [
    landingNameInput,
    landingBusinessInput,
    landingPageKeyInput,
    landingH5BaseFormInput,
    landingHeroTitleInput,
    landingHeroSubtitleInput,
    landingButtonTextInput,
    landingButtonLinkInput,
    landingButtonImageUrlInput,
    landingThemeColorInput,
    landingBannerUrlInput,
    landingConfigJsonUrlInput,
    landingMaterialUrlsInput,
    landingContentInput,
    landingHotspotXInput,
    landingHotspotYInput,
    landingHotspotWInput,
    landingHotspotHInput,
    landingHotspotEventInput,
    landingHotspotSkuInput,
    landingHotspotLinkInput,
    landingHotspotBridgeActionInput,
    landingHotspotBridgeParamsInput,
    landingButtonXInput,
    landingButtonYInput,
    landingButtonWInput,
    landingButtonHInput,
    landingButtonSafeAreaInput,
    landingButtonFloatAboveImageInput,
    landingButtonEventInput,
    landingButtonSkuInput,
    landingButtonBridgeActionInput,
    landingButtonBridgeParamsInput,
  ].forEach((el) => {
    if (!el) return;
    el.disabled = readonly;
    el.classList.toggle("readonly", readonly);
  });
  saveLandingBtn?.classList.toggle("hidden", readonly);
  landingDeleteComponentBtn?.classList.toggle("hidden", readonly || !state.landingEditorSelectedId);
  landingButtonModeButtons.forEach((button) => {
    button.disabled = readonly;
    button.classList.toggle("readonly", readonly);
  });
  [landingPageKeyInput, landingConfigJsonUrlInput].forEach((el) => {
    if (!el) return;
    el.disabled = true;
    el.classList.add("readonly");
  });
}

async function openLandingForm(mode, id, seed = {}) {
  state.landingFormMode = mode;
  state.landingEditingId = id || null;
  state.landingPageKeyManuallyEdited = false;
  state.landingHeroTitleManuallyEdited = false;
  state.landingLastNameValue = "";
  let record;
  if (mode === "create") {
    const defaultConfig = createDefaultLandingConfig();
    record = normalizeLandingRecord({
      name: seed.name || "",
      businessTypeComment: seed.businessTypeComment || "",
      content: JSON.stringify({
        ...defaultConfig,
        pageKey: seed.pageKey || makeLandingPageKey(seed.name),
        hero: {
          ...defaultConfig.hero,
          title: seed.name || "领取专属课程权益",
        },
      }, null, 2),
      h5Url: "",
      creator: state.authUser?.username || "admin",
      createTime: "",
    });
  } else {
    const source = landingItems.find((item) => String(item.id) === String(id));
    if (!source) return;
    if (isApiMode()) {
      try {
        record = await fetchLandingDetail(id);
      } catch (error) {
        window.alert(`加载落地页详情失败：${error.message}`);
        return;
      }
    } else {
      record = normalizeLandingRecord(source);
      try {
        record = await hydrateLandingRecordConfig(record);
      } catch (error) {
        window.alert(`加载 OSS 配置失败：${error.message}`);
        return;
      }
    }
    if (mode === "copy") {
      record = normalizeLandingRecord({
        ...record,
        id: null,
        name: `${record.name}-副本`,
        h5Url: "",
        content: JSON.stringify({ ...record.config, pageKey: makeLandingPageKey(record.name) }, null, 2),
      });
    }
  }

  state.landingForm = record;
  if (landingFormTitle) {
    landingFormTitle.textContent = mode === "detail" ? "领取落地页详情" : mode === "edit" ? "编辑领取落地页" : mode === "copy" ? "复制领取落地页" : "新建领取落地页";
  }
  landingListView?.classList.add("hidden");
  landingOverview?.classList.add("hidden");
  landingFormView?.classList.remove("hidden");
  setLandingFormReadonly(mode === "detail");
  fillLandingForm(record);
}

function goLandingList() {
  state.landingForm = null;
  state.landingEditingId = null;
  state.landingEditorSelectedId = null;
  landingFormView?.classList.add("hidden");
  landingOverview?.classList.remove("hidden");
  landingListView?.classList.remove("hidden");
  refreshLandingPage({ showErrorAlert: false });
}

function openLandingCreateModal() {
  if (!landingCreateModal) {
    openLandingForm("create");
    return;
  }
  if (landingCreateNameInput) landingCreateNameInput.value = "";
  if (landingCreateBusinessInput) landingCreateBusinessInput.value = "";
  landingCreateModal.classList.remove("hidden");
  setTimeout(() => landingCreateNameInput?.focus(), 0);
}

function closeLandingCreateDialog() {
  landingCreateModal?.classList.add("hidden");
}

function confirmLandingCreate() {
  const name = landingCreateNameInput?.value.trim() || "";
  if (!name) {
    window.alert("请输入落地页名称");
    landingCreateNameInput?.focus();
    return;
  }
  const businessTypeComment = getLandingBusinessLabel(landingCreateBusinessInput?.value || "");
  closeLandingCreateDialog();
  openLandingForm("create", null, {
    name,
    businessTypeComment,
    pageKey: makeLandingPageKey(name),
  });
}

function filteredLocalLandingItems() {
  return localLandingItems
    .filter((item) => !state.landingFilters.name || item.name.includes(state.landingFilters.name))
    .sort((a, b) => (a.createTime > b.createTime ? -1 : 1));
}

function renderLandingFilters() {
  if (landingSearchName) landingSearchName.value = state.landingFilters.name;
}

function renderLandingOverview(totalCount, list) {
  if (landingMetricTotal) landingMetricTotal.textContent = String(totalCount || 0);
  const latest = (list || [])
    .map((item) => item.createTime)
    .filter(Boolean)
    .sort((a, b) => (a < b ? 1 : -1))[0];
  if (landingMetricUpdated) landingMetricUpdated.textContent = latest ? `最近创建 ${latest}` : "最近暂无更新";
  if (landingMetricSummary) {
    const bits = [];
    if (state.landingFilters.name) bits.push(`名称：${state.landingFilters.name}`);
    landingMetricSummary.textContent = bits.length ? bits.join(" / ") : "全部落地页";
  }
}

function getLandingConfigSummary(record) {
  const config = record.config || parseLandingContent(record.content) || {};
  const components = getLandingComponents(config);
  const materialCount = Array.isArray(config.materials) ? config.materials.length : 0;
  const hotzoneCount = components
    .filter((component) => component.type === "image")
    .reduce((sum, component) => sum + (component.hotzones || []).length, 0);
  const title = config.hero?.title || record.name || "未配置标题";
  const mode = config.renderer?.mode || "dynamic-json";
  return `${title} / ${mode} / 组件 ${components.length} 个 / 热区 ${hotzoneCount} 个 / 素材 ${materialCount} 个`;
}

function renderLandingTable() {
  if (!landingTableBody) return;
  const allList = isApiMode() ? landingItems : filteredLocalLandingItems();
  let totalCount = allList.length;
  let totalPage = Math.max(1, Math.ceil(totalCount / state.pageSize));
  let list = allList;
  if (isApiMode()) {
    totalCount = state.landingApiTotal || allList.length;
    totalPage = Math.max(1, state.landingApiPages || Math.ceil(totalCount / state.pageSize));
  } else {
    if (state.pageCurrent > totalPage) {
      state.pageCurrent = totalPage;
      return renderLandingTable();
    }
    const start = (state.pageCurrent - 1) * state.pageSize;
    list = allList.slice(start, start + state.pageSize);
  }

  state.totalPages = totalPage;
  landingTableBody.innerHTML = "";
  list.forEach((record) => {
    const row = normalizeLandingRecord(record);
    const safeH5Url = row.h5Url ? escapeHtml(row.h5Url) : "";
    const configIdentity = getLandingConfigIdentity(row) || "-";
    const canCopyConfigIdentity = configIdentity && configIdentity !== "-";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(row.id ?? "-")}</td>
      <td>${escapeHtml(row.name || "-")}</td>
      <td>${escapeHtml(row.businessTypeComment || "-")}</td>
      <td><a class="landing-url-link" href="${safeH5Url || "#"}" target="_blank" rel="noreferrer">${safeH5Url || "-"}</a></td>
      <td>
        <span class="landing-config-id" title="${escapeHtml(configIdentity)}">${escapeHtml(configIdentity)}</span>
        ${canCopyConfigIdentity ? '<button class="link landing-copy-id" type="button">复制</button>' : ""}
      </td>
      <td>${escapeHtml(row.createTime || "-")}</td>
      <td>
        <div class="op-btns">
          <button class="link landing-detail">查看</button>
          <button class="link landing-edit">编辑</button>
          <button class="link landing-copy">复制</button>
          <button class="link landing-copy-url">复制链接</button>
        </div>
      </td>
    `;
    tr.querySelector(".landing-detail")?.addEventListener("click", () => openLandingForm("detail", row.id));
    tr.querySelector(".landing-edit")?.addEventListener("click", () => openLandingForm("edit", row.id));
    tr.querySelector(".landing-copy")?.addEventListener("click", () => openLandingForm("copy", row.id));
    tr.querySelector(".landing-copy-id")?.addEventListener("click", async () => {
      try {
        await copyTextToClipboard(configIdentity);
        showToast("唯一 id 已复制", "success");
      } catch (_) {
        window.alert("复制失败，请手动复制唯一 id");
      }
    });
    tr.querySelector(".landing-copy-url")?.addEventListener("click", async () => {
      try {
        await copyTextToClipboard(row.h5Url);
        showToast("H5 链接已复制", "success");
      } catch (_) {
        window.alert("复制失败，请手动复制链接");
      }
    });
    landingTableBody.appendChild(tr);
  });
  updatePagerDisplay(totalPage, totalCount);
  renderDataSourceTag();
  renderEnvSwitch();
  renderLandingOverview(totalCount, isApiMode() ? landingItems : filteredLocalLandingItems());
  setupTableDragScroll();
}

async function refreshLandingPage(options = {}) {
  const { showErrorAlert = true } = options;
  try {
    if (isApiMode()) {
      await queryLandingItems();
    } else {
      syncLandingItemsWithSource();
    }
    renderLandingTable();
    return { ok: true };
  } catch (error) {
    if (showErrorAlert) window.alert(`领取落地页加载失败：${error.message}`);
    return { ok: false, error };
  }
}

async function applyLandingQuery() {
  state.pageCurrent = 1;
  state.landingFilters.name = landingSearchName?.value.trim() || "";
  await refreshLandingPage();
}

function setLandingSaving(isSaving) {
  state.landingSaving = isSaving;
  if (!saveLandingBtn) return;
  saveLandingBtn.disabled = isSaving;
  saveLandingBtn.textContent = isSaving ? "保存中..." : "保存配置";
}

function blurLandingActiveControl() {
  const active = document.activeElement;
  if (!active || !landingFormView?.contains(active) || typeof active.blur !== "function") return;
  active.blur();
}

function prepareLandingPublishDraft() {
  const name = landingNameInput?.value.trim() || "";
  if (!name) {
    window.alert("落地页名称必填");
    return null;
  }
  const selectedComponent = getLandingSelectedComponent();
  if (selectedComponent?.type === "button" && !updateLandingSelectedButtonFromInputs()) {
    return null;
  }
  if (getLandingHotzoneWithParent(state.landingEditorSelectedId, getLandingComponents(state.landingForm?.config))) {
    if (!updateLandingSelectedHotspotFromInputs({ render: false, syncRect: false })) {
      window.alert("当前热区配置未保存，请检查热区 ID 是否为空或重复");
      return null;
    }
  }
  state.landingH5BaseUrl = landingH5BaseFormInput?.value.trim() || state.landingH5BaseUrl || getStoredLandingH5Base();
  const config = getLandingFormConfigFromInputs();
  const duplicateControl = findLandingDuplicateControlId(config.components);
  if (duplicateControl) {
    if (duplicateControl.second?.id) state.landingEditorSelectedId = duplicateControl.second.id;
    renderLandingEditor();
    if (duplicateControl.empty) {
      window.alert(`${getLandingControlLabel(duplicateControl.second)} ID 不能为空`);
    } else {
      window.alert(`${getLandingControlLabel(duplicateControl.first)}和${getLandingControlLabel(duplicateControl.second)}的 ID「${duplicateControl.id}」不能重复`);
    }
    return null;
  }
  const overlap = findLandingOverlappingHotzones(config.components);
  if (overlap) {
    state.landingEditorSelectedId = overlap.first.id;
    renderLandingEditor();
    window.alert(`${overlap.image.name || "图片组件"}中的${overlap.first.name || "热区"}和${overlap.second.name || "热区"}不能重叠`);
    return null;
  }
  const invalidButton = findLandingInvalidButtonOverlap(config.components);
  if (invalidButton) {
    state.landingEditorSelectedId = invalidButton.id;
    renderLandingEditor();
    window.alert("吸顶、吸底、跟随滑动模式下，按钮不能与背景图重叠");
    return null;
  }
  const isEdit = state.landingFormMode === "edit";
  const pageKey = config.pageKey || normalizeLandingPageKey(landingPageKeyInput?.value || name);
  const fileBaseName = safeFileName(pageKey || name, "landing-page");
  const jsonFileName = getLandingConfigJsonName(config.renderer?.configJsonUrl || fileBaseName);
  const h5Url = buildLandingH5Url({
    id: isEdit ? state.landingEditingId : null,
    pageKey,
    configJsonUrl: jsonFileName,
    baseUrl: state.landingH5BaseUrl,
  });
  const configForDownload = getLandingFormConfigFromInputs({
    configJsonUrl: jsonFileName,
    h5Url,
    landingPageId: isEdit ? state.landingEditingId : null,
  });
  const payload = {
    id: isEdit ? state.landingEditingId : undefined,
    name,
    businessTypeComment: landingBusinessInput?.value.trim() || "",
    content: "",
    h5Url,
  };
  return {
    isEdit,
    name,
    pageKey,
    fileBaseName,
    jsonFileName,
    payload,
    config: configForDownload,
    html: buildLandingRendererHtml(),
  };
}

function openLandingPublishModal(draft) {
  state.landingPublishDraft = draft;
  if (landingPublishHtmlPreview) landingPublishHtmlPreview.textContent = draft.html;
  if (landingPublishJsonPreview) landingPublishJsonPreview.textContent = JSON.stringify(draft.config, null, 2);
  if (landingPublishHtmlName) landingPublishHtmlName.textContent = `${draft.fileBaseName}.html`;
  if (landingPublishJsonName) landingPublishJsonName.textContent = draft.jsonFileName;
  if (landingPublishResult) {
    landingPublishResult.textContent = "";
    landingPublishResult.classList.add("hidden");
  }
  landingPublishModal?.classList.remove("hidden");
}

function closeLandingPublishDialog(force = false) {
  if (state.landingSaving && !force) return;
  landingPublishModal?.classList.add("hidden");
}

async function saveLandingPage() {
  if (state.landingSaving || !state.landingForm) return;
  try {
    blurLandingActiveControl();
    const draft = prepareLandingPublishDraft();
    if (!draft) return;
    openLandingPublishModal(draft);
  } catch (error) {
    console.error("保存领取落地页配置失败", error);
    window.alert(`保存配置失败：${error.message || error}`);
  }
}

async function confirmLandingPublish() {
  const draft = state.landingPublishDraft;
  if (!draft || state.landingSaving) return;

  try {
    setLandingSaving(true);
    if (confirmLandingPublishBtn) {
      confirmLandingPublishBtn.disabled = true;
      confirmLandingPublishBtn.textContent = "上传中...";
    }
    if (landingPublishResult) {
      landingPublishResult.textContent = "正在准备发布数据...";
      landingPublishResult.classList.remove("hidden");
    }

    let publishId = draft.isEdit ? state.landingEditingId : null;
    if (!publishId && !isApiMode()) {
      publishId = draft.isEdit ? state.landingEditingId : Date.now();
    }

    const configJsonUrl = getLandingConfigJsonName(draft.jsonFileName || draft.pageKey || publishId || "landing-page");
    const configJsonOssUrl = `${LANDING_OSS_CONFIG.endpoint}/${LANDING_OSS_CONFIG.configDirectory}${configJsonUrl}`;
    const finalH5Url = buildLandingH5Url({
      id: publishId,
      pageKey: draft.pageKey,
      configJsonUrl,
      baseUrl: state.landingH5BaseUrl,
    });
    let finalConfig = getLandingFormConfigFromInputs({
      configJsonUrl,
      h5Url: finalH5Url,
      landingPageId: publishId,
    });
    finalConfig.dataSource = {
      ...(finalConfig.dataSource || {}),
      type: "oss-json",
      configJsonUrl,
    };
    finalConfig.publish = {
      ...(finalConfig.publish || {}),
      h5Url: finalH5Url,
      configJsonUrl,
      configJsonOssUrl,
      htmlFileName: `${draft.fileBaseName}.html`,
      jsonFileName: configJsonUrl,
    };
    if (landingPublishResult) landingPublishResult.textContent = "正在上传 JSON 到 OSS...";
    let configUploadResult = await uploadLandingJsonToOss({
      config: finalConfig,
      pageKey: draft.pageKey,
      fileName: configJsonUrl,
    });
    const payload = {
      ...draft.payload,
      content: configUploadResult.url,
      h5Url: finalH5Url,
    };
    rememberLandingH5BaseUrl(state.landingH5BaseUrl);

    if (isApiMode()) {
      const apiPayload = {
        ...payload,
        content: configUploadResult.url,
        h5Url: finalH5Url,
      };
      if (publishId) apiPayload.id = publishId;
      const savedData = await landingApiRequest("/sae-gateway/kkhc-bizcenter-app/landingPage/landingPageSave", {
        method: "POST",
        body: apiPayload,
      });
      let savedId = getLandingSavedId(savedData);
      if (!savedId && !draft.isEdit) {
        savedId = await findSavedLandingPageId({ name: draft.name, h5Url: finalH5Url });
      }
      if (savedId && String(savedId) !== String(publishId || "")) {
        publishId = savedId;
        finalConfig = {
          ...finalConfig,
          landingPageId: publishId,
          dataSource: {
            ...(finalConfig.dataSource || {}),
            landingPageId: publishId,
          },
          publish: {
            ...(finalConfig.publish || {}),
            landingPageId: publishId,
          },
        };
        if (landingPublishResult) landingPublishResult.textContent = "正在回写落地页 ID 到 JSON...";
        configUploadResult = await uploadLandingJsonToOss({
          config: finalConfig,
          pageKey: draft.pageKey,
          fileName: configJsonUrl,
        });
        await landingApiRequest("/sae-gateway/kkhc-bizcenter-app/landingPage/landingPageSave", {
          method: "POST",
          body: {
            ...apiPayload,
            id: publishId,
            content: configUploadResult.url,
            h5Url: finalH5Url,
          },
        });
      }
      showToast("领取落地页配置已保存", "success");
      closeLandingPublishDialog(true);
      goLandingList();
      return;
    }

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const localConfig = {
      ...finalConfig,
      landingPageId: publishId,
      h5Url: finalH5Url,
      publish: {
        ...(finalConfig.publish || {}),
        h5Url: finalH5Url,
        configJsonUrl,
        configJsonOssUrl: configUploadResult.url,
      },
    };
    const localRecord = normalizeLandingRecord({
      ...payload,
      id: publishId,
      content: configUploadResult.url,
      h5Url: finalH5Url,
      creator: state.authUser?.username || "admin",
      createTime: draft.isEdit ? (state.landingForm.createTime || now) : now,
    });
    if (draft.isEdit) {
      const idx = localLandingItems.findIndex((item) => String(item.id) === String(state.landingEditingId));
      if (idx >= 0) localLandingItems[idx] = localRecord;
    } else {
      localLandingItems.unshift(localRecord);
    }
    showToast("本地领取落地页配置已保存", "success");
    closeLandingPublishDialog(true);
    goLandingList();
  } catch (error) {
    window.alert(`发布失败：${error.message}`);
    if (landingPublishResult) {
      landingPublishResult.textContent = `发布失败：${error.message}`;
      landingPublishResult.classList.remove("hidden");
    }
  } finally {
    setLandingSaving(false);
    if (confirmLandingPublishBtn) {
      confirmLandingPublishBtn.disabled = false;
      confirmLandingPublishBtn.textContent = "确认上传并保存";
    }
  }
}

function syncLandingPageKeyFromName() {
  if (!landingNameInput || !landingPageKeyInput || state.landingFormMode === "detail") return;
  landingPageKeyInput.value = makeLandingPageKey(landingNameInput.value);
  state.landingPageKeyManuallyEdited = false;
}

function syncLandingHeroTitleFromName() {
  if (!landingNameInput || !landingHeroTitleInput || state.landingFormMode === "detail") return;
  landingHeroTitleInput.value = landingNameInput.value.trim();
  state.landingLastNameValue = landingNameInput.value;
  state.landingHeroTitleManuallyEdited = false;
}

function syncViewState() {
  ensureCurrentViewAccessible();
  const isRulesView = state.currentView === "rules";
  const isFeedbackView = state.currentView === "feedback";
  const isLandingView = state.currentView === "landing";
  const isH5ActivityView = state.currentView === "h5Activity";
  const isPianoPracticeView = state.currentView === "pianoPractice";
  const isShareMaterialsView = state.currentView === "shareMaterials";
  const isPushToolView = state.currentView === "pushTool";
  const titles = {
    rules: {
      title: "自定义人群包",
      subtitle: "规则列表、状态管理、条件配置与 SQL 编辑",
    },
    feedback: {
      title: "问题反馈",
      subtitle: "用户反馈列表、日志下载与状态流转",
    },
    landing: {
      title: "领取落地页配置",
      subtitle: "配置 JSON、素材 URL 与动态 H5 链接管理",
    },
    h5Activity: {
      title: "H5 活动配置",
      subtitle: "配置活动样式、分享素材与互动字段",
    },
    pianoPractice: {
      title: "钢琴练习工具",
      subtitle: "曲目管理、练习记录与全局音源配置",
    },
    shareMaterials: {
      title: "作业分享素材",
      subtitle: "大树等级图片与华彩豆文案配置",
    },
    pushTool: {
      title: "Push 发送工具",
      subtitle: "上传 Excel 批量推送消息，支持定时发送与演练模式",
    },
  };
  pageTitle.textContent = titles[state.currentView].title;
  pageSubtitle.textContent = titles[state.currentView].subtitle;
  rulesPage.classList.toggle("hidden", !isRulesView);
  feedbackPage.classList.toggle("hidden", !isFeedbackView);
  landingPage?.classList.toggle("hidden", !isLandingView);
  h5ActivityPage?.classList.toggle("hidden", !isH5ActivityView);
  pianoPracticePage?.classList.toggle("hidden", !isPianoPracticeView);
  shareMaterialsPage?.classList.toggle("hidden", !isShareMaterialsView);
  pushToolPage?.classList.toggle("hidden", !isPushToolView);
  if (isH5ActivityView) syncH5ActivityFrame();
  if (isPianoPracticeView) syncPianoPracticeFrame();
  if (isPushToolView) syncPushToolFrame();
  if (!isRulesView) formView.classList.add("hidden");
  if (!isLandingView) {
    landingFormView?.classList.add("hidden");
    landingOverview?.classList.remove("hidden");
    landingListView?.classList.remove("hidden");
  }
  createBtn.classList.toggle("hidden", !isRulesView);
  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === state.currentView);
  });
}

function switchView(view) {
  if (!canAccessView(view)) return;
  state.currentView = view;
  if (view === "feedback") {
    formView.classList.add("hidden");
    listView.classList.remove("hidden");
    landingFormView?.classList.add("hidden");
    landingOverview?.classList.remove("hidden");
    landingListView?.classList.remove("hidden");
    resetFormMode();
    renderFeedbackFilters();
    if (isApiMode()) {
      queryFeedbackItems().finally(() => renderFeedbackTable());
    } else {
      syncFeedbackItemsWithSource();
      renderFeedbackTable();
    }
  } else if (view === "landing") {
    formView.classList.add("hidden");
    listView.classList.remove("hidden");
    landingFormView?.classList.add("hidden");
    landingOverview?.classList.remove("hidden");
    landingListView?.classList.remove("hidden");
    resetFormMode();
    renderLandingFilters();
    refreshLandingPage();
  } else if (view === "shareMaterials") {
    formView.classList.add("hidden");
    listView.classList.remove("hidden");
    landingFormView?.classList.add("hidden");
    landingOverview?.classList.remove("hidden");
    landingListView?.classList.remove("hidden");
    resetFormMode();
    refreshShareMaterials();
  } else if (view === "h5Activity") {
    formView.classList.add("hidden");
    listView.classList.remove("hidden");
    landingFormView?.classList.add("hidden");
    landingOverview?.classList.remove("hidden");
    landingListView?.classList.remove("hidden");
    resetFormMode();
    syncH5ActivityFrame();
  } else if (view === "pianoPractice") {
    formView.classList.add("hidden");
    listView.classList.remove("hidden");
    landingFormView?.classList.add("hidden");
    landingOverview?.classList.remove("hidden");
    landingListView?.classList.remove("hidden");
    resetFormMode();
    syncPianoPracticeFrame();
  } else if (view === "pushTool") {
    formView.classList.add("hidden");
    listView.classList.add("hidden");
    landingFormView?.classList.add("hidden");
    landingOverview?.classList.remove("hidden");
    landingListView?.classList.remove("hidden");
    resetFormMode();
    syncPushToolFrame();
  } else {
    landingFormView?.classList.add("hidden");
    landingOverview?.classList.remove("hidden");
    landingListView?.classList.remove("hidden");
    renderOverview();
    refreshByDataSource();
  }
  syncViewState();
}

function highlightSql(raw) {
  const escaped = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const keywords = [
    "SELECT", "DISTINCT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "NOT IN",
    "BETWEEN", "LIKE", "IS", "NULL", "AS", "ON", "JOIN", "LEFT", "RIGHT",
    "INNER", "OUTER", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
    "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP", "TABLE", "INDEX",
    "UNION", "ALL", "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END", "COUNT",
    "SUM", "AVG", "MIN", "MAX", "CAST",
  ];
  let result = escaped;
  keywords.forEach((kw) => {
    const re = new RegExp(`\\b(${kw})\\b`, "gi");
    result = result.replace(re, '<span class="sql-kw">$1</span>');
  });
  result = result.replace(/(--[^\n]*)/g, '<span class="sql-comment">$1</span>');
  result = result.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="sql-str">$1</span>');
  result = result.replace(/\b(\d+(?:\.\d+)?)\b(?![^<]*>)/g, '<span class="sql-num">$1</span>');
  return result;
}

function openSqlModal(sql) {
  const text = sql || "-- SQL 为空";
  sqlModalContent.innerHTML = highlightSql(text);
  sqlModal.classList.remove("hidden");
}

function closeSqlModal() {
  sqlModal.classList.add("hidden");
}

function isApiMode() {
  return state.dataSource === "api";
}

function activeFeatureMeta() {
  return state.apiFeatureMeta?.length ? state.apiFeatureMeta : featureMetaLocal;
}

function filteredLocalRules() {
  return localRules
    .filter((it) => !state.searchName || it.name.includes(state.searchName))
    .filter((it) => state.statusFilters.length === 0 || state.statusFilters.includes(String(it.status)))
    .sort((a, b) => (a.lastUpdateTime > b.lastUpdateTime ? -1 : 1));
}

function displayRules() {
  if (isApiMode()) return state.apiRules;
  const list = filteredLocalRules();
  const start = (state.pageCurrent - 1) * state.pageSize;
  return list.slice(start, start + state.pageSize);
}

function renderDataSourceTag() {
  const envLabel = API_ENV_CONFIG[state.apiEnv]?.label || API_ENV_CONFIG.prod.label;
  dataSourceTag.textContent = `当前：${isApiMode() ? `接口数据 · ${envLabel}` : "本地数据"}`;
  dataSourceToggleBtn.textContent = isApiMode() ? "切换到本地数据" : "切换到接口数据";
}

function renderEnvSwitch() {
  [testEnvBtn, prodEnvBtn].forEach((btn) => {
    if (!btn) return;
    const isActive = btn.dataset.env === state.apiEnv;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function syncH5ActivityFrame() {
  if (!h5ActivityFrame) return;
  const nextSrc = `./h5-activity-config.html?env=${encodeURIComponent(state.apiEnv)}`;
  const currentSrc = h5ActivityFrame.getAttribute("src") || "";
  if (currentSrc !== nextSrc) h5ActivityFrame.setAttribute("src", nextSrc);
}

const PUSH_TOOL_PATH = "./push-tool/index.html";
const PUSH_TOOL_VERSION = "202607011620";
function getFrameMessageTargetOrigin() {
  return window.location.protocol === "file:" || window.location.origin === "null"
    ? "*"
    : window.location.origin;
}

function postThemeToFrame(frame) {
  frame?.contentWindow?.postMessage({
    type: "kkhc-theme-change",
    theme: state.theme,
  }, getFrameMessageTargetOrigin());
}

function postPushToolConfigToFrame() {
  pushToolFrame?.contentWindow?.postMessage({
    type: "kkhc-push-tool-config",
    theme: state.theme,
    env: state.apiEnv,
  }, getFrameMessageTargetOrigin());
}

function syncPushToolFrame() {
  if (!pushToolFrame) return;
  const nextSrc = `${PUSH_TOOL_PATH}?theme=${encodeURIComponent(state.theme)}&env=${encodeURIComponent(state.apiEnv)}&v=${PUSH_TOOL_VERSION}`;
  const currentSrc = pushToolFrame.getAttribute("src") || "";
  let isCurrentPushTool = false;
  try {
    const currentUrl = new URL(currentSrc, window.location.href);
    isCurrentPushTool = currentUrl.pathname.endsWith("/push-tool/index.html")
      && currentUrl.searchParams.get("v") === PUSH_TOOL_VERSION
      && currentUrl.searchParams.get("env") === state.apiEnv;
  } catch (error) {
    isCurrentPushTool = false;
  }
  if (!isCurrentPushTool) {
    pushToolFrame.setAttribute("src", nextSrc);
    return;
  }
  postPushToolConfigToFrame();
}

function syncPianoPracticeFrame() {
  if (!pianoPracticeFrame) return;
  const nextSrc = `./piano-practice-admin/index.html?embed=desktop&theme=${encodeURIComponent(state.theme)}`;
  const currentSrc = pianoPracticeFrame.getAttribute("src") || "";
  if (currentSrc !== nextSrc) {
    pianoPracticeFrame.setAttribute("src", nextSrc);
    return;
  }
  postThemeToFrame(pianoPracticeFrame);
}

function applyTheme() {
  document.body.classList.toggle("theme-light", state.theme === "light");
  syncPianoPracticeFrame();
  syncPushToolFrame();
  if (!themeToggleBtn) return;
  themeToggleBtn.textContent = state.theme === "light" ? "切换到暗黑模式" : "切换到浅色模式";
  themeToggleBtn.setAttribute("aria-pressed", state.theme === "light" ? "true" : "false");
}

function renderOverview() {
  if (state.currentView !== "rules") return;
  const allRules = isApiMode() ? state.apiRules : filteredLocalRules();
  const totalCount = isApiMode() ? state.apiTotal : allRules.length;
  const enabledCount = allRules.filter((item) => Number(item.status) === 1).length;
  const disabledCount = allRules.filter((item) => Number(item.status) !== 1).length;
  const envLabel = API_ENV_CONFIG[state.apiEnv]?.label || API_ENV_CONFIG.prod.label;

  if (metricDataSource) metricDataSource.textContent = isApiMode() ? "接口数据" : "本地数据";
  if (metricEnv) metricEnv.textContent = isApiMode() ? `${envLabel}环境` : "本地预览";
  if (metricTotalRules) metricTotalRules.textContent = String(totalCount);
  if (metricPageState) metricPageState.textContent = `第 ${state.pageCurrent} / ${state.totalPages || 1} 页`;
  if (metricEnabledRules) metricEnabledRules.textContent = String(enabledCount);
  if (metricDisabledRules) metricDisabledRules.textContent = `禁用 ${disabledCount} 条`;
  if (metricViewMode) metricViewMode.textContent = listView.classList.contains("hidden") ? "编辑视图" : "列表视图";
  if (metricSummary) {
    if (state.searchName) {
      metricSummary.textContent = `关键词：${state.searchName}`;
    } else if (state.statusFilters.length) {
      metricSummary.textContent = `状态筛选：${state.statusFilters.map((v) => (v === "1" ? "启用" : "禁用")).join(" / ")}`;
    } else {
      metricSummary.textContent = "全部";
    }
  }
}

function toValueObj(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === "object") {
    return { code: String(val.code ?? val.name ?? ""), name: String(val.name ?? val.code ?? "") };
  }
  const s = String(val);
  return { code: s, name: s };
}

function toValueListObj(list) {
  if (!Array.isArray(list)) return null;
  return list.map((v) => toValueObj(v)).filter(Boolean);
}

function getSqlPreviewText(sql) {
  const text = String(sql || "").replace(/\s+/g, " ").trim();
  if (!text) return "-- SQL 为空";
  return text.length > 60 ? `${text.slice(0, 60)}...` : text;
}

function getOpOptions(meta) {
  const ops = meta?.supportOps || [];
  if (!Array.isArray(ops) || ops.length === 0) return [];
  if (typeof ops[0] === "string") {
    return ops.map((op) => ({ code: op, name: op }));
  }
  return ops.map((op) => ({
    code: String(op.code ?? op.name ?? ""),
    name: String(op.name ?? op.code ?? ""),
  }));
}

function getOpMeta(meta, opCode) {
  const ops = getOpOptions(meta);
  return ops.find((op) => String(op.code) === String(opCode)) || ops[0] || { code: opCode || "", name: opCode || "" };
}

function isListOperator(meta, opCode) {
  const op = getOpMeta(meta, opCode);
  const tokens = [op.code, op.name].map((x) => String(x || "").trim().toUpperCase());
  return tokens.some((token) => ["IN", "NOT_IN", "INCLUDE", "EXCLUDE", "CONTAINS", "NOT_CONTAINS"].includes(token))
    || [op.code, op.name].some((token) => ["包含", "不包含"].includes(String(token || "").trim()));
}

function apiConditionToInternal(apiCond) {
  if (!apiCond) return null;
  // 如果已经是内部结构，直接返回
  if (apiCond.invert !== undefined && apiCond.featureCode && apiCond.op) return apiCond;

  const invert = apiCond.isPositiveFlag === false;
  const featureName = apiCond.featureName || "";
  let featureCode = apiCond.featureCode || "";
  if (!featureCode && featureName) {
    const metaList = state.apiFeatureMeta?.length ? state.apiFeatureMeta : featureMetaLocal;
    const meta = metaList.find((m) => m.featureName === featureName);
    featureCode = meta?.featureCode || "";
  }

  return {
    invert,
    featureCode,
    op: apiCond.operateCode || apiCond.op || "",
    value: apiCond.value ? toValueObj(apiCond.value) : null,
    valueList: apiCond.valueList ? toValueListObj(apiCond.valueList) : null,
  };
}

function internalConditionToApi(cond) {
  const meta = getFeatureMeta(cond.featureCode) || {};
  const isListOp = isListOperator(meta, cond.op);
  const opMeta = getOpMeta(meta, cond.op);
  const valueObj = toValueObj(cond.value) || { code: "", name: "" };
  const valueListObj = toValueListObj(cond.valueList) || [];
  return {
    isPositiveFlag: !cond.invert,
    featureCode: cond.featureCode,
    featureName: meta.featureName || cond.featureCode,
    operateCode: cond.op,
    operateName: opMeta.name || cond.op,
    value: isListOp ? null : valueObj,
    valueList: isListOp ? valueListObj : null,
  };
}

function isBlankValueObj(value) {
  const obj = toValueObj(value);
  return !obj || !String(obj.code || "").trim();
}

function validateConditions() {
  if (state.useSqlMode) return true;
  if (!state.form.conditions.length) {
    window.alert("请至少配置一个条件");
    return false;
  }

  for (let idx = 0; idx < state.form.conditions.length; idx += 1) {
    const cond = state.form.conditions[idx];
    const meta = getFeatureMeta(cond.featureCode);
    const featureName = meta?.featureName || cond.featureCode || "条件";

    if (isListOperator(meta, cond.op)) {
      const values = Array.isArray(cond.valueList) ? cond.valueList.filter((item) => !isBlankValueObj(item)) : [];
      if (!values.length) {
        window.alert(`请为条件「${featureName}」选择值`);
        return false;
      }
    } else if (isBlankValueObj(cond.value)) {
      window.alert(`请为条件「${featureName}」选择或填写值`);
      return false;
    }
  }

  return true;
}

function renderTable() {
  if (!canAccessView("rules")) return;
  const pageList = displayRules();
  ruleTableBody.innerHTML = "";
  pageList.forEach((row) => {
    const tr = document.createElement("tr");
    const sqlPreview = getSqlPreviewText(row.ruleSql);
    tr.innerHTML = `
      <td>${row.ruleCode}</td>
      <td>${row.name}</td>
      <td><span class="sql-preview" title="${row.ruleSql}">${sqlPreview}</span> <button class="link show-sql">查看</button></td>
      <td><span class="pill ${row.status === 1 ? "on" : "off"}">${statusText(row.status)}</span></td>
      <td>${row.lastUpdateEmpName}</td>
      <td>${row.lastUpdateTime}</td>
      <td>${row.userCount}</td>
      <td><div class="op-btns"></div></td>
    `;
    const opBox = tr.querySelector(".op-btns");
    const onOps = [
      ["查看", () => openForm("detail", row.id)],
      ["禁用", () => changeStatus(row.id, 2)],
      ["复制", () => openForm("copy", row.id)],
    ];
    const offOps = [
      ["编辑", () => openForm("edit", row.id)],
      ["启用", () => changeStatus(row.id, 1)],
      ["删除", () => removeRule(row.id)],
      ["复制", () => openForm("copy", row.id)],
    ];
    (row.status === 1 ? onOps : offOps).forEach(([name, fn]) => {
      const btn = document.createElement("button");
      btn.className = "link";
      btn.textContent = name;
      btn.addEventListener("click", fn);
      opBox.appendChild(btn);
    });
    tr.querySelector(".show-sql").addEventListener("click", () => openSqlModal(row.ruleSql));
    ruleTableBody.appendChild(tr);
  });
  const totalCount = isApiMode() ? state.apiTotal : filteredLocalRules().length;
  const totalPage = Math.max(1, Math.ceil(totalCount / state.pageSize));
  state.totalPages = totalPage;
  if (state.pageCurrent > totalPage) {
    state.pageCurrent = totalPage;
    return renderTable();
  }
  updatePagerDisplay(totalPage, totalCount);
  renderDataSourceTag();
  renderEnvSwitch();
  renderOverview();
  setupTableDragScroll();
}

function normalizeRule(row) {
  return {
    id: row.id,
    ruleCode: row.ruleCode || row.code || "",
    name: row.name || "",
    ruleSql: row.ruleSql || row.packageSql || "",
    status: Number(row.status || 2),
    userCount: row.userCount ?? "0",
    lastUpdateEmpName: row.lastUpdateEmpName || "admin",
    lastUpdateTime: (row.lastUpdateTime || "").replace("T", " ").slice(0, 19),
    // 详情接口返回的 conditions 是 API 结构；转换成内部结构后才能渲染/保存
    conditions: Array.isArray(row.conditions) ? row.conditions.map(apiConditionToInternal).filter(Boolean) : [],
  };
}

async function apiRequest(path, options = {}) {
  const apiBase = API_ENV_CONFIG[state.apiEnv]?.baseUrl || API_ENV_CONFIG.prod.baseUrl;
  const resp = await fetch(`${apiBase}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const json = await resp.json();
  if (!resp.ok || json.status !== 200) {
    throw new Error(json.message || "接口请求失败");
  }
  return json.data;
}

async function feedbackApiRequest(path, options = {}) {
  const apiBase = API_ENV_CONFIG[state.apiEnv]?.feedbackBaseUrl || API_ENV_CONFIG.prod.feedbackBaseUrl;
  const resp = await fetch(`${apiBase}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const json = await resp.json();
  if (!resp.ok || json.status !== 200) {
    throw new Error(json.message || "反馈查询接口请求失败");
  }
  return json.data;
}

function buildFeedbackQueryBody(overrides = {}) {
  const body = {
    pageCurrent: state.pageCurrent,
    pageSize: state.pageSize,
    isAsc: false,
    sortField: "updateTime",
    ...overrides,
  };
  if (state.feedbackFilters.unionId) body.unionId = state.feedbackFilters.unionId;
  if (state.feedbackFilters.version) body.appVersionList = [state.feedbackFilters.version];
  if (state.feedbackFilters.description) body.userDesc = state.feedbackFilters.description;
  if (state.feedbackFilters.remark) body.comment = state.feedbackFilters.remark;
  if (state.feedbackFilters.brands.length) body.brand = state.feedbackFilters.brands[0];
  if (state.feedbackFilters.uploadDateStart) body.createTimeBegin = `${state.feedbackFilters.uploadDateStart} 00:00:00`;
  if (state.feedbackFilters.uploadDateEnd) body.createTimeEnd = `${state.feedbackFilters.uploadDateEnd} 23:59:59`;
  if (state.feedbackFilters.updateDateStart) body.updateTimeBegin = state.feedbackFilters.updateDateStart;
  if (state.feedbackFilters.updateDateEnd) body.updateTimeEnd = state.feedbackFilters.updateDateEnd;
  if (state.feedbackFilters.statuses.length) {
    const statusCodes = state.feedbackFilters.statuses
      .map((status) => feedbackStatusToCode(status))
      .filter((code) => code !== null);
    if (statusCodes.length) body.problemClassificationList = statusCodes;
  }
  return body;
}

function normalizeFeedbackRecord(item) {
  return {
    id: Number(item.id) || Date.now() + Math.random(),
    unionId: String(item.unionId || ""),
    version: String(item.appVersion || ""),
    platform: String(item.platform || ""),
    brand: String(item.brand || ""),
    description: String(item.userDesc || ""),
    status: feedbackCodeToStatus(Number(item.problemClassification)),
    uploadTime: String(item.createTime || ""),
    updateTime: String(item.updateTime || item.createTime || ""),
    remark: String(item.comment || ""),
    logUrl: String(item.logUrl || ""),
    problemClassification: Number(item.problemClassification ?? -1),
  };
}

async function queryFeedbackPage({ pageCurrent = state.pageCurrent, pageSize = state.pageSize } = {}) {
  const data = await feedbackApiRequest("/sae-gateway/kkhc-bizcenter-app/appUploadLog/pageQueryAppUploadLog", {
    method: "POST",
    body: buildFeedbackQueryBody({ pageCurrent, pageSize }),
  });

  return {
    current: Number(data?.current || pageCurrent || 1),
    total: Number(data?.total || 0),
    pageSize: Number(data?.size || pageSize || state.pageSize || 18),
    pages: Math.max(0, Number(data?.pages || 0)),
    records: Array.isArray(data?.records) ? data.records.map(normalizeFeedbackRecord) : [],
  };
}

async function queryFeedbackOverview(forceRefresh = false) {
  const overviewKey = getFeedbackOverviewKey();
  if (!forceRefresh && state.feedbackOverviewKey === overviewKey) {
    return state.feedbackApiOverview;
  }

  const firstPage = await queryFeedbackPage({ pageCurrent: 1, pageSize: Math.max(100, state.pageSize) });
  const total = firstPage.total;
  const pageSize = Math.max(1, firstPage.pageSize || Math.max(100, state.pageSize));
  let allRecords = firstPage.records.slice();

  for (let page = 2; allRecords.length < total; page += 1) {
    const nextPage = await queryFeedbackPage({ pageCurrent: page, pageSize });
    if (!nextPage.records.length) break;
    allRecords = allRecords.concat(nextPage.records);
  }

  state.feedbackApiOverview = buildFeedbackOverview(allRecords, total);
  state.feedbackOverviewKey = overviewKey;
  return state.feedbackApiOverview;
}

async function queryFeedbackItems(options = {}) {
  const { refreshOverview = false } = options;
  const data = await queryFeedbackPage({ pageCurrent: state.pageCurrent, pageSize: state.pageSize });
  state.feedbackApiTotal = data.total;
  state.feedbackApiPages = Math.max(1, data.pages || Math.ceil(data.total / Math.max(1, state.pageSize)));
  state.pageCurrent = Math.max(1, Math.min(data.current || state.pageCurrent, state.feedbackApiPages));
  apiFeedbackItems = data.records;
  syncFeedbackItemsWithSource();

  const overviewKey = getFeedbackOverviewKey();
  if (refreshOverview || state.feedbackOverviewKey !== overviewKey || state.feedbackApiOverview.total === 0) {
    await queryFeedbackOverview(refreshOverview);
  }
}

async function changeFeedbackStatusByApi({ id, comment, problemClassification }) {
  return feedbackApiRequest("/sae-gateway/kkhc-bizcenter-app/appUploadLog/changeStatus", {
    method: "POST",
    body: {
      id,
      comment,
      problemClassification,
    },
  });
}

async function queryApiRules() {
  const statusSingle = state.statusFilters.length === 1 ? Number(state.statusFilters[0]) : undefined;
  const data = await apiRequest("/pageQueryUserPackage", {
    method: "POST",
    body: {
      pageCurrent: state.pageCurrent,
      pageSize: state.pageSize,
      name: state.searchName || undefined,
      status: statusSingle,
    },
  });
  state.apiRules = (data.records || []).map(normalizeRule);
  state.apiTotal = Number(data.total || 0);
}

async function loadApiFeatureMeta() {
  const data = await apiRequest("/listUserFeature", {
    method: "POST",
    body: {},
  });
  const list = data.featureDtos || [];
  state.apiFeatureMeta = list.map((it) => ({
    featureCode: it.featureCode,
    featureName: it.featureName,
    valueType: Number(it.valueType),
    supportOps: (it.supportOps || []).map((x) => ({
      code: String((typeof x === "object" ? x.code ?? x.name : x) ?? ""),
      name: String((typeof x === "object" ? x.name ?? x.code : x) ?? ""),
    })),
    enumValues: (it.enumValues || []).map((x) => ({
      code: String((typeof x === "object" ? x.code ?? x.name : x) ?? ""),
      name: String((typeof x === "object" ? x.name ?? x.code : x) ?? ""),
    })),
  }));
}

function resetApiCache() {
  state.apiRules = [];
  state.apiTotal = 0;
  state.apiFeatureMeta = null;
}

async function refreshByDataSource(options = {}) {
  const { showErrorAlert = true } = options;
  if (!canAccessView("rules")) return { ok: false, error: new Error("当前账号无权访问规则列表") };
  try {
    if (isApiMode()) {
      await queryApiRules();
    }
    renderTable();
    return { ok: true };
  } catch (error) {
    if (showErrorAlert) window.alert(`接口模式加载失败：${error.message}`);
    return { ok: false, error };
  }
}

async function changeStatus(id, status) {
  if (isApiMode()) {
    try {
      await apiRequest("/changeUserPackageStatus", {
        method: "POST",
        body: { id, status },
      });
      await refreshByDataSource();
    } catch (error) {
      window.alert(`修改状态失败：${error.message}`);
    }
    return;
  }
  const item = localRules.find((r) => r.id === id);
  if (!item) return;
  item.status = status;
  item.lastUpdateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  item.userCount = status === 1 ? "计算中" : item.userCount;
  renderTable();
}

async function removeRule(id) {
  const ok = window.confirm("确认删除该人群包规则吗？删除后不可恢复。");
  if (!ok) return;

  if (isApiMode()) {
    try {
      await apiRequest("/deleteUserPackage", {
        method: "POST",
        body: { id },
      });
      await refreshByDataSource();
    } catch (error) {
      window.alert(`删除失败：${error.message}`);
    }
    return;
  }
  localRules = localRules.filter((r) => r.id !== id);
  renderTable();
}

function newCondition() {
  const f = activeFeatureMeta()[0];
  const initOp = getOpOptions(f)[0]?.code || "=";
  const isListOp = isListOperator(f, initOp);
  return {
    invert: false,
    featureCode: f.featureCode,
    op: initOp,
    // value/valueList 需要是对象/对象数组（保存接口入参）
    value: f.valueType === 1 ? { code: "", name: "" } : isListOp ? null : { code: "", name: "" },
    valueList: isListOp ? [] : null,
  };
}

async function fetchRuleDetail(id) {
  const data = await apiRequest(`/getUserPackageDetail?id=${id}`);
  return normalizeRule(data);
}

async function openForm(mode, id) {
  state.mode = mode;
  state.editingId = id || null;
  const t = document.querySelector("#formTitle");

  // 详情/编辑/复制需要特征元信息（用于 conditions 渲染/保存）
  if (isApiMode() && !state.apiFeatureMeta) {
    await loadApiFeatureMeta();
  }

  if (mode === "create") {
    state.form = { ruleCode: "", name: "", sql: "", conditions: [newCondition()] };
    t.textContent = "新建人群包规则";
  } else {
    let src = null;
    if (isApiMode()) {
      try {
        src = await fetchRuleDetail(id);
      } catch (error) {
        window.alert(`加载详情失败：${error.message}`);
        return;
      }
    } else {
      src = localRules.find((r) => r.id === id);
    }
    if (!src) return;
    state.form = {
      ruleCode: mode === "copy" ? "" : src.ruleCode,
      name: mode === "copy" ? `${src.name}-副本` : src.name,
      sql: src.ruleSql,
      conditions: src.conditions.length ? JSON.parse(JSON.stringify(src.conditions)) : [newCondition()],
    };
    t.textContent = mode === "detail" ? "规则详情" : mode === "edit" ? "编辑规则" : "复制规则";
  }
  state.useSqlMode = false;
  renderForm();
  listView.classList.add("hidden");
  formView.classList.remove("hidden");
  renderOverview();
}

function goList() {
  resetFormMode();
  formView.classList.add("hidden");
  listView.classList.remove("hidden");
  renderOverview();
  if (state.currentView === "rules") refreshByDataSource();
}

async function gotoPage(nextPage) {
  const num = Number(nextPage);
  if (!Number.isFinite(num) || Number.isNaN(num)) return;
  const total = state.totalPages || 1;
  const clamped = Math.max(1, Math.min(total, Math.floor(num)));
  state.pageCurrent = clamped;
  await refreshCurrentViewPage();
}

async function refreshCurrentViewPage(options = {}) {
  const { showErrorAlert = true, refreshOverview = false } = options;
  if (state.currentView === "feedback") {
    if (isApiMode()) {
      try {
        await queryFeedbackItems({ refreshOverview });
      } catch (error) {
        if (showErrorAlert) window.alert(`接口模式加载失败：${error.message}`);
        return { ok: false, error };
      }
    }
    renderFeedbackTable();
    return { ok: true };
  }
  if (state.currentView === "landing") {
    return refreshLandingPage({ showErrorAlert });
  }
  if (state.currentView === "shareMaterials") {
    return refreshShareMaterials({ showErrorAlert });
  }
  return refreshByDataSource({ showErrorAlert });
}

async function handleManualRefresh(targetView) {
  const isRulesTarget = targetView === "rules";
  const isLandingTarget = targetView === "landing";
  const isShareMaterialsTarget = targetView === "shareMaterials";
  const button = isRulesTarget ? refreshRulesBtn : isLandingTarget ? refreshLandingBtn : isShareMaterialsTarget ? refreshShareMaterialsBtn : refreshFeedbackBtn;
  const label = isRulesTarget ? "规则列表" : isLandingTarget ? "领取落地页" : isShareMaterialsTarget ? "作业分享素材" : "问题反馈";
  setButtonLoading(button, true, "刷新中...");
  const result = isRulesTarget
    ? await refreshByDataSource({ showErrorAlert: false })
    : isLandingTarget
      ? await refreshLandingPage({ showErrorAlert: false })
      : isShareMaterialsTarget
        ? await refreshShareMaterials({ showErrorAlert: false })
        : await refreshCurrentViewPage({ showErrorAlert: false, refreshOverview: true });
  setButtonLoading(button, false);
  if (result?.ok) {
    showToast(`${label}已刷新`, "success");
    return;
  }
  const errorMessage = result?.error?.message || "请稍后重试";
  showToast(`${label}刷新失败：${errorMessage}`, "error");
}

function currentReadonly() {
  return state.mode === "detail";
}

function getFeatureMeta(featureCode) {
  const meta = activeFeatureMeta();
  return meta.find((f) => f.featureCode === featureCode) || meta[0];
}

function getEnumOptions(meta) {
  const ev = meta?.enumValues || [];
  if (!Array.isArray(ev) || ev.length === 0) return [];
  // 本地 mock 可能只给了 string 列表
  if (typeof ev[0] === "string") {
    return ev.map((s) => ({ code: s, name: s }));
  }
  return ev;
}

function getSelectedSummary(list) {
  if (!Array.isArray(list) || list.length === 0) return "请选择";
  if (list.length <= 2) return list.map((item) => item.name || item.code).join("、");
  const names = list.slice(0, 2).map((item) => item.name || item.code).join("、");
  return `${names} 等 ${list.length} 项`;
}

function createMultiValueSelector(meta, cond, idx, readonly) {
  const container = document.createElement("div");
  container.className = `multi-select ${readonly ? "is-readonly" : ""}`;

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "multi-trigger";
  trigger.disabled = readonly;

  const triggerLabel = document.createElement("div");
  triggerLabel.className = "multi-trigger-label";
  const triggerTitle = document.createElement("span");
  triggerTitle.className = "multi-trigger-title";
  triggerTitle.textContent = getSelectedSummary(cond.valueList || []);
  const triggerMeta = document.createElement("span");
  triggerMeta.className = "multi-trigger-meta";
  triggerMeta.textContent = (cond.valueList || []).length ? `已选 ${(cond.valueList || []).length} 项` : "支持搜索";
  triggerLabel.appendChild(triggerTitle);
  triggerLabel.appendChild(triggerMeta);

  const triggerArrow = document.createElement("span");
  triggerArrow.className = "multi-trigger-arrow";
  triggerArrow.textContent = "▾";

  trigger.appendChild(triggerLabel);
  trigger.appendChild(triggerArrow);
  container.appendChild(trigger);

  const panel = document.createElement("div");
  panel.className = "multi-panel hidden";

  const search = document.createElement("input");
  search.type = "search";
  search.className = "multi-search";
  search.placeholder = "搜索名称";
  search.disabled = readonly;

  const tools = document.createElement("div");
  tools.className = "multi-tools";
  const counter = document.createElement("span");
  counter.className = "multi-counter";
  const selectAllBtn = document.createElement("button");
  selectAllBtn.type = "button";
  selectAllBtn.className = "link";
  selectAllBtn.textContent = "全选当前结果";
  selectAllBtn.disabled = readonly;
  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "link";
  clearBtn.textContent = "清空已选";
  clearBtn.disabled = readonly;
  const doneBtn = document.createElement("button");
  doneBtn.type = "button";
  doneBtn.className = "btn btn-light multi-done";
  doneBtn.textContent = "完成";
  doneBtn.disabled = readonly;
  tools.appendChild(counter);
  tools.appendChild(selectAllBtn);
  tools.appendChild(clearBtn);
  tools.appendChild(doneBtn);

  const selectedBar = document.createElement("div");
  selectedBar.className = "multi-selected";

  const optionsBox = document.createElement("div");
  optionsBox.className = "multi-options";

  panel.appendChild(search);
  panel.appendChild(tools);
  panel.appendChild(selectedBar);
  panel.appendChild(optionsBox);
  container.appendChild(panel);

  const selectedMap = () => new Map((state.form.conditions[idx].valueList || []).map((item) => [String(item.code), item]));

  function renderPanelOptions() {
    const query = search.value.trim().toLowerCase();
    const options = getEnumOptions(meta);
    const filtered = options.filter((opt) => {
      const code = String(opt.code || "").toLowerCase();
      const name = String(opt.name || "").toLowerCase();
      return !query || code.includes(query) || name.includes(query);
    });
    const selected = state.form.conditions[idx].valueList || [];
    const selectedCodes = new Set(selected.map((item) => String(item.code)));
    const ordered = filtered.slice().sort((a, b) => {
      const aSelected = selectedCodes.has(String(a.code)) ? 0 : 1;
      const bSelected = selectedCodes.has(String(b.code)) ? 0 : 1;
      if (aSelected !== bSelected) return aSelected - bSelected;
      return String(a.name || a.code).localeCompare(String(b.name || b.code), "zh-CN");
    });

    triggerTitle.textContent = getSelectedSummary(selected);
    triggerMeta.textContent = selected.length ? `已选 ${selected.length} 项` : "支持搜索";
    counter.textContent = `匹配 ${filtered.length} 项`;
    selectAllBtn.classList.toggle("hidden", filtered.length === 0);
    clearBtn.classList.toggle("hidden", selected.length === 0);
    const allFilteredSelected = filtered.length > 0 && filtered.every((opt) => selectedCodes.has(String(opt.code)));
    selectAllBtn.textContent = allFilteredSelected ? "取消全选当前结果" : "全选当前结果";

    selectedBar.innerHTML = "";
    if (selected.length) {
      selected.forEach((item) => {
        const tag = document.createElement("span");
        tag.className = "multi-chip";
        const label = document.createElement("span");
        label.textContent = item.name || item.code;
        tag.appendChild(label);
        if (!readonly) {
          const closeBtn = document.createElement("button");
          closeBtn.type = "button";
          closeBtn.className = "multi-chip-close";
          closeBtn.textContent = "×";
          closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            state.form.conditions[idx].valueList = (state.form.conditions[idx].valueList || [])
              .filter((v) => String(v.code) !== String(item.code));
            state.form.conditions[idx].value = null;
            renderPanelOptions();
          });
          tag.appendChild(closeBtn);
        }
        selectedBar.appendChild(tag);
      });
      selectedBar.classList.remove("hidden");
    } else {
      selectedBar.classList.add("hidden");
    }

    optionsBox.innerHTML = "";
    if (!ordered.length) {
      const empty = document.createElement("div");
      empty.className = "multi-empty";
      empty.textContent = "没有匹配项";
      optionsBox.appendChild(empty);
      return;
    }

    const current = selectedMap();
    ordered.forEach((opt) => {
      const label = document.createElement("label");
      label.className = "multi-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.disabled = readonly;
      checkbox.checked = current.has(String(opt.code));
      checkbox.addEventListener("change", () => {
        const existing = state.form.conditions[idx].valueList || [];
        const next = checkbox.checked
          ? [...existing.filter((item) => String(item.code) !== String(opt.code)), { code: opt.code, name: opt.name }]
          : existing.filter((item) => String(item.code) !== String(opt.code));
        state.form.conditions[idx].valueList = next;
        state.form.conditions[idx].value = null;
        renderPanelOptions();
      });

      const textWrap = document.createElement("span");
      textWrap.className = "multi-option-text";
      const name = document.createElement("span");
      name.className = "multi-option-name";
      name.textContent = opt.name;
      textWrap.appendChild(name);
      if (String(opt.name) !== String(opt.code)) {
        const code = document.createElement("span");
        code.className = "multi-option-code";
        code.textContent = opt.code;
        textWrap.appendChild(code);
      }

      label.appendChild(checkbox);
      label.appendChild(textWrap);
      optionsBox.appendChild(label);
    });
  }

  function closePanel() {
    panel.classList.add("hidden");
    container.classList.remove("is-open");
  }

  function openPanel() {
    if (readonly) return;
    document.dispatchEvent(new CustomEvent("multiselect-open", { detail: { source: container } }));
    panel.classList.remove("hidden");
    container.classList.add("is-open");
    renderPanelOptions();
    search.focus();
  }

  document.addEventListener("multiselect-open", (event) => {
    if (event.detail.source !== container) closePanel();
  });

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    if (panel.classList.contains("hidden")) {
      openPanel();
    } else {
      closePanel();
    }
  });

  search.addEventListener("input", renderPanelOptions);
  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePanel();
  });
  clearBtn.addEventListener("click", () => {
    state.form.conditions[idx].valueList = [];
    state.form.conditions[idx].value = null;
    renderPanelOptions();
  });
  selectAllBtn.addEventListener("click", () => {
    const query = search.value.trim().toLowerCase();
    const options = getEnumOptions(meta);
    const filtered = options.filter((opt) => {
      const code = String(opt.code || "").toLowerCase();
      const name = String(opt.name || "").toLowerCase();
      return !query || code.includes(query) || name.includes(query);
    });
    const current = state.form.conditions[idx].valueList || [];
    const currentMap = new Map(current.map((item) => [String(item.code), item]));
    const allFilteredSelected = filtered.length > 0 && filtered.every((opt) => currentMap.has(String(opt.code)));

    if (allFilteredSelected) {
      state.form.conditions[idx].valueList = current.filter((item) => !filtered.some((opt) => String(opt.code) === String(item.code)));
    } else {
      filtered.forEach((opt) => {
        currentMap.set(String(opt.code), { code: opt.code, name: opt.name });
      });
      state.form.conditions[idx].valueList = Array.from(currentMap.values());
    }
    state.form.conditions[idx].value = null;
    renderPanelOptions();
  });
  doneBtn.addEventListener("click", () => {
    closePanel();
    trigger.focus();
  });

  container.addEventListener("mousedown", (event) => {
    event.stopPropagation();
  });
  container.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
    if (!container.contains(event.target)) closePanel();
  });

  renderPanelOptions();
  return container;
}

function renderValueInput(wrap, cond, idx, readonly) {
  wrap.innerHTML = "";
  const meta = getFeatureMeta(cond.featureCode);
  if (meta.valueType === 1) {
    const input = document.createElement("input");
    input.type = "number";
    input.value = cond.value?.code ?? cond.value ?? "";
    input.disabled = readonly;
    input.addEventListener("input", () => {
      state.form.conditions[idx].value = { code: input.value, name: input.value };
    });
    wrap.appendChild(input);
    return;
  }
  if (isListOperator(meta, cond.op)) {
    wrap.appendChild(createMultiValueSelector(meta, cond, idx, readonly));
  } else {
    const sel = document.createElement("select");
    sel.disabled = readonly;
    getEnumOptions(meta).forEach((opt) => {
      const op = document.createElement("option");
      op.value = opt.code;
      op.textContent = opt.name;
      if (String(opt.code) === String(cond.value?.code)) op.selected = true;
      op.dataset.name = opt.name;
      sel.appendChild(op);
    });
    if (!readonly && isBlankValueObj(cond.value) && sel.options.length) {
      const selected = sel.options[sel.selectedIndex];
      state.form.conditions[idx].value = { code: sel.value, name: selected?.dataset?.name || sel.value };
      state.form.conditions[idx].valueList = null;
    }
    sel.addEventListener("change", () => {
      const selected = sel.options[sel.selectedIndex];
      const name = selected?.dataset?.name || sel.value;
      state.form.conditions[idx].value = { code: sel.value, name };
      state.form.conditions[idx].valueList = null;
    });
    wrap.appendChild(sel);
  }
}

function renderConditions() {
  const box = document.querySelector("#conditionList");
  box.innerHTML = "";
  const readonly = currentReadonly();
  state.form.conditions.forEach((cond, idx) => {
    const item = condTpl.content.firstElementChild.cloneNode(true);
    const invert = item.querySelector(".invert");
    const feature = item.querySelector(".feature");
    const op = item.querySelector(".op");
    const valueWrap = item.querySelector(".value-wrap");
    const del = item.querySelector(".del");

    invert.checked = cond.invert;
    invert.disabled = readonly;
    invert.addEventListener("change", () => {
      state.form.conditions[idx].invert = invert.checked;
    });

    activeFeatureMeta().forEach((f) => {
      const o = document.createElement("option");
      o.value = f.featureCode;
      o.textContent = f.featureName;
      if (f.featureCode === cond.featureCode) o.selected = true;
      feature.appendChild(o);
    });
    feature.disabled = readonly;
    feature.addEventListener("change", () => {
      const meta = getFeatureMeta(feature.value);
      const opOptions = getOpOptions(meta);
      state.form.conditions[idx].featureCode = meta.featureCode;
      state.form.conditions[idx].op = opOptions[0]?.code || "=";
      // 切换特征时重置 value/valueList，保持与当前 op 匹配
      if (meta.valueType === 1) {
        state.form.conditions[idx].value = { code: "", name: "" };
        state.form.conditions[idx].valueList = null;
      } else if (isListOperator(meta, state.form.conditions[idx].op)) {
        state.form.conditions[idx].value = null;
        state.form.conditions[idx].valueList = [];
      } else {
        state.form.conditions[idx].value = { code: "", name: "" };
        state.form.conditions[idx].valueList = null;
      }
      renderConditions();
    });

    const ops = getOpOptions(getFeatureMeta(cond.featureCode));
    ops.forEach((x) => {
      const o = document.createElement("option");
      o.value = x.code;
      o.textContent = x.name;
      if (x.code === cond.op) o.selected = true;
      op.appendChild(o);
    });
    op.disabled = readonly;
    op.addEventListener("change", () => {
      state.form.conditions[idx].op = op.value;
      const meta = getFeatureMeta(state.form.conditions[idx].featureCode);
      if (meta.valueType !== 1 && isListOperator(meta, op.value)) {
        state.form.conditions[idx].value = null;
        state.form.conditions[idx].valueList = state.form.conditions[idx].valueList || [];
      }
      if (meta.valueType !== 1 && !isListOperator(meta, op.value)) {
        state.form.conditions[idx].value = state.form.conditions[idx].value || { code: "", name: "" };
        state.form.conditions[idx].valueList = null;
      }
      if (meta.valueType === 1) {
        state.form.conditions[idx].value = state.form.conditions[idx].value || { code: "", name: "" };
        state.form.conditions[idx].valueList = null;
      }
      renderConditions();
    });

    renderValueInput(valueWrap, cond, idx, readonly);
    del.disabled = readonly;
    del.addEventListener("click", () => {
      state.form.conditions.splice(idx, 1);
      renderConditions();
    });
    box.appendChild(item);
  });
}

function renderForm() {
  const readonly = currentReadonly();
  const codeEl = document.querySelector("#ruleCodeInput");
  const nameEl = document.querySelector("#ruleNameInput");
  const sqlEditor = document.querySelector("#sqlEditor");
  const sqlWrap = document.querySelector("#sqlEditorWrap");
  const condList = document.querySelector("#conditionList");
  const addCondBtn = document.querySelector("#addConditionBtn");
  const toggleSqlBtn = document.querySelector("#toggleSqlBtn");
  codeEl.value = state.form.ruleCode;
  nameEl.value = state.form.name;
  sqlEditor.value = state.form.sql;
  codeEl.disabled = readonly || state.mode === "edit";
  nameEl.disabled = readonly;
  sqlEditor.disabled = readonly;
  [codeEl, nameEl, sqlEditor].forEach((el) => el.classList.toggle("readonly", el.disabled));
  codeEl.oninput = () => {
    state.form.ruleCode = codeEl.value.trim();
  };
  nameEl.oninput = () => {
    state.form.name = nameEl.value.trim();
  };
  sqlEditor.oninput = () => {
    state.form.sql = sqlEditor.value;
  };
  sqlWrap.classList.toggle("hidden", !state.useSqlMode);
  condList.classList.toggle("hidden", state.useSqlMode);
  addCondBtn.disabled = readonly || state.useSqlMode;
  toggleSqlBtn.textContent = state.useSqlMode ? "返回条件配置" : "我要写SQL";
  document.querySelector("#saveBtn").classList.toggle("hidden", readonly);
  renderConditions();
}

function resetFormMode() {
  state.useSqlMode = false;
  const readonly = currentReadonly();
  const sqlWrap = document.querySelector("#sqlEditorWrap");
  const condList = document.querySelector("#conditionList");
  const addCondBtn = document.querySelector("#addConditionBtn");
  const toggleSqlBtn = document.querySelector("#toggleSqlBtn");
  if (sqlWrap) sqlWrap.classList.add("hidden");
  if (condList) condList.classList.remove("hidden");
  if (addCondBtn) addCondBtn.disabled = readonly;
  if (toggleSqlBtn) toggleSqlBtn.textContent = "我要写SQL";
}

function saveRule() {
  if (!state.form.ruleCode || !state.form.name) {
    window.alert("规则 code 和规则名称必填");
    return;
  }
  if (state.form.ruleCode.length > 30 || state.form.name.length > 30) {
    window.alert("规则 code 和规则名称需在 30 字以内");
    return;
  }
  if (!/^[A-Za-z0-9_]+$/.test(state.form.ruleCode)) {
    window.alert("规则 code 仅支持英文、数字、下划线");
    return;
  }
  if (state.useSqlMode && !state.form.sql.trim()) {
    window.alert("SQL 模式下请输入 SQL");
    return;
  }
  if (!validateConditions()) {
    return;
  }
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const conditionPayload = state.form.conditions.map(internalConditionToApi);
  const payload = {
    ruleCode: state.form.ruleCode,
    name: state.form.name,
    ruleSql: state.useSqlMode
      ? state.form.sql || "-- SQL 为空"
      : "SELECT DISTINCT union_id FROM dwd_app_user_detail_info_df -- 由条件自动生成",
    status: 2,
    userCount: "0",
    lastUpdateEmpName: "admin",
    lastUpdateTime: now,
  };
  if (isApiMode()) {
    const requestBody = {
      id: state.mode === "edit" ? state.editingId : undefined,
      ruleCode: payload.ruleCode,
      name: payload.name,
      status: payload.status,
      ...(state.useSqlMode
        ? { packageSql: payload.ruleSql }
        : { conditions: conditionPayload }),
    };
    apiRequest("/saveUserPackage", {
      method: "POST",
      body: requestBody,
    })
      .then(() => goList())
      .catch((error) => window.alert(`保存失败：${error.message}`));
    return;
  }
  const localRecord = {
    ...payload,
    ruleSql: state.useSqlMode ? payload.ruleSql : "",
    conditions: state.useSqlMode ? [] : JSON.parse(JSON.stringify(state.form.conditions)),
  };
  if (state.mode === "edit") {
    const idx = localRules.findIndex((r) => r.id === state.editingId);
    if (idx >= 0) {
      localRules[idx] = { ...localRules[idx], ...localRecord };
    }
  } else {
    if (localRules.some((r) => r.ruleCode === payload.ruleCode)) {
      window.alert("规则 code 已存在，请更换");
      return;
    }
    localRules.unshift({ ...localRecord, id: Date.now() });
  }
  goList();
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const nextView = item.dataset.view;
    if (!nextView || nextView === state.currentView) return;
    switchView(nextView);
  });
});
document.querySelector("#createBtn").addEventListener("click", async () => {
  if (isApiMode() && !state.apiFeatureMeta) {
    try {
      await loadApiFeatureMeta();
    } catch (error) {
      window.alert(`加载特征失败：${error.message}`);
      return;
    }
  }
  openForm("create");
});
document.querySelector("#backBtn").addEventListener("click", () => {
  resetFormMode();
  goList();
});
document.querySelector("#queryBtn").addEventListener("click", () => {
  state.searchName = document.querySelector("#searchName").value.trim();
  state.statusFilters = Array.from(document.querySelectorAll(".statusCheck:checked")).map((x) => x.value);
  state.pageCurrent = 1;
  refreshByDataSource();
});
refreshRulesBtn?.addEventListener("click", () => {
  handleManualRefresh("rules");
});
document.querySelector("#resetBtn").addEventListener("click", () => {
  document.querySelector("#searchName").value = "";
  document.querySelectorAll(".statusCheck").forEach((x) => {
    x.checked = false;
  });
  state.searchName = "";
  state.statusFilters = [];
  state.pageCurrent = 1;
  refreshByDataSource();
});
document.querySelector("#prevPage").addEventListener("click", () => {
  state.pageCurrent = Math.max(1, state.pageCurrent - 1);
  refreshCurrentViewPage();
});
document.querySelector("#nextPage").addEventListener("click", () => {
  state.pageCurrent = Math.min(state.totalPages || 1, state.pageCurrent + 1);
  refreshCurrentViewPage();
});
firstPageBtn.addEventListener("click", () => gotoPage(1));
lastPageBtn.addEventListener("click", () => gotoPage(state.totalPages || 1));
goPageBtn.addEventListener("click", () => gotoPage(pageInput?.value));
if (pageInput) {
  pageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") gotoPage(pageInput.value);
  });
}
feedbackPrevPageBtn?.addEventListener("click", () => {
  state.pageCurrent = Math.max(1, state.pageCurrent - 1);
  refreshCurrentViewPage();
});
feedbackNextPageBtn?.addEventListener("click", () => {
  state.pageCurrent = Math.min(state.totalPages || 1, state.pageCurrent + 1);
  refreshCurrentViewPage();
});
feedbackFirstPageBtn?.addEventListener("click", () => gotoPage(1));
feedbackLastPageBtn?.addEventListener("click", () => gotoPage(state.totalPages || 1));
feedbackGoPageBtn?.addEventListener("click", () => gotoPage(feedbackPageInput?.value));
if (feedbackPageInput) {
  feedbackPageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") gotoPage(feedbackPageInput.value);
  });
}
landingPrevPageBtn?.addEventListener("click", () => {
  state.pageCurrent = Math.max(1, state.pageCurrent - 1);
  refreshCurrentViewPage();
});
landingNextPageBtn?.addEventListener("click", () => {
  state.pageCurrent = Math.min(state.totalPages || 1, state.pageCurrent + 1);
  refreshCurrentViewPage();
});
landingFirstPageBtn?.addEventListener("click", () => gotoPage(1));
landingLastPageBtn?.addEventListener("click", () => gotoPage(state.totalPages || 1));
landingGoPageBtn?.addEventListener("click", () => gotoPage(landingPageInput?.value));
if (landingPageInput) {
  landingPageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") gotoPage(landingPageInput.value);
  });
}
document.querySelector("#addConditionBtn").addEventListener("click", () => {
  if (currentReadonly() || state.useSqlMode) return;
  state.form.conditions.push(newCondition());
  renderConditions();
});
document.querySelector("#toggleSqlBtn").addEventListener("click", () => {
  if (currentReadonly()) return;
  state.useSqlMode = !state.useSqlMode;
  renderForm();
});
document.querySelector("#saveBtn").addEventListener("click", saveRule);
document.querySelector("#closeSqlModal").addEventListener("click", closeSqlModal);
document.querySelector(".modal-mask").addEventListener("click", closeSqlModal);
if (loginForm) loginForm.addEventListener("submit", handleLogin);
if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
sidebarToggleBtn?.addEventListener("click", () => toggleSidebar());
sidebarBackdrop?.addEventListener("click", () => toggleSidebar(false));
feedbackBrandFilterBtn?.addEventListener("click", () => toggleFilterPanel("brand"));
feedbackStatusFilterBtn?.addEventListener("click", () => toggleFilterPanel("status"));
feedbackUploadDateToggleBtn?.addEventListener("click", () => openFeedbackDateModal("upload"));
feedbackUpdateDateToggleBtn?.addEventListener("click", () => openFeedbackDateModal("update"));
document.querySelector("#feedbackQueryBtn")?.addEventListener("click", applyFeedbackQuery);
refreshFeedbackBtn?.addEventListener("click", () => {
  handleManualRefresh("feedback");
});
refreshLandingBtn?.addEventListener("click", () => {
  handleManualRefresh("landing");
});
refreshShareMaterialsBtn?.addEventListener("click", () => {
  handleManualRefresh("shareMaterials");
});
createShareMaterialBtn?.addEventListener("click", () => openShareMaterialModal("create"));
shareMaterialSkuFilter?.addEventListener("change", () => {
  state.shareMaterialSkuFilter = shareMaterialSkuFilter.value || SHARE_MATERIAL_SKU_OPTIONS[0].value;
  renderShareMaterials();
});
closeShareMaterialModal?.addEventListener("click", closeShareMaterialDialog);
cancelShareMaterialBtn?.addEventListener("click", closeShareMaterialDialog);
shareMaterialModal?.querySelector(".modal-mask")?.addEventListener("click", closeShareMaterialDialog);
saveShareMaterialBtn?.addEventListener("click", confirmShareMaterialFromModal);
saveShareMaterialsPageBtn?.addEventListener("click", saveShareMaterialActiveConfig);
shareMaterialUrlInput?.addEventListener("input", () => {
  renderShareMaterialPreviewBox(shareMaterialUrlInput.value, shareMaterialTypeInput?.value || "image");
});
shareMaterialTypeInput?.addEventListener("change", () => {
  renderShareMaterialPreviewBox(shareMaterialUrlInput?.value || "", shareMaterialTypeInput.value);
});
uploadShareMaterialBtn?.addEventListener("click", openShareMaterialFilePicker);
shareMaterialUploadBox?.addEventListener("click", openShareMaterialFilePicker);
shareMaterialUploadBox?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  openShareMaterialFilePicker();
});
shareMaterialUploadBox?.addEventListener("dragover", (event) => {
  event.preventDefault();
  shareMaterialUploadBox.classList.add("is-dragover");
});
shareMaterialUploadBox?.addEventListener("dragleave", () => {
  shareMaterialUploadBox.classList.remove("is-dragover");
});
shareMaterialUploadBox?.addEventListener("drop", (event) => {
  event.preventDefault();
  shareMaterialUploadBox.classList.remove("is-dragover");
  const [file] = event.dataTransfer?.files || [];
  uploadShareMaterialFile(file);
});
closeShareMaterialViewer?.addEventListener("click", closeShareMaterialViewerDialog);
shareMaterialViewerModal?.querySelector(".modal-mask")?.addEventListener("click", closeShareMaterialViewerDialog);
createLandingBtn?.addEventListener("click", openLandingCreateModal);
document.querySelector("#landingQueryBtn")?.addEventListener("click", applyLandingQuery);
document.querySelector("#landingResetBtn")?.addEventListener("click", () => {
  state.pageCurrent = 1;
  state.landingFilters = { name: "" };
  renderLandingFilters();
  refreshLandingPage();
});
document.querySelector("#landingBackBtn")?.addEventListener("click", goLandingList);
closeLandingCreateModal?.addEventListener("click", closeLandingCreateDialog);
cancelLandingCreateBtn?.addEventListener("click", closeLandingCreateDialog);
landingCreateModal?.querySelector(".modal-mask")?.addEventListener("click", closeLandingCreateDialog);
confirmLandingCreateBtn?.addEventListener("click", confirmLandingCreate);
landingCreateNameInput?.addEventListener("keydown", (event) => {
  if (event.isComposing || event.keyCode === 229) return;
  if (event.key === "Enter") confirmLandingCreate();
});
closeLandingPublishModal?.addEventListener("click", () => closeLandingPublishDialog());
cancelLandingPublishBtn?.addEventListener("click", () => closeLandingPublishDialog());
landingPublishModal?.querySelector(".modal-mask")?.addEventListener("click", () => closeLandingPublishDialog());
downloadLandingHtmlBtn?.addEventListener("click", () => {
  const draft = state.landingPublishDraft;
  if (!draft) return;
  downloadTextFile(`${draft.fileBaseName}.html`, draft.html, "text/html;charset=utf-8");
});
downloadLandingJsonBtn?.addEventListener("click", () => {
  const draft = state.landingPublishDraft;
  if (!draft) return;
  downloadTextFile(draft.jsonFileName || draft.fileBaseName, JSON.stringify(draft.config, null, 2), "application/json;charset=utf-8");
});
confirmLandingPublishBtn?.addEventListener("click", confirmLandingPublish);
saveLandingBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  saveLandingPage();
});
copyLandingUrlBtn?.addEventListener("click", async () => {
  try {
    await copyTextToClipboard(landingH5UrlOutput?.value || "");
    showToast("H5 链接已复制", "success");
  } catch (_) {
    window.alert("复制失败，请手动复制链接");
  }
});
copyLandingConfigBtn?.addEventListener("click", async () => {
  try {
    updateLandingGeneratedFields();
    await copyTextToClipboard(landingConfigPreview?.textContent || "");
    showToast("配置 JSON 已复制", "success");
  } catch (_) {
    window.alert("复制失败，请手动复制 JSON");
  }
});
[
  landingSearchName,
].forEach((input) => {
  input?.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key !== "Enter") return;
    event.preventDefault();
    applyLandingQuery();
  });
});
landingNameInput?.addEventListener("input", () => {
  syncLandingPageKeyFromName();
  syncLandingHeroTitleFromName();
});
landingPageKeyInput?.addEventListener("input", () => {
  state.landingPageKeyManuallyEdited = true;
});
landingHeroTitleInput?.addEventListener("input", () => {
  state.landingHeroTitleManuallyEdited = true;
});
[
  landingNameInput,
  landingBusinessInput,
  landingPageKeyInput,
  landingH5BaseFormInput,
  landingHeroTitleInput,
  landingHeroSubtitleInput,
  landingButtonTextInput,
  landingButtonLinkInput,
  landingButtonImageUrlInput,
  landingThemeColorInput,
  landingBannerUrlInput,
  landingConfigJsonUrlInput,
  landingMaterialUrlsInput,
  landingContentInput,
].forEach((input) => {
  input?.addEventListener("input", updateLandingGeneratedFields);
});

document.querySelectorAll("[data-landing-add]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!state.landingForm?.config || state.landingFormMode === "detail") return;
    const type = button.dataset.landingAdd;
    const components = getLandingComponents(state.landingForm.config);
    if (type === "hotspot") {
      const image = getLandingTargetImageComponent(components);
      if (!image) {
        window.alert("请先选定图片组件，再添加热区");
        return;
      }
      const hotzone = createLandingComponent("hotspot", {
        id: makeLandingDefaultControlId("hotspot", components),
        name: `热区 ${(image.hotzones || []).length + 1}`,
      });
      const availableRect = findAvailableLandingHotzoneRect(image, getLandingHotzoneRect(hotzone), hotzone.id);
      if (!availableRect) {
        window.alert("当前图片没有足够空间添加不重叠热区");
        return;
      }
      Object.assign(hotzone, availableRect);
      image.hotzones = [...(image.hotzones || []), hotzone];
      state.landingEditorSelectedId = hotzone.id;
    } else if (type === "button") {
      const image = getLandingTargetImageComponent(components) || components.find((component) => component.type === "image");
      const component = createLandingComponent("button", {
        id: makeLandingDefaultControlId("button", components),
        positionMode: "flow",
      });
      const imageIndex = image ? components.findIndex((item) => item.id === image.id) : -1;
      components.splice(imageIndex >= 0 ? imageIndex + 1 : components.length, 0, component);
      normalizeLandingButtonLayouts(components);
      state.landingEditorSelectedId = component.id;
    } else {
      const component = createLandingComponent(type);
      components.push(component);
      state.landingEditorSelectedId = component.id;
    }
    state.landingForm.config.components = components;
    renderLandingEditor();
  });
});

landingDeleteComponentBtn?.addEventListener("click", () => {
  deleteLandingSelectedComponent();
});

landingBannerUrlInput?.addEventListener("input", () => {
  const imageUrl = landingBannerUrlInput.value.trim();
  mutateLandingSelectedComponent((component) => {
    if (component.type !== "image") return;
    component.imageUrl = imageUrl;
    component.height = 0;
    component.naturalWidth = 375;
    component.naturalHeight = 560;
  });
  window.clearTimeout(landingImageUrlMeasureTimer);
  landingImageUrlMeasureTimer = window.setTimeout(async () => {
    const imageMeta = await loadLandingImageMeta(imageUrl);
    if (!imageMeta?.width || !imageMeta?.height) return;
    mutateLandingSelectedComponent((component) => {
      if (component.type !== "image" || component.imageUrl !== imageUrl) return;
      component.naturalWidth = imageMeta.width;
      component.naturalHeight = imageMeta.height;
      component.height = Math.round((375 * imageMeta.height) / imageMeta.width);
    });
  }, 350);
});

clearLandingImageUrlBtn?.addEventListener("click", () => {
  if (landingBannerUrlInput) landingBannerUrlInput.value = "";
  mutateLandingSelectedComponent((component) => {
    if (component.type !== "image") return;
    component.imageUrl = "";
    component.height = 560;
    component.naturalWidth = 375;
    component.naturalHeight = 560;
    component.hotzones = [];
  });
});

landingImageUploadBox?.addEventListener("click", openLandingImageFilePicker);
landingImageUploadBox?.addEventListener("dragover", (event) => {
  event.preventDefault();
  landingImageUploadBox.classList.add("is-dragover");
});
landingImageUploadBox?.addEventListener("dragleave", () => {
  landingImageUploadBox.classList.remove("is-dragover");
});
landingImageUploadBox?.addEventListener("drop", (event) => {
  event.preventDefault();
  landingImageUploadBox.classList.remove("is-dragover");
  const [file] = event.dataTransfer?.files || [];
  applyLandingUploadedImage(file);
});

landingButtonImagePreview?.addEventListener("click", openLandingButtonImageFilePicker);
landingButtonImagePreview?.addEventListener("dragover", (event) => {
  event.preventDefault();
  landingButtonImagePreview.classList.add("is-dragover");
});
landingButtonImagePreview?.addEventListener("dragleave", () => {
  landingButtonImagePreview.classList.remove("is-dragover");
});
landingButtonImagePreview?.addEventListener("drop", (event) => {
  event.preventDefault();
  landingButtonImagePreview.classList.remove("is-dragover");
  const [file] = event.dataTransfer?.files || [];
  applyLandingUploadedButtonImage(file);
});

clearLandingButtonImageUrlBtn?.addEventListener("click", () => {
  if (landingButtonImageUrlInput) landingButtonImageUrlInput.value = "";
  mutateLandingSelectedComponent((component) => {
    if (component.type !== "button") return;
    component.imageUrl = "";
    component.naturalWidth = 0;
    component.naturalHeight = 0;
    component.width = 311;
    component.height = 48;
  });
});

[
  landingHotspotSkuInput,
  landingHotspotLinkInput,
  landingHotspotBridgeActionInput,
  landingHotspotBridgeParamsInput,
].forEach((input) => {
  input?.addEventListener("input", () => updateLandingSelectedHotspotFromInputs({ render: false, syncRect: false }));
  input?.addEventListener("change", () => updateLandingSelectedHotspotFromInputs({ render: false, syncRect: false }));
});

[
  landingHotspotIdInput,
].forEach((input) => {
  input?.addEventListener("input", () => updateLandingSelectedHotspotFromInputs({ render: false, syncRect: false }));
  input?.addEventListener("change", () => {
    if (updateLandingSelectedHotspotFromInputs({ render: false, syncRect: false })) {
      refreshLandingHotspotSurface();
    }
  });
});

[
  landingHotspotXInput,
  landingHotspotYInput,
  landingHotspotWInput,
  landingHotspotHInput,
].forEach((input) => {
  input?.addEventListener("input", () => {
    if (updateLandingSelectedHotspotFromInputs({ render: false })) {
      refreshLandingHotspotSurface();
    }
  });
  input?.addEventListener("change", () => {
    input.value = formatLandingPixelValue(input.value, Number(input.min || 0));
    if (updateLandingSelectedHotspotFromInputs({ render: false })) {
      refreshLandingHotspotSurface();
    }
  });
});
landingHotspotEventInput?.addEventListener("change", () => {
  renderLandingHotspotEventFields(landingHotspotEventInput.value || "claim");
  updateLandingSelectedHotspotFromInputs({ render: false, syncRect: false });
});

[
  landingButtonSkuInput,
  landingButtonLinkInput,
  landingButtonBridgeActionInput,
  landingButtonBridgeParamsInput,
  landingButtonImageUrlInput,
  landingThemeColorInput,
  landingButtonTextInput,
  landingButtonFloatAboveImageInput,
].forEach((input) => {
  input?.addEventListener("input", () => updateLandingSelectedButtonFromInputs());
  input?.addEventListener("change", () => updateLandingSelectedButtonFromInputs());
});

[
  landingButtonXInput,
  landingButtonIdInput,
  landingButtonYInput,
  landingButtonWInput,
  landingButtonHInput,
].forEach((input) => {
  input?.addEventListener("input", () => updateLandingSelectedButtonFromInputs());
  input?.addEventListener("change", () => {
    updateLandingSelectedButtonFromInputs();
    input.value = formatLandingPixelValue(input.value, Number(input.min || 0));
  });
});
landingButtonEventInput?.addEventListener("change", () => {
  renderLandingButtonEventFields(landingButtonEventInput.value || "claim");
  updateLandingSelectedButtonFromInputs();
});

landingButtonSafeAreaInput?.addEventListener("change", () => {
  if (!state.landingForm?.config || state.landingFormMode === "detail") return;
  state.landingForm.config.canvas = {
    ...(state.landingForm.config.canvas || {}),
    width: 375,
    height: 812,
    enableBottomSafeArea: landingButtonSafeAreaInput.checked,
  };
  renderLandingEditor();
});

landingButtonModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateLandingSelectedButtonFromInputs(button.dataset.landingButtonMode);
  });
});
[
  feedbackSearchUnionId,
  feedbackSearchVersion,
  feedbackSearchDescription,
  feedbackSearchRemark,
].forEach((input) => {
  input?.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key !== "Enter") return;
    event.preventDefault();
    applyFeedbackQuery();
  });
});

document.addEventListener("keydown", (event) => {
  if (!["Delete", "Backspace"].includes(event.key)) return;
  if (state.currentView !== "landing" || landingFormView?.classList.contains("hidden")) return;
  const target = event.target;
  const tagName = target?.tagName?.toLowerCase();
  if (["input", "textarea", "select"].includes(tagName) || target?.isContentEditable) return;
  event.preventDefault();
  deleteLandingSelectedComponent();
});

document.querySelector("#feedbackResetBtn")?.addEventListener("click", () => {
  state.pageCurrent = 1;
  state.feedbackFilters = {
    unionId: "",
    version: "",
    description: "",
    remark: "",
    brands: [],
    uploadDateStart: "",
    uploadDateEnd: "",
    updateDateStart: "",
    updateDateEnd: "",
    statuses: [],
  };
  renderFeedbackFilters();
  if (isApiMode()) {
    queryFeedbackItems().finally(() => renderFeedbackTable());
  } else {
    renderFeedbackTable();
  }
});
document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (!target.closest("#feedbackBrandFilterWrap")) feedbackBrandFilterPanel?.classList.add("hidden");
  if (!target.closest("#feedbackStatusFilterWrap")) feedbackStatusFilterPanel?.classList.add("hidden");
});
document.querySelector("#closeFeedbackStatusModal")?.addEventListener("click", closeFeedbackStatusModal);
document.querySelector("#saveFeedbackStatusBtn")?.addEventListener("click", saveFeedbackStatus);
feedbackStatusModal?.querySelector(".modal-mask")?.addEventListener("click", closeFeedbackStatusModal);
document.querySelector("#closeFeedbackContentModal")?.addEventListener("click", closeFeedbackContentModal);
feedbackContentModal?.querySelector(".modal-mask")?.addEventListener("click", closeFeedbackContentModal);
document.querySelector("#closeFeedbackDateModal")?.addEventListener("click", closeFeedbackDateModal);
document.querySelector("#saveFeedbackDateBtn")?.addEventListener("click", saveFeedbackDateFilter);
feedbackDateModal?.querySelector(".modal-mask")?.addEventListener("click", closeFeedbackDateModal);
dataSourceToggleBtn.addEventListener("click", async () => {
  state.dataSource = isApiMode() ? "local" : "api";
  state.pageCurrent = 1;
  if (isApiMode() && !state.apiFeatureMeta) {
    try {
      await loadApiFeatureMeta();
    } catch (error) {
      window.alert(`加载特征失败，已切回本地数据：${error.message}`);
      state.dataSource = "local";
    }
  }
  if (state.currentView === "feedback") {
    renderDataSourceTag();
    renderEnvSwitch();
    syncFeedbackItemsWithSource();
    if (isApiMode()) {
      try {
        await queryFeedbackItems({ refreshOverview: true });
      } catch (error) {
        window.alert(`接口模式加载失败：${error.message}`);
      }
    }
    syncFeedbackItemsWithSource();
    renderFeedbackTable();
    return;
  }
  if (state.currentView === "landing") {
    renderDataSourceTag();
    renderEnvSwitch();
    syncLandingItemsWithSource();
    if (isApiMode()) {
      try {
        await queryLandingItems();
      } catch (error) {
        window.alert(`接口模式加载失败：${error.message}`);
      }
    }
    syncLandingItemsWithSource();
    renderLandingTable();
    return;
  }
  if (state.currentView === "shareMaterials") {
    renderDataSourceTag();
    renderEnvSwitch();
    await refreshShareMaterials({ showErrorAlert: false });
    return;
  }
  if (state.currentView === "h5Activity") {
    renderDataSourceTag();
    renderEnvSwitch();
    syncH5ActivityFrame();
    return;
  }
  await refreshByDataSource();
});

[testEnvBtn, prodEnvBtn].forEach((btn) => {
  btn.addEventListener("click", async () => {
    const nextEnv = btn.dataset.env;
    if (!API_ENV_CONFIG[nextEnv] || nextEnv === state.apiEnv) return;
    state.apiEnv = nextEnv;
    state.pageCurrent = 1;
    resetApiCache();
    window.localStorage.setItem(API_ENV_STORAGE_KEY, nextEnv);
    renderEnvSwitch();
    renderDataSourceTag();
    if (state.currentView === "h5Activity") {
      syncH5ActivityFrame();
      return;
    }
    if (state.currentView === "pushTool") {
      syncPushToolFrame();
      return;
    }
    if (!isApiMode()) {
      if (state.currentView === "feedback") {
        syncFeedbackItemsWithSource();
        renderFeedbackTable();
      }
      if (state.currentView === "landing") {
        syncLandingItemsWithSource();
        renderLandingTable();
      }
      if (state.currentView === "shareMaterials") {
        await refreshShareMaterials({ showErrorAlert: false });
      }
      return;
    }

    if (state.currentView === "feedback") {
      try {
        await queryFeedbackItems();
        renderFeedbackTable();
      } catch (error) {
        window.alert(`切换${API_ENV_CONFIG[nextEnv].label}失败：${error.message}`);
      }
      return;
    }

    if (state.currentView === "landing") {
      try {
        await queryLandingItems();
        renderLandingTable();
      } catch (error) {
        window.alert(`切换${API_ENV_CONFIG[nextEnv].label}失败：${error.message}`);
      }
      return;
    }

    if (state.currentView === "shareMaterials") {
      const result = await refreshShareMaterials({ showErrorAlert: false });
      if (!result?.ok) {
        window.alert(`切换${API_ENV_CONFIG[nextEnv].label}失败：${result?.error?.message || "请稍后重试"}`);
      }
      return;
    }

    try {
      await loadApiFeatureMeta();
      await refreshByDataSource();
    } catch (error) {
      window.alert(`切换${API_ENV_CONFIG[nextEnv].label}失败：${error.message}`);
    }
  });
});

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    window.localStorage.setItem(THEME_STORAGE_KEY, state.theme);
    applyTheme();
  });
}

pushToolFrame?.addEventListener("load", () => {
  syncPushToolFrame();
});

applyTheme();
renderFeedbackStatusOptions();
renderFeedbackBrandOptions();
renderFeedbackFilters();
renderLandingFilters();
renderAuthState();
renderSidebarState();
syncViewState();
if (isLoggedIn()) {
  if (state.currentView === "rules") {
    refreshByDataSource();
  } else if (state.currentView === "landing") {
    refreshLandingPage();
  } else if (state.currentView === "shareMaterials") {
    refreshShareMaterials();
  } else {
    if (isApiMode()) {
      queryFeedbackItems().finally(() => renderFeedbackTable());
    } else {
      renderFeedbackTable();
    }
  }
} else {
  loginUsername?.focus();
}

window.addEventListener("resize", () => {
  renderSidebarState();
  setupTableDragScroll();
});

/* ── Particle animation (performance-optimized) ── */
(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles, mouse, raf;
  let paused = false;
  let lastFrameTime = 0;

  const CONFIG = {
    count: 45,
    speed: 0.3,
    linkDist: 120,
    linkDistSq: 120 * 120,
    mouseRadius: 180,
    mouseRadiusSq: 180 * 180,
    baseRadius: 1.6,
    frameInterval: 33,
    colors: {
      dark: { dot: "rgba(50,215,255,", line: "rgba(50,215,255," },
      light: { dot: "rgba(14,165,233,", line: "rgba(14,165,233," },
    },
  };

  mouse = { x: -9999, y: -9999 };

  function palette() {
    return document.body.classList.contains("theme-light")
      ? CONFIG.colors.light
      : CONFIG.colors.dark;
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(CONFIG.count, Math.floor((w * h) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed,
        r: CONFIG.baseRadius + Math.random() * 1.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw(timestamp) {
    if (paused) return;
    raf = requestAnimationFrame(draw);

    if (timestamp - lastFrameTime < CONFIG.frameInterval) return;
    lastFrameTime = timestamp;

    ctx.clearRect(0, 0, w, h);
    const pal = palette();
    const len = particles.length;
    const linkDistSq = CONFIG.linkDistSq;
    const mouseRadiusSq = CONFIG.mouseRadiusSq;

    for (let i = 0; i < len; i++) {
      const p = particles[i];
      p.pulse += 0.012;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      else if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      else if (p.y > h) p.y = 0;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distMouseSq = dx * dx + dy * dy;
      const interacting = distMouseSq < mouseRadiusSq;

      const glow = 0.35 + 0.2 * Math.sin(p.pulse);
      let dotAlpha = glow;
      let r = p.r;
      if (interacting) {
        const ratio = 1 - Math.sqrt(distMouseSq) / CONFIG.mouseRadius;
        dotAlpha = Math.min(1, glow + 0.4 * ratio);
        r = p.r + 1.2 * ratio;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = pal.dot + dotAlpha + ")";
      ctx.fill();

      for (let j = i + 1; j < len; j++) {
        const q = particles[j];
        const ddx = p.x - q.x;
        const ddy = p.y - q.y;
        const distSq = ddx * ddx + ddy * ddy;
        if (distSq < linkDistSq) {
          const alpha = 0.12 * (1 - Math.sqrt(distSq) / CONFIG.linkDist);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = pal.line + alpha + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function start() {
    if (!paused) return;
    paused = false;
    lastFrameTime = 0;
    document.body.classList.remove("perf-hidden");
    raf = requestAnimationFrame(draw);
  }

  function stop() {
    paused = true;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    document.body.classList.add("perf-hidden");
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  window.addEventListener("blur", stop);
  window.addEventListener("focus", start);

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  resize();
  createParticles();
  if (!document.hidden) {
    raf = requestAnimationFrame(draw);
  } else {
    paused = true;
    document.body.classList.add("perf-hidden");
  }
})();
