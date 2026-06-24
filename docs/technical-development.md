# 技术开发文档

本文档面向 `online-resume-wangxueming` 项目的后续开发、维护、部署和问题排查。

## 1. 项目概览

这是一个基于 React + Vite 的个人在线简历站点，主要能力包括：

- 首页简历展示：个人定位、核心指标、技能矩阵、工作经历、教育经历。
- 项目案例展示：项目卡片和项目详情页。
- AI 问答助手：页面内嵌聊天区 + 右下角悬浮聊天窗口。
- 简历 PDF 下载：静态托管 `public/wangxueming-resume.pdf`。
- GitHub Pages 自动发布：`main` 分支推送后自动构建并发布到 `gh-pages`。
- Coze 智能体接入：前端调用 uniCloud 代理，避免在前端暴露 Coze API Token。
- 对话记录：uniCloud 云函数按 IP / userId 记录访客问答。

线上地址：

```text
https://wxm510846302.github.io/online-resume-wangxueming/
```

## 2. 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端框架 | React 19 |
| 构建工具 | Vite 7 |
| 图标 | lucide-react |
| 样式 | 原生 CSS，集中在 `src/styles.css` |
| 数据 | `src/data/resume.js` 静态结构化数据 |
| AI 接口 | Coze Chat v3 |
| AI 代理 | uniCloud 云函数，另保留 Vercel / Netlify 代理适配 |
| 部署 | GitHub Pages |
| CI/CD | GitHub Actions |
| 测试 | Node.js test runner + 内容完整性检查 + Vite build |

## 3. 目录结构

```text
.
├── .github/workflows/deploy-pages.yml   # GitHub Pages 自动发布工作流
├── api/coze-chat.js                      # Vercel Function 入口
├── docs/                                 # 项目文档与验证截图
├── netlify/functions/coze-chat.js        # Netlify Function 入口
├── public/                               # 原样复制到 dist 的静态资源
│   ├── favicon.svg
│   ├── _redirects
│   └── wangxueming-resume.pdf            # 下载简历 PDF
├── scripts/check-content.mjs             # 内容结构校验脚本
├── server/
│   ├── conversationLogger.js             # Node 代理下的对话日志记录
│   ├── conversationLogger.test.mjs
│   └── cozeProxy.js                      # Node/Vercel/Netlify 代理逻辑
├── src/
│   ├── assets/images/                    # 页面图片资源
│   ├── data/resume.js                    # 简历与项目内容源
│   ├── utils/cozeStream.js               # Coze SSE 解析
│   ├── utils/cozeStream.test.mjs
│   ├── main.jsx                          # React 页面与交互主入口
│   └── styles.css                        # 全站样式
├── uniCloud-aliyun/cloudfunctions/coze-chat/
│   ├── index.js                          # uniCloud Coze 代理
│   └── package.json
├── vite.config.js                        # Vite 配置和本地 Coze API 中间件
└── package.json
```

## 4. 本地开发

### 4.1 安装依赖

```bash
npm install
```

项目仓库里存在 `pnpm-lock.yaml`，但当前 GitHub Actions 使用的是 `npm install`，为了和线上构建一致，本地优先使用 npm。

### 4.2 启动开发服务

```bash
npm run dev
```

默认 Vite 会监听 `0.0.0.0`，本地可访问：

```text
http://localhost:5173/
```

### 4.3 按 GitHub Pages 二级路径预览

GitHub Pages 站点部署在 `/online-resume-wangxueming/` 子路径下。验证线上路径相关问题时，应使用：

```bash
VITE_BASE_PATH=/online-resume-wangxueming/ \
VITE_COZE_PROXY_PATH=https://fc-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/coze-chat \
npm run build

VITE_BASE_PATH=/online-resume-wangxueming/ \
VITE_COZE_PROXY_PATH=https://fc-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/coze-chat \
npm run preview -- --port 4187
```

预览地址：

```text
http://localhost:4187/online-resume-wangxueming/
```

## 5. 核心模块说明

### 5.1 页面入口

主入口文件：

```text
src/main.jsx
```

关键组件：

