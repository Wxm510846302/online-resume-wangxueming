import test from "node:test";
import assert from "node:assert/strict";
import { collectConversationStream, getClientIp } from "./conversationLogger.js";

test("extracts client IP from proxy headers", () => {
  const request = new Request("http://localhost/api/coze-chat", {
    headers: {
      "x-forwarded-for": "203.0.113.8, 10.0.0.1",
      "user-agent": "node-test",
    },
  });

  assert.equal(getClientIp(request), "203.0.113.8");
});

test("collects streamed answer text without changing SSE chunks", async () => {
  const chunks = [
    "event:conversation.message.delta\n",
    'data:{"role":"assistant","type":"answer","content":"你好","content_type":"text"}\n\n',
    "event:conversation.message.delta\n",
    'data:{"role":"assistant","type":"answer","content":"，欢迎了解我","content_type":"text"}\n\n',
  ];
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });

  let recorded;
  const collected = collectConversationStream(stream, {
    onComplete: (answer) => {
      recorded = answer;
    },
  });

  const responseText = await new Response(collected).text();
  assert.equal(responseText, chunks.join(""));
  assert.equal(recorded, "你好，欢迎了解我");
});
