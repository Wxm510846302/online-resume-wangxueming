"use strict";

const crypto = require("crypto");

const AUTH_HASH_SALT = "online-resume-wangxueming";
const DEFAULT_ALLOWED_ORIGIN = "https://wxm510846302.github.io";
const DEFAULT_TTL_SECONDS = 60 * 60 * 12;
const LOCAL_ENV = loadLocalEnv();

exports.main = async function (event = {}) {
  const origin = getHeader(event, "origin");

  if (event.httpMethod === "OPTIONS") {
    return response(204, "", origin);
  }

  if (event.httpMethod && event.httpMethod !== "POST") {
    return response(405, { error: "Method not allowed" }, origin);
  }

  const body = parseRequestBody(event);
  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  if (!username || !password) {
    return response(400, { ok: false, error: "Username and password are required" }, origin);
  }

  const result = verifyResumeAdmin(username, password);
  if (!result.ok) {
    return response(result.status || 401, { ok: false, error: result.error || "Invalid credentials" }, origin);
  }

  return response(200, {
    ok: true,
    expiresAt: Date.now() + getAuthTtlSeconds() * 1000,
  }, origin);
};

function verifyResumeAdmin(username, password) {
  const configuredUsername = getConfigValue("RESUME_ADMIN_USERNAME");
  const configuredPassword = getConfigValue("RESUME_ADMIN_PASSWORD");
  const configuredUsernameHash = getConfigValue("RESUME_ADMIN_USERNAME_HASH");
  const configuredPasswordHash = getConfigValue("RESUME_ADMIN_PASSWORD_HASH");

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
  const allowedOrigins = (getConfigValue("ALLOWED_ORIGIN") || DEFAULT_ALLOWED_ORIGIN)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const fallback = allowedOrigins[0] || DEFAULT_ALLOWED_ORIGIN;
  if (!origin) return fallback;
  if (allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    return origin;
  }
  return fallback;
}

function getHeader(event, name) {
  const headers = event.headers || {};
  const key = Object.keys(headers).find((item) => item.toLowerCase() === name.toLowerCase());
  return key ? String(headers[key] || "") : "";
}

function hashCredential(kind, value) {
  return crypto.createHash("sha256")
    .update(`${AUTH_HASH_SALT}:${kind}:${value}`)
    .digest("hex");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getAuthTtlSeconds() {
  const raw = Number(getConfigValue("RESUME_ADMIN_SESSION_TTL_SECONDS"));
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TTL_SECONDS;
}

function getConfigValue(name) {
  return process.env?.[name] || LOCAL_ENV[name] || "";
}

function loadLocalEnv() {
  try {
    const fs = require("fs");
    const path = require("path");
    const envPath = path.join(__dirname, ".env");
    if (!fs.existsSync(envPath)) return {};
    return Object.fromEntries(
      fs.readFileSync(envPath, "utf8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => {
          const index = line.indexOf("=");
          return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
        }),
    );
  } catch {
    return {};
  }
}
