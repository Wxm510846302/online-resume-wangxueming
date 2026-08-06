export const DAILY_QUESTION_LIMIT = 5;
export const DAILY_QUESTION_LIMIT_ERROR = "DAILY_QUESTION_LIMIT_REACHED";
export const DAILY_QUESTION_USAGE_STORAGE_KEY = "resume-ai-daily-question-usage-v1";
export const DAILY_QUESTION_LIMIT_MESSAGE = `今天的 ${DAILY_QUESTION_LIMIT} 次 AI 问答已经用完啦。感谢你认真了解我的经历！

如果你还想继续聊岗位匹配、项目合作或技术问题，欢迎直接联系我：

- 电话：[176-1024-1135](tel:17610241135)
- 邮箱：[wangxueming_1993@163.com](mailto:wangxueming_1993@163.com)

我看到后会尽快回复你。`;

export function getShanghaiDateKey(timestamp = Date.now()) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return getShanghaiDateKey(Date.now());
  // 业务额度按北京时间自然日重置，避免访客设备处于其他时区时提前或延后刷新次数。
  return new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function normalizeDailyQuestionUsage(value, dateKey = getShanghaiDateKey()) {
  const used = value?.dateKey === dateKey ? Number(value.used) : 0;
  return {
    dateKey,
    used: Number.isFinite(used) ? Math.min(Math.max(Math.floor(used), 0), DAILY_QUESTION_LIMIT) : 0,
  };
}

export function readDailyQuestionUsage(storage, dateKey = getShanghaiDateKey()) {
  try {
    const raw = storage?.getItem(DAILY_QUESTION_USAGE_STORAGE_KEY);
    return normalizeDailyQuestionUsage(raw ? JSON.parse(raw) : null, dateKey);
  } catch {
    // 隐私模式或存储空间异常时由服务端额度继续兜底，不能阻断正常提问。
    return normalizeDailyQuestionUsage(null, dateKey);
  }
}

export function recordSuccessfulQuestion(storage, dateKey = getShanghaiDateKey()) {
  const current = readDailyQuestionUsage(storage, dateKey);
  const next = {
    ...current,
    used: Math.min(current.used + 1, DAILY_QUESTION_LIMIT),
  };

  try {
    storage?.setItem(DAILY_QUESTION_USAGE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 写入失败时保持当前页面可用，并交由服务端额度继续执行第二层校验。
  }
  return next;
}

export function hasReachedDailyQuestionLimit(storage, dateKey = getShanghaiDateKey()) {
  return readDailyQuestionUsage(storage, dateKey).used >= DAILY_QUESTION_LIMIT;
}

export function getDailyQuestionStorage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    // 某些隐私浏览器会在访问 localStorage 属性时直接抛错，服务端额度可继续兜底。
    return null;
  }
}

export function createDailyQuestionLimitError(message = DAILY_QUESTION_LIMIT_MESSAGE) {
  const error = new Error(message);
  error.code = DAILY_QUESTION_LIMIT_ERROR;
  return error;
}

export function isDailyQuestionLimitError(error) {
  return error?.code === DAILY_QUESTION_LIMIT_ERROR;
}
