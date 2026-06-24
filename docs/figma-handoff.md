# Figma 设计交接

## 当前状态

已完成线上简历视觉概念图和前端实现，概念图保存在：

- `src/assets/images/design-concept.png`

Figma 插件当前暴露了 `create_new_file` 和 `use_figma`，但没有暴露用于获取 `planKey` 的 `whoami` 工具；`create_new_file` 必须提供 `planKey`。因此本轮无法在没有 Figma 文件 URL 或 planKey 的情况下自动创建 Figma 文件。

## 可继续推送到 Figma 的输入

任一方式即可：

- 提供一个已有 Figma design 文件 URL。
- 提供可用于 `create_new_file` 的 Figma `planKey`。

## 设计方向

- 首页：姓名 `王学明` 作为首屏主信号，定位为高级前端全栈/客户端跨端开发工程师。
- 视觉：白色/石墨色为主，电青色和暖琥珀强调，避免紫蓝、深蓝和米色单一主题。
- 结构：首页 hero、核心指标、能力矩阵、职业路径、教育与技术转型、项目案例、简历丰富建议。
- 详情页：项目背景、关键职责、成果与指标、面试讲法、demo/视频/截图素材状态。
- 3D 形象：桌面可替换为轻量 GLB，移动端使用静态/伪 3D 降级。

## Figma 页面建议

- `Home / Desktop 1440`
- `Home / Mobile 390`
- `Project Detail / Desktop 1440`
- `Project Detail / Mobile 390`
- `Components / Project Card`
- `Components / Media Placeholder`
- `Components / Avatar Stage`
