import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  DAILY_QUESTION_LIMIT,
  consumeDailyQuestionQuota,
  readDailyQuestionQuota,
} = require("../uniCloud-aliyun/cloudfunctions/coze-chat/dailyQuestionQuota.js");

function createQuotaDatabase() {
  const rows = [];
  const collection = {
    query: null,
    where(query) {
      this.query = query;
      return this;
    },
    limit() {
      return this;
    },
    async get() {
      return { data: rows.filter((row) => row.usageKey === this.query?.usageKey).slice(0, 1) };
    },
    doc(recordId) {
      return {
        async update(patch) {
          const row = rows.find((item) => item._id === recordId);
          row.used += patch.used.increment;
          row.updatedAt = patch.updatedAt;
        },
      };
    },
    async add(record) {
      rows.push({ ...record, _id: `quota-${rows.length + 1}` });
    },
  };

  return {
    rows,
    command: {
      inc: (increment) => ({ increment }),
    },
    collection: () => collection,
  };
}

test("server quota allows five successful answers and rejects the sixth", async () => {
  const database = createQuotaDatabase();
  const timestamp = Date.parse("2026-08-06T08:00:00.000Z");

  for (let index = 0; index < DAILY_QUESTION_LIMIT; index += 1) {
    const current = await readDailyQuestionQuota(database, "visitor-test", timestamp);
    assert.equal(current.allowed, true);
    await consumeDailyQuestionQuota(database, current, "visitor-test");
  }

  const exhausted = await readDailyQuestionQuota(database, "visitor-test", timestamp);
  assert.equal(exhausted.allowed, false);
  assert.equal(exhausted.used, DAILY_QUESTION_LIMIT);
  assert.equal(exhausted.remaining, 0);
  assert.equal(database.rows.length, 1);
});
