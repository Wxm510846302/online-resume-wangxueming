import test from "node:test";
import assert from "node:assert/strict";
import { isTransientProxyError, runWithTransientRetry } from "./proxyRetry.js";

test("retries a transient network error once and returns the recovered result", async () => {
  let attempts = 0;
  const result = await runWithTransientRetry(async () => {
    attempts += 1;
    if (attempts === 1) throw new TypeError("Failed to fetch");
    return "recovered";
  }, { delayMs: 0 });

  assert.equal(result, "recovered");
  assert.equal(attempts, 2);
});

test("does not retry a non-transient client error", async () => {
  let attempts = 0;
  const error = new Error("Question is required");
  error.status = 400;

  await assert.rejects(
    runWithTransientRetry(async () => {
      attempts += 1;
      throw error;
    }, { delayMs: 0 }),
    error,
  );
  assert.equal(attempts, 1);
});

test("classifies retryable HTTP and empty-response failures", () => {
  const serverError = new Error("HTTP 502");
  serverError.status = 502;
  const clientError = new Error("HTTP 401");
  clientError.status = 401;

  assert.equal(isTransientProxyError(serverError), true);
  assert.equal(isTransientProxyError(clientError), false);
  assert.equal(isTransientProxyError(new Error("Coze 没有返回可展示内容")), true);
});
