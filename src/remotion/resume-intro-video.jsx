import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { projects, resume } from "../data/resume.js";

const palette = {
  ink: "#10202d",
  muted: "#5f6c74",
  paper: "#f8f3e9",
  panel: "rgba(255, 255, 255, 0.82)",
  line: "rgba(16, 32, 45, 0.14)",
  teal: "#0f9f94",
  blue: "#2674d9",
  gold: "#c58b26",
  coral: "#d95d49",
  green: "#44895e",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

function clampInterpolate(frame, input, output) {
  return interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
}

function useAppear(start, duration = 24, distance = 34) {
  const frame = useCurrentFrame();
  return {
    opacity: clampInterpolate(frame, [start, start + duration], [0, 1]),
    transform: `translateY(${clampInterpolate(frame, [start, start + duration], [distance, 0])}px)`,
  };
}

function Background() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = clampInterpolate(frame, [0, durationInFrames], [0, -42]);

  return (
    <AbsoluteFill style={{ background: palette.paper, overflow: "hidden" }}>
      <Img
        src={staticFile("remotion-assets/hero-layer-bg.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.18,
          transform: `scale(1.08) translateX(${drift}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(112deg, rgba(248,243,233,0.97) 0%, rgba(248,243,233,0.88) 47%, rgba(223,238,236,0.86) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 12,
          background: `linear-gradient(90deg, ${palette.teal}, ${palette.blue}, ${palette.gold}, ${palette.coral})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 92,
          top: 80,
          width: 520,
          height: 520,
          border: `1px solid ${palette.line}`,
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 205,
          bottom: 86,
          width: 720,
          height: 1,
          background: palette.line,
          transform: "rotate(-18deg)",
        }}
      />
    </AbsoluteFill>
  );
}

function Shell({ children, kicker }) {
  return (
    <AbsoluteFill style={{ padding: "78px 96px 72px", color: palette.ink, fontFamily: '"PingFang SC", "Microsoft YaHei", Arial, sans-serif' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, color: palette.muted }}>
        <strong style={{ color: palette.ink, fontSize: 34 }}>王学明 · Resume Film</strong>
        <span>{kicker}</span>
      </div>
      {children}
    </AbsoluteFill>
  );
}

