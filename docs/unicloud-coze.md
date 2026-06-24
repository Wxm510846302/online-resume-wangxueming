# uniCloud Coze Proxy

This project can use uniCloud as the server-side Coze proxy for GitHub Pages.

## Deploy

1. Open this project in HBuilderX.
2. Associate a uniCloud service space.
3. Upload `uniCloud/cloudfunctions/coze-chat`.
4. In the uniCloud console, enable URL access for the function path `/coze-chat`.
5. Configure cloud function environment variables:

```text
COZE_API_TOKEN=your_coze_token
COZE_BOT_ID=7654798932023181327
ALLOWED_ORIGIN=https://wxm510846302.github.io
```

## GitHub Pages

Set a GitHub repository variable:

```text
VITE_COZE_PROXY_PATH=https://your-unicloud-domain/coze-chat
```

Then rerun the GitHub Pages workflow or push a new commit.

## Conversation Logs

The cloud function attempts to write conversation records to the uniCloud database collection:

```text
resume_ai_conversations
```

If database writing fails, it falls back to `console.log`.
