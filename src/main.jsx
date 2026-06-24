import React from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, ArrowUpRight, Blocks, BriefcaseBusiness, CalendarClock, Camera, CheckCircle2, Code2, Cpu, FileText, Gauge, Gamepad2, Github, Mail, MapPin, Menu, PackageCheck, Phone, PlayCircle, Send, ShieldCheck, Sparkles, TimerReset, UserCog, X } from "lucide-react";
import { resume, projects } from "./data/resume.js";
import { parseCozeSseChunk } from "./utils/cozeStream.js";
import aiAvatar from "./assets/images/avatar-ai.png?avatar-ai-v1";
import heroLayerBg from "./assets/images/hero-layer-bg.jpg?layered-v1";
import heroLayerPerson from "./assets/images/hero-layer-person.png?layered-v1";
import "./styles.css";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const cozeApiPath = import.meta.env.VITE_COZE_PROXY_PATH || "/api/coze-chat";

const iconMap = {
  performance: TimerReset,
  architecture: Cpu,
  bridge: Code2,
  leadership: BriefcaseBusiness,
  ai: Sparkles,
  quality: ShieldCheck,
};

const metricIcons = [CalendarClock, UserCog, Blocks, Gauge, Gamepad2, PackageCheck];

const assistantPrompts = [
  "你最适合什么岗位？",
  "介绍一下 Flutter Add-to-App 经验",
  "讲讲性能优化成果",
  "有哪些 SDK 和支付经验？",
];

