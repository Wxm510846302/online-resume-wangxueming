import React from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, ArrowUpRight, Blocks, BriefcaseBusiness, CalendarClock, Camera, CheckCircle2, Code2, Copy, Cpu, FileText, Gauge, Gamepad2, Github, Mail, MapPin, Menu, MessageCircle, PackageCheck, Phone, PlayCircle, RefreshCw, Send, ShieldCheck, Shuffle, Sparkles, Square, TimerReset, UserCog, Volume2, X } from "lucide-react";
import { resume, projects } from "./data/resume.js";
import { parseCozeSseChunk } from "./utils/cozeStream.js";
import aiAvatar from "./assets/images/avatar-ai.png?avatar-ai-v1";
import heroLayerBg from "./assets/images/hero-layer-bg.jpg?layered-v1";
import heroLayerPerson from "./assets/images/hero-layer-person.png?layered-v1";
import "./styles.css";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const cozeApiPath = import.meta.env.VITE_COZE_PROXY_PATH || "/api/coze-chat";
const cozeSpeechApiPath = import.meta.env.VITE_COZE_SPEECH_PROXY_PATH || cozeApiPath;

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
  "我是王学明，过去 10 多年主要解决移动端和跨端产品里的复杂问题，包括 Flutter Add-to-App、iOS 性能优化、H5 与原生通信、SDK 架构、支付链路和 AI 工具提效。",
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
  const chatLogRef = React.useRef(null);
  const inputRef = React.useRef(null);
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
        hasPlayed={hasPlayedIntro}
        introText={introText}
        isPreparing={isIntroPreparing}
        isSpeaking={isIntroSpeaking}
        onPlayIntro={playIntro}
      />
      <div className="assistant-messages" ref={chatLogRef} aria-live="polite">
        {messages.map((message) => (
          <div className={`assistant-message ${message.role}${message.error ? " is-error" : ""}${message.pending ? " is-pending" : ""}${message.typing ? " is-typing" : ""}`} key={message.id}>
            <span className="assistant-avatar">
              {message.role === "assistant" ? <img src={aiAvatar} alt="" /> : <UserCog size={15} />}
            </span>
            {message.role === "assistant" ? (
              <div className="assistant-message-content">
                <AssistantMarkdown text={message.text} />
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

function AssistantIntroStage({ hasPlayed, introText, isPreparing, isSpeaking, onPlayIntro }) {
  const buttonLabel = isPreparing ? "准备音色中" : isSpeaking ? "停止播放" : hasPlayed ? "换一段" : "播放自我介绍";

  return (
    <div className={`assistant-intro-stage${isSpeaking ? " is-speaking" : ""}`}>
      <div className="assistant-intro-copy">
        <div className="assistant-wave" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <p>{introText}</p>
      </div>
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

function AssistantMarkdown({ text }) {
  const blocks = parseAssistantMarkdown(text);

  return (
    <div className="assistant-markdown">
      {blocks.map((block, index) => {
        if (block.type === "ul") {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInlineMarkdown(item, itemIndex)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInlineMarkdown(item, itemIndex)}</li>
              ))}
            </ol>
          );
        }

        return <p key={index}>{renderInlineMarkdown(block.text, index)}</p>;
      })}
    </div>
  );
}

function parseAssistantMarkdown(text) {
  const lines = text.split("\n");
  const blocks = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "p", text: paragraph.join("\n") });
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    blocks.push(list);
    list = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const unordered = trimmed.match(/^[-*•]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(unordered[1]);
      continue;
    }

    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks.length ? blocks : [{ type: "p", text: "" }];
}

function renderInlineMarkdown(text, keyPrefix = "inline") {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;
    if (token.startsWith("**")) {
      parts.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={key}>{token.slice(1, -1)}</code>);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

async function streamAssistantReply(question, assistantId, signal, setMessages, setServiceState) {
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
    const { text } = parseCozeSseChunk(chunk);
    if (!text) continue;

    hasContent = true;
    setServiceState("replying");
    await typeAssistantText(assistantId, text, setMessages, signal, { append: true });
  }

  if (buffer.trim()) {
    const { text } = parseCozeSseChunk(buffer);
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
  const response = await fetch(cozeSpeechApiPath, {
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
