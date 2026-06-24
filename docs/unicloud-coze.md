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
```

## GitHub Pages

The GitHub Pages workflow currently builds with this public proxy URL:

```text
VITE_COZE_PROXY_PATH=https://fc-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/coze-chat
```

Push a new commit to rerun the GitHub Pages workflow.

## Conversation Logs

The cloud function attempts to write conversation records to the uniCloud database collection:

```text
resume_ai_conversations
```

If database writing fails, it falls back to `console.log`.