const assistantReplies = {
  default:
    "我是王学明的虚拟分身，可以围绕岗位匹配、跨端架构、iOS/Flutter/小程序、SDK、性能优化和项目经历回答。你可以问我：适合什么岗位、做过哪些项目、如何处理复杂跨端交付。",
  role:
    "我更适合高级前端全栈、客户端跨端负责人、Flutter Add-to-App / iOS 技术负责人、SDK 架构与复杂业务交付类岗位。优势是既能做客户端深水区问题，也能把 H5、小程序、Flutter、原生 SDK 和后台协作串起来。",
  flutter:
    "在开开华彩项目中，我负责 Flutter Add-to-App 业务模块和原生宿主协同，覆盖课程、作业、订单、直播、支付、IM、音视频等业务域。核心经验包括 go_router、dio、provider、get_it、MethodChannel/native_channel，以及多宿主下的原生能力桥接和版本交付。",
  performance:
    "我有 iOS 性能与稳定性经验，熟悉 ARC/MRC、Runtime、RunLoop、多线程和 Instruments 工具链。项目里做过启动耗时优化、弱网体验、WebView 离线缓存、Crash 收敛等工作，简历中当前突出指标包括启动耗时优化 35%、Debug 效率提升 40%、课件体验优化带来日活提升 150%。",
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

  React.useEffect(() => {
    const syncRoute = () => setRoute(getRoute());
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  const slug = route.replace(/^\/project\/?/, "").replace(/\/$/, "");
  const project = slug ? projects.find((item) => item.slug === slug) : null;

  if (slug && project) {
    return <ProjectDetail project={project} />;
  }

  if (slug && !project) {
    return <NotFound />;
  }

  return <Home />;
}

function getRoute() {
  if (window.location.hash.startsWith("#/project/")) {
    return window.location.hash.slice(1);
  }

  const currentPath = window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length) || "/"
    : window.location.pathname;

  return currentPath.startsWith("/project/") ? currentPath : "/";
}

function Header() {
  const [open, setOpen] = React.useState(false);
  const [activeHash, setActiveHash] = React.useState(window.location.hash || "#top");
  const links = [
    ["首页", "#top"],
    ["技能", "#skills"],
    ["项目", "#projects"],
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
      <a className="brand" href={`${basePath}/`}>
        <span>王学明</span>
        <span className="brand-code">&lt;/&gt;</span>
      </a>
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
          下载简历 PDF
        </a>
      </nav>
    </header>
  );
}

function Home() {
  const assistant = useAssistantChat();

  return (
    <>
      <Header />
      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <h1>{resume.name}</h1>
            <p className="role">高级前端全栈开发工程师</p>
            <p className="summary">10+ 年客户端与全栈研发经验，专注高性能跨端应用与 SDK 架构设计</p>
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
              {["10 + 年经验", "iOS 性能优化", "Flutter","鸿蒙", "Web / 小程序", "Web3", "AI 工具链", "SDK 架构"].map((tag) => (
                <span key={tag}>{tag}</span>
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

        <section className="overview-section section" id="skills">
          <SkillMatrix />
          <TimelineCompact />
        </section>

        <AssistantSection assistant={assistant} />

        <section className="section" id="projects">
          <SectionTitle title="项目案例" />
          <div className="project-grid">
            {projects.map((project) => <ProjectCard project={project} key={project.slug} />)}
          </div>
        </section>

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

function HeroVisual() {
  return (
    <aside className="hero-visual" aria-label="3D 开发者人偶与跨端项目展示">
      <img className="hero-layer-bg" src={heroLayerBg} alt="" aria-hidden="true" />
      <img className="hero-layer-person" src={heroLayerPerson} alt="3D 开发者人偶" />
    </aside>
  );
}

function AssistantSection({ assistant }) {
  return (
    <section className="assistant-section section" id="assistant">
      <div className="assistant-shell">
        <div className="assistant-copy">
          <div className="assistant-title-row">
            <span className="assistant-orb"><Sparkles size={22} /></span>
            <h2>AI 问答助手</h2>
          </div>
          <p>
            用对话方式了解我的虚拟分身。当前版本已接入智能体，适合快速了解岗位匹配、项目经验和技术强项。
          </p>
        </div>
        <AssistantChat assistant={assistant} compact={false} />
      </div>
    </section>
  );
}

function PromptButtons({ onAsk }) {
  return (
    <div className="assistant-prompt-list" aria-label="快捷问题">
      {assistantPrompts.map((prompt) => (
        <button type="button" key={prompt} onClick={() => onAsk?.(prompt)}>
          {prompt}
        </button>
      ))}
    </div>
  );
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
  const abortRef = React.useRef(null);

  React.useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const ask = React.useCallback(async (question) => {
    const trimmed = question.trim();
    if (!trimmed || isSending) return;
    const timestamp = Date.now();
    const userMessage = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    const assistantId = `a-${timestamp}`;
    const assistantMessage = {
      id: assistantId,
      role: "assistant",
      text: "正在思考中",
      pending: true,
    };
    setMessages((current) => [...current, userMessage, assistantMessage]);

    setIsSending(true);
    setServiceState("thinking");
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamAssistantReply(trimmed, assistantId, controller.signal, setMessages);
      setServiceState("ready");
    } catch (error) {
      const fallback = getAssistantReply(trimmed);
      setMessages((current) =>
        updateMessage(current, assistantId, {
          text: `真实 AI 暂时未连通：${error.message || "请求失败"}\n\n先给你一版本地简历兜底回答：${fallback}`,
          pending: false,
          error: true,
        }),
      );
      setServiceState("offline");
    } finally {
      setIsSending(false);
      abortRef.current = null;
    }
  }, [isSending]);

  return {
    ask,
    isSending,
    messages,
    serviceState,
  };
}

function AssistantChat({ assistant, compact = false }) {
  const [input, setInput] = React.useState("");
  const chatLogRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const { ask, isSending, messages, serviceState } = assistant;

  React.useEffect(() => {
    const log = chatLogRef.current;
    if (log) {
      log.scrollTop = log.scrollHeight;
    }
  }, [messages]);

  const submitQuestion = (question) => {
    const trimmed = question.trim();
    if (!trimmed || isSending) return;
    ask(trimmed);
    setInput("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

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
          {serviceState === "thinking" ? "思考中" : serviceState === "offline" ? "未连通" : "在线"}
        </span>
      </div>
      <div className="assistant-messages" ref={chatLogRef} aria-live="polite">
        {messages.map((message) => (
          <div className={`assistant-message ${message.role}${message.error ? " is-error" : ""}${message.pending ? " is-pending" : ""}`} key={message.id}>
            <span className="assistant-avatar">
              {message.role === "assistant" ? <img src={aiAvatar} alt="" /> : <UserCog size={15} />}
            </span>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <PromptButtons onAsk={ask} />
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

async function streamAssistantReply(question, assistantId, signal, setMessages) {
  const response = await fetch(cozeApiPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      userId: getVisitorId(),
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
    setMessages((current) =>
      updateMessage(current, assistantId, (message) => ({
        ...message,
        text: answer,
        pending: false,
      })),
    );
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
    const { text } = parseCozeSseChunk(chunk);
    if (!text) continue;

    hasContent = true;
    setMessages((current) =>
      updateMessage(current, assistantId, (message) => ({
        ...message,
        text: message.pending ? text : `${message.text}${text}`,
        pending: false,
      })),
    );
  }

  if (buffer.trim()) {
    const { text } = parseCozeSseChunk(buffer);
    if (text) {
      hasContent = true;
      setMessages((current) =>
        updateMessage(current, assistantId, (message) => ({
          ...message,
          text: message.pending ? text : `${message.text}${text}`,
          pending: false,
        })),
      );
    }
  }

  if (!hasContent) {
    throw new Error("Coze 没有返回可展示内容");
  }
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
    ["客户端", "iOS (Swift)", "Flutter Add-to-App", "WebView", "性能优化", "SDK"],
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

function ProjectCard({ project }) {
  const detailHref = `${basePath}/#/project/${project.slug}`;

  return (
    <article className="project-card">
      <div className="project-icon"><Code2 size={28} /></div>
      <div className="project-topline">
        {project.stack.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
      </div>
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
    </article>
  );
}

function ProjectDetail({ project }) {
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
          <MediaBox project={project} />
        </section>
        <section className="detail-grid">
          <DetailBlock title="项目背景" items={project.background} />
          <DetailBlock title="关键职责" items={project.responsibilities} />
          <DetailBlock title="成果与指标" items={project.results} />
          <DetailBlock title="面试讲法" items={project.interviewAngles} />
        </section>
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
