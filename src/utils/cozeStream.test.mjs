import test from "node:test";
import assert from "node:assert/strict";
import { parseCozeSseChunk } from "./cozeStream.js";

test("extracts assistant answer deltas from Coze SSE chunks", () => {
  const chunk = [
    "event:conversation.message.delta",
    'data:{"role":"assistant","type":"answer","content":"你好","content_type":"text"}',
    "",
    "event:conversation.message.delta",
    'data:{"role":"assistant","type":"verbose","content":"{\\"msg_type\\":\\"generate_answer_finish\\"}","content_type":"text"}',
    "",
    "event:conversation.message.delta",
    'data:{"role":"assistant","type":"answer","content":"，我是王学明 AI 分身","content_type":"text"}',
    "",
  ].join("\n");

  assert.deepEqual(parseCozeSseChunk(chunk), {
    text: "你好，我是王学明 AI 分身",
    done: false,
  });
});

test("marks the stream complete when Coze sends completion events", () => {
  const chunk = [
    "event:conversation.chat.completed",
    'data:{"status":"completed"}',
    "",
    "event:done",
    "data:[DONE]",
    "",
  ].join("\n");

  assert.deepEqual(parseCozeSseChunk(chunk), {
    text: "",
    done: true,
  });
});

test("surfaces Coze stream errors with the upstream message", () => {
  const chunk = [
    "event:error",
    'data:{"code":401,"msg":"invalid token"}',
    "",
  ].join("\n");

  assert.throws(
    () => parseCozeSseChunk(chunk),
    /Coze API error 401: invalid token/,
  );
});
