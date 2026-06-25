import {
  buildConversationRecord,
  collectConversationStream,
  writeConversationRecord,
} from "./conversationLogger.js";

const COZE_CHAT_URL = "https://api.coze.cn/v3/chat";
const COZE_SPEECH_URL = "https://api.coze.cn/v1/audio/speech";
const DEFAULT_COZE_VOICE_ID = "7426725529589645339";
const DEFAULT_BOT_ID = "7654798932023181327";

export async function handleCozeChat(request) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const token = process.env.COZE_API_TOKEN || process.env.COZE_ACCESS_TOKEN;
  if (!token) {
    return jsonResponse(
      {
        error: "Coze API token is not configured",
        detail: "Set COZE_API_TOKEN with a Coze personal access token that has chat permission.",
      },
      500,
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (payload?.action === "speech") {
    return handleCozeSpeechPayload(payload, token);
  }

  const question = String(payload?.question || "").trim();
  if (!question) {
    return jsonResponse({ error: "Question is required" }, 400);
  }

  const botId = getBotId();
  const userId = buildUserId(payload?.userId);
  const conversationId = safeId(payload?.conversationId);
  const upstreamUrl = conversationId
    ? `${COZE_CHAT_URL}?conversation_id=${encodeURIComponent(conversationId)}`
    : COZE_CHAT_URL;

  const upstream = await fetch(upstreamUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
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
        source: "online-resume-wangxueming",
      },
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return jsonResponse(
      {
        error: "Coze API request failed",
        status: upstream.status,
        detail,
      },
      upstream.status || 502,
    );
  }

  const loggedBody = collectConversationStream(upstream.body, {
    onComplete: (answer) => {
      const record = buildConversationRecord({
        request,
        question,
        answer,
        botId,
        userId,
        conversationId,
      });
      writeConversationRecord(record);
    },
  });

  return new Response(loggedBody, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

async function handleCozeSpeechPayload(payload, token) {
  const input = String(payload?.text || payload?.input || "").trim();
  if (!input) {
    return jsonResponse({ error: "Speech text is required" }, 400);
  }

  const upstream = await fetch(COZE_SPEECH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "audio/mpeg, audio/*, application/json",
    },
    body: JSON.stringify({
      input: input.slice(0, 1000),
      voice_id: getVoiceId(),
      response_format: "mp3",
      speed: Number(process.env.COZE_SPEECH_SPEED || 1),
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return jsonResponse(
      {
        error: "Coze speech request failed",
        status: upstream.status,
        detail,
      },
      upstream.status || 502,
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function buildUserId(value) {
  const fallback = "resume-visitor";
  return safeId(value) || fallback;
}

function getBotId() {
  const envBotId = safeId(process.env.COZE_BOT_ID);
  return envBotId && envBotId !== "0" ? envBotId : DEFAULT_BOT_ID;
}

function getVoiceId() {
  const envVoiceId = safeNumericId(process.env.COZE_VOICE_ID || process.env.COZE_AGENT_VOICE_ID);
  return envVoiceId && envVoiceId !== "0" ? envVoiceId : DEFAULT_COZE_VOICE_ID;
}

function safeNumericId(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return /^\d{6,}$/.test(trimmed) ? trimmed : "";
}

function safeId(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[^\w-]/g, "").slice(0, 64);
}