| 组件 / 方法 | 作用 |
| --- | --- |
| `App` | 顶层路由分发，决定展示首页、项目详情页或 404 |
| `getRoute` | 支持 `#/project/:slug` hash 路由，兼容 GitHub Pages |
| `Header` | 顶部导航和 PDF 下载按钮 |
| `Home` | 首页整体布局 |
| `HeroVisual` | 首页右侧人物与技术背景图 |
| `AssistantSection` | 页面内 AI 问答区域 |
| `AssistantChat` | 聊天 UI、输入、消息列表 |
| `FloatingAssistant` | 右下角悬浮聊天窗口，进入页面 3 秒后自动弹出 |
| `ProjectCard` | 项目卡片 |
| `ProjectDetail` | 项目详情页 |
| `TimelineCompact` | 工作经历，支持“查看完整经历 / 收起” |

### 5.2 路由设计

GitHub Pages 静态站不适合直接访问 `/project/foo` 这类前端路由，因为刷新后容易 404。

当前项目详情页统一使用 hash 路由：

```text
https://wxm510846302.github.io/online-resume-wangxueming/#/project/:slug
```

对应逻辑在 `src/main.jsx`：

```js
if (window.location.hash.startsWith("#/project/")) {
  return window.location.hash.slice(1);
}
```

项目卡片里的“查看详情 / 演示 / 截图”目前都指向同一个项目详情页，避免二级页面 404。

### 5.3 简历内容数据

主要内容源：

```text
src/data/resume.js
```

包含两类导出：

```js
export const resume = { ... };
export const projects = [ ... ];
```

常见改动位置：

| 修改内容 | 文件位置 |
| --- | --- |
| 姓名、电话、邮箱、定位 | `resume` 顶层字段 |
| 首页摘要 | `resume.summary` 或 `src/main.jsx` hero 文案 |
| 核心指标 | `resume.metrics` |
| 技能矩阵 | `resume.skills` |
| 工作经历 | `resume.timeline` |
| 教育经历 | `resume.education` |
| 项目卡片 / 详情 | `projects` 数组 |

修改后建议运行：

```bash
npm run check:content
```

该脚本会检查必填字段、项目数量、项目详情结构和源简历关键字映射。

### 5.4 样式系统

样式集中在：

```text
src/styles.css
```

当前设计特点：

- 背景使用浅色网格和克制的蓝色强调。
- 首页使用左右分栏，移动端切为单列。
- 卡片圆角整体控制在 8px 到 16px。
- 导航固定在顶部。
- 悬浮 AI 窗口固定右下角，移动端铺满底部宽度。

移动端响应式主要在：

```css
@media (max-width: 760px) { ... }
```

改样式后必须检查：

- 375px 宽度是否横向溢出。
- 顶部导航是否遮挡内容。
- AI 悬浮窗是否超出屏幕。
- 长中文、邮箱、电话、标签是否换行或截断合理。

## 6. AI 问答接入

### 6.1 前端调用链路

前端聊天调用在 `src/main.jsx`：

```js
const cozeApiPath = import.meta.env.VITE_COZE_PROXY_PATH || "/api/coze-chat";
```

提问时调用：

```js
fetch(cozeApiPath, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    question,
    userId: getVisitorId(),
  }),
});
```

本地开发时如果没有配置 `VITE_COZE_PROXY_PATH`，会请求：

```text
/api/coze-chat
```

这个本地接口由 `vite.config.js` 中的 `cozeDevApi()` 中间件接管。

线上 GitHub Pages 构建时使用：

```text
VITE_COZE_PROXY_PATH=https://fc-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/coze-chat
```

### 6.2 为什么不能把 Key 写在前端

Coze API Token 不能写入前端代码。原因：

- 前端 JS 会被任何访客下载。
- Token 一旦暴露，任何人都可以直接调用接口。
- GitHub Pages 是纯静态托管，没有服务端环境变量保护能力。

因此当前采用：

```text
浏览器 -> uniCloud 云函数 -> Coze API
```

### 6.3 uniCloud 云函数

云函数目录：

```text
uniCloud-aliyun/cloudfunctions/coze-chat/
```

入口：

```text
uniCloud-aliyun/cloudfunctions/coze-chat/index.js
```

云函数职责：

