# 本地运行方法：
cd /Users/xuemingwang/Desktop/KKHC/online-resume-wangxueming

# Vite 7 需要 Node.js 20.19+，推荐 Node 22
nvm install 22
nvm use 22

# 首次运行需要安装依赖
npm install

npm run dev

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

## GitHub Pages API 限制

GitHub Pages 只能托管静态文件，不能处理 `/api/*` 的 POST 请求。AI 问答部署到 GitHub Pages 时，必须在构建环境中通过 `VITE_COZE_PROXY_PATHS` 配置 uniCloud、Vercel、Netlify 等外部 HTTPS 函数地址。

不要将相对地址 `/api/coze-chat` 配置为 GitHub Pages 的生产回退接口，否则浏览器请求会返回 HTTP 405。修改仓库 Variables 后需重新运行 Pages 发布工作流，环境变量才会写入新的前端构建产物。
