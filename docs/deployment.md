# Deployment Notes

默认构建支持部署在域名根路径，例如 `https://example.com/`。

已提供静态 SPA 回退：

- Vercel: `vercel.json`
- Netlify: `netlify.toml`
- 通用静态托管: `public/_redirects`

如果部署到二级目录，例如 `https://example.com/resume/`，构建时设置：

```bash
VITE_BASE_PATH=/resume/ pnpm run build
```

同时确保托管平台把 `/resume/project/*` 回退到 `/resume/index.html`。
