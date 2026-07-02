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

const agentQuestions = [
  {
    slug: "stable-json-output",
    question: "大模型怎么稳定输出 JSON？",
    category: "结构化输出",
    summary: "靠 schema 约束、低温度、失败重试、解析校验和业务兜底，而不是只在 prompt 里说“请输出 JSON”。",
    answer: {
      core:
        "稳定 JSON 的关键是把“自然语言生成”变成“受约束的数据生成”。我会优先使用模型或 SDK 支持的 structured outputs / JSON schema；如果平台不支持，就在系统提示词里给出字段、类型、枚举、必填项和禁止额外文本，并在服务端做 JSON.parse、schema validate、自动修复或重试。",
      practices: [
        "字段层面写清楚类型、枚举、是否可空、数组长度和默认值，不让模型自由发挥字段名。",
        "温度设低，避免同一个字段今天叫 title、明天叫 name。",
        "服务端只信解析后的对象，不信模型原文；解析失败要重试或降级。",
        "对金额、日期、ID、布尔值这类字段做二次校验，避免字符串看起来对但业务不可用。",
      ],
      pitfalls: [
        "只靠 prompt 约束不够，模型仍可能输出说明文字、Markdown 代码块或尾随逗号。",
        "不要让模型直接决定数据库写入，必须经过 schema 和权限校验。",
      ],
      interview:
        "我会回答：稳定 JSON 不是 prompt 技巧，而是协议设计。模型负责生成候选结构，服务端负责校验、修复、重试和兜底。上线时我会记录解析失败率、字段缺失率和重试次数，用这些指标判断结构化输出是否稳定。",
      diagram: "json",
    },
  },
  {
    slug: "claude-rag-vector-search",
    question: "Claude 为何不一定依赖 RAG / 向量检索？",
    category: "RAG",
    summary: "更准确的说法不是 Claude 不用 RAG，而是长上下文模型在某些场景可以先直接读上下文，RAG 仍适合大规模知识库和权限过滤。",
    answer: {
      core:
        "Claude 这类长上下文模型可以一次读入较长材料，所以在文档数量少、上下文可控、问题需要跨段推理时，不一定先做向量检索。但这不等于不用 RAG。RAG 的价值在于大规模知识库召回、权限隔离、增量更新、成本控制和可追溯引用。Code 模式也是类似逻辑：它不是不用 RAG，而是优先用代码搜索、文件读取、符号定位、git diff、终端日志和测试结果获取精确上下文。",
      practices: [
        "文档少且用户明确上传了材料：直接放进上下文，减少检索误召回。",
        "知识库很大、权限复杂、频繁更新：使用 RAG，先召回再生成。",
        "对答案可追溯要求高：RAG 返回来源片段，回答必须引用证据。",
        "复杂任务可混合：先检索候选资料，再让长上下文模型做综合推理。",
        "代码任务优先用 grep/rg、AST/符号索引、调用链、测试输出和真实文件内容，因为代码需要精确到路径、函数名、参数和报错行。",
      ],
      pitfalls: [
        "不要说 Claude 不需要 RAG；准确表述是“不是所有场景都需要向量检索”。",
        "长上下文不等于会自动找到正确证据，材料过多仍会稀释注意力和增加成本。",
        "不要把 Code 模式理解成纯聊天模型。它和普通问答最大的区别是能读写工作区、运行命令、验证结果；向量检索只是可选的上下文来源之一。",
      ],
      interview:
        "我会说：RAG 是工程策略，不是模型信仰。是否使用 RAG 取决于知识规模、权限、更新频率、成本和可追溯要求。Claude 长上下文让部分场景可以简化检索，但企业知识库通常仍需要 RAG 或混合检索。Code 模式下也不是不用 RAG，而是优先使用更精确的工程工具，比如搜索仓库、读文件、看调用链、跑测试和分析日志；当跨仓库、跨文档或需要历史知识时，再引入 RAG、全文搜索或项目记忆。",
      diagram: "rag",
    },
  },
  {
    slug: "llm-hallucination",
    question: "大模型为什么会有幻觉？",
    category: "可靠性",
    summary: "因为模型是在预测最可能的文本，不是数据库查询；缺少证据、问题模糊、训练噪声和上下文冲突都会诱发幻觉。",
    answer: {
      core:
        "大模型的本质是根据上下文预测下一个 token。它没有天然的事实数据库，也不会自动知道自己不知道。当问题缺证据、上下文不完整、资料互相矛盾，或者用户要求它必须给出答案时，模型就可能生成听起来合理但事实错误的内容。",
      practices: [
        "高风险事实必须接检索、数据库、工具或引用来源，不让模型凭空回答。",
        "系统提示词允许模型说不知道，并要求区分事实、推断和建议。",
        "关键字段走工具查询，例如订单状态、价格、排期、用户信息。",
        "输出后做事实校验、规则校验或人工审核，尤其是医疗、法律、财务内容。",
      ],
      pitfalls: [
        "温度调低只能减少随机性，不能根治事实错误。",
        "模型语气自信不代表答案正确。",
      ],
      interview:
        "我会解释：幻觉不是模型坏了，而是生成式模型的默认风险。工程上要把事实型问题交给数据源，把推理型问题交给模型，并通过引用、校验和拒答策略控制风险。",
      diagram: "grounding",
    },
  },
  {
    slug: "agent-memory-management",
    question: "Agent 如何做记忆管理？",
    category: "记忆",
    summary: "记忆要分短期上下文、会话摘要、长期偏好、任务状态和可检索知识，不能把所有聊天记录无限塞进 prompt。",
    answer: {
      core:
        "Agent 记忆管理要先分类：短期记忆放当前任务上下文；会话记忆保存阶段性摘要；长期记忆保存稳定偏好和事实；知识记忆走文档库/RAG；任务记忆记录待办、工具结果和决策。不同记忆的生命周期、权限和写入条件都不一样。",
      practices: [
        "每轮对话只带当前任务必要上下文，避免 prompt 被旧信息污染。",
        "长对话定期摘要，保留决策和约束，丢弃寒暄和重复内容。",
        "长期记忆必须有写入门槛，例如用户明确确认、重复出现或对未来任务稳定有用。",
        "敏感信息不进长期记忆，或者加密、脱敏、可删除。",
      ],
      pitfalls: [
        "把完整聊天历史都当记忆，会导致成本高、冲突多、模型抓不住重点。",
        "未经用户确认保存偏好，容易造成隐私和体验问题。",
      ],
      interview:
        "我会回答：记忆不是越多越好，而是要分层、可过期、可审计。Agent 真正需要的是当前目标、关键约束、已验证事实和下一步状态，而不是所有历史文本。",
      diagram: "memory",
    },
  },
  {
    slug: "tool-calling-design",
    question: "Agent 工具调用应该怎么设计？",
    category: "工具调用",
    summary: "工具要有清晰 schema、权限边界、幂等设计、超时重试和结果校验，避免模型把工具当万能函数。",
    answer: {
      core:
        "工具调用的关键是把模型的意图转成可控的系统操作。每个工具要定义输入 schema、输出 schema、权限、超时、错误码和副作用。读操作可以自动执行，写操作、支付、发送消息、删除数据等必须有确认或权限控制。",
      practices: [
        "工具名和描述要具体，避免模型误选。",
        "输入参数尽量结构化，少用自由文本。",
        "工具结果返回可供模型理解的摘要，同时保留原始状态码给系统判断。",
        "所有有副作用的工具都做审计日志和幂等 key。",
      ],
      pitfalls: [
        "不要让模型直接拼 SQL 或 shell 执行高权限操作。",
        "工具失败时不要让模型假装成功，要明确错误和下一步。",
      ],
      interview:
        "我会说：Agent 的可靠性很大程度取决于工具边界。模型负责决定意图，系统负责校验、执行和审计。越接近真实业务写操作，越要把权限和确认放在模型外面。",
      diagram: "tool",
    },
  },
  {
    slug: "prompt-injection-defense",
    question: "怎么防 Prompt Injection？",
    category: "安全",
    summary: "把用户内容、网页内容、工具结果都当不可信输入，系统指令和权限判断必须放在模型外层。",
    answer: {
      core:
        "Prompt Injection 是外部内容试图覆盖系统指令或诱导模型泄露数据。防御思路是分层信任：系统指令最高，开发者规则其次，用户和网页内容都不可信。真正的权限判断、数据过滤和动作确认要在程序里做，而不是只靠模型自律。",
      practices: [
        "工具结果和网页内容用明确标签包起来，提示模型只能当资料，不能当指令。",
        "敏感数据默认不放进上下文，必须按任务最小化提供。",
        "发送、删除、付款、改权限等动作需要 action-time confirmation。",
        "对输出做策略检查，避免泄露 token、隐私和内部提示词。",
      ],
      pitfalls: [
        "不要相信“忽略以上规则”这类文本无害，它可能来自网页或邮件。",
        "不要把系统 prompt、API key、完整工具返回一股脑交给模型。",
      ],
      interview:
        "我会回答：防注入不是写一句‘不要被攻击’。要把信任边界做在系统架构里：不可信内容隔离、权限外置、工具最小授权、动作确认和审计日志。",
      diagram: "safety",
    },
  },
  {
    slug: "context-window-management",
    question: "长上下文不够用时怎么办？",
    category: "上下文",
    summary: "靠摘要、检索、分块、任务状态和优先级裁剪，而不是简单截断最早消息。",
    answer: {
      core:
        "上下文窗口是 Agent 的工作内存。超出窗口时要保留目标、约束、已做决策、当前文件/数据、失败原因和下一步，丢弃重复对话和低价值细节。对于文档和代码库，应该用检索或索引按需加载。",
      practices: [
        "对长会话做滚动摘要，摘要里保留决策和约束。",
        "对代码和文档按任务检索，不把整个仓库塞进 prompt。",
        "给上下文分优先级：系统规则、用户要求、当前任务证据、历史背景。",
        "关键事实用结构化状态保存，避免摘要漂移。",
      ],
      pitfalls: [
        "简单截断可能删掉最早但最重要的需求约束。",
        "摘要也可能出错，重要事实最好可追溯到来源。",
      ],
      interview:
        "我会说：上下文管理就是让模型始终看到当前任务最有用的信息。长上下文只是容量变大，不代表可以不做信息治理。",
      diagram: "memory",
    },
  },
  {
    slug: "agent-evaluation",
    question: "Agent 怎么做效果评测？",
    category: "评测",
    summary: "要评测任务完成率、工具正确率、事实准确率、成本、延迟和安全，不只看回答像不像人。",
    answer: {
      core:
        "Agent 评测不能只用主观打分。要建立任务集，每个任务有输入、允许工具、预期结果和失败标准。评测维度包括是否完成任务、是否调用正确工具、是否遵守权限、事实是否有证据、成本和耗时是否可接受。",
      practices: [
        "用真实业务任务做 golden set，例如查询订单、生成报告、修改配置。",
        "记录每一步工具调用，评估参数是否正确。",
        "对高风险任务做人工复核和回归测试。",
        "上线后监控失败率、人工接管率、平均成本和用户纠错率。",
      ],
      pitfalls: [
        "只看模型回答分数，容易忽略工具误调用和副作用。",
        "评测集太简单，会导致 demo 很好、生产很差。",
      ],
      interview:
        "我会回答：Agent 评测要像测业务系统一样测闭环结果。模型回答只是中间过程，最终要看任务是否正确、安全、可控地完成。",
      diagram: "eval",
    },
  },
  {
    slug: "multi-agent-collaboration",
    question: "多 Agent 协作怎么设计？",
    category: "多 Agent",
    summary: "先定义角色、输入输出、共享状态和仲裁机制，不要让多个 Agent 随机聊天。",
    answer: {
      core:
        "多 Agent 适合把复杂任务拆给不同角色，例如规划、检索、实现、审查、测试。但它需要清晰协议：谁负责决策，谁负责执行，输出格式是什么，共享哪些状态，冲突如何仲裁。否则多个 Agent 会互相重复、互相误导。",
      practices: [
        "任务拆分要有 disjoint ownership，避免多人改同一个文件或同一段结论。",
        "子 Agent 输出要结构化：发现、证据、风险、建议。",
        "主 Agent 负责整合和最终责任，不把决策完全外包。",
        "并行任务适合信息收集、审核、独立模块实现。",
      ],
      pitfalls: [
        "多 Agent 不等于更聪明，可能只是更贵、更慢、更难控。",
        "没有共享事实源时，不同 Agent 会产生互相冲突的结论。",
      ],
      interview:
        "我会说：多 Agent 的核心是工程管理，不是堆模型数量。要像团队协作一样定义角色、边界、交付物和审查机制。",
      diagram: "agent",
    },
  },
  {
    slug: "agent-cost-control",
    question: "Agent 成本怎么控制？",
    category: "成本",
    summary: "通过模型分级、缓存、检索裁剪、批处理、超时控制和工具优先，避免所有任务都用最大模型。",
    answer: {
      core:
        "Agent 成本来自 token、模型档位、工具调用、重试和长链路延迟。控制成本要先分任务：简单分类、格式化、路由用小模型或规则；复杂推理用强模型；事实查询优先工具和缓存。",
      practices: [
        "对 prompt 和上下文做裁剪，减少无效历史。",
        "相同输入或稳定知识结果做缓存。",
        "设置最大步数、最大重试和超时。",
        "监控单任务成本和高成本异常链路。",
      ],
      pitfalls: [
        "只压低模型价格可能导致失败率上升，反而因为重试更贵。",
        "把所有历史都放进上下文，是最常见的隐性成本浪费。",
      ],
      interview:
        "我会回答：成本优化不是简单换便宜模型，而是任务路由、上下文治理、缓存和失败控制的组合。最终看单位成功任务成本，而不是单次调用价格。",
      diagram: "eval",
    },
  },
  {
    slug: "agent-state-machine",
    question: "Agent 为什么需要状态机？",
    category: "架构",
    summary: "状态机能约束 Agent 当前能做什么、下一步去哪、失败怎么恢复，避免无限循环和乱调用工具。",
    answer: {
      core:
        "真实业务 Agent 不是每轮都自由生成，而是处在明确状态里：收集信息、确认意图、调用工具、等待结果、需要人工确认、完成或失败。状态机让系统知道当前允许哪些动作，也方便断点续跑和错误恢复。",
      practices: [
        "为每个状态定义允许工具和退出条件。",
        "失败状态要保存错误原因和可恢复动作。",
        "长任务保存 checkpoint，避免重启后丢失进度。",
        "用户确认状态必须显式等待，不让模型自动越权。",
      ],
      pitfalls: [
        "没有状态机的 Agent 容易重复问问题、重复调工具或忘记已经完成的步骤。",
        "状态太细也会复杂，应该围绕业务关键节点设计。",
      ],
      interview:
        "我会说：状态机是把 Agent 从聊天机器人变成业务系统的关键。模型可以灵活推理，但业务流程必须可控、可恢复、可审计。",
      diagram: "agent",
    },
  },
  {
    slug: "human-in-the-loop",
    question: "哪些场景必须 Human-in-the-loop？",
    category: "安全",
    summary: "有外部副作用、高金额、高风险、低置信度或涉及隐私权限时，需要人工确认或审核。",
    answer: {
      core:
        "Human-in-the-loop 不是不自动化，而是在关键节点让人确认。典型场景包括发送消息、付款、删除数据、修改权限、提交合同、医疗法律建议、高金额订单和模型低置信度判断。",
      practices: [
        "读操作默认自动，写操作按风险分级确认。",
        "确认页面展示模型将执行什么、影响谁、数据来源是什么。",
        "人工修改后的结果回写为反馈，用于后续评测和改进。",
        "高风险动作保留审计记录。",
      ],
      pitfalls: [
        "确认不能只问“是否继续”，要展示具体动作和数据。",
        "所有步骤都人工确认会失去自动化价值，需要按风险分级。",
      ],
      interview:
        "我会回答：Agent 的自动化边界取决于风险。低风险让它自动做，高风险让它准备方案并等待人确认，这样既有效率也可控。",
      diagram: "safety",
    },
  },
  {
    slug: "streaming-user-experience",
    question: "Agent 流式输出如何设计体验？",
    category: "体验",
    summary: "流式输出要让用户知道系统在做什么，同时不能把未验证内容当最终结果。",
    answer: {
      core:
        "流式体验不只是逐字显示。Agent 做长任务时，用户需要看到阶段状态：正在理解问题、检索资料、调用工具、生成答案、等待确认。对于工具结果和最终结论，最好分区展示，避免用户把中间草稿当事实。",
      practices: [
        "展示步骤状态和进度，而不是只转圈。",
        "工具调用期间保留 loading，避免用户误以为点击无效。",
        "最终答案和中间思考/草稿分开。",
        "失败时给可重试动作和已完成部分。",
      ],
      pitfalls: [
        "逐字输出可能让错误内容先出现在屏幕上，要考虑敏感场景的延迟展示。",
        "只显示 loading 不显示阶段，会让用户不信任系统。",
      ],
      interview:
        "我会说：Agent 体验设计的目标是可预期。用户不一定需要看见内部推理，但需要知道现在执行到哪一步、是否可取消、失败后怎么恢复。",
      diagram: "agent",
    },
  },
  {
    slug: "agent-observability",
    question: "Agent 如何做可观测性？",
    category: "可观测性",
    summary: "要记录输入、路由、上下文摘要、工具调用、模型版本、成本、延迟、错误和最终结果。",
    answer: {
      core:
        "Agent 出错时不能只看最终回答。可观测性要覆盖整条链路：用户输入、选择了哪个模型、带了哪些上下文、调用了哪些工具、工具参数和结果、每步耗时、token 成本、失败原因和最终状态。",
      practices: [
        "每个任务生成 traceId，贯穿模型调用和工具调用。",
        "敏感数据脱敏后再写日志。",
        "聚合指标包括成功率、工具失败率、重试率、平均成本和人工接管率。",
        "保留可回放样本，用于复盘和回归测试。",
      ],
      pitfalls: [
        "日志里不能存 API key、完整个人隐私或未脱敏业务数据。",
        "只记录最终文本，无法定位是检索错、工具错还是模型错。",
      ],
      interview:
        "我会回答：Agent 可观测性要像分布式系统 trace 一样做。没有 trace，就无法解释为什么它做错，也无法稳定迭代。",
      diagram: "eval",
    },
  },
  {
    slug: "rag-chunking",
    question: "RAG 文档怎么切分更合理？",
    category: "RAG",
    summary: "按语义和结构切分，保留标题、层级、来源和相邻上下文，而不是固定每 500 字切一刀。",
    answer: {
      core:
        "RAG 切分的目标是让召回片段既完整又不过长。技术文档适合按标题、段落、代码块和表格切；政策/合同适合按条款切；FAQ 适合问答成对切。每个 chunk 要带来源、标题路径、更新时间和权限信息。",
      practices: [
        "chunk 太小会丢上下文，太大会召回噪声。",
        "保留标题路径，例如“登录 > OAuth > Token 刷新”。",
        "对代码、表格、列表不要粗暴截断。",
        "用 overlap 或 parent-child chunk 保留上下文。",
      ],
      pitfalls: [
        "只用向量相似度可能漏掉关键词精确匹配，最好混合 BM25/关键词。",
        "没有权限过滤的 RAG 会造成数据泄露。",
      ],
      interview:
        "我会说：RAG 质量很大程度取决于知识工程。切分、元数据、权限和混合检索做好，模型才能回答得准。",
      diagram: "rag",
    },
  },
  {
    slug: "function-calling-vs-agent",
    question: "Function Calling 和 Agent 有什么区别？",
    category: "架构",
    summary: "Function Calling 是单步工具选择能力，Agent 是围绕目标进行多步规划、执行、观察和修正的系统。",
    answer: {
      core:
        "Function Calling 通常是一轮对话中让模型选择一个函数并填参数。Agent 则更像一个循环：理解目标、规划步骤、调用工具、观察结果、修正计划，直到完成或失败。Agent 可以包含多次 function calling。",
      practices: [
        "简单任务用 function calling，例如查天气、查订单。",
        "多步骤任务用 Agent，例如生成报告、调试问题、自动整理数据。",
        "Agent 要有最大步数、状态机和失败处理。",
        "不要为了包装概念，把所有工具调用都叫 Agent。",
      ],
      pitfalls: [
        "没有目标循环和状态管理，只有函数调用，不算真正 Agent。",
        "Agent 自主性越高，越需要权限和观测。",
      ],
      interview:
        "我会回答：Function Calling 是能力，Agent 是系统。前者解决怎么调用工具，后者解决围绕目标如何持续决策和执行。",
      diagram: "tool",
    },
  },
  {
    slug: "model-routing",
    question: "多模型路由怎么做？",
    category: "模型路由",
    summary: "按任务难度、风险、成本、延迟和上下文长度选择模型，而不是固定所有请求走一个模型。",
    answer: {
      core:
        "多模型路由的目标是让合适任务用合适模型。简单分类、抽取、格式化可以用低成本模型；复杂推理、代码修改、长文综合用强模型；安全审核可以用专门规则或审核模型；语音/图像走多模态模型。",
      practices: [
        "先做任务分类，再选择模型和工具。",
        "低置信度或失败重试时升级模型。",
        "记录每类任务的成功率和成本，动态调整路由。",
        "关键任务避免盲目降级模型。",
      ],
      pitfalls: [
        "只按价格路由会导致质量不稳定。",
        "模型切换后输出格式可能变化，需要统一 schema。",
      ],
      interview:
        "我会说：模型路由本质是成本、质量和延迟的平衡。工程上要看单位成功任务成本，而不是单次调用价格。",
      diagram: "agent",
    },
  },
  {
    slug: "agent-cache",
    question: "Agent 哪些内容适合缓存？",
    category: "缓存",
    summary: "稳定、可复用、无权限差异的结果适合缓存；个性化、敏感、实时数据要谨慎。",
    answer: {
      core:
        "Agent 缓存可以分 prompt 缓存、检索结果缓存、工具结果缓存、模型回答缓存和中间摘要缓存。缓存能降成本和延迟，但必须处理权限、过期时间和数据实时性。",
      practices: [
        "公共文档检索结果、静态 FAQ、分类结果适合缓存。",
        "订单、余额、权限、个人信息不应长期缓存，或必须按用户隔离。",
        "缓存 key 要包含模型版本、prompt 版本、知识库版本和用户权限。",
        "缓存命中后仍可做轻量校验。",
      ],
      pitfalls: [
        "缓存未带权限维度，可能把 A 用户数据给 B 用户。",
        "知识库更新后缓存不失效，会回答旧内容。",
      ],
      interview:
        "我会回答：缓存是 Agent 成本优化的重要手段，但权限和时效是底线。缓存策略必须和业务数据类型绑定。",
      diagram: "eval",
    },
  },
  {
    slug: "agent-failure-recovery",
    question: "Agent 失败后怎么恢复？",
    category: "可靠性",
    summary: "要区分模型失败、工具失败、权限失败、业务失败，并提供重试、降级、人工接管和断点续跑。",
    answer: {
      core:
        "Agent 失败不是一个 error 就结束。要先分类：模型输出无效、工具超时、权限不足、业务规则不允许、外部服务失败、用户信息不完整。不同失败对应不同恢复策略。",
      practices: [
        "模型输出格式错：重新生成或修复 JSON。",
        "工具超时：指数退避重试或切换备用服务。",
        "权限不足：请求授权或转人工。",
        "长任务失败：从 checkpoint 续跑，不重做所有步骤。",
      ],
      pitfalls: [
        "无限重试会烧成本，还可能重复执行副作用。",
        "失败信息不具体，用户无法知道下一步该做什么。",
      ],
      interview:
        "我会说：可靠 Agent 一定要能失败得明白。用户看到的不是崩溃，而是当前失败原因、已完成部分和可选恢复动作。",
      diagram: "agent",
    },
  },
  {
    slug: "agent-permissions",
    question: "Agent 权限怎么设计？",
    category: "安全",
    summary: "用最小权限、按动作授权、按数据域过滤，并对高风险操作做确认和审计。",
    answer: {
      core:
        "Agent 权限不能只按用户登录态判断，还要按工具、数据域和动作类型判断。读客户列表、改订单状态、发消息、删除文件是完全不同风险。系统应该在模型外部做 RBAC/ABAC 和工具授权。",
      practices: [
        "每个工具声明所需权限和副作用等级。",
        "按用户身份过滤可访问数据，不把不可见数据放进上下文。",
        "高风险写操作需要二次确认。",
        "保留谁在什么时候让 Agent 做了什么的审计日志。",
      ],
      pitfalls: [
        "不要让模型自己判断用户有没有权限。",
        "不要因为 Agent 是内部工具就给全库权限。",
      ],
      interview:
        "我会回答：权限必须在确定性系统里执行，模型只能提出动作建议。这样才能避免越权访问和误操作。",
      diagram: "safety",
    },
  },
  {
    slug: "agent-productization",
    question: "Agent 从 Demo 到生产要补哪些能力？",
    category: "产品化",
    summary: "要补权限、评测、观测、成本、降级、错误恢复、数据治理和运营后台，不只是接上模型 API。",
    answer: {
      core:
        "Agent Demo 通常只证明模型能回答，生产系统要证明它能稳定、安全、低成本地完成任务。需要补齐身份权限、工具治理、日志追踪、评测集、人工接管、灰度发布、成本监控和用户反馈闭环。",
      practices: [
        "先定义可完成的窄任务，不要一开始做万能助手。",
        "建立失败样本库和回归评测。",
        "上线前做灰度和人工接管机制。",
        "运营后台要能看任务记录、失败原因和成本。",
      ],
      pitfalls: [
        "只做聊天框很容易 Demo 好看，生产不可控。",
        "没有评测和日志，后续无法迭代。",
      ],
      interview:
        "我会说：Agent 产品化的重点不是模型接入，而是把它纳入软件工程体系。能观测、能控制、能评测、能恢复，才算可上线。",
      diagram: "eval",
    },
  },
  {
    slug: "nature-skill-agent-workflow",
    question: "Nature / 学术写作 Skill 如何做成 Agent 工作流？",
    category: "Skill",
    summary: "把检索、阅读、引用、图表、润色和审稿拆成可审计步骤，避免模型凭空写论文。",
    answer: {
      core:
        "Nature 类 skill 不能让模型直接编论文，而要把学术任务拆成工作流：检索真实文献、筛选证据、读取原文、提取方法和结论、生成引用、绘制图表、写作润色、审稿检查。每一步都要保留来源和证据。",
      practices: [
        "文献检索要记录数据库、关键词、筛选标准和排除理由。",
        "引用必须来自真实论文，不允许模型编 DOI。",
        "结果、方法、局限要区分清楚，避免过度结论。",
        "润色阶段只改表达，不改科学事实。",
      ],
      pitfalls: [
        "学术内容最怕幻觉引用和夸大结论。",
        "没有证据链的漂亮文字不能用于论文或投稿。",
      ],
      interview:
        "我会回答：Nature skill 的价值是把严谨流程工具化。模型可以辅助阅读和表达，但事实、引用和数据必须可追溯。",
      diagram: "agent",
    },
  },
  {
    slug: "agent-data-privacy",
    question: "Agent 如何处理隐私和敏感数据？",
    category: "安全",
    summary: "最小化上下文、脱敏、权限过滤、日志治理和数据保留策略缺一不可。",
    answer: {
      core:
        "Agent 很容易把用户输入、工具结果和日志串起来，所以隐私设计要前置。原则是最小化：模型只拿完成任务所需的数据；敏感字段尽量脱敏；日志只记录必要信息；长期记忆必须可删除。",
      practices: [
        "手机号、邮箱、地址、身份证、token 等进入模型前脱敏或不传。",
        "按用户权限过滤检索结果和工具返回。",
        "日志分级保存，敏感数据加密或不落盘。",
        "提供记忆查看、删除和关闭能力。",
      ],
      pitfalls: [
        "把完整数据库记录交给模型再让它自己过滤，是错误做法。",
        "调试日志常常成为隐私泄露源。",
      ],
      interview:
        "我会说：隐私不是最后加一个过滤器，而是从上下文构造、工具返回、日志和记忆全链路控制。",
      diagram: "safety",
    },
  },
  {
    slug: "agent-planning",
    question: "Agent 规划能力应该怎么约束？",
    category: "规划",
    summary: "规划要短周期、可验证、可中断，避免一次生成超长计划后盲目执行。",
    answer: {
      core:
        "Agent 规划不是让模型写一大串步骤然后一直执行。更稳的方式是短计划：先列 2-5 步，执行一步，观察结果，再更新计划。每一步都要有完成条件和失败条件。",
      practices: [
        "复杂任务先让模型给计划，但执行前由系统或用户确认关键步骤。",
        "每步执行后检查结果是否满足条件。",
        "计划中包含工具调用、人工确认和停止条件。",
        "长期任务保存计划状态，支持暂停和恢复。",
      ],
      pitfalls: [
        "长计划容易在中途偏离现实，尤其是工具结果和预期不一致时。",
        "没有停止条件会导致循环调用。",
      ],
      interview:
        "我会回答：Agent 规划要像敏捷迭代，短周期验证、持续修正，而不是一次性幻想完整路线。",
      diagram: "agent",
    },
  },
  {
    slug: "agent-frontend-integration",
    question: "前端接 Agent 要注意什么？",
    category: "前端集成",
    summary: "前端要处理流式状态、取消、重试、权限提示、长任务进度和错误恢复。",
    answer: {
      core:
        "前端接 Agent 不只是放一个聊天框。需要展示任务阶段、流式内容、工具调用状态、可取消按钮、重试入口、权限确认弹窗和历史记录。长任务要让用户知道系统在做什么。",
      practices: [
        "流式输出时区分草稿、工具状态和最终答案。",
        "支持 AbortController 取消长请求。",
        "错误提示要给恢复动作，例如重试、修改输入、联系人工。",
        "敏感操作确认弹窗展示具体动作和影响对象。",
      ],
      pitfalls: [
        "只显示一个 loading 会让用户觉得卡死。",
        "网络断开或刷新后没有任务状态，会丢失用户信任。",
      ],
      interview:
        "我会说：Agent 前端的重点是可控感。用户要知道系统在做什么、能不能取消、失败后怎么办。",
      diagram: "agent",
    },
  },
];

