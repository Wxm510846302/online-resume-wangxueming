# App运营配置中心集成说明

配置中心已作为 `DesktopVersion` 的内嵌工具接入，桌面端左侧菜单通过 `index.html` 打开本目录的静态前端。

## 当前部署方式（uniCloud）

前端是静态网页，部署在 uniCloud 前端网页托管；数据、鉴权、文件上传和测试环境调用由 URL 化云函数处理。

- 静态入口：`https://static-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/DesktopVersion/`
- 云函数入口：`https://fc-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/app-config-center-api`
- 云函数源码：`DesktopVersion/uniCloud-aliyun/cloudfunctions/app-config-center/`
- 数据库 Schema：`DesktopVersion/uniCloud-aliyun/database/app_config_*.schema.json`

管理员登录桌面后台时会换取 12 小时的短期云端令牌，令牌过期后退出并重新登录即可。令牌只传给同源内嵌页面，不在静态文件中保存固定密钥。

## 为什么不能只有静态网页

`index.html`、`app.js`、`styles.css`、`config.js` 都是可静态托管的。将 `config.js` 中的 `apiBaseUrl` 改为独立后端的完整 HTTPS 地址：

```js
window.APP_CONFIG_CENTER = Object.freeze({
  apiBaseUrl: 'https://config-api.example.com',
});
```

以下能力不能只靠静态网页可靠完成，因此已迁移到 uniCloud 云函数：

- 配置记录、操作日志及多人共享数据；
- 图片和 Excel 上传、持久化及公网 URL；
- 从服务端请求测试环境接口，避免浏览器跨域限制；
- 后续接入登录鉴权、权限控制、审计和密钥管理。

## 本地 Node 后端

`backend/` 保留为本地开发和回退实现，不随静态网页发布。运行方式：

```bash
cd app-config-center/backend
npm ci
npm start
```

## 运行数据

`backend/data/` 和 `backend/uploads/` 是本地运行时目录，已忽略实际内容。不要把真实配置记录、上传文件、访问令牌或接口密钥提交到 Git。
