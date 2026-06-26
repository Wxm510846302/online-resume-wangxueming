# uniCloud Coze Proxy

This project can use uniCloud as the server-side Coze proxy for GitHub Pages.

## Deploy

1. Open this project in HBuilderX.
2. Associate a uniCloud service space.
3. Upload `uniCloud-aliyun/cloudfunctions/coze-chat`.
4. In the uniCloud console, confirm URL access for the function path `/coze-chat`.
5. Configure cloud function environment variables, or inject them during upload from a local ignored file:

```text
COZE_API_TOKEN=your_coze_token
COZE_BOT_ID=7654798932023181327
ALLOWED_ORIGIN=https://wxm510846302.github.io
COZE_CHAT_TIMEOUT_MS=55000
COZE_SPEECH_TIMEOUT_MS=30000
SAVE_CONVERSATIONS=false
```

`GBs` in the uniCloud console means `memory GB * execution seconds`, not outbound traffic. The old function config was 512MB memory with a 55s upstream wait, so one slow invocation could cost about `0.5 * 55 = 27.5 GBs`. 77 slow invocations can exceed 1000GBs.

The optimized config uses:

```text
memorySize=256MB
concurrency=1
timeout=60s
COZE_CHAT_TIMEOUT_MS=55000
COZE_SPEECH_TIMEOUT_MS=30000
auto_save_history=false
SAVE_CONVERSATIONS=false
```

With this setup, the function still avoids the old 512MB cost and skips extra database writes, but a normal AI answer is not cut off by a very short 15s client timeout. `concurrency=1` is intentional: Alibaba Cloud uniCloud requires at least 512MB memory when concurrency is greater than 1, so keeping concurrency at 1 allows the lower 256MB memory setting. In the worst case, one chat invocation is capped around `0.25 * 55 = 13.75 GBs` before platform overhead.

## GitHub Pages

GitHub Pages is static hosting, so it cannot run `api/coze-chat.js` directly. Production AI requests must go through an external server-side proxy such as uniCloud, Vercel, Netlify, or another HTTPS function.

The app supports comma-separated proxy fallbacks:

```text
VITE_COZE_PROXY_PATHS=https://primary.example.com/coze-chat,https://backup.example.com/api/coze-chat
VITE_COZE_SPEECH_PROXY_PATHS=https://primary.example.com/coze-chat,https://backup.example.com/api/coze-chat
```

For GitHub Pages, configure repository Variables:

```text
VITE_COZE_PROXY_PATHS
VITE_COZE_SPEECH_PROXY_PATHS
```

If these variables are not configured, the workflow falls back to the original uniCloud URL:

```text
https://fc-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/coze-chat
```

If that URL returns `PrePayResourceExhausted`, the uniCloud service space has exhausted its function resources and browser requests will fail before the cloud function can return CORS headers. Recharge or upgrade the uniCloud service space, or configure `VITE_COZE_PROXY_PATHS` with another available proxy URL. Push a new commit or rerun the GitHub Pages workflow after changing variables.

Recommended alternatives:

- Deploy this repo to Vercel or Netlify and use their built-in `api/coze-chat` / `netlify/functions/coze-chat` server function with `COZE_API_TOKEN` stored as an environment variable.
- Keep GitHub Pages as the static site and set `VITE_COZE_PROXY_PATHS` to a Vercel/Netlify/Cloudflare Worker HTTPS proxy URL.
- Do not put `COZE_API_TOKEN` in frontend code. GitHub Pages JS is public and the token can be copied from DevTools or the downloaded bundle.

## Conversation Logs

The cloud function attempts to write conversation records to the uniCloud database collection:

```text
resume_ai_conversations
```

If database writing fails, it falls back to `console.log`.