- 处理 CORS。
- 校验请求方法和问题内容。
- 从环境变量读取 Coze Token。
- 调用 `https://api.coze.cn/v3/chat`。
- 解析 Coze SSE 文本。
- 返回 JSON：

```json
{
  "answer": "..."
}
```

- 写入对话记录到 uniCloud 数据库集合：

```text
resume_ai_conversations
```

### 6.4 uniCloud 环境变量

云函数需要配置：

```text
COZE_API_TOKEN=你的 Coze Token
COZE_BOT_ID=7654798932023181327
ALLOWED_ORIGIN=https://wxm510846302.github.io
```

可选兼容变量：

```text
COZE_ACCESS_TOKEN=你的 Coze Token
```

### 6.5 对话记录与访客识别

前端通过 localStorage 生成访客 ID：

```text
resume-coze-user-id
```

云函数还会通过请求头获取 IP：

- `x-forwarded-for`
- `x-real-ip`
- `cf-connecting-ip`

uniCloud 记录字段包括：

| 字段 | 说明 |
| --- | --- |
| `timestamp` | 对话时间 |
| `ip` | 访客 IP |
| `userAgent` | 浏览器 UA |
| `userId` | 前端访客 ID 或 IP 兜底 |
| `botId` | Coze Bot ID |
| `question` | 用户问题 |
| `answer` | AI 回复 |

注意：IP 只能用于粗略区分访客，不能保证唯一身份。

## 7. PDF 下载

PDF 文件位于：

```text
public/wangxueming-resume.pdf
```

构建后会复制到：

```text
dist/wangxueming-resume.pdf
```

线上地址：

```text
https://wxm510846302.github.io/online-resume-wangxueming/wangxueming-resume.pdf
```

顶部按钮在 `Header` 中：

```jsx
<a
  className="nav-cta"
  href={`${basePath}/wangxueming-resume.pdf`}
  download="王学明开发岗个人简历v2.5.2.pdf"
>
  下载简历 PDF
</a>
```

如果要替换 PDF：

1. 用新文件覆盖 `public/wangxueming-resume.pdf`。
2. 如果下载文件名变化，同步修改 `download` 属性。
3. 运行 `npm test`。
4. 提交并推送。

## 8. 构建与测试

### 8.1 全量测试

```bash
npm test
```

等价于：

```bash
npm run test:unit
npm run check:content
npm run build
```

### 8.2 单元测试

```bash
npm run test:unit
```

当前覆盖：

- Coze SSE 解析。
- Node 代理下的对话日志记录。

### 8.3 内容检查

```bash
npm run check:content
```

用于防止结构化简历数据缺字段、项目案例缺字段或源简历重要关键字丢失。

### 8.4 构建

```bash
npm run build
```

本地默认构建到根路径 `/`。

GitHub Pages 需要：

```bash
VITE_BASE_PATH=/online-resume-wangxueming/ npm run build
```

## 9. GitHub Pages 发布

工作流文件：

```text
.github/workflows/deploy-pages.yml
```

触发条件：

- 推送到 `main`。
- 手动触发 `workflow_dispatch`。

流程：

1. Checkout `main`。
2. 安装 Node 22。
3. `npm install`。
4. 设置环境变量并运行 `npm run build`。
5. 进入 `dist`。
6. 初始化临时 `gh-pages` 分支。
7. force push 到远端 `gh-pages`。

关键构建环境变量：

```yaml
VITE_BASE_PATH: /online-resume-wangxueming/
VITE_COZE_PROXY_PATH: https://fc-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/coze-chat
```

发布后如果页面短时间仍显示旧内容，多半是 GitHub Pages CDN 缓存。可用缓存参数验证：

```text
https://wxm510846302.github.io/online-resume-wangxueming/?v=提交哈希
```

也可以检查当前 HTML 引用的 JS 文件名：

```bash
curl -fsSL "https://wxm510846302.github.io/online-resume-wangxueming/?v=COMMIT" \
  | sed -n 's/.*src="\([^"]*index-[^"]*\.js\)".*/\1/p'
```

## 10. 常见开发任务

### 10.1 修改首页文案

常见位置：

