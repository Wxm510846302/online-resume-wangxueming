export function parseCozeSseChunk(chunk) {
  const events = chunk
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  let text = "";
  let done = false;

  for (const block of events) {
    const event = readSseField(block, "event");
    const data = readSseField(block, "data");

    if (!event) continue;
    if (event === "done" || event === "conversation.chat.completed") {
      done = true;
      continue;
    }

    const payload = parseJsonData(data);

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

  return { text, done };
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
