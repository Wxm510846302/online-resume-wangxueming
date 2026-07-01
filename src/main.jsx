import React from "react";
import { createRoot } from "react-dom/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowUpRight, Blocks, BriefcaseBusiness, CalendarClock, Camera, CheckCircle2, ChevronDown, ChevronUp, Code2, Copy, Cpu, Download, FileText, Gauge, Gamepad2, Github, KeyRound, LockKeyhole, Mail, MapPin, Menu, MessageCircle, PackageCheck, Phone, PlayCircle, RefreshCw, Send, ShieldCheck, Shuffle, Sparkles, Square, TimerReset, UserCog, Volume2, X } from "lucide-react";
import { resume, projects } from "./data/resume.js";
import { parseCozeSseChunk } from "./utils/cozeStream.js";
import aiAvatar from "./assets/images/avatar-ai.png?avatar-ai-v1";
import heroLayerBg from "./assets/images/hero-layer-bg.jpg?layered-v1";
import heroLayerPerson from "./assets/images/hero-layer-person.png?layered-v1";
import "./styles.css";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const defaultCozeApiPath = import.meta.env.VITE_COZE_PROXY_PATH || "/api/coze-chat";
const cozeApiPaths = parseProxyPaths(import.meta.env.VITE_COZE_PROXY_PATHS, defaultCozeApiPath);
const cozeSpeechApiPaths = parseProxyPaths(
  import.meta.env.VITE_COZE_SPEECH_PROXY_PATHS,
  import.meta.env.VITE_COZE_SPEECH_PROXY_PATH || cozeApiPaths,
);
const resumeLoginCloudApiPath = "https://fc-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/resume-login";
const resumeLoginDefaultApiPath = isLocalRuntime() ? "/api/resume-login" : resumeLoginCloudApiPath;
const resumeLoginApiPath = import.meta.env.VITE_RESUME_LOGIN_PROXY_PATH || resumeLoginDefaultApiPath;
const resumeFilmSrc = `${basePath}/resume-film/wangxueming-resume-intro.mp4`;
const resumeFilmPoster = `${basePath}/resume-film/wangxueming-resume-intro-poster.png`;
const AUTH_STORAGE_KEY = "resume-admin-authenticated";
const desktopVersionSrc = `${basePath}/DesktopVersion/index.html`;

function parseProxyPaths(value, fallback) {
  const values = [];
  const append = (item) => {
    if (Array.isArray(item)) {
      item.forEach(append);
      return;
    }
    if (typeof item !== "string") return;
    item.split(",").map((path) => path.trim()).filter(Boolean).forEach((path) => values.push(path));
  };

  append(value);
  append(fallback);
  return [...new Set(values)];
}