- `src/main.jsx`：hero 固定文案、AI 区说明、聊天默认提示。
- `src/data/resume.js`：结构化简历内容。

修改后：

```bash
npm test
git add src/main.jsx src/data/resume.js
git commit -m "Update resume copy"
git push origin main
```

### 10.2 修改项目案例

编辑：

```text
src/data/resume.js
```

每个项目必须包含：

```text
slug, name, period, role, summary, stack,
background, responsibilities, results, interviewAngles, assets
```

`slug` 会用于项目详情页路由：

```text
#/project/:slug
```

### 10.3 修改 AI 快捷问题

编辑：

```text
src/main.jsx
```

位置：

```js
const assistantPrompts = [
  ...
];
```

本地兜底回答在：

```js
const assistantReplies = {
  ...
};
```

真实 AI 不通时，会展示兜底回答和错误提示。

### 10.4 替换首页图片

图片目录：

```text
src/assets/images/
```

当前首页主要使用：

```text
hero-layer-bg.jpg
hero-layer-person.png
avatar-ai.png
```

替换图片后应检查：

- 桌面端人物位置。
- 移动端是否裁切或横向溢出。
- 图片体积是否过大。

### 10.5 修改自动弹窗行为

位置：

```text
src/main.jsx
```

组件：

```js
function FloatingAssistant({ assistant }) { ... }
```

当前行为：

- 首次进入页面 3 秒后自动打开。
- 如果用户在 3 秒内手动点过头像或关闭按钮，则不再强制弹出。

## 11. 故障排查

### 11.1 推送后线上文案没有变化

排查顺序：

1. 确认改动已提交：

```bash
git log -1 --oneline
git status --short
```

2. 确认 GitHub Actions 成功。
3. 带缓存参数访问：

```text
?v=提交哈希
```

4. 检查线上 HTML 使用的新 JS 文件名。
5. 如果 `gh-pages` 已更新但页面仍旧，等待 GitHub Pages CDN 刷新。

### 11.2 项目详情页 404

应使用 hash 路由：

```text
/#/project/:slug
```

不要直接用：

```text
/project/:slug
```

### 11.3 AI 显示未连通或 404

检查：

- `VITE_COZE_PROXY_PATH` 是否指向可访问的 uniCloud 云函数。
- uniCloud 云函数 URL 访问路径是否为 `/coze-chat`。
- 云函数环境变量是否配置 `COZE_API_TOKEN`。
- Coze Token 是否有效、额度是否可用。
- 浏览器控制台是否有 CORS 报错。

### 11.4 Coze 返回额度或权限错误

如果接口返回类似 quota / permission / token 错误：

- 检查 Coze Token 是否过期。
- 检查智能体 Bot ID 是否正确。
- 检查 Coze 账号额度。
- 检查 Token 是否有 Chat API 权限。

### 11.5 PDF 下载无效

检查：

```bash
curl -I https://wxm510846302.github.io/online-resume-wangxueming/wangxueming-resume.pdf
```

预期：

```text
HTTP/2 200
content-type: application/pdf
```

如果 404：

- 确认 `public/wangxueming-resume.pdf` 存在。
- 确认构建后 `dist/wangxueming-resume.pdf` 存在。
- 确认 Pages 部署完成。

## 12. 安全注意事项

- 不要把 `COZE_API_TOKEN` 写进前端代码。
- 不要提交 `.env.local`。
- 不要在文档或 issue 中泄露真实 Token。
- 对话日志包含用户问题、IP、UA，后续如果公开日志或导出数据，需要脱敏。
- GitHub Pages 是静态托管，只适合公开资源；私密能力必须走服务端或云函数。

## 13. 推荐发布流程

每次上线建议按以下顺序：

```bash
git status --short
npm test
git add <changed-files>
git commit -m "Your commit message"
git push origin main
```

发布完成后验证：

```bash
curl -fsSL "https://wxm510846302.github.io/online-resume-wangxueming/?v=$(git rev-parse --short HEAD)"
```

重点检查：

- 首页是否正常渲染。
- 顶部 PDF 下载是否可用。
- 项目详情页是否可打开。
- AI 悬浮窗是否 3 秒后自动打开。
- AI 问答是否能返回真实结果或合理兜底。

