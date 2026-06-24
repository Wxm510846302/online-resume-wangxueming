import { mkdir, appendFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { parseCozeSseChunk } from "../src/utils/cozeStream.js";

const DEFAULT_LOG_PATH = ".data/conversations.jsonl";

export function getClientIp(request) {
  const forwardedFor = firstHeaderValue(request, "x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return (
    firstHeaderValue(request, "x-real-ip") ||
    firstHeaderValue(request, "cf-connecting-ip") ||
    firstHeaderValue(request, "x-vercel-forwarded-for") ||
    "unknown"
  );
}

export function collectConversationStream(stream, { onComplete }) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let answer = "";

  return stream.pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);

        buffer += decoder.decode(chunk, { stream: true });
        const boundary = buffer.lastIndexOf("\n\n");
        if (boundary === -1) return;

        const parsable = buffer.slice(0, boundary + 2);
        buffer = buffer.slice(boundary + 2);
        answer += readAnswerText(parsable);
      },
      flush(controller) {
        if (buffer.trim()) {
          answer += readAnswerText(buffer);
          controller.enqueue(encoder.encode(""));
        }
        onComplete?.(answer);
      },
    }),
  );
}

export function buildConversationRecord({ request, question, answer, botId, userId, conversationId }) {
  return {
    timestamp: new Date().toISOString(),
    ip: getClientIp(request),
    userAgent: firstHeaderValue(request, "user-agent") || "",
    referer: firstHeaderValue(request, "referer") || "",
    userId,
    botId,
    conversationId: conversationId || "",
    question,
    answer,
  };
}

export async function writeConversationRecord(record) {
  const line = `${JSON.stringify(record)}\n`;
  const logPath = resolve(process.cwd(), process.env.CONVERSATION_LOG_PATH || DEFAULT_LOG_PATH);

  try {
    await mkdir(dirname(logPath), { recursive: true });
    await appendFile(logPath, line, "utf8");
  } catch {
    console.info("[conversation-log]", line.trim());
  }
}

function readAnswerText(chunk) {
  try {
    return parseCozeSseChunk(chunk).text;
  } catch {
    return "";
  }
}

function firstHeaderValue(request, name) {
  return request.headers.get(name)?.trim() || "";
}