function isLocalRuntime() {
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

const iconMap = {
  performance: TimerReset,
  architecture: Cpu,
  bridge: Code2,
  leadership: BriefcaseBusiness,
  ai: Sparkles,
  quality: ShieldCheck,
};

const metricIcons = [CalendarClock, UserCog, Blocks, Gauge, Gamepad2, PackageCheck];

const aiMiniProjects = [
  {
    title: "成语接龙",
    type: "小游戏",
    description: "中文成语连续接龙练习，适合展示规则约束和轻交互体验。",
    url: "https://static-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/minigame/Cyjl/index.html",
    accent: "blue",
  },
  {
    title: "翻翻乐",
    type: "小游戏",
    description: "卡片记忆匹配玩法，覆盖状态管理、动画反馈和基础关卡节奏。",
    url: "https://static-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/minigame/Fppd/index.html",
    accent: "green",
  },
  {
    title: "拼图",
    type: "小游戏",
    description: "图片切片拖拽还原，验证网格计算、拖拽交互和完成判定。",
    url: "https://static-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/minigame/Pt/index.html",
    accent: "amber",
  },
  {
    title: "五子棋",
    type: "小游戏",
    description: "经典棋盘对弈，包含落子、胜负判断和棋局状态维护。",
    url: "https://static-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/minigame/Wzq/deliverables/gomoku.html",
    accent: "dark",
  },
  {
    title: "象棋",
    type: "小游戏",
    description: "中国象棋 Web 版，突出复杂规则建模与棋盘交互实现。",
    url: "https://static-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/minigame/Xq/xiangqi.html",
    accent: "red",
  },
  {
    title: "太阳系模拟器",
    type: "可视化",
    description: "天体轨道模拟展示，适合体现 Canvas/Web 动效和科普表达。",
    url: "https://static-mp-80ef50b6-4838-4618-a67a-e60b50667633.next.bspapp.com/DesktopVersion/solar-system/index.html",
    accent: "violet",
  },
  {
    title: "非自杀性自伤临床诊治",
    type: "医学科普",
    description: "医学主题 Web 展示页，将专业资料整理为结构化临床科普内容。",
    url: "https://wxm510846302.github.io/nssi-web/",
    accent: "cyan",
  },
  {
    title: "睡眠心理健康科普",
    type: "医学科普",
    description: "睡眠心理健康主题演示站，面向科普传播的完整 Web PPT。",
    url: "https://wxm510846302.github.io/sleep-web-ppt-full/",
    accent: "indigo",
  },
];

const aiResearchDocs = [
  {
    title: "比特币生态导航图",
    type: "Web3 研究文档",
    description: "围绕比特币生态、协议方向、资产形态和基础设施做结构化梳理，适合展示 Web3 研究与信息架构能力。",
    url: "https://drive.google.com/file/d/1vqVXK_lgQz93muuHo9o69RrTGD2dt66A/view",
    meta: "Bitcoin Ecosystem Map",
  },
  {
    title: "区块链发展趋势图",
    type: "Web3 研究文档",
    description: "将区块链技术演进、产业趋势和应用方向整理成图谱化资料，体现复杂信息归纳与可视化表达。",
    url: "https://drive.google.com/file/d/1aX6wDLnZcjzBDVzydusAHu4FUYHc0ViQ/view",
    meta: "Blockchain Trend Map",
  },
];

const skillDetails = [
  {
    slug: "experience",
    label: "10 + 年经验",
    title: "10+ 年移动端与跨端研发经验",
    subtitle: "从 iOS 原生到 Flutter、小程序、H5、SDK 和后台协作，长期处理复杂产品交付里的端侧问题。",
    theme: "blue",
    icon: CalendarClock,
    focus: ["客户端架构", "跨端协作", "团队交付", "业务稳定性"],
    overview:
      "我的经验不是单一技术栈的年限累计，而是持续在复杂业务里负责客户端、跨端页面、原生能力、第三方 SDK 和后台联动。适合承担从技术方案、排期拆解、风险识别到上线验收的完整交付责任。",
    highlights: [
      "覆盖在线教育、游戏 SDK、Web3 资产平台、企业数字化和运营后台等多类业务。",
      "能够在业务需求、客户端实现、后端接口、第三方服务和上线质量之间做技术取舍。",
      "长期负责支付、登录、分享、推送、音视频、IM、WebView 等高风险链路。",
    ],
    projects: ["开开华彩 Flutter App / 小程序 / 运营后台", "蓝港平台 BI / 游戏 SDK / Web3 资管 App", "麦思加数学 iOS 与 WebView 体系"],
    interview: [
      "我一般会先把需求拆成用户路径、端侧能力、接口依赖和上线风险四块。例如开开华彩这类课程/订单/直播/支付链路，我会先确认哪些能力在 Flutter，哪些必须走原生或 H5，再和后端对齐字段、状态流转和异常兜底。开发中会把高风险链路提前打通，最后用测试环境、灰度版本和线上日志确认真实结果。",
      "我识别风险时会重点看三类问题：第一是跨端能力差异，比如微信、支付、推送、权限在不同宿主下表现不同；第二是数据时机，比如页面预加载状态和用户真正点击提交时的 payload 可能不一致；第三是体验风险，比如弱网、加载卡住、分享生成慢、上传文件变大。排期上会把这些风险前置验证，而不是等联调末期才暴露。",
      "复杂任务我会拆成可并行的工作包：客户端负责页面、桥接、缓存和异常兜底；前端/H5 负责展示、埋点和 WebView 通信；后端负责接口、配置和数据一致性；测试负责关键链路用例和回归范围。我的价值是把这些边界讲清楚，保证每个人知道自己的输入输出和验收标准。",
    ],
  },
  {
    slug: "app-performance",
    label: "APP 性能优化",
    title: "APP 性能优化",
    subtitle: "关注启动、卡顿、内存、弱网、WebView、图片视频处理和线上稳定性，不局限于 iOS 单端。",
    theme: "blue",
    icon: Gauge,
    focus: ["启动耗时", "卡顿与内存", "弱网体验", "Crash 收敛"],
    overview:
      "性能优化会从用户可感知链路出发，而不是只看单个指标。我的处理方式是先定位瓶颈归属，再选择缓存、异步化、资源压缩、桥接优化、线程调度或降级策略，确保优化结果能体现在真实页面和业务操作里。",
    highlights: [
      "做过启动链路治理：减少首屏前同步任务、把非关键初始化后置、控制 SDK 初始化时机，并通过日志和工具确认启动阶段耗时来源。",
      "做过页面加载和 WebView 体验优化：静态资源缓存、离线包/本地缓存、接口并发控制、弱网兜底、课件加载等待态和失败重试。",
      "做过图片、视频、上传和分享链路优化：压缩策略避免越压越大，生成分享图时保持加载动画，必要时从 H5 追到 Flutter/native 桥接层定位瓶颈。",
    ],
    projects: ["麦思加数学 WebView 离线缓存与课件体验优化", "开开华彩 Flutter/native 分享与上传链路优化", "蓝港游戏 SDK 支付与登录稳定性治理"],
    interview: [
      "启动优化我会先拆阶段：进程启动、AppDelegate/宿主初始化、第三方 SDK 初始化、首屏接口、首屏渲染。优化动作包括把统计、推送、非首屏业务 SDK 延后初始化；避免启动阶段做大文件读写和同步网络等待；对首屏接口做并发和缓存；把可延迟的用户信息、配置拉取放到首屏后。验证时看冷启动/热启动耗时、首屏可交互时间和线上日志分布，而不是只看单次本地测试。",
      "页面加载和 WebView 优化我做过几类：课件和 H5 资源走本地缓存/离线缓存，减少重复下载；接口请求按首屏优先级拆分，非关键数据延后；弱网下保留骨架屏或加载动画，失败时给重试和降级；WebView 页面和 App 原生通信时，避免页面先渲染空状态再等待原生回填关键参数。这样用户感知上会从“白屏/卡住”变成“先可见、再补全”。",
      "图片视频和上传链路我会特别关注文件体积和耗时。之前处理过压缩后反而变大的问题，做法是根据源文件大小、码率和输出结果判断是否采用压缩结果，保证不会让上传文件变大；分享生成图时保留可见 loading，避免用户以为点击无效；如果 H5 已经生成了图片 bytes，就优先让 Flutter/native 直接消费，减少 base64 转换和重复渲染。",
      "判断瓶颈归属时，我会沿最终链路查，不停在表层。比如分享慢，先看 H5 生成图耗时，再看传给 Flutter 的数据大小，再看 native 保存/分享面板弹起时间；上传慢则看前端选择文件、Flutter 压缩、native 编码、网络上传分别耗时。定位后再决定是缓存、异步化、压缩策略、桥接数据格式还是 native 实现需要改。",
    ],
  },
  {
    slug: "flutter",
    label: "Flutter",
    title: "Flutter App 与 Add-to-App 交付",
    subtitle: "负责 Flutter 业务模块、原生宿主协同、路由状态、网络层和 MethodChannel/native_channel 桥接。",
    theme: "blue",
    icon: Blocks,
    focus: ["Add-to-App", "MethodChannel", "业务模块化", "多宿主协同"],
    overview:
      "Flutter 经验集中在真实 App 业务交付，不只是页面开发。重点包括课程、作业、订单、直播、支付、IM、音视频等业务模块，以及 Android/iOS/鸿蒙宿主复用 Flutter 能力时的原生能力桥接。",
    highlights: [
      "使用 go_router、dio、provider、get_it 等组织业务、网络和依赖注入。",
      "通过 MethodChannel/native_channel 对接支付、微信、权限、音视频、推送等原生能力。",
      "能处理 Flutter 模块与原生生命周期、WebView 页面和后台接口之间的协作边界。",
    ],
    projects: ["开开华彩 Flutter App", "Flutter 与 Android/iOS/鸿蒙宿主集成", "课程、直播、订单、支付和 IM 业务域"],
    interview: [
      "Flutter 这块我会强调不是只写 UI。我做的是业务模块交付，包括课程、作业、订单、直播、支付、IM、音视频等。比如支付链路，Flutter 负责业务状态和页面交互，真正拉起微信/支付宝、处理回调、权限和异常需要走原生通道，最后再把结果同步回 Flutter 页面和后端订单状态。",
      "Add-to-App 的意思是把 Flutter 模块嵌入已有原生 App。这里最关键的是边界：路由由谁管理、FlutterEngine 何时创建和复用、登录态和用户信息怎么同步、页面销毁时原生资源如何释放。我会把 Flutter 当成业务模块，而不是另起一个和原生割裂的 App。",
      "MethodChannel/native_channel 我一般会设计成稳定能力接口，比如支付、分享、打开小程序、获取设备信息、权限申请、音视频能力。Flutter 不直接关心各端 SDK 差异，只关心统一入参和回调结果；原生层负责处理 Android/iOS/鸿蒙差异和异常。",
      "Flutter 和 H5/小程序/后台的一致性主要靠接口字段和业务规则对齐。比如活动、商品、订单或分享参数，前端展示字段不能随意替代提交字段；后台配置变更后，Flutter、H5、小程序都要确认同一套规则下的最终 payload。",
    ],
  },
  {
    slug: "harmony",
    label: "鸿蒙",
    title: "鸿蒙宿主与跨端能力适配",
    subtitle: "面向多端业务复用，关注鸿蒙宿主、Flutter 模块、原生能力和第三方服务的一致接入。",
    theme: "blue",
    icon: Cpu,
    focus: ["多端宿主", "原生桥接", "权限与能力", "版本一致性"],
    overview:
      "鸿蒙相关经验更多体现在跨端体系里的宿主适配：同一业务能力需要在 Android、iOS、鸿蒙和 Flutter 之间保持一致，同时要兼顾系统权限、原生插件、第三方 SDK 和版本交付节奏。",
    highlights: [
      "理解多宿主复用 Flutter 业务能力时的桥接边界和能力抽象。",
      "关注支付、推送、权限、音视频等原生能力在不同宿主下的差异。",
      "能够把鸿蒙适配纳入客户端整体架构，而不是孤立维护一套页面。",
    ],
    projects: ["开开华彩多宿主客户端体系", "Flutter 与鸿蒙宿主协同", "推送、权限、音视频等原生能力适配"],
    interview: [
      "鸿蒙相关我会放在多端宿主适配里讲。核心不是单独做一个页面，而是同一套业务能力要在 Android、iOS、鸿蒙和 Flutter 之间复用，所以需要把支付、推送、权限、分享、音视频等能力抽象成统一接口。",
      "最容易出现差异的是系统权限、第三方 SDK 支持情况、页面生命周期、文件路径和外部 App 跳转。我的处理方式是先列能力清单，再按宿主实现 adapter，业务层只依赖统一能力，不直接依赖某个平台实现。",
      "验证上我会按高风险链路排优先级：登录、支付、推送、分享、音视频、WebView 通信先测，再测普通页面。每个版本需要明确哪些能力是共用逻辑，哪些是单端实现，避免某一端修复影响其他端。",
    ],
  },
  {
    slug: "web-mini",
    label: "Web / 小程序",
    title: "Web、H5 与微信小程序",
    subtitle: "覆盖 WebView/H5 活动、运营后台、微信小程序和前端工程化，擅长和客户端能力打通。",
    theme: "blue",
    icon: Code2,
    focus: ["WebView/H5", "微信小程序", "运营后台", "前后端协作"],
    overview:
      "Web 和小程序能力主要服务于跨端业务闭环：活动页、商品页、后台配置、小程序业务和 App WebView 页面需要共用业务规则，同时还要和 Flutter/native 分享、支付、登录、跳转能力保持一致。",
    highlights: [
      "能开发 H5 活动页、运营后台工具、微信小程序页面和静态管理后台。",
      "熟悉 WebView 与 App 原生通信、页面跳转、分享生成、登录态和参数传递。",
      "注重展示字段和提交字段分离，避免页面展示改动影响后端 payload。",
    ],
    projects: ["开开华彩小程序与 H5 活动配置", "app-h5 / myH5 商品与分享页面", "DesktopVersion 静态管理后台"],
    interview: [
      "H5 到 App 的链路我会用分享或跳转举例：H5 页面收集业务参数，调用 bridge，把目标类型、页面路径、图片或链接参数传给 Flutter/native；Flutter 做参数校验和状态提示；原生层再拉起微信、相册、系统分享或小程序。关键是最终点击时的 payload 要正确，而不是只看页面初始化时的数据。",
      "小程序和 H5 我比较关注展示字段和提交字段分离。比如手机号脱敏只用于展示，后端提交仍要用原始字段；渠道、unionId、oaid 这类字段要按用户点击时的最终规则决定，不能因为 preload 状态看起来对就放过。",
      "后台配置页我会把环境、接口、权限和部署方式讲清楚。比如 DesktopVersion 是静态后台页，环境切换通过页面状态同步 iframe，接口直接走允许 CORS 的网关；如果某些功能需要登录后可见，就在个人主页入口或后端接口层做限制，避免把敏感配置暴露在前端。",
      "Web/小程序经验不只是写页面，还包括 WebView 缓存、弱网兜底、跳转无反应排查、分享图生成、运营配置和后端联调。我的优势是能从页面问题追到 App bridge 或后端 payload。",
    ],
  },
  {
    slug: "web3",
    label: "Web3",
    title: "Web3 资产平台与投研表达",
    subtitle: "参与 Web3 资产数据平台、NFT/游戏平台生态分析，并产出结构化研究文档。",
    theme: "amber",
    icon: Shuffle,
    focus: ["资产数据", "NFT / GameFi", "投研文档", "生态梳理"],
    overview:
      "Web3 经验侧重在资产数据、业务理解和信息架构：把钱包地址、协议分类、公司主体、生态项目和投研结论整理成可展示、可决策、可传播的结构化内容。",
    highlights: [
      "维护过 Web3 资管 App 和集团资产数据相关模块。",
      "整合 Element NFT 平台、NAGA Web3 游戏平台和火星财经相关生态信息。",
      "创作《比特币生态导航图》《区块链发展趋势图》等研究型文档。",
    ],
    projects: ["蓝港 Web3 资管 App", "Element / NAGA / LK Venture 生态资料", "比特币生态导航图与区块链趋势图"],
    interview: [
      "Web3 这块我会讲业务理解和信息架构。比如资管 App 不是简单展示钱包地址，而是要把地址、资产、协议、链、项目方、公司主体和风险信息组织成业务方能看懂的视图，方便判断资产分布、项目进展和风险点。",
      "做生态研究时我会按层级分类：底层链和协议、资产形态、钱包/交易/数据基础设施、NFT/GameFi/应用项目、机构和合作方。这样投研内容不是一堆链接，而是能服务产品、商务和管理层决策的结构化资料。",
      "《比特币生态导航图》《区块链发展趋势图》这类文档可以展示我对复杂信息归纳的能力：先定义分类口径，再筛选代表项目，最后用图谱方式表达趋势、机会和风险。这个能力也能迁移到产品分析和技术方案表达。",
    ],
  },
  {
    slug: "ai-tools",
    label: "AI 工具链",
    title: "AI 工具链与研发提效",
    subtitle: "熟悉 Cursor、Codex、Claude Code、本地模型和 AI API，将 AI 融入研发、内容和自动化流程。",
    theme: "amber",
    icon: Sparkles,
    focus: ["Codex / Cursor", "本地模型", "AI API", "自动化流程"],
    overview:
      "AI 工具链能力不是停留在提示词层面，而是用于真实研发流程：代码分析、问题定位、文档生成、素材整理、自动化脚本和智能问答接入。这个在线简历本身也接入了 Coze/云函数代理，用来展示 AI 交互能力。",
    highlights: [
      "熟悉 Codex、Cursor、Claude Code 等工具在本地工程中的协作方式。",
      "具备本地大模型部署、API 接入、代理服务和成本控制意识。",
      "能把 AI 用在项目解释、文档维护、代码排查和业务内容生成中。",
    ],
    projects: ["在线简历 AI 分身与 Coze 云函数代理", "AI 辅助小游戏与演示页面生成", "本地模型和自动化研发流程"],
    interview: [
      "AI 工具链我会强调工程落地，不是只会聊天。日常可以用于代码阅读、问题定位、脚本生成、文档维护、测试用例补充和方案评审。比如一个跨端问题，可以让 AI 先帮我梳理调用链和可疑点，我再结合真实日志、源码和运行结果验证。",
      "这个在线简历就是一个案例：前端不直接暴露 Coze Token，而是通过云函数/Serverless 代理请求；前端只发问题和访客会话信息，服务端负责 Token、Bot ID、超时、CORS 和对话记录。这样既能展示 AI 交互，又避免密钥放在浏览器里。",
      "在团队里用 AI 我会建立边界：不能让 AI 直接决定线上行为，关键改动必须有代码审查和测试；适合让它做重复性分析、生成初稿和辅助排查。这样能提效，但不会牺牲工程质量。",
    ],
  },
  {
    slug: "sdk",
    label: "SDK 架构",
    title: "SDK 架构与第三方能力集成",
    subtitle: "覆盖登录、支付、分享、推送、统计、地图、IM、RTC、海外登录和归因等 50+ SDK 接入经验。",
    theme: "amber",
    icon: PackageCheck,
    focus: ["登录支付", "Unity 桥接", "埋点统计", "稳定性治理"],
    overview:
      "SDK 架构经验集中在高风险、强依赖、跨团队协作的客户端基础能力。重点不是简单接入，而是统一接口、隔离第三方差异、处理失败重试、日志追踪、版本兼容和业务降级。",
    highlights: [
      "集成过微信、支付宝、友盟、极光、高德、Facebook、Google、Adjust、Firebase、Kakao、融云、火山 RTC 等。",
      "重构过游戏登录/支付 SDK，处理登录、注册、支付、分享、打点、聊天和 Unity/自研引擎桥接。",
      "关注支付掉单、登录失败、回调丢失、渠道差异和线上问题可观测性。",
    ],
    projects: ["蓝港游戏登录/支付 SDK", "Unity 与自研引擎桥接", "开开华彩支付、推送、统计和音视频能力"],
    interview: [
      "SDK 架构我会按分层讲：业务层只调用统一登录/支付/分享接口；适配层屏蔽微信、支付宝、Facebook、Google、Adjust、Firebase 等第三方差异；基础层负责初始化、日志、错误码、重试、回调分发和版本兼容。这样业务不会被第三方 SDK 变化牵着走。",
      "支付掉单我会从订单创建、拉起支付、第三方回调、App 回到前台、服务端验单、客户端刷新订单状态这几个节点排查。治理手段包括统一订单号和 traceId、补齐日志、前后台切换后主动查单、失败可重试、服务端最终态兜底。目标是用户付了钱但页面没变的情况要能自动恢复或明确提示。",
      "Unity/自研引擎桥接我会强调接口稳定性。游戏侧通常只希望拿到登录结果、支付结果、分享结果和埋点接口，不希望理解各平台 SDK 细节。所以 SDK 要提供清晰 API、错误码和回调时机，同时保留原生日志方便定位线上问题。",
      "第三方 SDK 多时，初始化顺序和隐私合规也很重要。不能所有 SDK 都在启动阶段同步初始化，要按业务必要性延迟加载；涉及设备信息、IDFA、OAID、推送权限时，要遵守用户授权和平台规则。",
    ],
  },
];

const skillDetailMap = new Map(skillDetails.map((skill) => [skill.slug, skill]));

const assistantPrompts = [
  "你最适合什么岗位？",
  "介绍一下 Flutter App 经验",
  "讲讲性能优化成果",
  "有哪些 SDK 和支付经验？",
  "讲讲你的游戏公司经历？",
  "你是如何带领团队完成项目交付的？",
  "你处理过哪些复杂跨端架构问题？",
  "你做过哪些能直接影响业务指标的优化？",
  "你如何保障版本质量和线上稳定性？",
  "你相比普通前端或客户端开发强在哪里？",
  "如果入职后 3 个月，你能带来什么价值？",
  "你能胜任技术负责人岗位的依据是什么？",
  "你如何从 0 到 1 搭建一个 App 项目？",
  "你怎么设计一个可长期维护的 SDK？",
  "你如何排查线上 Crash 和内存泄漏？",
  "你如何处理支付、登录、分享这类核心链路？",
  "你如何推动前端、客户端和后端协作？",
  "你如何用 AI 工具提升研发效率？",
  "你有哪些 Web3 或 AI 相关项目经验？",
  "你过去最能体现 Owner 意识的项目是什么？",
  "你如何评估一个复杂需求的排期和风险？",
  "你能为团队建立哪些工程规范？",
  "你如何让业务方看到技术投入的价值？",
  "你最适合高薪岗位的核心竞争力是什么？"
];
const assistantPromptVisibleCount = 3;
const assistantIntroVariants = [
  "你好，我是王学明。我有 10+ 年移动端与跨端研发经验，长期专注 iOS、Flutter、小程序、Web/H5 和 SDK 架构。相比单一前端，我更擅长把客户端、跨端页面、原生能力和复杂业务交付串起来。",
  "我是王学明，一名高级前端全栈开发工程师。我的经验覆盖 iOS、Flutter、WebView、小程序、SDK、支付登录和性能优化，适合负责复杂跨端产品、客户端基础能力和工程化交付。",
  "你好，我是王学明。我做过在线教育、游戏 SDK、Web3、企业数字化等项目，擅长从业务目标出发处理跨端架构、性能稳定性、第三方 SDK 集成和团队协作交付。",
  "我是王学明，过去 10 多年主要解决移动端和跨端产品里的复杂问题，包括 Flutter Add-to-App、APP 性能优化、H5 与原生通信、SDK 架构、支付链路和 AI 工具提效。",
  "你好，我是王学明。我的定位不是只写页面的前端，而是能把 iOS、Flutter、小程序、Web/H5、后台协作和 SDK 底层能力连接起来，负责高复杂度产品从方案到落地的完整交付。",
];

const assistantReplies = {
  default:
    "我是王学明的虚拟分身，可以围绕岗位匹配、跨端架构、iOS/Flutter/小程序、SDK、性能优化和项目经历回答。你可以问我：适合什么岗位、做过哪些项目、如何处理复杂跨端交付。",
  role:
    "我更适合高级前端全栈、客户端跨端负责人、Flutter App / iOS 技术负责人、SDK 架构与复杂业务交付类岗位。优势是既能做客户端深水区问题，也能把 H5、小程序、Flutter、原生 SDK 和后台协作串起来。",
  flutter:
    "在开开华彩项目中，我负责 Flutter App 业务模块和原生宿主协同，覆盖课程、作业、订单、直播、支付、IM、音视频等业务域。核心经验包括 go_router、dio、provider、get_it、MethodChannel/native_channel，以及多宿主下的原生能力桥接和版本交付。",
  performance:
    "我有 APP 性能与稳定性经验，熟悉 Instruments、线程调度、WebView、弱网和 Crash 分析工具链。项目里做过启动耗时优化、弱网体验、WebView 离线缓存、Crash 收敛等工作，简历中当前突出指标包括启动耗时优化 35%、Debug 效率提升 40%、课件体验优化带来日活提升 150%。",
  sdk:
    "我集成过 50+ 第三方 SDK，覆盖支付、推送、统计、地图、IM、RTC、海外登录和归因生态，包括微信、支付宝、友盟、极光、高德、Facebook、Google、Adjust、Firebase、Kakao、融云、火山 RTC 等。在蓝港项目里重构过游戏登录/支付 SDK，支付掉单率从 8% 降到 3%。",
  projects:
    `代表项目包括：${projects.slice(0, 4).map((project) => project.name).join("、")}。其中开开华彩偏跨端业务和团队交付，蓝港偏游戏 SDK/BI/Web3，麦思加数学偏在线教育和 WebView 缓存优化，朗致集团偏数字化转型和 AI/企业微信方向。`,
  contact:
    `可以通过邮箱 ${resume.email} 联系我，也可以在页面顶部使用邮件联系入口。`,
};

function getAssistantReply(question) {
  const text = question.toLowerCase();
  if (/岗位|职位|适合|方向|offer|招聘/.test(text)) return assistantReplies.role;
  if (/flutter|add-to-app|addtoapp|methodchannel|跨端|小程序|webview/.test(text)) return assistantReplies.flutter;
  if (/性能|优化|启动|卡顿|crash|稳定|instruments|runloop/.test(text)) return assistantReplies.performance;
  if (/sdk|支付|登录|分享|推送|统计|firebase|adjust|微信|支付宝/.test(text)) return assistantReplies.sdk;
  if (/项目|经历|案例|做过|产品|蓝港|开开华彩|朗致|麦思加/.test(text)) return assistantReplies.projects;
  if (/联系|邮箱|电话|沟通|面试/.test(text)) return assistantReplies.contact;
  return assistantReplies.default;
}

function App() {
  const [route, setRoute] = React.useState(getRoute);
  const authState = useResumeAuth();
  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
  const auth = {
    ...authState,
    openLogin: () => setLoginDialogOpen(true),
  };

  React.useEffect(() => {
    const syncRoute = () => setRoute(getRoute());
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  const projectSlug = route.startsWith("/project/")
    ? route.replace(/^\/project\/?/, "").replace(/\/$/, "")
    : "";
  const skillSlug = route.startsWith("/skill/")
    ? route.replace(/^\/skill\/?/, "").replace(/\/$/, "")
    : "";
  const project = projectSlug ? projects.find((item) => item.slug === projectSlug) : null;
  const skill = skillSlug ? skillDetailMap.get(skillSlug) : null;
  let page;

  if (route === "/desktop") {
    page = <DesktopVersionPage auth={auth} />;
  } else if (skillSlug && skill) {
    page = <SkillDetailPage skill={skill} auth={auth} />;
  } else if (skillSlug && !skill) {
    page = <NotFound />;
  } else if (projectSlug && project) {
    page = <ProjectDetail project={project} auth={auth} />;
  } else if (projectSlug && !project) {
    page = <NotFound />;
  } else {
    page = <Home auth={auth} />;
  }

  return (
    <>
      {page}
      {loginDialogOpen ? (
        <LoginDialog auth={auth} onClose={() => setLoginDialogOpen(false)} />
      ) : null}
    </>
  );
}

function getRoute() {
  if (window.location.hash.startsWith("#/project/")) {
    return window.location.hash.slice(1);
  }
  if (window.location.hash.startsWith("#/skill/")) {
    return window.location.hash.slice(1);
  }
  if (window.location.hash === "#/desktop") {
    return "/desktop";
  }

  const currentPath = window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length) || "/"
    : window.location.pathname;

  if (currentPath === "/desktop" || currentPath === "/desktop/") return "/desktop";
  if (currentPath.startsWith("/skill/")) return currentPath;
  return currentPath.startsWith("/project/") ? currentPath : "/";
}

function useResumeAuth() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return readStoredAuth();
  });

  const login = React.useCallback(async (username, password) => {
    let response;
    try {
      response = await fetch(resumeLoginApiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
    } catch {
      return { ok: false, reason: "network" };
    }

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await response.json().catch(() => ({}))
      : {};

    if (!response.ok) {
      if (response.status === 401) {
        return { ok: false, reason: "credentials" };
      }
      if (response.status >= 500) {
        return { ok: false, reason: "service" };
      }
      return { ok: false, reason: "request", status: response.status };
    }

    if (!body.ok) {
      return { ok: false, reason: "credentials" };
    }

    setIsAuthenticated(true);
    try {
      window.localStorage?.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        authenticated: true,
        expiresAt: Number(body.expiresAt) || Date.now() + 12 * 60 * 60 * 1000,
      }));
    } catch {
      // Login still works for the current session if storage is unavailable.
    }
    return { ok: true };
  }, []);

  const logout = React.useCallback(() => {
    setIsAuthenticated(false);
    try {
      window.localStorage?.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Local state has already been cleared.
    }
  }, []);

  return { isAuthenticated, login, logout };
}

