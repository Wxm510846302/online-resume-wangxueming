import test from "node:test";
import assert from "node:assert/strict";
import {
  DAILY_QUESTION_LIMIT,
  DAILY_QUESTION_USAGE_STORAGE_KEY,
  getShanghaiDateKey,
  hasReachedDailyQuestionLimit,
  readDailyQuestionUsage,
  recordSuccessfulQuestion,
} from "./dailyQuestionLimit.js";

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("uses the Shanghai calendar date for daily quota", () => {
  assert.equal(getShanghaiDateKey("2026-08-06T15:59:59.000Z"), "2026-08-06");
  assert.equal(getShanghaiDateKey("2026-08-06T16:00:00.000Z"), "2026-08-07");
});

test("blocks the sixth question and resets on the next Shanghai day", () => {
  const storage = createMemoryStorage();
  const dateKey = "2026-08-06";

  for (let index = 0; index < DAILY_QUESTION_LIMIT; index += 1) {
    recordSuccessfulQuestion(storage, dateKey);
  }

  assert.equal(hasReachedDailyQuestionLimit(storage, dateKey), true);
  assert.equal(readDailyQuestionUsage(storage, dateKey).used, DAILY_QUESTION_LIMIT);
  assert.equal(hasReachedDailyQuestionLimit(storage, "2026-08-07"), false);
  assert.deepEqual(readDailyQuestionUsage(storage, "2026-08-07"), {
    dateKey: "2026-08-07",
    used: 0,
  });
  assert.ok(storage.getItem(DAILY_QUESTION_USAGE_STORAGE_KEY));
});
