import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { Readable } from "node:stream";
import { handleCozeChat } from "./server/cozeProxy.js";

const resumeLoginCloudApiPath = "https://fc-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/resume-login";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.COZE_API_TOKEN ||= env.COZE_API_TOKEN;
  process.env.COZE_ACCESS_TOKEN ||= env.COZE_ACCESS_TOKEN;
  process.env.COZE_BOT_ID ||= env.COZE_BOT_ID;
  process.env.COZE_VOICE_ID ||= env.COZE_VOICE_ID;
  process.env.COZE_AGENT_VOICE_ID ||= env.COZE_AGENT_VOICE_ID;
  process.env.COZE_SPEECH_SPEED ||= env.COZE_SPEECH_SPEED;
  process.env.RESUME_ADMIN_USERNAME ||= env.RESUME_ADMIN_USERNAME;
  process.env.RESUME_ADMIN_PASSWORD ||= env.RESUME_ADMIN_PASSWORD;
  process.env.RESUME_ADMIN_USERNAME_HASH ||= env.RESUME_ADMIN_USERNAME_HASH;
  process.env.RESUME_ADMIN_PASSWORD_HASH ||= env.RESUME_ADMIN_PASSWORD_HASH;
  process.env.RESUME_ADMIN_SESSION_TTL_SECONDS ||= env.RESUME_ADMIN_SESSION_TTL_SECONDS;

  return {
    plugins: [react(), resumeLoginDevApi(), cozeDevApi()],
    base: process.env.VITE_BASE_PATH || "/",
  };
});

function resumeLoginDevApi() {
  return {
    name: "resume-login-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/resume-login", async (req, res) => {
        try {
          const request = toWebRequest(req, server);
          const response = await fetch(resumeLoginCloudApiPath, {
            method: request.method,
            headers: {
              "content-type": request.headers.get("content-type") || "application/json;charset=utf-8",
              origin: `${server.config.server.https ? "https" : "http"}://${req.headers.host || "localhost"}`,
            },
            body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
          });
          sendWebResponse(response, res);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: error.message || "Local resume login failed" }));
        }
      });
    },
  };
}

function cozeDevApi() {
  return {
    name: "coze-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/coze-chat", async (req, res) => {
        try {
          const response = await handleCozeChat(toWebRequest(req, server));
          sendWebResponse(response, res);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: error.message || "Local Coze proxy failed" }));
        }
      });
    },
  };
}

function sendWebResponse(response, res) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  Readable.fromWeb(response.body).pipe(res);
}

function toWebRequest(req, server) {
  const protocol = server.config.server.https ? "https" : "http";
  const host = req.headers.host || "localhost";
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else if (value) {
      headers.set(key, value);
    }
  }

  return new Request(`${protocol}://${host}${req.originalUrl || req.url}`, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
    duplex: "half",
  });
}
