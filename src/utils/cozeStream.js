export function parseCozeSseChunk(chunk) {
  const events = chunk
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  let text = "";
  let done = false;
  // 记录本次数据块里出现的会话 ID，供前端持久化以维持多轮上下文与 AI 记忆。
  let conversationId = "";

  for (const block of events) {
    const event = readSseField(block, "event");
    const data = readSseField(block, "data");

    if (!event) continue;

    const payload = parseJsonData(data);

    // Coze 在 chat.created / message / completed 等事件里都会带 conversation_id，
    // 取到第一个非空值即可，用于把后续提问续接到同一个会话上。
    if (!conversationId && typeof payload?.conversation_id === "string") {
      conversationId = payload.conversation_id;
    }

    if (event === "done" || event === "conversation.chat.completed") {
      done = true;
      continue;
    }

    if (event === "error") {
      const code = payload?.code ?? "unknown";
      const message = payload?.msg || payload?.message || "Unknown Coze API error";
      throw new Error(`Coze API error ${code}: ${message}`);
    }

    if (
      event === "conversation.message.delta" &&
      payload?.role === "assistant" &&
      payload?.type === "answer" &&
      typeof payload.content === "string"
    ) {
      text += payload.content;
    }
  }

  return { text, done, conversationId };
}

function readSseField(block, fieldName) {
  return block
    .split("\n")
    .filter((line) => line.startsWith(`${fieldName}:`))
    .map((line) => line.slice(fieldName.length + 1).trimStart())
    .join("\n");
}

function parseJsonData(data) {
  if (!data || data === "[DONE]") return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}