function readStoredAuth() {
  try {
    const raw = window.localStorage?.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    if (raw === "true") {
      window.localStorage?.removeItem(AUTH_STORAGE_KEY);
      return false;
    }
    const data = JSON.parse(raw);
    if (!data?.authenticated || Number(data.expiresAt) <= Date.now()) {
      window.localStorage?.removeItem(AUTH_STORAGE_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function LoginDialog({ auth, onClose }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const usernameRef = React.useRef(null);

  React.useEffect(() => {
    usernameRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await auth.login(username, password);
      if (result.ok) {
        setError("");
        onClose();
        return;
      }
      const errorMessages = {
        credentials: "账号或密码不正确",
        network: "无法连接登录服务，请检查网络后重试",
        service: "登录服务暂不可用，请确认 uniCloud resume-login 已部署",
        request: `登录接口异常（HTTP ${result.status || "未知"}），请稍后重试`,
      };
      setError(errorMessages[result.reason] || "登录校验失败，请稍后重试");
    } catch {
      setError("登录校验失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="login-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="login-close" type="button" aria-label="关闭登录弹框" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="login-head">
          <span><LockKeyhole size={20} /></span>
          <div>
            <h2 id="login-title">管理员登录</h2>
          </div>
          <em>Private</em>
        </div>
        {auth.isAuthenticated ? (
          <div className="login-authed">
            <span><ShieldCheck size={18} /> 已登录</span>
            <button
              className="secondary-action"
              type="button"
              onClick={() => {
                auth.logout();
                onClose();
              }}
            >
              退出登录
            </button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              <span>账号</span>
              <div className="login-input-shell">
                <UserCog size={18} />
                <input
                  ref={usernameRef}
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="请输入账号"
                />
              </div>
            </label>
            <label>
              <span>密码</span>
              <div className="login-input-shell">
                <KeyRound size={18} />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="请输入密码"
                />
              </div>
            </label>
            {error ? <p className="login-error" role="alert">{error}</p> : null}
            <button className="primary-action login-submit" type="submit" disabled={submitting}>
              {submitting ? "校验中" : "登录"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

function Header({ auth }) {
  const [open, setOpen] = React.useState(false);
  const [activeHash, setActiveHash] = React.useState(window.location.hash || "#top");
  const links = [
    ["首页", "#top"],
    ["技能", "#skills"],
    ["项目", "#projects"],
    ...(auth.isAuthenticated ? [["后台", "#/desktop"]] : []),
    ["小作品", "#ai-lab"],
    ["经历", "#timeline"],
    ["问答", "#assistant"],
    ["关于我", "#education"],
  ];

  React.useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash || "#top");
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <header className="site-header">
      <button
        className={auth.isAuthenticated ? "brand is-authenticated" : "brand"}
        type="button"
        aria-haspopup="dialog"
        onClick={auth.openLogin}
        title={auth.isAuthenticated ? "已登录，点击管理登录状态" : "登录后查看面试准备内容"}
      >
        <span>王学明</span>
        <span className="brand-code">&lt;/&gt;</span>
      </button>
      <button
        className="icon-button mobile-only"
        aria-label={open ? "关闭导航" : "打开导航"}
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav id="primary-nav" className={open ? "nav is-open" : "nav"} aria-label="主导航">
        {links.map(([label, href]) => (
          <a
            className={activeHash === href ? "is-active" : undefined}
            key={href}
            href={href}
            onClick={() => {
              setActiveHash(href);
              setOpen(false);
            }}
          >
            {label}
          </a>
        ))}
        <a
          className="nav-cta"
          href={`${basePath}/wangxueming-resume.pdf`}
          download="王学明开发岗个人简历v2.5.2.pdf"
        >
          <span className="nav-cta-icon"><Download size={18} /></span>
          <span>下载简历</span>
          <strong>PDF</strong>
        </a>
      </nav>
    </header>
  );
}

function Home({ auth }) {
  const assistant = useAssistantChat();
  const [resumeFilmVisible, setResumeFilmVisible] = React.useState(getInitialResumeFilmVisibility);

  const hideResumeFilm = React.useCallback(() => {
    setResumeFilmVisible(false);
    try {
      window.localStorage?.setItem("resume-film", "hidden");
    } catch {
      // The section is still hidden for the current session if storage is unavailable.
    }
  }, []);

  return (
    <>
      <Header auth={auth} />
      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <h1>{resume.name}</h1>
            <p className="role">大前端负责人/高级前端全栈开发工程师</p>
            <p className="summary">10+ 年移动端与全栈研发经验，主导服务全国百万级用户的跨端产品与 SDK 架构落地</p>
            <address className="identity-row" aria-label="联系信息">
              <a href={`mailto:${resume.email}`}><Mail size={18} /> wangxueming_1993@163.com</a>
              <a href={`tel:${resume.phone}`}><Phone size={18} /> 176-1024-1135</a>
              <span><MapPin size={18} /> 北京 · 可远程</span>
            </address>
            <div className="social-row" aria-label="社交链接">
              <a href={resume.gitHub} target="_blank" rel="noreferrer"><Github size={18} /> GitHub</a>
              <a href={resume.gitee} target="_blank" rel="noreferrer">Gitee</a>
              <a href={resume.twitter} target="_blank" rel="noreferrer">X</a>
              {/* <a href={resume.twitter} target="_blank" rel="noreferrer">in LinkedIn</a> */}
              {/* <a href="#review"><Mic size={17} /> 博客</a> */}
            </div>
            <div className="hero-tags" aria-label="核心标签">
              {skillDetails.map((skill) => (
                <a className={`skill-tag skill-tag-${skill.theme}`} href={`${basePath}/skill/${skill.slug}`} key={skill.slug}>
                  {skill.label}
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
            <div className="hero-actions">
              <a className="primary-action" href="#projects">
                查看项目案例 <ArrowUpRight size={18} />
              </a>
              <a className="secondary-action" href={`mailto:${resume.email}`}>
                <Mail size={18} /> 邮件联系
              </a>
            </div>
          </div>
          <HeroVisual />
        </section>

        <section className="metrics" aria-label="核心指标">
          {resume.metrics.map((item, index) => {
            const MetricIcon = metricIcons[index] || Code2;
            return (
            <article className={`metric metric-${index + 1}`} key={item.label}>
              <MetricIcon size={30} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          );})}
        </section>

        {resumeFilmVisible ? <ResumeFilmSection onHide={hideResumeFilm} /> : null}

        <section className="overview-section section" id="skills">
          <SkillMatrix />
          <TimelineCompact />
        </section>

        <AssistantSection assistant={assistant} />

        <section className="section" id="projects">
          <SectionTitle title="项目案例" />
          <div className="project-grid">
            {projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}
          </div>
        </section>

        <AIMiniProjectsSection />

        <section className="section education-section" id="education">
          <SectionTitle title="教育与技术转型" />
          <article className="education-card">
            <h3>{resume.education.school}</h3>
            <p>{resume.education.period} · {resume.education.major} · {resume.education.degree}</p>
            <span>{resume.education.note}</span>
          </article>
        </section>

      </main>
      <FloatingAssistant assistant={assistant} />
      <Footer />
    </>
  );
}

function getInitialResumeFilmVisibility() {
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("film");

  if (forced === "1" || forced === "true") return true;
  if (forced === "0" || forced === "false") return false;

  try {
    return window.localStorage?.getItem("resume-film") !== "hidden";
  } catch {
    return true;
  }
}

function ResumeFilmSection({ onHide }) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.35, 0.55, 0.85] },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="resume-film-section section" id="resume-film" aria-label="简历介绍短片">
      <div className="resume-film-shell">
        <div className="resume-film-player">
          <video
            ref={videoRef}
            controls
            muted
            playsInline
            preload="metadata"
            poster={resumeFilmPoster}
            src={resumeFilmSrc}
          >
            你的浏览器不支持视频播放。
          </video>
          <span className="resume-film-badge"><PlayCircle size={16} /> 36 秒介绍短片</span>
        </div>
        <div className="resume-film-copy">
          <span className="section-eyebrow">36s Candidate Snapshot</span>
          <h2>高级跨端负责人</h2>
          <p>
            10+ 年移动端与跨端研发经验，覆盖产品、SDK、支付稳定性与团队交付，可快速评估其技术宽度和落地能力。
          </p>
          <ul className="resume-film-points" aria-label="招聘筛选要点">
            {["百万级产品经验", "50+ SDK 接入治理", "支付掉单率优化"].map((point) => (
              <li key={point}><CheckCircle2 size={17} /> {point}</li>
            ))}
          </ul>
          <div className="resume-film-actions">
            <a className="primary-action" href={resumeFilmSrc} target="_blank" rel="noreferrer">
              查看短片摘要 <ArrowUpRight size={18} />
            </a>
            <button className="secondary-action resume-film-hide" type="button" onClick={onHide}>
              <X size={18} /> 收起短片
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <aside className="hero-visual" aria-label="3D 开发者人偶与跨端项目展示">
      <img className="hero-layer-bg" src={heroLayerBg} alt="" aria-hidden="true" />
      <img className="hero-layer-person" src={heroLayerPerson} alt="3D 开发者人偶" />
    </aside>
  );
}

function AssistantSection({ assistant }) {
  const guideCards = [
    {
      icon: MessageCircle,
      title: "面试式追问",
      text: "围绕岗位匹配、项目经历、技术取舍连续追问。",
    },
    {
      icon: ShieldCheck,
      title: "核心链路",
      text: "登录、支付、分享、SDK、性能稳定性都可展开。",
    },
    {
      icon: CheckCircle2,
      title: "答案可复核",
      text: "回复支持 Markdown，关键信息更易扫描和复制。",
    },
  ];
  const guideTags = ["岗位匹配", "Flutter App", "APP 性能", "SDK 架构", "支付登录", "团队管理"];

  return (
    <section className="assistant-section section" id="assistant">
      <div className="assistant-shell">
        <div className="assistant-copy">
          <div className="assistant-copy-main">
            <div className="assistant-title-row">
              <span className="assistant-orb"><Sparkles size={22} /></span>
              <div>
                <h2>问答助手</h2>
                <span>虚拟分身 · 简历问答</span>
              </div>
            </div>
            <p>
              用对话方式快速了解岗位匹配、项目经验和技术强项。适合在面试前先筛选关键能力，也适合围绕复杂链路继续追问。
            </p>
          </div>
          <div className="assistant-guide-grid" aria-label="问答能力说明">
            {guideCards.map(({ icon: GuideIcon, title, text }) => (
              <article className="assistant-guide-card" key={title}>
                <GuideIcon size={17} />
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="assistant-topic-panel">
            <span>建议提问方向</span>
            <div>
              {guideTags.map((tag) => <button type="button" key={tag} onClick={() => assistant.ask(tag)}>{tag}</button>)}
            </div>
          </div>
          <div className="assistant-copy-foot">
            <strong>*</strong>
            <span>预设高频问题覆盖项目、架构、性能、交付和管理场景</span>
          </div>
        </div>
        <AssistantChat assistant={assistant} compact={false} />
      </div>
    </section>
  );
}

function PromptButtons({ onAsk }) {
  const [visiblePrompts, setVisiblePrompts] = React.useState(() => getRandomPrompts());

  return (
    <div className="assistant-prompt-list" aria-label="快捷问题">
      {visiblePrompts.map((prompt) => (
        <button className="assistant-prompt-button" type="button" key={prompt} onClick={() => onAsk?.(prompt)}>
          {prompt}
        </button>
      ))}
      <button
        className="assistant-prompt-random"
        type="button"
        aria-label="随机换一组快捷问题"
        onClick={() => setVisiblePrompts(getRandomPrompts(visiblePrompts))}
        title="换一组"
      >
        <Shuffle size={15} />
        <span>换一组</span>
      </button>
    </div>
  );
}

function getRandomPrompts(previous = []) {
  const shuffled = [...assistantPrompts].sort(() => Math.random() - 0.5);
  const next = shuffled.filter((prompt) => !previous.includes(prompt)).slice(0, assistantPromptVisibleCount);
  if (next.length === assistantPromptVisibleCount) return next;
  return [
    ...next,
    ...shuffled
      .filter((prompt) => !next.includes(prompt))
      .slice(0, assistantPromptVisibleCount - next.length),
  ];
}

function getRandomIntroText() {
  return assistantIntroVariants[Math.floor(Math.random() * assistantIntroVariants.length)];
}

function stopAudioElement(ref) {
  if (!ref.current) return;
  ref.current.pause();
  ref.current.remove();
  ref.current.src = "";
  ref.current = null;
}

function createHiddenAudio(audioUrl) {
  const audio = document.createElement("audio");
  audio.src = audioUrl;
  audio.preload = "auto";
  audio.className = "assistant-hidden-audio";
  document.body.appendChild(audio);
  audio.load();
  return audio;
}

function useAssistantChat() {
  const [messages, setMessages] = React.useState([
    {
      id: "intro",
      role: "assistant",
      text: "你好，我是王学明的 AI 虚拟分身。你可以像面试沟通一样问我岗位匹配、项目经历、跨端架构、SDK 或性能优化。",
    },
  ]);
  const [isSending, setIsSending] = React.useState(false);
  const [serviceState, setServiceState] = React.useState("ready");
  const [isIntroSpeaking, setIsIntroSpeaking] = React.useState(false);
  const [isIntroPreparing, setIsIntroPreparing] = React.useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = React.useState(false);
  const [introText, setIntroText] = React.useState(assistantIntroVariants[0]);
  const [playingMessageId, setPlayingMessageId] = React.useState("");
  const [copiedMessageId, setCopiedMessageId] = React.useState("");
  const [followUpContext, setFollowUpContext] = React.useState(null);
  const abortRef = React.useRef(null);
  const introAudioRef = React.useRef(null);
  const introSpeechAbortRef = React.useRef(null);
  const introTypeTimerRef = React.useRef(null);
  const messageAudioRef = React.useRef(null);
  const messageSpeechAbortRef = React.useRef(null);

  const stopMessageSpeech = React.useCallback(() => {
    messageSpeechAbortRef.current?.abort();
    messageSpeechAbortRef.current = null;
    stopAudioElement(messageAudioRef);
    setPlayingMessageId("");
  }, []);

  const stopIntroSpeech = React.useCallback(() => {
    introSpeechAbortRef.current?.abort();
    introSpeechAbortRef.current = null;
    if (introTypeTimerRef.current) {
      window.clearInterval(introTypeTimerRef.current);
      introTypeTimerRef.current = null;
    }
    stopAudioElement(introAudioRef);
    setIsIntroSpeaking(false);
    setIsIntroPreparing(false);
    setIntroText(assistantIntroVariants[0]);
  }, []);

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopMessageSpeech();
      stopIntroSpeech();
    };
  }, [stopIntroSpeech, stopMessageSpeech]);

  const startIntroTypewriter = React.useCallback((text) => {
    if (introTypeTimerRef.current) {
      window.clearInterval(introTypeTimerRef.current);
      introTypeTimerRef.current = null;
    }
    setIntroText("");
    let introCharIndex = 0;
    const introChars = Array.from(text);
    introTypeTimerRef.current = window.setInterval(() => {
      introCharIndex += 1;
      setIntroText(introChars.slice(0, introCharIndex).join(""));
      if (introCharIndex >= introChars.length && introTypeTimerRef.current) {
        window.clearInterval(introTypeTimerRef.current);
        introTypeTimerRef.current = null;
      }
    }, 42);
  }, []);

  const playIntro = React.useCallback(async () => {
    if (isIntroSpeaking) {
      stopIntroSpeech();
      return;
    }

    stopMessageSpeech();
    stopIntroSpeech();
    setIsIntroSpeaking(true);
    setIsIntroPreparing(true);
    const controller = new AbortController();
    introSpeechAbortRef.current = controller;

    let audioUrl = "";
    const introSpeechText = getRandomIntroText();
    const finish = () => {
      if (introTypeTimerRef.current) {
        window.clearInterval(introTypeTimerRef.current);
        introTypeTimerRef.current = null;
      }
      stopAudioElement(introAudioRef);
      if (introSpeechAbortRef.current === controller) {
        introSpeechAbortRef.current = null;
      }
      setIsIntroSpeaking(false);
      setIsIntroPreparing(false);
      setHasPlayedIntro(true);
      setIntroText(introSpeechText);
    };

    try {
      startIntroTypewriter(introSpeechText);
      audioUrl = await requestCozeSpeech(introSpeechText, controller.signal);
      if (controller.signal.aborted) return;
      const audio = createHiddenAudio(audioUrl);
      introAudioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        finish();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        finish();
      };
      setIsIntroPreparing(false);
      await audio.play();
    } catch {
      if (!controller.signal.aborted) {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        finish();
      }
    }
  }, [isIntroSpeaking, startIntroTypewriter, stopIntroSpeech, stopMessageSpeech]);

  const ask = React.useCallback(async (question, context = null) => {
    const trimmed = question.trim();
    if (!trimmed || isSending) return;
    const effectiveQuestion = context?.text
      ? `请基于上一段回答继续追问。上一段回答：\n${context.text}\n\n用户追问：${trimmed}`
      : trimmed;
    const timestamp = Date.now();
    const userMessage = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    const assistantId = `a-${timestamp}`;
    const assistantMessage = {
      id: assistantId,
      role: "assistant",
      text: "正在思考中",
      pending: true,
      sourceQuestion: effectiveQuestion,
      sourceUserQuestion: trimmed,
    };
    setMessages((current) => [...current, userMessage, assistantMessage]);

    setIsSending(true);
    setServiceState("thinking");
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamAssistantReply(effectiveQuestion, assistantId, controller.signal, setMessages, setServiceState);
      setServiceState("ready");
    } catch (error) {
      if (controller.signal.aborted) return;
      const fallback = getAssistantReply(trimmed);
      const fallbackText = `真实 AI 暂时未连通：${error.message || "请求失败"}\n\n先给你一版本地简历兜底回答：${fallback}`;
      setServiceState("replying");
      await typeAssistantText(
        assistantId,
        fallbackText,
        setMessages,
        controller.signal,
        { error: true },
      );
      setServiceState("offline");
    } finally {
      setIsSending(false);
      abortRef.current = null;
    }
  }, [isSending]);

  const speakMessage = React.useCallback(async (message) => {
    if (!message?.text || message.pending || message.typing) return;
    if (playingMessageId === message.id) {
      stopMessageSpeech();
      return;
    }

    stopMessageSpeech();
    const controller = new AbortController();
    messageSpeechAbortRef.current = controller;
    setPlayingMessageId(message.id);

    try {
      const audioUrl = await requestCozeSpeech(message.text, controller.signal);
      if (controller.signal.aborted) return;
      const audio = createHiddenAudio(audioUrl);
      messageAudioRef.current = audio;
      const cleanup = () => {
        URL.revokeObjectURL(audioUrl);
        if (messageAudioRef.current === audio) {
          stopAudioElement(messageAudioRef);
        } else {
          audio.pause();
          audio.remove();
          audio.src = "";
        }
        if (messageSpeechAbortRef.current === controller) {
          messageSpeechAbortRef.current = null;
        }
        setPlayingMessageId("");
      };
      audio.onended = cleanup;
      audio.onerror = cleanup;
      await audio.play();
    } catch {
      if (!controller.signal.aborted) {
        setPlayingMessageId("");
      }
    }
  }, [playingMessageId, stopMessageSpeech]);

  const copyMessage = React.useCallback(async (message) => {
    if (!message?.text) return;
    await navigator.clipboard?.writeText(message.text);
    setCopiedMessageId(message.id);
    window.setTimeout(() => {
      setCopiedMessageId((current) => (current === message.id ? "" : current));
    }, 1200);
  }, []);

  const followUpMessage = React.useCallback((message) => {
    if (!message?.text || isSending) return;
    setFollowUpContext({
      id: message.id,
      text: message.text,
      title: message.sourceUserQuestion || message.sourceQuestion || message.text.slice(0, 42),
    });
  }, [isSending]);

  const refreshMessage = React.useCallback(async (message) => {
    if (!message?.id || isSending) return;
    const question = message.sourceQuestion || "请重新介绍一下王学明的技术背景和岗位匹配。";
    setMessages((current) =>
      updateMessage(current, message.id, {
        text: "正在思考中",
        pending: true,
        typing: false,
        error: false,
        sourceQuestion: question,
        sourceUserQuestion: message.sourceUserQuestion || question,
      }),
    );
    setIsSending(true);
    setServiceState("thinking");
    stopMessageSpeech();
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamAssistantReply(question, message.id, controller.signal, setMessages, setServiceState);
      setServiceState("ready");
    } catch (error) {
      if (controller.signal.aborted) return;
      const fallback = getAssistantReply(question);
      const fallbackText = `真实 AI 暂时未连通：${error.message || "请求失败"}\n\n先给你一版本地简历兜底回答：${fallback}`;
      setServiceState("replying");
      await typeAssistantText(
        message.id,
        fallbackText,
        setMessages,
        controller.signal,
        { error: true },
      );
      setServiceState("offline");
    } finally {
      setIsSending(false);
      abortRef.current = null;
    }
  }, [isSending, stopMessageSpeech]);

  return {
    ask,
    copiedMessageId,
    copyMessage,
    clearFollowUpContext: () => setFollowUpContext(null),
    followUpMessage,
    followUpContext,
    hasPlayedIntro,
    introText,
    isIntroPreparing,
    isIntroSpeaking,
    isSending,
    messages,
    playIntro,
    playingMessageId,
    refreshMessage,
    serviceState,
    stopIntroSpeech,
    speakMessage,
  };
}

function AssistantChat({ assistant, compact = false }) {
  const [input, setInput] = React.useState("");
  const [introCollapsed, setIntroCollapsed] = React.useState(false);
  const chatLogRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const lastScrollTopRef = React.useRef(0);
  const {
    ask,
    clearFollowUpContext,
    copiedMessageId,
    copyMessage,
    followUpMessage,
    followUpContext,
    hasPlayedIntro,
    introText,
    isIntroPreparing,
    isIntroSpeaking,
    isSending,
    messages,
    playIntro,
    playingMessageId,
    refreshMessage,
    serviceState,
    speakMessage,
  } = assistant;

  React.useEffect(() => {
    const log = chatLogRef.current;
    if (log) {
      log.scrollTop = log.scrollHeight;
      lastScrollTopRef.current = log.scrollTop;
    }
  }, [messages]);

  React.useEffect(() => {
    if (followUpContext) {
      inputRef.current?.focus();
    }
  }, [followUpContext]);

  const submitQuestion = (question) => {
    const trimmed = question.trim();
    if (!trimmed || isSending) return;
    ask(trimmed, followUpContext);
    clearFollowUpContext();
    setInput("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleMessageScroll = React.useCallback((event) => {
    const nextScrollTop = event.currentTarget.scrollTop;
    const delta = nextScrollTop - lastScrollTopRef.current;

    if (Math.abs(delta) < 12) return;

    if (delta > 0) {
      setIntroCollapsed(true);
    } else {
      setIntroCollapsed(false);
    }

    lastScrollTopRef.current = nextScrollTop;
  }, []);

  return (
    <div className={compact ? "assistant-chat assistant-chat-floating" : "assistant-chat"} aria-label="AI 虚拟分身聊天窗口">
      <div className="assistant-chat-head">
        <div className="assistant-head-person">
          <img src={aiAvatar} alt="王学明 AI 分身头像" />
          <div>
            <strong>王学明 AI 分身</strong>
            <span>知无不言</span>
          </div>
        </div>
        <span className={`assistant-status assistant-status-${serviceState}`}>
          {serviceState === "thinking" ? "思考中" : serviceState === "replying" ? "回复中" : serviceState === "offline" ? "未连通" : "在线"}
        </span>
      </div>
      <AssistantIntroStage
        collapsed={introCollapsed}
        hasPlayed={hasPlayedIntro}
        introText={introText}
        isPreparing={isIntroPreparing}
        isSpeaking={isIntroSpeaking}
        onPlayIntro={playIntro}
        onToggleCollapsed={() => setIntroCollapsed((current) => !current)}
      />
      <div className="assistant-messages" ref={chatLogRef} onScroll={handleMessageScroll} aria-live="polite">
        {messages.map((message) => (
          <div className={`assistant-message ${message.role}${message.error ? " is-error" : ""}${message.pending ? " is-pending" : ""}${message.typing ? " is-typing" : ""}`} key={message.id}>
            <span className="assistant-avatar">
              {message.role === "assistant" ? <img src={aiAvatar} alt="" /> : <UserCog size={15} />}
            </span>
            {message.role === "assistant" ? (
              <div className="assistant-message-content">
                <AssistantMarkdown text={message.text} typing={message.typing} />
                {!message.pending && !message.typing && message.text ? (
                  <AssistantMessageActions
                    copied={copiedMessageId === message.id}
                    message={message}
                    onCopy={copyMessage}
                    onFollowUp={followUpMessage}
                    onRefresh={refreshMessage}
                    onSpeak={speakMessage}
                    playing={playingMessageId === message.id}
                  />
                ) : null}
              </div>
            ) : (
              <p>{message.text}</p>
            )}
          </div>
        ))}
      </div>
      <PromptButtons
        onAsk={(prompt) => {
          clearFollowUpContext();
          ask(prompt);
        }}
      />
      {followUpContext ? (
        <div className="assistant-followup-context">
          <MessageCircle size={14} />
          <span>正在追问上一段回复</span>
          <button type="button" onClick={clearFollowUpContext} aria-label="取消追问上下文">
            <X size={13} />
          </button>
        </div>
      ) : null}
      <form
        className="assistant-input-row"
          onSubmit={(event) => {
          event.preventDefault();
          submitQuestion(inputRef.current?.value || input);
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={isSending ? "AI 分身正在回复..." : "问我：你最适合什么岗位？"}
          aria-label="向 AI 虚拟分身提问"
          disabled={isSending}
        />
        <button
          type="submit"
          aria-label="发送问题"
          disabled={isSending}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

function AssistantIntroStage({ collapsed, hasPlayed, introText, isPreparing, isSpeaking, onPlayIntro, onToggleCollapsed }) {
  const buttonLabel = isPreparing ? "准备音色中" : isSpeaking ? "停止播放" : hasPlayed ? "换一段" : "播放自我介绍";
  const toggleLabel = collapsed ? "展开自我介绍" : "收起自我介绍";

  return (
    <div className={`assistant-intro-stage${isSpeaking ? " is-speaking" : ""}${collapsed ? " is-collapsed" : ""}`}>
      <div className="assistant-intro-copy">
        <div className="assistant-wave" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <p>{collapsed ? "自我介绍已收起，向下滚动聊天记录或点击右侧按钮可展开。" : introText}</p>
      </div>
      <div className="assistant-intro-actions">
        <button
          className="assistant-voice-button"
          type="button"
          disabled={isPreparing}
          onClick={onPlayIntro}
          title={buttonLabel}
          aria-label={buttonLabel}
        >
          {isSpeaking ? <Square size={15} /> : <Volume2 size={15} />}
          <span>{buttonLabel}</span>
        </button>
        <button
          className="assistant-intro-toggle"
          type="button"
          onClick={onToggleCollapsed}
          title={toggleLabel}
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
    </div>
  );
}

function AssistantMessageActions({
  copied,
  message,
  onCopy,
  onFollowUp,
  onRefresh,
  onSpeak,
  playing,
}) {
  return (
    <div className="assistant-message-actions" aria-label="回复操作">
      <button
        type="button"
        className={playing ? "is-active" : undefined}
        onClick={() => onSpeak(message)}
        title={playing ? "停止播放" : "播放这段回复"}
        aria-label={playing ? "停止播放这段回复" : "播放这段回复"}
      >
        {playing ? <Square size={14} /> : <Volume2 size={14} />}
      </button>
      <button
        type="button"
        className={copied ? "is-done" : undefined}
        onClick={() => onCopy(message)}
        title={copied ? "已复制" : "复制这段回复"}
        aria-label="复制这段回复"
      >
        <Copy size={14} />
      </button>
      <button
        type="button"
        onClick={() => onFollowUp(message)}
        title="基于这段回复追问"
        aria-label="基于这段回复追问"
      >
        <MessageCircle size={14} />
      </button>
      <button
        type="button"
        onClick={() => onRefresh(message)}
        title="重新生成这段回复"
        aria-label="重新生成这段回复"
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );
}

function AssistantMarkdown({ text, typing = false }) {
  const markdownText = prepareAssistantMarkdown(text || "", typing);

  return (
    <div className="assistant-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => (
            <a href={href} target="_blank" rel="noreferrer" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {markdownText}
      </ReactMarkdown>
    </div>
  );
}

function prepareAssistantMarkdown(text, typing = false) {
  const stableText = typing ? hideUnclosedInlineMarkdown(text) : text;
  return stableText.replace(/(\*\*|__|~~)([“‘"《（(【「『])/g, "$1\u200b$2");
}

function hideUnclosedInlineMarkdown(text) {
  return ["**", "__", "~~"].reduce((current, marker) => {
    const indexes = [];
    let fromIndex = 0;
    while (fromIndex < current.length) {
      const index = current.indexOf(marker, fromIndex);
      if (index === -1) break;
      indexes.push(index);
      fromIndex = index + marker.length;
    }

    if (indexes.length % 2 === 0) return current;
    const lastIndex = indexes[indexes.length - 1];
    return `${current.slice(0, lastIndex)}${current.slice(lastIndex + marker.length)}`;
  }, text);
}

async function streamAssistantReply(question, assistantId, signal, setMessages, setServiceState) {
  let lastError = null;

  for (const path of cozeApiPaths) {
    try {
      await streamAssistantReplyFromPath(path, question, assistantId, signal, setMessages, setServiceState);
      return;
    } catch (error) {
      if (signal.aborted) throw error;
      lastError = error;
    }
  }

  throw new Error(formatProxyFailure("AI 接口", lastError));
}

async function streamAssistantReplyFromPath(path, question, assistantId, signal, setMessages, setServiceState) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      userId: getVisitorId(),
      // 携带上一轮的会话 ID，让 Coze 把本轮提问续接到同一会话，保留上下文与记忆。
      conversationId: getConversationId(),
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail || payload?.error || `HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const payload = await response.json();
    const answer = payload?.answer || payload?.data?.answer;
    if (!answer) {
      throw new Error(payload?.error || "AI 接口没有返回可展示内容");
    }
    rememberConversationId(payload?.conversationId || payload?.data?.conversationId);
    setServiceState("replying");
    await typeAssistantText(assistantId, answer, setMessages, signal);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let hasContent = false;
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const boundary = buffer.lastIndexOf("\n\n");
    if (boundary === -1) continue;

    const chunk = buffer.slice(0, boundary + 2);
    buffer = buffer.slice(boundary + 2);
    const { text, conversationId } = parseCozeSseChunk(chunk);
    // 一拿到会话 ID 就持久化，保证即使用户中途中断也能在下一轮续接同一会话。
    rememberConversationId(conversationId);
    if (!text) continue;

    hasContent = true;
    setServiceState("replying");
    await typeAssistantText(assistantId, text, setMessages, signal, { append: true });
  }

  if (buffer.trim()) {
    const { text, conversationId } = parseCozeSseChunk(buffer);
    rememberConversationId(conversationId);
    if (text) {
      hasContent = true;
      setServiceState("replying");
      await typeAssistantText(assistantId, text, setMessages, signal, { append: true });
    }
  }

  if (!hasContent) {
    throw new Error("Coze 没有返回可展示内容");
  }
}

async function requestCozeSpeech(text, signal) {
  let lastError = null;

  for (const path of cozeSpeechApiPaths) {
    try {
      return await requestCozeSpeechFromPath(path, text, signal);
    } catch (error) {
      if (signal.aborted) throw error;
      lastError = error;
    }
  }

  throw new Error(formatProxyFailure("Coze 音色生成", lastError));
}

async function requestCozeSpeechFromPath(path, text, signal) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "speech",
      text,
      userId: getVisitorId(),
    }),
    signal,
  });

  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    const payload = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : null;
    const detail = payload?.detail || payload?.error || `HTTP ${response.status}`;
    throw new Error(`Coze 音色生成失败：${detail}`);
  }

  if (contentType.includes("application/json")) {
    const payload = await response.json();
    if (payload?.audioBase64) {
      return URL.createObjectURL(base64ToAudioBlob(payload.audioBase64, payload.mimeType || "audio/mpeg"));
    }
    if (payload?.audioUrl) {
      const audioResponse = await fetch(payload.audioUrl, { signal });
      if (!audioResponse.ok) throw new Error("Coze 音频文件下载失败");
      return URL.createObjectURL(await audioResponse.blob());
    }
    throw new Error(payload?.error || "Coze 没有返回可播放音频");
  }

  return URL.createObjectURL(await response.blob());
}

function formatProxyFailure(label, error) {
  const detail = error?.message || "所有代理都不可用";
  if (/Failed to fetch|NetworkError|Load failed/i.test(detail)) {
    return `${label}暂时未连通：代理服务不可访问或未返回跨域响应`;
  }
  return `${label}暂时未连通：${detail}`;
}

function base64ToAudioBlob(value, mimeType) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

async function typeAssistantText(
  assistantId,
  text,
  setMessages,
  signal,
  { append = false, error = false } = {},
) {
  const chars = Array.from(text);
  if (!chars.length) return;

  setMessages((current) =>
    updateMessage(current, assistantId, (message) => ({
      ...message,
      text: append && !message.pending ? message.text : "",
      pending: false,
      typing: true,
      error: error || message.error,
    })),
  );

  for (const char of chars) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    setMessages((current) =>
      updateMessage(current, assistantId, (message) => ({
        ...message,
        text: `${message.text}${char}`,
        pending: false,
        typing: true,
      })),
    );
    await waitForTypewriterDelay(char, signal);
  }

  setMessages((current) =>
    updateMessage(current, assistantId, (message) => ({
      ...message,
      typing: false,
    })),
  );
}

function waitForTypewriterDelay(char, signal) {
  const delay = /[。！？!?；;：:\n]/.test(char) ? 90 : 18;
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, delay);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function updateMessage(messages, id, patchOrUpdater) {
  return messages.map((message) => {
    if (message.id !== id) return message;
    return typeof patchOrUpdater === "function"
      ? patchOrUpdater(message)
      : { ...message, ...patchOrUpdater };
  });
}

function getVisitorId() {
  const key = "resume-coze-user-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = `visitor-${crypto.randomUUID?.() || Date.now()}`;
  window.localStorage.setItem(key, next);
  return next;
}

// 会话 ID 与访客绑定并持久化在 localStorage，保证同一访客的多轮对话续接到
// 同一个 Coze 会话，聊天记录才能正确累积进 AI 长期记忆，而不是每条消息新开一个会话。
const CONVERSATION_ID_KEY = "resume-coze-conversation-id";

function getConversationId() {
  try {
    return window.localStorage.getItem(CONVERSATION_ID_KEY) || "";
  } catch {
    // 隐私模式或存储被禁用时降级为无会话 ID，不影响单轮问答。
    return "";
  }
}

function rememberConversationId(conversationId) {
  if (typeof conversationId !== "string" || !conversationId) return;
  if (conversationId === getConversationId()) return;
  try {
    window.localStorage.setItem(CONVERSATION_ID_KEY, conversationId);
  } catch {
    // 写入失败时静默降级，下一轮仍会尝试携带已知会话 ID。
  }
}

function FloatingAssistant({ assistant }) {
  const [open, setOpen] = React.useState(false);
  const userInteractedRef = React.useRef(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!userInteractedRef.current) {
        setOpen(true);
      }
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  const closePanel = () => {
    userInteractedRef.current = true;
    setOpen(false);
  };

  const togglePanel = () => {
    userInteractedRef.current = true;
    setOpen((value) => !value);
  };

  return (
    <div className={open ? "floating-assistant is-open" : "floating-assistant"}>
      {open ? (
        <div className="floating-assistant-panel">
          <button
            className="floating-close"
            type="button"
            aria-label="关闭 AI 分身对话框"
            onClick={closePanel}
          >
            <X size={18} />
          </button>
          <AssistantChat assistant={assistant} compact />
        </div>
      ) : null}
      <button
        className="floating-avatar-button"
        type="button"
        aria-label={open ? "关闭 AI 分身对话框" : "打开 AI 分身对话框"}
        aria-expanded={open}
        onClick={togglePanel}
      >
        <img src={aiAvatar} alt="王学明 AI 分身头像" />
        <span />
      </button>
    </div>
  );
}

function SkillMatrix() {
  const rows = [
    ["前端 / 跨端", "TypeScript", "React", "Vue 3", "Flutter", "小程序"],
    ["客户端", "iOS (Swift)", "Flutter App", "WebView", "性能优化", "SDK"],
    ["后端 / 全栈", "Node.js", "Python", "GraphQL", "接口设计", "自动化脚本"],
    ["数据 / 存储", "SQLite", "FMDB", "CoreData", "MySQL", "Redis"],
    ["工程化 / 工具", "Vite", "CocoaPods", "CI/CD", "Git", "ESLint"],
    ["Web3 / AI", "Solidity", "Ethers.js", "NFT", "AI API", "LangChain"],
  ];
  return (
    <article className="matrix-panel">
      <div className="panel-head">
        <h2>技能矩阵</h2>
        <a href="#skills">查看全部技能 <ArrowUpRight size={15} /></a>
      </div>
      <div className="skill-table">
        {rows.map((row) => (
          <div className="skill-row" key={row[0]}>
            <strong>{row[0]}</strong>
            {row.slice(1).map((item) => <span key={item}>{item}</span>)}
          </div>
        ))}
      </div>
    </article>
  );
}

function TimelineCompact() {
  const [expanded, setExpanded] = React.useState(false);
  const visibleTimeline = expanded ? resume.timeline : resume.timeline.slice(0, 3);

  return (
    <article className="timeline-panel" id="timeline">
      <div className="panel-head">
        <h2>工作经历</h2>
        <button
          type="button"
          className="panel-head-action"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "收起经历" : "查看完整经历"} <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="timeline compact">
        {visibleTimeline.map((item) => (
          <article className="timeline-item" key={item.company}>
            <span className="timeline-dot" />
            <span className="timeline-period">{item.period}</span>
            <div>
              <h3>{item.company}</h3>
              <p>{item.role}</p>
              <span>{item.focus}</span>
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}

function SectionTitle({ title, text }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function ProjectCard({ project, index }) {
  const detailHref = `${basePath}/#/project/${project.slug}`;

  return (
    <article className="project-card">
      <div className="project-card-head">
        <div className="project-icon"><Code2 size={24} /></div>
        <div className="project-head-meta">
          <span>Case {String(index + 1).padStart(2, "0")}</span>
          <div className="project-topline">
            {project.stack.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </div>
      <div className="project-card-body">
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <div className="project-actions">
          <a className="project-link" href={detailHref}>
            查看详情 <ArrowUpRight size={15} />
          </a>
          <a className="project-link muted" href={detailHref}>
            <PlayCircle size={15} /> 演示
          </a>
          <a className="project-link muted" href={detailHref}>
            <Camera size={15} /> 截图
          </a>
        </div>
      </div>
    </article>
  );
}

function AIMiniProjectsSection() {
  return (
    <section className="ai-lab-section section" id="ai-lab">
      <div className="ai-lab-shell">
        <div className="ai-lab-intro">
          <span className="section-eyebrow">AI Built Experiments</span>
          <h2>AI 小项目实验室</h2>
          <p>
            这些是用 AI 辅助快速完成的小项目，覆盖小游戏、交互模拟和医学科普 Web 展示。它们不替代正式项目经历，但能体现从想法到可访问 Demo 的落地速度。
          </p>
          <div className="ai-lab-stats" aria-label="AI 小项目概览">
            <span><strong>{aiMiniProjects.length}</strong> 个外链 Demo</span>
            <span><strong>5</strong> 个小游戏</span>
            <span><strong>3</strong> 个科普文档</span>
            <span><strong>{aiResearchDocs.length}</strong> 个研究文档</span>
          </div>
        </div>
        <div className="ai-lab-grid">
          {aiMiniProjects.map((item) => (
            <a
              className={`ai-lab-card accent-${item.accent}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              key={item.title}
            >
              <span className="ai-lab-card-icon">
                {item.type === "医学科普" ? <FileText size={19} /> : item.type === "可视化" ? <Sparkles size={19} /> : <Gamepad2 size={19} />}
              </span>
              <span className="ai-lab-card-type">{item.type}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <span className="ai-lab-card-action">
                打开 Demo <ArrowUpRight size={15} />
              </span>
            </a>
          ))}
        </div>
        <div className="ai-doc-panel" aria-label="Web3 研究文档">
          <div className="ai-doc-panel-head">
            <span className="section-eyebrow">Web3 Research Output</span>
            <h3>图谱化研究文档</h3>
          </div>
          <div className="ai-doc-grid">
            {aiResearchDocs.map((item) => (
              <a className="ai-doc-card" href={item.url} target="_blank" rel="noreferrer" key={item.title}>
                <span className="ai-doc-icon"><FileText size={20} /></span>
                <span className="ai-doc-type">{item.type}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span className="ai-doc-meta">{item.meta}</span>
                <span className="ai-doc-action">
                  查看文档 <ArrowUpRight size={15} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopVersionPage({ auth }) {
  return (
    <>
      <header className="detail-header desktop-version-header">
        <a href={`${basePath}/`} className="back-link"><ArrowLeft size={18} /> 返回首页</a>
        <button
          className="secondary-action"
          type="button"
          onClick={auth.openLogin}
        >
          {auth.isAuthenticated ? <ShieldCheck size={18} /> : <LockKeyhole size={18} />}
          {auth.isAuthenticated ? "管理登录状态" : "登录后查看"}
        </button>
      </header>
      <main className="desktop-version-main">
        {auth.isAuthenticated ? (
          <section className="desktop-version-shell" aria-label="DesktopVersion 后台">
            <iframe
              className="desktop-version-frame"
              title="DesktopVersion"
              src={desktopVersionSrc}
            />
          </section>
        ) : (
          <section className="desktop-version-locked">
            <span><LockKeyhole size={28} /></span>
            <h1>DesktopVersion</h1>
            <p>该后台入口需要管理员登录后查看。</p>
            <button className="primary-action" type="button" onClick={auth.openLogin}>
              登录查看 <ArrowUpRight size={18} />
            </button>
          </section>
        )}
      </main>
    </>
  );
}

function SkillDetailPage({ skill, auth }) {
  const SkillIcon = skill.icon || Sparkles;
  const siblingSkills = skillDetails.filter((item) => item.slug !== skill.slug);

  return (
    <>
      <header className="detail-header skill-detail-header">
        <a href={`${basePath}/#top`} className="back-link"><ArrowLeft size={18} /> 返回首页</a>
        <div className="skill-header-actions">
          {!auth.isAuthenticated ? (
            <button className="secondary-action" type="button" onClick={auth.openLogin}>
              <LockKeyhole size={16} /> 登录查看面试话术
            </button>
          ) : null}
          <a href={`${basePath}/#projects`} className="secondary-action">
            查看项目案例 <ArrowUpRight size={16} />
          </a>
        </div>
      </header>
      <main className={`skill-detail-main skill-theme-${skill.theme}`}>
        <section className="skill-detail-hero">
          <div className="skill-detail-icon"><SkillIcon size={32} /></div>
          <div>
            <p className="section-eyebrow">Skill Deep Dive</p>
            <h1>{skill.title}</h1>
            <p>{skill.subtitle}</p>
          </div>
        </section>

        <section className="skill-focus-strip" aria-label="能力关键词">
          {skill.focus.map((item) => (
            <span key={item}><CheckCircle2 size={16} /> {item}</span>
          ))}
        </section>

        <section className="skill-detail-grid">
          <article className="skill-story-panel">
            <span className="section-eyebrow">Experience</span>
            <h2>经验说明</h2>
            <p>{skill.overview}</p>
            <div className="skill-highlight-list">
              {skill.highlights.map((item) => (
                <div key={item}>
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="skill-side-panel">
            <span className="section-eyebrow">Proof</span>
            <h2>项目证据</h2>
            <ul>
              {skill.projects.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </aside>
        </section>

        {auth.isAuthenticated ? (
          <section className="skill-interview-section">
            <div>
              <span className="section-eyebrow">Interview Narrative</span>
              <h2>面试时可以这样展开</h2>
            </div>
            <div className="skill-interview-grid">
              {skill.interview.map((item, index) => (
                <article key={item}>
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="skill-related-section">
          <div>
            <span className="section-eyebrow">More Skills</span>
            <h2>继续查看其他技能</h2>
          </div>
          <div className="skill-related-list">
            {siblingSkills.slice(0, 7).map((item) => (
              <a className={`skill-related-link skill-tag-${item.theme}`} href={`${basePath}/skill/${item.slug}`} key={item.slug}>
                {item.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ProjectDetail({ project, auth }) {
  return (
    <>
      <header className="detail-header">
        <a href={`${basePath}/#projects`} className="back-link"><ArrowLeft size={18} /> 返回首页</a>
        <a href={`mailto:${resume.email}`} className="secondary-action"><Mail size={18} /> 联系候选人</a>
      </header>
      <main className="detail-main">
        <section className="detail-hero">
          <div>
            <p className="project-period">{project.period} · {project.role}</p>
            <h1>{project.name}</h1>
            <p>{project.summary}</p>
            <div className="tag-row">
              {project.stack.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
          {auth.isAuthenticated ? <MediaBox project={project} /> : null}
        </section>
        <section className="detail-grid">
          <DetailBlock title="项目背景" items={project.background} />
          <DetailBlock title="关键职责" items={project.responsibilities} />
          <DetailBlock title="成果与指标" items={project.results} />
          <PrivateDetailBlock title="面试讲法" items={project.interviewAngles} auth={auth} />
        </section>
        {auth.isAuthenticated ? (
          <section className="detail-section">
            <h2>Demo / 视频 / 截图补充建议</h2>
            <div className="asset-grid">
              {project.assets.map((asset) => (
                <article className={asset.url ? "asset-item has-url" : "asset-item"} key={asset.title}>
                  <PlayCircle size={22} />
                  <h3>{asset.title}</h3>
                  <p>{asset.text}</p>
                  <span>{asset.type} · {asset.status}</span>
                  {asset.url ? (
                    <a className="asset-link" href={asset.url} target="_blank" rel="noreferrer">
                      打开素材 <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <small>{asset.privacyLevel === "needs-redaction" ? "需脱敏后公开" : "素材整理中"}</small>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}

function MediaBox({ project }) {
  const primaryAsset = project.assets.find((asset) => asset.url || asset.thumbnail) || project.assets[0];
  return (
    <div className="media-box">
      <div className="media-toolbar">
        <span />
        <span />
        <span />
      </div>
      <div className="media-content">
        {primaryAsset?.thumbnail ? (
          <img src={primaryAsset.thumbnail} alt={`${primaryAsset.title} 缩略图`} />
        ) : (
          <FileText size={42} />
        )}
        <strong>{primaryAsset?.title || project.demoStatus}</strong>
        <p>
          {primaryAsset?.url
            ? "已配置真实素材链接，可作为 demo、视频或截图入口。"
            : `${project.demoStatus}。素材未补齐时显示明确状态，不让详情页出现空白区域。`}
        </p>
        {primaryAsset?.url ? (
          <a className="secondary-action" href={primaryAsset.url} target="_blank" rel="noreferrer">
            打开素材 <ArrowUpRight size={16} />
          </a>
        ) : null}
      </div>
    </div>
  );
}

function DetailBlock({ title, items }) {
  return (
    <article className="detail-block">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}

function PrivateDetailBlock({ title, items, auth }) {
  if (!auth.isAuthenticated) {
    return null;
  }
  return <DetailBlock title={title} items={items} />;
}

function NotFound() {
  return (
    <main className="not-found">
      <h1>项目未找到</h1>
      <p>请从首页项目卡片进入详情页。</p>
      <a className="primary-action" href={`${basePath}/`}>返回首页</a>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} 王学明 Online Resume</span>
    </footer>
  );
}

const rootElement = document.getElementById("root");
rootElement.__resumeRoot ??= createRoot(rootElement);
rootElement.__resumeRoot.render(<App />);
