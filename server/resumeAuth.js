import { createHash, timingSafeEqual } from "node:crypto";

const AUTH_HASH_SALT = "online-resume-wangxueming";
const DEFAULT_TTL_SECONDS = 60 * 60 * 12;

export async function handleResumeLogin(request) {
  if (request.method === "OPTIONS") {
    return jsonResponse({}, 204);
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!username || !password) {
    return jsonResponse({ ok: false, error: "Username and password are required" }, 400);
  }

  const result = verifyResumeAdmin(username, password);
  if (!result.ok) {
    return jsonResponse({ ok: false, error: result.error || "Invalid credentials" }, result.status || 401);
  }

  return jsonResponse({
    ok: true,
    expiresAt: Date.now() + getAuthTtlSeconds() * 1000,
  });
}

export function verifyResumeAdmin(username, password) {
  const configuredUsername = readConfig("RESUME_ADMIN_USERNAME");
  const configuredPassword = readConfig("RESUME_ADMIN_PASSWORD");
  const configuredUsernameHash = readConfig("RESUME_ADMIN_USERNAME_HASH");
  const configuredPasswordHash = readConfig("RESUME_ADMIN_PASSWORD_HASH");

  if (configuredUsername && configuredPassword) {
    return {
      ok: safeEqual(username, configuredUsername) && safeEqual(password, configuredPassword),
    };
  }

  if (configuredUsernameHash && configuredPasswordHash) {
    return {
      ok: safeEqual(hashCredential("username", username), configuredUsernameHash)
        && safeEqual(hashCredential("password", password), configuredPasswordHash),
    };
  }

  return {
    ok: false,
    status: 500,
    error: "Resume admin credentials are not configured",
  };
}

export function hashCredential(kind, value) {
  return createHash("sha256")
    .update(`${AUTH_HASH_SALT}:${kind}:${value}`)
    .digest("hex");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getAuthTtlSeconds() {
  const raw = Number(readConfig("RESUME_ADMIN_SESSION_TTL_SECONDS"));
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TTL_SECONDS;
}

function readConfig(name) {
  return process.env[name] || "";
}

function jsonResponse(body, status) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}
