const TRANSIENT_NETWORK_PATTERN = /Failed to fetch|NetworkError|Load failed|fetch failed|timeout|timed out|network/i;
const TRANSIENT_RESPONSE_PATTERN = /没有返回|未生成可展示|no(?:t)? return|no .*content|empty response/i;

// 仅重试网络抖动、超时、限流和服务端错误，避免对明确的业务型 4xx 请求重复提交。
export function isTransientProxyError(error) {
  const status = Number(error?.status || 0);
  if (status) {
    return status === 408 || status === 425 || status === 429 || status >= 500;
  }

  const detail = String(error?.message || error || "");
  return TRANSIENT_NETWORK_PATTERN.test(detail) || TRANSIENT_RESPONSE_PATTERN.test(detail);
}

// 在同一代理发生瞬时故障时做一次短退避重试，减少偶发网络错误直接暴露给访客。
export async function runWithTransientRetry(operation, options = {}) {
  const maxAttempts = Math.max(1, Number(options.maxAttempts) || 2);
  const delayMs = Math.max(0, Number(options.delayMs) || 0);
  const signal = options.signal;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (signal?.aborted || attempt >= maxAttempts || !isTransientProxyError(error)) {
        throw error;
      }
      await waitForRetry(delayMs, signal);
    }
  }

  throw lastError || new Error("代理请求失败");
}

function waitForRetry(delayMs, signal) {
  if (signal?.aborted) {
    return Promise.reject(createAbortError());
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, delayMs);
    const handleAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", handleAbort);
      reject(createAbortError());
    };
    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

function createAbortError() {
  const error = new Error("请求已取消");
  error.name = "AbortError";
  return error;
}
