import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { Readable } from "node:stream";
import { handleCozeChat } from "./server/cozeProxy.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.COZE_API_TOKEN ||= env.COZE_API_TOKEN;
  process.env.COZE_ACCESS_TOKEN ||= env.COZE_ACCESS_TOKEN;
  process.env.COZE_BOT_ID ||= env.COZE_BOT_ID;

  return {
    plugins: [react(), cozeDevApi()],
    base: process.env.VITE_BASE_PATH || "/",
  };
});

function cozeDevApi() {
  return {
    name: "coze-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/coze-chat", async (req, res) => {
        try {
          const response = await handleCozeChat(toWebRequest(req, server));
          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });

          if (!response.body) {
            res.end();
            return;
          }

          Readable.fromWeb(response.body).pipe(res);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: error.message || "Local Coze proxy failed" }));
        }
      });
    },
  };
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
