"use strict";

function parseCozeAnswer(text) {
  let deltaAnswer = "";
  let completedAnswer = "";
  let conversationId = "";
  const normalizedText = String(text || "").replace(/\r\n?/g, "\n");

  for (const block of normalizedText.split(/\n\n+/)) {
    const event = readSseField(block, "event");
    if (
      event !== "conversation.chat.created" &&
      event !== "conversation.message.delta" &&
      event !== "conversation.message.completed" &&
      event !== "conversation.chat.completed" &&
      event !== "conversation.chat.failed"
    ) continue;

    const data = readSseField(block, "data");
    if (!data || data === "[DONE]") continue;

    try {
      const payload = JSON.parse(data);
      if (!conversationId && typeof payload.conversation_id === "string") {
        conversationId = payload.conversation_id;
      }
      if (event === "conversation.chat.failed") {
        const message = payload.last_error?.msg || payload.error?.message || "Conversation failed";
        throw new Error(message);
      }
      if (payload.role !== "assistant" || payload.type !== "answer") continue;

      const answerText = readAnswerContent(payload.content);
      if (!answerText) continue;
      if (event === "conversation.message.completed") {
        completedAnswer = answerText;
      } else if (event === "conversation.message.delta") {
        deltaAnswer += answerText;
      }
    } catch (error) {
      if (event === "conversation.chat.failed") throw error;
    }
  }

  return {
    answer: (completedAnswer || deltaAnswer).trim(),
    conversationId,
  };
}

function readAnswerContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  // 兼容 Coze 将文本拆成结构化片段的响应格式，只提取明确的文本字段。
  return content
    .map((item) => {
      if (typeof item === "string") return item;
      if (typeof item?.text === "string") return item.text;
      if (typeof item?.content === "string") return item.content;
      return "";
    })
    .join("");
}

function readSseField(block, fieldName) {
  return block
    .split("\n")
    .filter((line) => line.startsWith(`${fieldName}:`))
    .map((line) => line.slice(fieldName.length + 1).trimStart())
    .join("\n");
}

module.exports = { parseCozeAnswer };
