"use strict";

const DAILY_QUESTION_LIMIT = 5;
const DAILY_QUESTION_LIMIT_ERROR = "DAILY_QUESTION_LIMIT_REACHED";
const DAILY_USAGE_COLLECTION = "resume_ai_daily_usage";
const DAILY_QUESTION_LIMIT_MESSAGE = `今天的 ${DAILY_QUESTION_LIMIT} 次 AI 问答已经用完啦。感谢你认真了解我的经历！

如果你还想继续聊岗位匹配、项目合作或技术问题，欢迎直接联系我：

- 电话：[176-1024-1135](tel:17610241135)
- 邮箱：[wangxueming_1993@163.com](mailto:wangxueming_1993@163.com)

我看到后会尽快回复你。`;

function getShanghaiDateKey(timestamp = Date.now()) {
  const date = new Date(timestamp);
  // 服务端统一按北京时间自然日核算，确保额度不会受云函数所在时区影响。
  return new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function readDailyQuestionQuota(database, userId, timestamp = Date.now()) {
  const dateKey = getShanghaiDateKey(timestamp);
  const usageKey = `${dateKey}:${userId}`;

  try {
    const result = await database.collection(DAILY_USAGE_COLLECTION)
      .where({ usageKey })
      .limit(1)
      .get();
    const record = Array.isArray(result.data) ? result.data[0] : null;
    const used = Number.isFinite(Number(record?.used)) ? Math.max(0, Math.floor(Number(record.used))) : 0;
    return {
      available: true,
      allowed: used < DAILY_QUESTION_LIMIT,
      dateKey,
      recordId: record?._id || "",
      remaining: Math.max(0, DAILY_QUESTION_LIMIT - used),
      usageKey,
      used,
    };
  } catch (error) {
    // 数据库短时不可用时放行本次请求，避免额度系统反过来造成 AI 全站不可用。
    console.log("daily-question-quota-read", error.message);
    return {
      available: false,
      allowed: true,
      dateKey,
      recordId: "",
      remaining: DAILY_QUESTION_LIMIT,
      usageKey,
      used: 0,
    };
  }
}

async function consumeDailyQuestionQuota(database, quota, userId) {
  if (!quota.available) return toPublicQuota(quota);
  const nextUsed = quota.used + 1;
  const updatedAt = new Date().toISOString();

  try {
    if (quota.recordId) {
      await database.collection(DAILY_USAGE_COLLECTION).doc(quota.recordId).update({
        used: database.command.inc(1),
        updatedAt,
      });
    } else {
      await database.collection(DAILY_USAGE_COLLECTION).add({
        usageKey: quota.usageKey,
        userId,
        dateKey: quota.dateKey,
        used: 1,
        createdAt: updatedAt,
        updatedAt,
      });
    }
    return {
      limit: DAILY_QUESTION_LIMIT,
      used: nextUsed,
      remaining: Math.max(0, DAILY_QUESTION_LIMIT - nextUsed),
      dateKey: quota.dateKey,
    };
  } catch (error) {
    // 本次答案已经生成，计数写入失败只记录日志，不把成功回答改成接口错误。
    console.log("daily-question-quota-write", error.message);
    return toPublicQuota(quota);
  }
}

function toPublicQuota(quota) {
  return {
    limit: DAILY_QUESTION_LIMIT,
    used: quota.used,
    remaining: Math.max(0, DAILY_QUESTION_LIMIT - quota.used),
    dateKey: quota.dateKey,
  };
}

module.exports = {
  DAILY_QUESTION_LIMIT,
  DAILY_QUESTION_LIMIT_ERROR,
  DAILY_QUESTION_LIMIT_MESSAGE,
  consumeDailyQuestionQuota,
  getShanghaiDateKey,
  readDailyQuestionQuota,
  toPublicQuota,
};