function HeroScene() {
  const frame = useCurrentFrame();
  const portraitScale = clampInterpolate(frame, [0, 160], [1.06, 1]);
  const name = useAppear(12, 28, 44);
  const role = useAppear(32, 28, 36);
  const summary = useAppear(52, 28, 28);
  const tags = useAppear(82, 28, 20);

  return (
    <Shell kicker="高级前端全栈 / 客户端跨端负责人">
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 64, alignItems: "center", height: "100%" }}>
        <div style={{ paddingBottom: 34 }}>
          <div style={{ ...name, fontSize: 136, fontWeight: 900, letterSpacing: 0, lineHeight: 0.98 }}>{resume.name}</div>
          <div style={{ ...role, marginTop: 30, fontSize: 50, fontWeight: 800, color: palette.teal }}>{resume.role}</div>
          <p style={{ ...summary, marginTop: 38, width: 900, fontSize: 38, lineHeight: 1.45, color: palette.ink }}>{resume.summary}</p>
          <div style={{ ...tags, display: "flex", flexWrap: "wrap", gap: 16, marginTop: 44 }}>
            {["10+ 年移动端", "Flutter / iOS / 小程序", "SDK 架构", "AI + Web3"].map((tag, index) => (
              <span key={tag} style={{ padding: "14px 22px", border: `1px solid ${palette.line}`, borderRadius: 8, background: index === 0 ? palette.ink : palette.panel, color: index === 0 ? "#fff" : palette.ink, fontSize: 28, fontWeight: 700 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", height: 740 }}>
          <Img
            src={staticFile("remotion-assets/hero-layer-person.png")}
            style={{
              position: "absolute",
              right: 42,
              bottom: 0,
              height: 720,
              objectFit: "contain",
              transform: `scale(${portraitScale})`,
              filter: "drop-shadow(0 34px 54px rgba(16,32,45,0.22))",
            }}
          />
          <div style={{ position: "absolute", left: 40, bottom: 46, width: 420, padding: "28px 30px", background: palette.panel, border: `1px solid ${palette.line}`, borderRadius: 8 }}>
            <div style={{ fontSize: 24, color: palette.muted }}>核心主线</div>
            <div style={{ marginTop: 12, fontSize: 34, fontWeight: 900 }}>复杂跨端产品交付</div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function MetricsScene() {
  return (
    <Shell kicker="Impact Metrics">
      <SceneHeading start={6} title="用结果证明交付能力" subtitle="从客户端深水区，到跨团队版本落地。" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginTop: 260 }}>
        {resume.metrics.map((item, index) => (
          <MetricCard item={item} index={index} key={item.label} />
        ))}
      </div>
    </Shell>
  );
}

function MetricCard({ item, index }) {
  const appear = useAppear(32 + index * 8, 22, 32);
  const colors = [palette.teal, palette.blue, palette.gold, palette.green, palette.coral, palette.ink];

  return (
    <div style={{ ...appear, minHeight: 214, padding: "34px 34px 30px", background: palette.panel, border: `1px solid ${palette.line}`, borderRadius: 8 }}>
      <div style={{ width: 64, height: 8, borderRadius: 8, background: colors[index % colors.length] }} />
      <strong style={{ display: "block", marginTop: 30, fontSize: 64, lineHeight: 1, color: colors[index % colors.length] }}>{item.value}</strong>
      <span style={{ display: "block", marginTop: 18, fontSize: 30, fontWeight: 700, color: palette.ink }}>{item.label}</span>
    </div>
  );
}

function CapabilityScene() {
  const selectedSkills = resume.skills.slice(0, 4);

  return (
    <Shell kicker="Capability Matrix">
      <SceneHeading start={4} title="技术能力不是列表，是完整作战半径" subtitle="架构、性能、桥接、交付、AI 工具链共同服务复杂产品。" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 244 }}>
        {selectedSkills.map((skill, index) => (
          <SkillRow skill={skill} index={index} key={skill.title} />
        ))}
      </div>
    </Shell>
  );
}

function SkillRow({ skill, index }) {
  const appear = useAppear(28 + index * 9, 22, 28);
  const accent = [palette.blue, palette.teal, palette.gold, palette.coral, palette.green][index % 5];

  return (
    <div style={{ ...appear, padding: "26px 28px", minHeight: 164, background: palette.panel, borderLeft: `8px solid ${accent}`, borderRadius: 8, boxShadow: "0 20px 44px rgba(16,32,45,0.06)" }}>
      <h3 style={{ margin: 0, fontSize: 31, lineHeight: 1.18 }}>{skill.title}</h3>
      <p style={{ margin: "12px 0 0", fontSize: 23, lineHeight: 1.38, color: palette.muted }}>{skill.text}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
        {skill.tags.slice(0, 5).map((tag) => (
          <span key={tag} style={{ padding: "7px 12px", background: "rgba(16,32,45,0.06)", borderRadius: 6, fontSize: 18, color: palette.ink }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function ProjectsScene() {
  return (
    <Shell kicker="Selected Projects">
      <SceneHeading start={4} title="代表项目覆盖多种复杂场景" subtitle="App、小程序、游戏 SDK、BI、Web3、在线教育与企业数字化。" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, marginTop: 244 }}>
        {projects.slice(0, 6).map((project, index) => (
          <ProjectTile project={project} index={index} key={project.slug} />
        ))}
      </div>
    </Shell>
  );
}

function ProjectTile({ project, index }) {
  const appear = useAppear(26 + index * 7, 20, 30);
  const accent = [palette.teal, palette.gold, palette.blue, palette.green, palette.coral, palette.ink][index % 6];

  return (
    <div style={{ ...appear, minHeight: 230, padding: 28, background: palette.panel, border: `1px solid ${palette.line}`, borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-start" }}>
        <span style={{ color: accent, fontSize: 22, fontWeight: 900 }}>{project.period}</span>
        <span style={{ padding: "7px 10px", borderRadius: 6, background: "rgba(16,32,45,0.06)", fontSize: 18, color: palette.muted }}>{project.role}</span>
      </div>
      <h3 style={{ margin: "24px 0 0", fontSize: 32, lineHeight: 1.16 }}>{project.name}</h3>
      <p style={{ margin: "14px 0 0", fontSize: 21, lineHeight: 1.35, color: palette.muted }}>{project.summary.slice(0, 92)}...</p>
    </div>
  );
}

function TimelineScene() {
  const items = resume.timeline;

  return (
    <Shell kicker="Career Timeline">
      <SceneHeading start={4} title="从独立交付，到复杂产品负责人" subtitle="经历沉淀出一条清晰主线：跨端架构 + 稳定性 + 团队交付。" />
      <div style={{ position: "relative", marginTop: 286, height: 420 }}>
        <div style={{ position: "absolute", left: 80, right: 80, top: 150, height: 3, background: palette.line }} />
        {items.map((item, index) => (
          <TimelineNode item={item} index={index} total={items.length} key={item.company} />
        ))}
      </div>
    </Shell>
  );
}

function TimelineNode({ item, index, total }) {
  const appear = useAppear(24 + index * 10, 22, 28);
  const left = 80 + (index / (total - 1)) * 1480;
  const accent = [palette.teal, palette.blue, palette.gold, palette.coral, palette.green][index % 5];

  return (
    <div style={{ ...appear, position: "absolute", left, top: index % 2 ? 178 : 0, width: 284, transform: `${appear.transform} translateX(-50%)` }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: accent, border: "6px solid #fff", boxShadow: "0 8px 22px rgba(16,32,45,0.2)", margin: index % 2 ? "-41px auto 20px" : "137px auto 20px" }} />
      <div style={{ padding: 20, background: palette.panel, border: `1px solid ${palette.line}`, borderRadius: 8, textAlign: "center" }}>
        <strong style={{ color: accent, fontSize: 21 }}>{item.period}</strong>
        <h3 style={{ margin: "10px 0 6px", fontSize: 28, lineHeight: 1.12 }}>{item.company}</h3>
        <p style={{ margin: 0, fontSize: 19, lineHeight: 1.25, color: palette.muted }}>{item.role}</p>
      </div>
    </div>
  );
}

function OutroScene() {
  const frame = useCurrentFrame();
  const visual = useAppear(18, 28, 28);
  const headline = useAppear(28, 28, 34);
  const contact = useAppear(58, 26, 24);
  const cursor = Math.floor(frame / 15) % 2 ? 1 : 0;
  const typed = "把复杂跨端产品，交付成稳定、可增长的业务结果。";
  const length = Math.floor(clampInterpolate(frame, [44, 136], [0, typed.length]));

  return (
    <Shell kicker="Let us talk">
      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 72, alignItems: "center", height: "100%" }}>
        <div style={{ ...visual, position: "relative", height: 640 }}>
          <Img src={staticFile("remotion-assets/avatar-ai.png")} style={{ width: 610, height: 610, objectFit: "contain", filter: "drop-shadow(0 34px 54px rgba(16,32,45,0.2))" }} />
          <div style={{ position: "absolute", left: 392, bottom: 34, padding: "20px 24px", background: palette.ink, color: "#fff", borderRadius: 8, fontSize: 28, fontWeight: 800 }}>AI 工具链 + 工程交付</div>
        </div>
        <div>
          <h2 style={{ ...headline, margin: 0, fontSize: 82, lineHeight: 1.08 }}>高级前端全栈开发工程师</h2>
          <p style={{ marginTop: 32, minHeight: 72, fontSize: 42, lineHeight: 1.35, color: palette.teal, fontWeight: 900 }}>
            {typed.slice(0, length)}
            <span style={{ opacity: cursor }}>|</span>
          </p>
          <div style={{ ...contact, display: "grid", gap: 18, marginTop: 50, fontSize: 32, color: palette.ink }}>
            <span>邮箱：{resume.email}</span>
            <span>电话：{resume.phone}</span>
            <span>GitHub：github.com/Wxm510846302</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function SceneHeading({ title, subtitle, start }) {
  const titleAppear = useAppear(start, 24, 34);
  const subtitleAppear = useAppear(start + 16, 24, 28);

  return (
    <div style={{ position: "absolute", left: 96, top: 172, width: 1280 }}>
      <h2 style={{ ...titleAppear, margin: 0, fontSize: 72, lineHeight: 1.08, letterSpacing: 0 }}>{title}</h2>
      <p style={{ ...subtitleAppear, margin: "24px 0 0", fontSize: 34, color: palette.muted, lineHeight: 1.35 }}>{subtitle}</p>
    </div>
  );
}

function SceneFade({ children, from, duration }) {
  const frame = useCurrentFrame();
  const local = frame - from;
  const opacityIn = clampInterpolate(local, [0, 18], [0, 1]);
  const opacityOut = clampInterpolate(local, [duration - 28, duration], [1, 0]);
  const scale = clampInterpolate(local, [0, duration], [1.006, 1]);

  return (
    <Sequence from={from} durationInFrames={duration}>
      <AbsoluteFill style={{ opacity: Math.min(opacityIn, opacityOut), transform: `scale(${scale})` }}>{children}</AbsoluteFill>
    </Sequence>
  );
}

function BackgroundAudio() {
  const { durationInFrames } = useVideoConfig();

  return (
    <Audio
      src={staticFile("remotion-assets/resume-bg.wav")}
      volume={(frame) =>
        interpolate(frame, [0, 45, durationInFrames - 90, durationInFrames], [0, 0.18, 0.18, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
}

export function ResumeIntroVideo() {
  return (
    <AbsoluteFill>
      <BackgroundAudio />
      <Background />
      <SceneFade from={0} duration={190}>
        <HeroScene />
      </SceneFade>
      <SceneFade from={170} duration={190}>
        <MetricsScene />
      </SceneFade>
      <SceneFade from={340} duration={220}>
        <CapabilityScene />
      </SceneFade>
      <SceneFade from={540} duration={230}>
        <ProjectsScene />
      </SceneFade>
      <SceneFade from={748} duration={190}>
        <TimelineScene />
      </SceneFade>
      <SceneFade from={918} duration={162}>
        <OutroScene />
      </SceneFade>
    </AbsoluteFill>
  );
}