const agentQuestionMap = new Map(agentQuestions.map((item) => [item.slug, item]));

const agentDeepDiveByDiagram = {
  json: {
    scenario: "适合表单抽取、配置生成、接口参数组装、AI 批改结果等必须被程序继续消费的场景。这里的重点不是让模型“看起来像 JSON”，而是让后端拿到稳定、可校验、可回滚的数据对象。",
    steps: [
      "先定义 schema：字段名、类型、枚举、默认值、是否必填、是否允许额外字段。",
      "模型侧使用 structured output / function calling；不支持时用低温度和严格输出边界。",
      "服务端做 JSON.parse、schema validate、业务规则校验，失败后按错误原因重试。",
      "把失败样本沉淀为测试集，统计解析失败率、字段缺失率、重试成功率。",
    ],
    metrics: ["JSON 解析失败率", "Schema 校验失败率", "平均重试次数", "字段缺失率"],
  },
  rag: {
    scenario: "适合企业知识库、产品文档、论文资料、客服资料和权限隔离明显的内容。长上下文能简化一部分场景，但当资料规模、权限、更新频率上来后，仍然需要检索、过滤和来源追踪。",
    steps: [
      "先判断知识规模和权限：少量用户上传文档可直接进上下文，大规模知识库走检索。",
      "构建元数据：标题路径、来源、更新时间、权限标签、业务域。",
      "召回用混合策略：向量检索解决语义，关键词/BM25 解决精确词和编号。",
      "回答必须引用来源，模型不能把未召回内容当事实。",
    ],
    metrics: ["召回命中率", "答案引用覆盖率", "权限过滤误漏率", "单次回答成本"],
  },
  grounding: {
    scenario: "适合事实型、高风险或用户会据此行动的问题，例如价格、订单、政策、医学、法律和排期。模型只负责组织语言和推理，事实必须来自可验证来源。",
    steps: [
      "把问题拆成事实查询和推理表达两部分。",
      "事实查询走数据库、检索、API 或人工确认，不让模型凭印象回答。",
      "回答中区分确定事实、根据证据的推断、需要补充确认的信息。",
      "对高风险输出增加规则校验、引用检查和拒答策略。",
    ],
    metrics: ["事实准确率", "引用有效率", "拒答正确率", "人工纠错率"],
  },
  memory: {
    scenario: "适合长期助手、个人工作流、客服连续会话和多步骤任务。记忆不是聊天记录堆叠，而是把当前目标、稳定偏好、关键决策和任务状态分层保存。",
    steps: [
      "短期上下文保存当前任务材料和最近动作。",
      "会话摘要保存阶段性决策、约束和未完成事项。",
      "长期记忆只保存用户确认过或重复出现的稳定偏好。",
      "敏感信息默认不入长期记忆，并提供删除和审计能力。",
    ],
    metrics: ["上下文 token 消耗", "记忆命中率", "记忆冲突率", "用户纠正次数"],
  },
  tool: {
    scenario: "适合查询订单、生成报告、写入配置、发送消息、调用内部系统等需要 Agent 操作真实系统的场景。工具调用的核心是权限和副作用控制。",
    steps: [
      "每个工具定义输入 schema、输出 schema、权限级别、超时和错误码。",
      "读工具可自动执行，写工具必须按风险分级确认。",
      "工具结果返回给模型前先做脱敏、裁剪和业务状态归一。",
      "所有副作用动作写审计日志，并使用幂等 key 避免重复执行。",
    ],
    metrics: ["工具选择准确率", "参数校验失败率", "工具超时率", "副作用误操作数"],
  },
  safety: {
    scenario: "适合联网 Agent、企业内部助手、自动发消息/改数据/读隐私资料的系统。安全设计必须在模型外层完成，不能只靠 prompt 让模型自觉。",
    steps: [
      "把网页、邮件、用户上传内容、工具返回都标记为不可信输入。",
      "系统权限、数据过滤和动作确认放在程序层，不交给模型自由判断。",
      "敏感动作采用最小授权、二次确认、审计日志和可撤销机制。",
      "对输出做策略检查，避免泄露隐私、密钥、内部提示词和越权信息。",
    ],
    metrics: ["越权拦截率", "敏感信息泄露数", "高风险动作确认率", "安全策略误杀率"],
  },
  eval: {
    scenario: "适合从 demo 走向生产前的验收。Agent 不只评回答好不好，还要评任务是否完成、工具是否正确、是否安全、成本和延迟是否可接受。",
    steps: [
      "建立真实任务集，每条任务包含输入、允许工具、期望结果和失败标准。",
      "记录完整 trace：模型、上下文、工具参数、工具结果、耗时和 token。",
      "用离线评测做版本回归，用线上监控看真实失败率。",
      "把人工接管、用户纠错和工具错误反哺到评测集。",
    ],
    metrics: ["任务完成率", "工具正确率", "平均延迟", "单位成功任务成本"],
  },
  agent: {
    scenario: "适合多步骤、长链路、可中断恢复的任务，例如生成报告、排查问题、整理资料、自动化运营。核心不是让模型自由发挥，而是把目标、状态和边界管理清楚。",
    steps: [
      "把任务拆成状态：理解、计划、执行、观察、确认、完成或失败。",
      "每个状态限定可用工具、退出条件和失败恢复动作。",
      "长任务保存 checkpoint，支持中断续跑和人工接管。",
      "主流程负责仲裁，模型负责建议下一步，不让模型越过业务边界。",
    ],
    metrics: ["任务完成率", "循环步数", "人工接管率", "失败恢复成功率"],
  },
};

