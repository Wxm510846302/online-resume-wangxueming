import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import parserModule from "../uniCloud-aliyun/cloudfunctions/coze-chat/cozeAnswerParser.js";

const { parseCozeAnswer } = parserModule;

test("prefers the completed Coze answer over accumulated deltas", () => {
  const stream = [
    "event:conversation.message.delta",
    'data:{"role":"assistant","type":"answer","content":"你","content_type":"text"}',
    "",
    "event:conversation.message.completed",
    'data:{"role":"assistant","type":"answer","content":"你好","content_type":"text","conversation_id":"conv-1"}',
    "",
  ].join("\n");

  assert.deepEqual(parseCozeAnswer(stream), {
    answer: "你好",
    conversationId: "conv-1",
  });
});

test("parses a completed answer from CRLF-delimited SSE", () => {
  const stream = [
    "event:conversation.chat.created",
    'data:{"conversation_id":"conv-crlf"}',
    "",
    "event:conversation.message.completed",
    'data:{"role":"assistant","type":"answer","content":"兼容成功","content_type":"text"}',
    "",
  ].join("\r\n");

  assert.deepEqual(parseCozeAnswer(stream), {
    answer: "兼容成功",
    conversationId: "conv-crlf",
  });
});

test("joins structured answer text fragments", () => {
  const stream = [
    "event:conversation.message.completed",
    'data:{"role":"assistant","type":"answer","content":[{"text":"结构化"},{"content":"答案"}],"content_type":"text"}',
    "",
  ].join("\n");

  assert.equal(parseCozeAnswer(stream).answer, "结构化答案");
});

test("surfaces a failed Coze conversation", () => {
  const stream = [
    "event:conversation.chat.failed",
    'data:{"last_error":{"msg":"model unavailable"}}',
    "",
  ].join("\n");

  assert.throws(() => parseCozeAnswer(stream), /model unavailable/);
});

test("cloud chat retries once without a stale conversation when the first response has no answer", async () => {
  const requests = [];
  const verboseOnly = [
    "event:conversation.message.completed",
    'data:{"role":"assistant","type":"verbose","content":"tool output","content_type":"text"}',
    "",
    "event:conversation.chat.completed",
    'data:{"status":"completed"}',
    "",
  ].join("\n");
  const retryAnswer = [
    "event:conversation.message.completed",
    'data:{"role":"assistant","type":"answer","content":"重试成功","content_type":"text","conversation_id":"conv-new"}',
    "",
  ].join("\n");

  process.env.COZE_API_TOKEN = "test-token";
  globalThis.uniCloud = {
    httpclient: {
      request: async (url) => {
        requests.push(url);
        return { status: 200, data: requests.length === 1 ? verboseOnly : retryAnswer };
      },
    },
  };

  try {
    const require = createRequire(import.meta.url);
    const { main } = require("../uniCloud-aliyun/cloudfunctions/coze-chat/index.js");
    const result = await main({
      httpMethod: "POST",
      body: JSON.stringify({
        question: "介绍一下 Flutter App 经验",
        userId: "test-user",
        conversationId: "conv-stale",
      }),
    });
    const body = JSON.parse(result.body);

    assert.equal(requests.length, 2);
    assert.match(requests[0], /conversation_id=conv-stale/);
    assert.equal(requests[1], "https://api.coze.cn/v3/chat");
    assert.equal(result.statusCode, 200);
    assert.equal(body.answer, "重试成功");
    assert.equal(body.conversationId, "conv-new");
  } finally {
    delete process.env.COZE_API_TOKEN;
    delete globalThis.uniCloud;
  }
});

test("cloud chat retries once after a transient upstream failure", async () => {
  let requestCount = 0;
  const retryAnswer = [
    "event:conversation.message.completed",
    'data:{"role":"assistant","type":"answer","content":"恢复成功","content_type":"text"}',
    "",
  ].join("\n");

  process.env.COZE_API_TOKEN = "test-token";
  globalThis.uniCloud = {
    httpclient: {
      request: async () => {
        requestCount += 1;
        if (requestCount === 1) throw new Error("temporary timeout");
        return { status: 200, data: retryAnswer };
      },
    },
  };

  try {
    const require = createRequire(import.meta.url);
    const { main } = require("../uniCloud-aliyun/cloudfunctions/coze-chat/index.js");
    const result = await main({
      httpMethod: "POST",
      body: JSON.stringify({ question: "介绍项目经验", userId: "test-user" }),
    });
    const body = JSON.parse(result.body);

    assert.equal(requestCount, 2);
    assert.equal(result.statusCode, 200);
    assert.equal(body.answer, "恢复成功");
  } finally {
    delete process.env.COZE_API_TOKEN;
    delete globalThis.uniCloud;
  }
});
