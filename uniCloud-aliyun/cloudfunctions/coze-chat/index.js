"use strict";

const COZE_CHAT_URL = "https://api.coze.cn/v3/chat";
const DEFAULT_BOT_ID = "7654798932023181327";
const DEFAULT_ALLOWED_ORIGIN = "https://wxm510846302.github.io";

exports.main = async function (event = {}, context = {}) {
  const origin = getHeader(event, "origin");

  if (event.httpMethod === "OPTIONS") {
    return response(204, "", origin);
  }

  if (event.httpMethod && event.httpMethod !== "POST") {
    return response(405, { error: "Method not allowed" }, origin);
  }

  const token = process.env.COZE_API_TOKEN || process.env.COZE_ACCESS_TOKEN;
  if (!token) {
    return response(500, { error: "Coze API token is not configured" }, origin);
  }

  const body = parseRequestBody(event);
  const question = String(body.question || "").trim();
  if (!question) {
    return response(400, { error: "Question is required" }, origin);
  }

  const botId = getBotId();
  const userId = safeId(body.userId) || buildUserId(event);

  const cozeRes = await uniCloud.httpclient.request(COZE_CHAT_URL, {
    method: "POST",
    contentType: "json",
    dataType: "text",
    timeout: 55000,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
    data: {
      bot_id: botId,
      user_id: userId,
      stream: true,
      auto_save_history: true,
      additional_messages: [
        {
          role: "user",
          content: question,
          content_type: "text",
        },
      ],
      meta_data: {
        source: "online-resume-wangxueming-unicloud",
      },
    },
  });

  const rawText = typeof cozeRes.data === "string" ? cozeRes.data : String(cozeRes.data || "");
  if (cozeRes.status >= 400) {
    return response(cozeRes.status, { error: "Coze API request failed", detail: rawText }, origin);
  }

  const answer = parseCozeAnswer(rawText);
  if (!answer) {
    return response(502, { error: "Coze did not return answer text" }, origin);
  }

  const record = {
    timestamp: new Date().toISOString(),
    ip: getClientIp(event),
    userAgent: getHeader(event, "user-agent"),
    userId,
    botId,
    question,
    answer,
  };
  await saveConversation(record);

  return response(200, { answer }, origin);
};

function parseRequestBody(event) {
  let body = event.body || event;
  if (event.isBase64Encoded && typeof body === "string") {
    body = Buffer.from(body, "base64").toString();
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body && typeof body === "object" ? body : {};
}

function parseCozeAnswer(text) {
  let deltaAnswer = "";
  let completedAnswer = "";
  for (const block of text.split(/\n\n+/)) {
    const event = readSseField(block, "event");
    if (event !== "conversation.message.delta" && event !== "conversation.message.completed") continue;

    const data = readSseField(block, "data");
    if (!data || data === "[DONE]") continue;

    try {
      const payload = JSON.parse(data);
      if (
        payload.role === "assistant" &&
        payload.type === "answer" &&
        typeof payload.content === "string"
      ) {
        if (event === "conversation.message.completed") {
          completedAnswer = payload.content;
        } else {
          deltaAnswer += payload.content;
        }
      }
    } catch {}
  }
  return (completedAnswer || deltaAnswer).trim();
}

function readSseField(block, fieldName) {
  return block
    .split("\n")
    .filter((line) => line.startsWith(`${fieldName}:`))
    .map((line) => line.slice(fieldName.length + 1).trimStart())
    .join("\n");
}

async function saveConversation(record) {
  try {
    const db = uniCloud.database();
    await db.collection("resume_ai_conversations").add(record);
  } catch (error) {
    console.log("conversation-log", record, error.message);
  }
}

function response(statusCode, body, origin) {
  return {
    mpserverlessComposedResponse: true,
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": getAllowedOrigin(origin),
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
      "access-control-max-age": "86400",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}

function getAllowedOrigin(origin) {
  const configured = process.env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
  if (!origin) return configured;
  if (origin === configured || origin.startsWith("http://localhost:")) return origin;
  return configured;
}

function getHeader(event, name) {
  const headers = event.headers || {};
  const key = Object.keys(headers).find((item) => item.toLowerCase() === name.toLowerCase());
  return key ? String(headers[key] || "") : "";
}

function getClientIp(event) {
  return (
    getHeader(event, "x-forwarded-for").split(",")[0].trim() ||
    getHeader(event, "x-real-ip") ||
    getHeader(event, "cf-connecting-ip") ||
    "unknown"
  );
}

function buildUserId(event) {
  const ip = getClientIp(event).replace(/[^\w-]/g, "");
  return ip ? `ip-${ip}`.slice(0, 64) : "resume-visitor";
}

function getBotId() {
  const envBotId = safeId(process.env.COZE_BOT_ID);
  return envBotId && envBotId !== "0" ? envBotId : DEFAULT_BOT_ID;
}

function safeId(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[^\w-]/g, "").slice(0, 64);
}