function getAgentDeepDive(item) {
  return agentDeepDiveByDiagram[item.answer.diagram] || agentDeepDiveByDiagram.agent;
}

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
  const agentSlug = route.startsWith("/agent/")
    ? route.replace(/^\/agent\/?/, "").replace(/\/$/, "")
    : "";
  const project = projectSlug ? projects.find((item) => item.slug === projectSlug) : null;
  const skill = skillSlug ? skillDetailMap.get(skillSlug) : null;
  const agentQuestion = agentSlug ? agentQuestionMap.get(agentSlug) : null;
  let page;

  if (route === "/desktop") {
    page = <DesktopVersionPage auth={auth} />;
  } else if (agentSlug && agentQuestion) {
    page = <AgentQuestionPage item={agentQuestion} auth={auth} />;
  } else if (agentSlug && !agentQuestion) {
    page = <NotFound />;
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
  if (window.location.hash.startsWith("#/agent/")) {
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
  if (currentPath.startsWith("/agent/")) return currentPath;
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
  const featuredQuestions = agentQuestions.slice(0, 4);
  const pagedQuestions = agentQuestions.slice(4);
  const pageSize = 8;
  const totalPages = Math.ceil(pagedQuestions.length / pageSize);
  const [agentPage, setAgentPage] = React.useState(1);
  const pageStart = (agentPage - 1) * pageSize;
  const primaryQuestions = pagedQuestions.slice(pageStart, pageStart + pageSize);

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
            <span><strong>{agentQuestions.length}</strong> 个 Agent 开发问答</span>
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
        <div className="agent-faq-panel" aria-label="Agent 开发常见问题">
          <div className="agent-faq-head">
            <div>
              <span className="section-eyebrow">Agent Engineering FAQ</span>
              <h3>Agent 开发常见问题</h3>
              <p>围绕结构化输出、RAG、幻觉、记忆、工具调用、安全、评测和成本，整理成可点击的工程实践问答。每个问题都按“原理、落地步骤、风险点、面试表达”拆开。</p>
            </div>
            <div className="agent-faq-meter" aria-label="Agent 问题数量">
              <strong>{agentQuestions.length}</strong>
              <span>个工程问题</span>
            </div>
          </div>
          <div className="agent-feature-grid">
            {featuredQuestions.map((item, index) => (
              <a className="agent-feature-card" href={`${basePath}/agent/${item.slug}`} key={item.slug}>
                <span className="agent-feature-index">{String(index + 1).padStart(2, "0")}</span>
                <em>{item.category}</em>
                <strong>{item.question}</strong>
                <p>{item.summary}</p>
                <span className="agent-feature-action">查看拆解 <ArrowUpRight size={15} /></span>
              </a>
            ))}
          </div>
          <div className="agent-question-list" aria-label="Agent 更多常见问题">
            {primaryQuestions.map((item, index) => (
              <a className="agent-question-item" href={`${basePath}/agent/${item.slug}`} key={item.slug}>
                <span>{String(pageStart + index + 5).padStart(2, "0")}</span>
                <div>
                  <strong>{item.question}</strong>
                  <p>{item.summary}</p>
                </div>
                <em>{item.category}</em>
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
          <div className="agent-pagination" aria-label="Agent 问题分页">
            <button
              type="button"
              onClick={() => setAgentPage((page) => Math.max(1, page - 1))}
              disabled={agentPage === 1}
            >
              上一页
            </button>
            <div>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  type="button"
                  className={page === agentPage ? "is-active" : ""}
                  onClick={() => setAgentPage(page)}
                  aria-current={page === agentPage ? "page" : undefined}
                  key={page}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAgentPage((page) => Math.min(totalPages, page + 1))}
              disabled={agentPage === totalPages}
            >
              下一页
            </button>
          </div>
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
      {!auth.isAuthenticated ? (
        <header className="detail-header desktop-version-header">
          <a href={`${basePath}/`} className="back-link"><ArrowLeft size={18} /> 返回首页</a>
          <button
            className="secondary-action"
            type="button"
            onClick={auth.openLogin}
          >
            <LockKeyhole size={18} />
            登录后查看
          </button>
        </header>
      ) : null}
      <main className={`desktop-version-main${auth.isAuthenticated ? " desktop-version-main-authed" : ""}`}>
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

function AgentQuestionPage({ item, auth }) {
  const deepDive = getAgentDeepDive(item);

  return (
    <>
      <header className="detail-header agent-detail-header">
        <a href={`${basePath}/#ai-lab`} className="back-link"><ArrowLeft size={18} /> 返回 AI 实验室</a>
      </header>
      <main className="agent-detail-main">
        <section className="agent-detail-hero">
          <div>
            <span className="section-eyebrow">Agent Engineering</span>
            <h1>{item.question}</h1>
            <p>{item.summary}</p>
          </div>
          <span className="agent-category-badge">{item.category}</span>
        </section>

        <section className="agent-detail-layout">
          <aside className="agent-detail-sidebar" aria-label="问题拆解目录">
            <span className="section-eyebrow">Answer Map</span>
            <a href="#agent-core">核心判断</a>
            <a href="#agent-steps">落地步骤</a>
            <a href="#agent-practices">工程做法</a>
            <a href="#agent-risks">风险点</a>
            {auth.isAuthenticated ? <a href="#agent-interview">面试回答</a> : null}
          </aside>

          <div className="agent-detail-content">
            <section className="agent-answer-grid" id="agent-core">
              <article className="agent-answer-card is-main">
                <span className="section-eyebrow">Core Answer</span>
                <h2>核心判断</h2>
                <p>{item.answer.core}</p>
                <div className="agent-scenario-box">
                  <strong>适用场景</strong>
                  <p>{deepDive.scenario}</p>
                </div>
              </article>
              <AgentDiagram type={item.answer.diagram} />
            </section>

            <section className="agent-playbook-card" id="agent-steps">
              <div>
                <span className="section-eyebrow">Implementation Playbook</span>
                <h2>落地拆解</h2>
              </div>
              <ol>
                {deepDive.steps.map((text) => <li key={text}>{text}</li>)}
              </ol>
            </section>

            <section className="agent-answer-columns" id="agent-practices">
              <article className="agent-answer-card">
                <span className="section-eyebrow">Engineering Practices</span>
                <h2>工程做法</h2>
                <ul>
                  {item.answer.practices.map((text) => <li key={text}>{text}</li>)}
                </ul>
              </article>
              <article className="agent-answer-card" id="agent-risks">
                <span className="section-eyebrow">Common Pitfalls</span>
                <h2>常见坑</h2>
                <ul>
                  {item.answer.pitfalls.map((text) => <li key={text}>{text}</li>)}
                </ul>
              </article>
            </section>

            <section className="agent-metrics-card" aria-label="评估指标">
              <span className="section-eyebrow">Production Metrics</span>
              <h2>上线后看这些指标</h2>
              <div>
                {deepDive.metrics.map((metric) => <span key={metric}>{metric}</span>)}
              </div>
            </section>
          </div>
        </section>

        {auth.isAuthenticated ? (
          <section className="agent-interview-card" id="agent-interview">
            <span className="section-eyebrow">Interview Narrative</span>
            <h2>面试时可以这样回答</h2>
            <p>{item.answer.interview}</p>
            <p>
              如果继续展开，我会补充具体工程取舍：先说明这个问题的风险边界，再讲系统层面的控制点，最后用指标闭环证明方案有效。这样回答比只讲概念更像真实项目经验。
            </p>
          </section>
        ) : null}

        <section className="agent-related-panel">
          <div>
            <span className="section-eyebrow">More Questions</span>
            <h2>继续查看 Agent 开发问题</h2>
          </div>
          <div className="agent-related-list">
            {agentQuestions.filter((next) => next.slug !== item.slug).slice(0, 6).map((next) => (
              <a href={`${basePath}/agent/${next.slug}`} key={next.slug}>
                {next.question}
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

function AgentDiagram({ type }) {
  const diagrams = {
    json: {
      title: "稳定 JSON 输出链路",
      nodes: ["Prompt + Schema", "模型生成", "JSON.parse", "Schema 校验", "重试/兜底", "业务使用"],
    },
    rag: {
      title: "RAG / 长上下文 / 搜索选型",
      nodes: ["用户问题", "规模与权限判断", "长上下文", "RAG/全文搜索", "数据库/API", "带来源回答"],
    },
    grounding: {
      title: "降低幻觉的证据闭环",
      nodes: ["问题", "检索/工具", "证据片段", "模型回答", "事实校验", "拒答/修正"],
    },
    memory: {
      title: "Agent 记忆分层",
      nodes: ["短期上下文", "会话摘要", "任务状态", "用户偏好", "知识库", "缓存层"],
    },
    tool: {
      title: "工具调用控制链路",
      nodes: ["意图识别", "选择工具", "参数校验", "权限检查", "工具执行", "结果校验"],
    },
    safety: {
      title: "Agent 安全边界",
      nodes: ["不可信输入", "指令隔离", "权限过滤", "动作确认", "执行审计", "输出过滤"],
    },
    eval: {
      title: "Agent 评测闭环",
      nodes: ["任务集", "执行 Trace", "结果评分", "失败样本", "回归测试", "线上监控"],
    },
    agent: {
      title: "Agent 执行循环",
      nodes: ["目标", "规划", "执行", "观察", "修正", "完成/交接"],
    },
  };
  const diagram = diagrams[type] || diagrams.agent;

  return (
    <aside className="agent-diagram-card" aria-label={diagram.title}>
      <span className="section-eyebrow">Diagram</span>
      <h2>{diagram.title}</h2>
      <div className="agent-diagram-flow">
        {diagram.nodes.map((node, index) => (
          <React.Fragment key={node}>
            <span>{node}</span>
            {index < diagram.nodes.length - 1 ? <i /> : null}
          </React.Fragment>
        ))}
      </div>
    </aside>
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
