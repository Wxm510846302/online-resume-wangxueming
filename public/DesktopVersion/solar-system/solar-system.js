const canvas = document.querySelector("#solarCanvas");
const labelsLayer = document.querySelector("#labelsLayer");
const loadingState = document.querySelector("#loadingState");
const loadingText = document.querySelector("#loadingText");
const pauseBtn = document.querySelector("#pauseBtn");
const pauseIcon = document.querySelector("#pauseIcon");
const pauseText = document.querySelector("#pauseText");
const langBtn = document.querySelector("#langBtn");
const resetBtn = document.querySelector("#resetBtn");
const speedSelect = document.querySelector("#speedSelect");
const speedRange = document.querySelector("#speedRange");
const speedOutput = document.querySelector("#speedOutput");
const zoomRange = document.querySelector("#zoomRange");
const zoomOutput = document.querySelector("#zoomOutput");
const planetNav = document.querySelector("#planetNav");
const detailPanel = document.querySelector("#detailPanel");
const detailTitle = document.querySelector("#detailTitle");
const detailBody = document.querySelector("#detailBody");
const detailIntro = document.querySelector("#detailIntro");
const detailStats = document.querySelector("#detailStats");
const soundBtn = document.querySelector("#soundBtn");
const soundIcon = document.querySelector("#soundIcon");
const soundText = document.querySelector("#soundText");
const soundMeta = document.querySelector("#soundMeta");
const soundSourceLink = document.querySelector("#soundSourceLink");
const voiceSelect = document.querySelector("#voiceSelect");
const scaleNote = document.querySelector("#scaleNote");
// 用 LoadingManager 跟踪所有纹理加载，以便在真正加载完成时再隐藏开场动画。
const textureLoadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(textureLoadingManager);

const CLOSE_VIEW_DISTANCE = 26;
const GALAXY_VIEW_DISTANCE = 210;
const DEFAULT_ZOOM_DISTANCE = 110;
const GALACTIC_ECLIPTIC_TILT = THREE.MathUtils.degToRad(60.2);
const GALACTIC_ECLIPTIC_ROLL = THREE.MathUtils.degToRad(-17);
const ORBIT_INCLINATION_VISUAL_BOOST = 3.2;
const ORBIT_DISTANCE_BASE = 4;
const ORBIT_DISTANCE_SCALE = 14;

const copy = {
  zh: {
    appLabel: "太阳系 3D 运行模拟",
    pause: "暂停",
    resume: "继续",
    reset: "重置视角",
    speed: "速度",
    zoom: "缩放",
    focusTitle: "太阳系运行",
    focusHelp: "拖拽旋转视角，滚轮或滑块拉近拉远。",
    scaleTitle: "尺度说明",
    normalScale: "轨道距离按真实 AU 做平方根压缩，行星半径与轨道倾角为教学可视化近似。",
    galaxyScale: "银河系为远景示意背景，非真实比例尺；太阳系整体绕银河中心缓慢公转，黄道面相对银河盘面倾斜显示，轨道距离按真实 AU 做平方根压缩。",
    detailKicker: "近景特征",
    view: "视图",
    viewValue: "斜俯瞰黄道面",
    planets: "行星",
    planetsValue: "八大行星",
    galaxy: "银河",
    hint: "拖拽旋转 · 滚轮缩放 · 点击星球聚焦",
    loading: "正在初始化太阳系",
    langButton: "EN",
    playSound: "朗读介绍",
    stopSound: "停止朗读",
    narrationSource: "资料参考",
    narrationReady: "点击后朗读当前天体介绍。已优化为分句朗读和较慢语速；可切换本机更自然的系统语音。",
    narrationUnsupported: "当前浏览器不支持语音朗读。",
    autoVoice: "自动自然语音",
    voiceLabel: "朗读语音",
    statDiameter: "直径",
    statDistance: "日距",
    statOrbit: "公转周期",
    statDay: "自转周期",
  },
  en: {
    appLabel: "Solar System 3D Simulation",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset View",
    speed: "Speed",
    zoom: "Zoom",
    focusTitle: "Solar System",
    focusHelp: "Drag to rotate. Use the wheel or slider to zoom.",
    scaleTitle: "Scale Note",
    normalScale: "Orbital distances use a square-root compression of real AU values; planet radii and inclinations are teaching-scale approximations.",
    galaxyScale: "The Milky Way view is illustrative, not to scale; the solar system slowly orbits the galactic center with its ecliptic plane inclined to the galactic disk, and orbital distances use square-root-compressed real AU values.",
    detailKicker: "Close-Up Features",
    view: "View",
    viewValue: "Oblique ecliptic plane",
    planets: "Planets",
    planetsValue: "Eight major planets",
    galaxy: "Galaxy",
    hint: "Drag to rotate · Scroll to zoom · Click a body to focus",
    loading: "Initializing solar system",
    langButton: "中文",
    playSound: "Read Intro",
    stopSound: "Stop Reading",
    narrationSource: "Reference",
    narrationReady: "Click to read the current body introduction. Reading uses sentence chunks, slower pacing, and the most natural local system voice available.",
    narrationUnsupported: "Speech synthesis is not supported in this browser.",
    autoVoice: "Auto Natural Voice",
    voiceLabel: "Narration Voice",
    statDiameter: "Diameter",
    statDistance: "Sun Distance",
    statOrbit: "Orbit",
    statDay: "Day",
  },
};

// 开场引语的展示与轮播由 index.html 的内联脚本负责（首屏即可见，不被大脚本阻塞），
// 此处只在场景就绪时通过 window.SolarLoading.stop() 通知其收起。
// 纹理迟迟未就绪时的兜底上限，避免开场动画无限停留。
const LOADING_MAX_DISPLAY_MS = 12000;
// 防止隐藏逻辑被多个信号（纹理就绪 / 兜底超时）重复触发。
let loadingDismissed = false;

const planetData = [
  { key: "mercury", name: "Mercury", zh: "水星", radius: 0.62, au: 0.387, distance: compressedOrbitDistance(0.387), speed: 4.15, color: "#a9a7a5", tilt: 0.01, featureZh: "灰色岩质表面、密集撞击坑和几乎没有大气，是水星近景的主要特征。", featureEn: "A gray rocky surface, dense impact craters, and almost no atmosphere define Mercury up close." },
  { key: "venus", name: "Venus", zh: "金星", radius: 0.95, au: 0.723, distance: compressedOrbitDistance(0.723), speed: 1.62, color: "#d9a55c", tilt: 0.02, featureZh: "金黄色厚云层覆盖表面，近景以高反照率云带和暖色大气为主。", featureEn: "Thick golden cloud decks hide the surface, giving Venus bright cloud bands and a warm atmospheric glow." },
  { key: "earth", name: "Earth", zh: "地球", radius: 1, au: 1.0, distance: compressedOrbitDistance(1.0), speed: 1, color: "#2f7ed8", tilt: 0.41, active: true, featureZh: "蓝色海洋、白色云带与绿色陆地是地球近景的主要视觉特征。", featureEn: "Blue oceans, white cloud bands, and green-brown continents are Earth's strongest close-up cues." },
  { key: "mars", name: "Mars", zh: "火星", radius: 0.78, au: 1.524, distance: compressedOrbitDistance(1.524), speed: 0.53, color: "#c76032", tilt: 0.44, featureZh: "红褐色铁氧化物地表、暗色高地和浅色极冠让火星具有明确辨识度。", featureEn: "Rust-red iron oxide terrain, darker highlands, and pale polar caps make Mars easy to identify." },
  { key: "jupiter", name: "Jupiter", zh: "木星", radius: 2.55, au: 5.203, distance: compressedOrbitDistance(5.203), speed: 0.084, color: "#d8b58a", tilt: 0.05, ring: { texture: "jupiterRing", inner: 1.18, outer: 1.72, opacity: 0.22 }, featureZh: "宽阔的褐白色条带、大红斑和非常暗淡的尘埃环，是木星近景最突出的特征。", featureEn: "Broad brown-white bands, the Great Red Spot, and a very faint dust ring are Jupiter's key close-up traits." },
  { key: "saturn", name: "Saturn", zh: "土星", radius: 2.25, au: 9.537, distance: compressedOrbitDistance(9.537), speed: 0.034, color: "#d9c083", tilt: 0.47, ring: { texture: "saturnRing", inner: 1.32, outer: 2.56, opacity: 0.88 }, featureZh: "明亮宽大的环系统和淡金色气态表面，是土星近景的核心识别点。", featureEn: "A bright, broad ring system and pale golden gas bands are Saturn's signature features." },
  { key: "uranus", name: "Uranus", zh: "天王星", radius: 1.55, au: 19.191, distance: compressedOrbitDistance(19.191), speed: 0.012, color: "#8ed9e5", tilt: 1.71, ring: { texture: "uranusRing", inner: 1.28, outer: 1.92, opacity: 0.38 }, featureZh: "青蓝色甲烷大气、明显倾斜的自转轴和暗淡窄环，让天王星看起来冷而平滑。", featureEn: "Blue-green methane air, a strongly tilted axis, and faint narrow rings give Uranus its cool, smooth look." },
  { key: "neptune", name: "Neptune", zh: "海王星", radius: 1.5, au: 30.069, distance: compressedOrbitDistance(30.069), speed: 0.006, color: "#345fd9", tilt: 0.49, ring: { texture: "neptuneRing", inner: 1.32, outer: 1.84, opacity: 0.24 }, featureZh: "深蓝色甲烷大气、暗色风暴感和微弱环弧，是海王星的近景重点。", featureEn: "Deep blue methane air, dark storm-like markings, and subtle ring arcs are Neptune's close-up emphasis." },
];

const orbitPlanes = {
  mercury: { inclination: 7.0, node: 48.3 },
  venus: { inclination: 3.4, node: 76.7 },
  earth: { inclination: 0.0, node: 0 },
  mars: { inclination: 1.85, node: 49.6 },
  jupiter: { inclination: 1.3, node: 100.5 },
  saturn: { inclination: 2.49, node: 113.7 },
  uranus: { inclination: 0.77, node: 74.0 },
  neptune: { inclination: 1.77, node: 131.8 },
};

const sunBody = {
  key: "sun",
  name: "Sun",
  zh: "太阳",
  color: "#ffb52f",
  featureZh: "太阳近景以炽热发光层、橙黄色纹理和强烈辉光为主；此处亮度经过压缩以便观察行星。",
  featureEn: "The Sun is shown with a hot luminous photosphere, orange-yellow granulation, and a compressed glow so planets remain visible.",
};

const bodyProfiles = {
  sun: {
    introZh: "太阳是一颗 G 型主序星，也是太阳系的质量中心。它把氢聚变成氦，持续释放光和热，并通过太阳风、磁场和辐射影响从水星到海王星的空间环境。太阳表面不是固体，而是不断翻涌的等离子体；黑子、耀斑和日冕物质抛射会改变行星附近的空间天气。当前画面压缩了太阳亮度和比例，让你能同时观察太阳、行星轨道和远景银河位置。",
    introEn: "The Sun is a G-type main-sequence star and the mass center of the solar system. It fuses hydrogen into helium, releases light and heat, and shapes the space environment from Mercury to Neptune through solar wind, magnetism, and radiation. Its surface is not solid; it is churning plasma with sunspots, flares, and coronal mass ejections that affect space weather near planets. This view compresses brightness and scale so the Sun, planetary orbits, and galactic context can be seen together.",
    statsZh: { diameter: "约 139.2 万 km", distance: "太阳系中心", orbit: "约 2.25-2.5 亿年绕银河中心一周", day: "赤道约 25 天" },
    statsEn: { diameter: "About 1.392 million km", distance: "Center of the solar system", orbit: "About 225-250 million years around the galaxy", day: "About 25 days at the equator" },
    sourceUrl: "https://science.nasa.gov/sun/",
  },
  mercury: {
    introZh: "水星是最靠近太阳、也是最小的八大行星。它没有能稳定保温的浓厚大气，所以白天被太阳暴晒，夜晚迅速降温，昼夜温差非常剧烈。水星表面布满撞击坑、盆地和悬崖状地形，说明它的地质活动较弱，古老表面保留了大量早期太阳系碰撞痕迹。它的轨道速度最快，公转周期只有 88 个地球日，但自转很慢，因此一昼夜循环和公转节奏并不直观。",
    introEn: "Mercury is the closest planet to the Sun and the smallest of the eight major planets. It lacks a thick atmosphere that can retain heat, so its dayside is intensely heated while the nightside cools rapidly, creating extreme temperature contrasts. Its surface is packed with craters, basins, and cliff-like scarps, preserving records of early solar system impacts. It moves fastest around the Sun, completing an orbit in only 88 Earth days, while rotating slowly enough that its day-night cycle feels counterintuitive.",
    statsZh: { diameter: "4,879 km", distance: "0.387 AU", orbit: "88 个地球日", day: "58.6 个地球日" },
    statsEn: { diameter: "4,879 km", distance: "0.387 AU", orbit: "88 Earth days", day: "58.6 Earth days" },
    sourceUrl: "https://science.nasa.gov/mercury/",
  },
  venus: {
    introZh: "金星在尺寸和密度上接近地球，但环境完全不同。它被厚重的二氧化碳大气包裹，云层中含有硫酸液滴，强烈的温室效应让表面温度高到足以熔化铅。金星自转方向与多数行星相反，而且自转很慢；从空间看，它最显眼的不是地表，而是高反照率的黄白色云顶。画面用暖金色云层和柔和大气辉光突出它的高压、厚云和炽热环境。",
    introEn: "Venus is similar to Earth in size and density, but its environment is radically different. A thick carbon dioxide atmosphere and sulfuric-acid clouds drive a runaway greenhouse effect hot enough to melt lead at the surface. Venus rotates in the opposite direction from most planets and does so very slowly; from space, its most visible feature is not the ground but its bright cloud tops. The scene uses warm golden clouds and atmospheric glow to emphasize its pressure, heat, and reflective cloud deck.",
    statsZh: { diameter: "12,104 km", distance: "0.723 AU", orbit: "225 个地球日", day: "243 个地球日，逆向自转" },
    statsEn: { diameter: "12,104 km", distance: "0.723 AU", orbit: "225 Earth days", day: "243 Earth days, retrograde" },
    sourceUrl: "https://science.nasa.gov/venus/",
  },
  earth: {
    introZh: "地球是目前已知唯一拥有稳定表面液态海洋和生命圈的行星。它位于适合液态水长期存在的区域，磁场和大气层帮助削弱太阳风、高能粒子和紫外辐射的影响。海洋、陆地、云层和冰盖不断交换热量与水汽，形成复杂的气候系统。画面中蓝色海洋、白色云带和绿色褐色大陆是最直接的识别特征，也提醒我们地球不是静止球体，而是一个活跃的水、岩石、空气和生命共同系统。",
    introEn: "Earth is the only known planet with stable surface oceans and a biosphere. It lies in a region where liquid water can persist over long periods, while its magnetic field and atmosphere help reduce the impact of solar wind, energetic particles, and ultraviolet radiation. Oceans, land, clouds, and ice exchange heat and water vapor to create a complex climate system. In the scene, blue oceans, white clouds, and green-brown continents make Earth instantly recognizable and show it as an active system of water, rock, air, and life.",
    statsZh: { diameter: "12,742 km", distance: "1 AU", orbit: "365.25 天", day: "23 小时 56 分" },
    statsEn: { diameter: "12,742 km", distance: "1 AU", orbit: "365.25 days", day: "23 h 56 min" },
    sourceUrl: "https://science.nasa.gov/earth/",
  },
  mars: {
    introZh: "火星是一颗寒冷、干燥的岩石行星，红色来自地表含铁矿物氧化后的尘土。它的大气很稀薄，主要成分是二氧化碳，因此表面保温能力弱，液态水难以长期稳定存在。不过峡谷、河道沉积、三角洲和含水矿物显示，早期火星曾有更活跃的水环境。它还有太阳系最高的火山奥林匹斯山和巨大的水手峡谷。画面用红褐色地表、暗色高地和浅色极冠表现它的干冷特征。",
    introEn: "Mars is a cold, dry rocky planet whose red color comes from oxidized iron-rich dust. Its thin carbon dioxide atmosphere holds little heat, making stable liquid water difficult at the surface today. Yet valleys, river deposits, deltas, and hydrated minerals show that early Mars once had more active water environments. It also hosts Olympus Mons, the tallest volcano in the solar system, and the enormous Valles Marineris canyon system. The scene uses rust-red terrain, darker highlands, and pale polar caps to express its dry, cold character.",
    statsZh: { diameter: "6,779 km", distance: "1.524 AU", orbit: "687 个地球日", day: "24 小时 37 分" },
    statsEn: { diameter: "6,779 km", distance: "1.524 AU", orbit: "687 Earth days", day: "24 h 37 min" },
    sourceUrl: "https://science.nasa.gov/mars/",
  },
  jupiter: {
    introZh: "木星是太阳系最大的行星，质量超过其他行星总和的两倍，主要由氢和氦组成。它没有像岩石行星那样清晰的固体表面，看到的是高速流动的大气云层。明暗相间的条带来自不同纬度的喷流和云层结构，大红斑是持续时间很长的巨大风暴。木星拥有强磁场、众多卫星和暗淡尘埃环，对小天体轨道也有重要引力影响。画面强调条带、大红斑和微弱环，让它区别于普通黄色气态球体。",
    introEn: "Jupiter is the largest planet in the solar system, with more than twice the mass of all the other planets combined, and is made mostly of hydrogen and helium. It has no clear rocky surface like the inner planets; what we see is a fast-moving atmosphere. Alternating light and dark bands come from jet streams and cloud structures at different latitudes, while the Great Red Spot is a long-lived giant storm. Jupiter also has a powerful magnetic field, many moons, and a faint dust ring, and its gravity strongly affects small-body orbits.",
    statsZh: { diameter: "139,820 km", distance: "5.203 AU", orbit: "11.86 年", day: "约 9 小时 56 分" },
    statsEn: { diameter: "139,820 km", distance: "5.203 AU", orbit: "11.86 years", day: "About 9 h 56 min" },
    sourceUrl: "https://science.nasa.gov/jupiter/",
  },
  saturn: {
    introZh: "土星是第二大行星，也是一颗以氢和氦为主的气态巨行星。它最著名的特征是宽阔明亮的环系统，环主要由冰粒、岩屑和尘埃组成，厚度相对直径非常薄。土星本体密度很低，大气中有风暴、喷流和淡金色云带，但视觉焦点通常被环系统占据。土星拥有大量卫星，其中土卫六有浓厚大气，是研究有机化学和外太阳系环境的重要目标。画面强化环缝和层次，让环不只是装饰，而是土星最核心的识别信息。",
    introEn: "Saturn is the second-largest planet and a hydrogen-helium gas giant. Its best-known feature is its broad, bright ring system, made mostly of icy particles, rocky debris, and dust, with a thickness tiny compared with its diameter. Saturn itself has low density, storms, jet streams, and pale golden cloud bands, but its rings dominate the view. It has many moons, including Titan, which has a thick atmosphere and is a major target for studying organic chemistry and outer solar system environments. The scene emphasizes ring gaps and layering as Saturn's central visual identity.",
    statsZh: { diameter: "116,460 km", distance: "9.537 AU", orbit: "29.45 年", day: "约 10 小时 33 分" },
    statsEn: { diameter: "116,460 km", distance: "9.537 AU", orbit: "29.45 years", day: "About 10 h 33 min" },
    sourceUrl: "https://science.nasa.gov/saturn/",
  },
  uranus: {
    introZh: "天王星是冰巨星，内部含有大量水、氨、甲烷等天文学意义上的“冰”成分。大气中的甲烷吸收红光，让它呈现青蓝色。它最反常的特点是自转轴几乎横躺在轨道面上，可能源于早期巨大撞击或复杂的形成历史，因此季节变化非常极端。天王星也有暗淡、狭窄的环和多颗卫星，只是从远处看不像土星环那样明亮。画面用冷青色、平滑表面和倾斜姿态表现它的冰巨星特征。",
    introEn: "Uranus is an ice giant containing large amounts of water, ammonia, methane, and other volatile materials called ices in astronomy. Methane in its atmosphere absorbs red light, giving the planet a blue-green color. Its most unusual trait is that its rotation axis is tipped almost sideways relative to its orbit, perhaps from an early giant impact or complex formation history, creating extreme seasons. Uranus also has dark, narrow rings and many moons, though its rings are far less obvious than Saturn's. The scene uses a cool cyan tone, smooth texture, and tilted attitude to identify it.",
    statsZh: { diameter: "50,724 km", distance: "19.191 AU", orbit: "84 年", day: "约 17 小时 14 分，逆向" },
    statsEn: { diameter: "50,724 km", distance: "19.191 AU", orbit: "84 years", day: "About 17 h 14 min, retrograde" },
    sourceUrl: "https://science.nasa.gov/uranus/",
  },
  neptune: {
    introZh: "海王星是距离太阳最远的主要行星，也是一颗冰巨星。它接收到的太阳能很少，却拥有活跃的大气和极高速风，说明内部热量仍在影响天气系统。甲烷让它呈现蓝色，暗色风暴和明亮云带会随时间变化。海王星也有微弱环弧和卫星，其中海卫一可能是被俘获的柯伊伯带天体。画面用更深的蓝色、暗色风暴感和微弱环弧表现它遥远、寒冷但并不平静的状态。",
    introEn: "Neptune is the farthest major planet from the Sun and an ice giant. It receives very little sunlight, yet it has an active atmosphere and extremely fast winds, showing that internal heat still drives weather systems. Methane contributes to its blue color, while dark storms and bright cloud features change over time. Neptune also has faint ring arcs and moons, including Triton, which may be a captured Kuiper Belt object. The scene uses deeper blue, storm-like markings, and subtle ring arcs to show a distant, cold world that is not quiet.",
    statsZh: { diameter: "49,244 km", distance: "30.069 AU", orbit: "164.8 年", day: "约 16 小时 6 分" },
    statsEn: { diameter: "49,244 km", distance: "30.069 AU", orbit: "164.8 years", day: "About 16 h 6 min" },
    sourceUrl: "https://science.nasa.gov/neptune/",
  },
};

let paused = false;
let speedFactor = 1;
let activeKey = "earth";
let currentLang = "zh";
let targetFocus = new THREE.Vector3(0, 0, 0);
let activeSpeechKey = null;
let currentUtterance = null;
let selectedNarrationVoiceURI = "auto";
let speechPauseTimer = null;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020409, 0.0022);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 600);
camera.position.set(0, 46, DEFAULT_ZOOM_DISTANCE);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
} else {
  renderer.outputEncoding = THREE.sRGBEncoding;
}
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 7;
controls.maxDistance = 420;
controls.target.set(0, 0, 0);

const planetObjects = new Map();
const labelObjects = new Map();
const labelRaycaster = new THREE.Raycaster();
const labelDirection = new THREE.Vector3();
const clock = new THREE.Clock();
const solarSystemGroup = new THREE.Group();
let galaxyGroup;
let galaxyMaterial;
let solarSystemOrbit;
let solarSystemOrbitAngle = 0.65;
let isGalaxyMode = false;

scene.add(solarSystemGroup);

init();
animate();

function init() {
  createLights();
  createStars();
  createGalaxy();
  createSun();
  createPlanets();
  createNavigation();
  bindControls();
  loadNarrationVoices();
  renderLanguage();
  updatePlanetDetails();
  updateZoomOutput();

  // 纹理全部加载完成后再收起开场动画（内联脚本会保证最短展示时长）。
  textureLoadingManager.onLoad = dismissLoading;
  // 兜底：若纹理加载失败或无需异步加载，到达上限后强制收起。
  window.setTimeout(dismissLoading, LOADING_MAX_DISPLAY_MS);
}

// 通知开场动画收起；多次调用只会生效一次。
// 优先交给内联脚本（含轮播清理与最短展示时长），缺失时退化为直接隐藏。
function dismissLoading() {
  if (loadingDismissed) return;
  loadingDismissed = true;
  if (window.SolarLoading && typeof window.SolarLoading.stop === "function") {
    window.SolarLoading.stop();
  } else if (loadingState) {
    loadingState.classList.add("hidden");
  }
}

function createLights() {
  scene.add(new THREE.AmbientLight(0x8aa0c0, 0.28));

  const sunLight = new THREE.PointLight(0xffd18a, 3.2, 260, 1.25);
  sunLight.position.set(0, 0, 0);
  solarSystemGroup.add(sunLight);
}

function createSun() {
  const sunTexture = makeSunTexture();
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(4.3, 96, 64),
    new THREE.MeshBasicMaterial({
      map: sunTexture,
      color: 0xffffff,
    })
  );
  sun.name = "Sun";
  solarSystemGroup.add(sun);
  planetObjects.set("sun", { ...sunBody, mesh: sun, angle: 0, distance: 0, speed: 0, radius: 4.3 });
  createGlow(5.8, 0xffb23e, 0.33);
  createLabel("sun", "Sun", sun);
}

function createGlow(size, color, opacity) {
  const spriteCanvas = document.createElement("canvas");
  spriteCanvas.width = 256;
  spriteCanvas.height = 256;
  const ctx = spriteCanvas.getContext("2d");
  const gradient = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
  gradient.addColorStop(0, `rgba(255, 218, 122, ${opacity})`);
  gradient.addColorStop(0.42, `rgba(255, 154, 44, ${opacity * 0.48})`);
  gradient.addColorStop(1, "rgba(255, 154, 44, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(spriteCanvas),
      color,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  sprite.scale.set(size * 5, size * 5, 1);
  solarSystemGroup.add(sprite);
}

function createPlanets() {
  for (const data of planetData) {
    const orbit = createOrbit(data);
    solarSystemGroup.add(orbit);

    const texture = makePlanetTexture(data);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(data.radius, 64, 48),
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: data.key === "earth" ? 0.72 : 0.86,
        metalness: 0.02,
      })
    );
    mesh.rotation.z = data.tilt;
    mesh.userData.key = data.key;
    mesh.userData.name = data.name;
    solarSystemGroup.add(mesh);

    if (data.ring) createPlanetRing(mesh, data);

    const angle = Math.random() * Math.PI * 2;
    planetObjects.set(data.key, { ...data, mesh, orbit, angle });
    createLabel(data.key, data.name, mesh);
  }
}

function createPlanetRing(mesh, data) {
  const ringTexture = textureLoader.load(window.PLANET_TEXTURES?.[data.ring.texture] || "");
  configureTextureColor(ringTexture);
  ringTexture.wrapS = THREE.ClampToEdgeWrapping;
  ringTexture.wrapT = THREE.RepeatWrapping;
  const innerRadius = data.radius * data.ring.inner;
  const outerRadius = data.radius * data.ring.outer;
  const ring = new THREE.Mesh(
    createRingGeometry(innerRadius, outerRadius, 192),
    new THREE.MeshBasicMaterial({
      map: ringTexture,
      color: 0xffffff,
      transparent: true,
      opacity: data.ring.opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  ring.name = `${data.name} ring`;
  ring.rotation.x = Math.PI / 2;
  ring.userData.key = data.key;
  mesh.add(ring);
}

function createRingGeometry(innerRadius, outerRadius, segments) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
  const positions = geometry.attributes.position;
  const uvs = geometry.attributes.uv;
  const span = outerRadius - innerRadius;
  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const radius = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);
    uvs.setXY(i, THREE.MathUtils.clamp((radius - innerRadius) / span, 0, 1), (angle + Math.PI) / (Math.PI * 2));
  }
  uvs.needsUpdate = true;
  return geometry;
}

function createOrbit(data) {
  const points = [];
  const distance = data.distance;
  const eccentricity = 1 + distance / 260;
  for (let i = 0; i <= 256; i += 1) {
    const a = (i / 256) * Math.PI * 2;
    points.push(getOrbitPosition(data, a));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.LineLoop(
    geometry,
    new THREE.LineBasicMaterial({
      color: distance === 18 ? 0x18c8ff : 0x8ca4c8,
      transparent: true,
      opacity: distance === 18 ? 0.42 : 0.22,
    })
  );
}

function getOrbitPosition(body, angle) {
  const distance = body.distance;
  const eccentricity = 1 + distance / 260;
  const position = new THREE.Vector3(
    Math.cos(angle) * distance * eccentricity,
    0,
    Math.sin(angle) * distance
  );
  const plane = orbitPlanes[body.key];
  if (!plane) return position;
  const inclination = THREE.MathUtils.degToRad(plane.inclination * ORBIT_INCLINATION_VISUAL_BOOST);
  const node = THREE.MathUtils.degToRad(plane.node);
  const axis = new THREE.Vector3(Math.cos(node), 0, Math.sin(node)).normalize();
  return position.applyAxisAngle(axis, inclination);
}

function makeStarSpriteTexture() {
  const size = 96;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 1, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.16, "rgba(255, 255, 255, 0.96)");
  gradient.addColorStop(0.38, "rgba(214, 229, 255, 0.46)");
  gradient.addColorStop(0.72, "rgba(126, 178, 255, 0.12)");
  gradient.addColorStop(1, "rgba(126, 178, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(c);
  configureTextureColor(texture);
  return texture;
}

function createStars() {
  const starCount = 2800;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const palette = [new THREE.Color(0xffffff), new THREE.Color(0x9fc7ff), new THREE.Color(0xffd59b)];

  for (let i = 0; i < starCount; i += 1) {
    const radius = 130 + Math.random() * 190;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  scene.add(
    new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        map: makeStarSpriteTexture(),
        size: 0.72,
        vertexColors: true,
        transparent: true,
        opacity: 0.86,
        alphaTest: 0.02,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );
}

function createGalaxy() {
  const count = 5200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorCore = new THREE.Color(0xffd690);
  const colorArm = new THREE.Color(0x92c8ff);
  const colorDust = new THREE.Color(0xf2e7d4);

  for (let i = 0; i < count; i += 1) {
    const arm = i % 4;
    const radius = 38 + Math.pow(Math.random(), 0.72) * 325;
    const spin = radius * 0.042;
    const angle = arm * (Math.PI / 2) + spin + (Math.random() - 0.5) * 0.58;
    const thickness = 3 + radius * 0.018;
    const vertical = (Math.random() - 0.5) * thickness;
    const jitter = (Math.random() - 0.5) * radius * 0.085;

    positions[i * 3] = Math.cos(angle) * (radius + jitter);
    positions[i * 3 + 1] = vertical - 34;
    positions[i * 3 + 2] = Math.sin(angle) * (radius + jitter);

    const mix = Math.min(1, radius / 340);
    const color = colorCore.clone().lerp(i % 7 === 0 ? colorDust : colorArm, mix);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  galaxyMaterial = new THREE.PointsMaterial({
    map: makeStarSpriteTexture(),
    size: 1.36,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    alphaTest: 0.01,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  galaxyGroup = new THREE.Points(geometry, galaxyMaterial);
  galaxyGroup.rotation.x = -0.32;
  galaxyGroup.rotation.z = 0.18;
  scene.add(galaxyGroup);

  solarSystemOrbit = createSolarSystemOrbit();
  scene.add(solarSystemOrbit);
}

function createSolarSystemOrbit() {
  const points = [];
  const radiusX = 238;
  const radiusZ = 162;
  for (let i = 0; i <= 360; i += 1) {
    const a = (i / 360) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radiusX, -22, Math.sin(a) * radiusZ));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.LineLoop(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0xffc46c,
      transparent: true,
      opacity: 0,
    })
  );
}

function makeSunTexture() {
  const fallback = makeTexture(["#fff2a7", "#ffc23f", "#ff7a18", "#7a2100"], 256, 1.35);
  const texture = textureLoader.load(
    window.PLANET_TEXTURES?.sun || "./assets/planets/sun.png",
    (loadedTexture) => {
      configureTextureColor(loadedTexture);
    },
    undefined,
    () => {
      console.warn("Sun texture failed, using fallback.");
    }
  );
  configureTextureColor(texture);
  texture.userData = texture.userData || {};
  texture.userData.fallbackTexture = fallback;
  return texture;
}

function compressedOrbitDistance(au) {
  return ORBIT_DISTANCE_BASE + ORBIT_DISTANCE_SCALE * Math.sqrt(au);
}

function makeTexture(colors, size = 192, noise = 0.55, painter) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const gradient = ctx.createRadialGradient(size * 0.35, size * 0.28, 2, size / 2, size / 2, size * 0.64);
  colors.forEach((color, index) => gradient.addColorStop(index / (colors.length - 1), color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  if (typeof painter === "function") {
    painter(ctx, size);
  }

  for (let i = 0; i < size * size * 0.08; i += 1) {
    const alpha = Math.random() * noise;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1.2, 1.2);
  }

  const texture = new THREE.CanvasTexture(c);
  if ("colorSpace" in texture && THREE.SRGBColorSpace) {
    texture.colorSpace = THREE.SRGBColorSpace;
  } else {
    texture.encoding = THREE.sRGBEncoding;
  }
  return texture;
}

function makePlanetTexture(data) {
  const specs = {
    mercury: {
      colors: ["#e0ded9", "#9d9a94", "#4d5055"],
      noise: 0.42,
      painter: (ctx, size) => {
        for (let i = 0; i < 42; i += 1) {
          const r = 2 + Math.random() * 11;
          const x = Math.random() * size;
          const y = Math.random() * size;
          ctx.strokeStyle = `rgba(32, 34, 37, ${0.25 + Math.random() * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.05})`;
          ctx.fill();
        }
      },
    },
    venus: {
      colors: ["#fff1b8", "#e5b05e", "#9a652a"],
      noise: 0.22,
      painter: (ctx, size) => drawBands(ctx, size, ["rgba(255,238,178,0.28)", "rgba(139,91,39,0.16)"], 12, 0.35),
    },
    earth: {
      colors: ["#eaffff", "#2c86d6", "#177759", "#102d75"],
      noise: 0.2,
      painter: (ctx, size) => {
        drawBlob(ctx, size, "#1f8f65", 0.18, 0.44, 0.22, 0.22);
        drawBlob(ctx, size, "#53b37b", 0.55, 0.52, 0.2, 0.14);
        drawBlob(ctx, size, "#235f42", 0.7, 0.32, 0.15, 0.18);
        drawBands(ctx, size, ["rgba(255,255,255,0.42)", "rgba(255,255,255,0.22)"], 10, 0.58);
      },
    },
    mars: {
      colors: ["#ffb16b", "#c65a2f", "#54241a"],
      noise: 0.36,
      painter: (ctx, size) => {
        drawBlob(ctx, size, "#7a3222", 0.28, 0.48, 0.28, 0.12);
        drawBlob(ctx, size, "#3f1b15", 0.58, 0.6, 0.16, 0.09);
        ctx.fillStyle = "rgba(246,222,178,0.48)";
        ctx.fillRect(0, 0, size, size * 0.08);
        ctx.fillRect(0, size * 0.91, size, size * 0.09);
      },
    },
    jupiter: {
      colors: ["#f7dfb5", "#c89158", "#f2d2a2", "#6f482e"],
      noise: 0.16,
      painter: (ctx, size) => {
        drawBands(ctx, size, ["rgba(100,57,35,0.35)", "rgba(255,237,201,0.34)", "rgba(186,109,57,0.28)"], 18, 0.15);
        ctx.fillStyle = "rgba(170,72,48,0.54)";
        ctx.beginPath();
        ctx.ellipse(size * 0.68, size * 0.58, size * 0.11, size * 0.055, -0.18, 0, Math.PI * 2);
        ctx.fill();
      },
    },
    saturn: {
      colors: ["#f9e5a9", "#cfaa66", "#766044"],
      noise: 0.14,
      painter: (ctx, size) => drawBands(ctx, size, ["rgba(255,247,206,0.28)", "rgba(133,104,62,0.18)"], 16, 0.12),
    },
    uranus: {
      colors: ["#e3ffff", "#8ed9e5", "#3e94a8"],
      noise: 0.08,
      painter: (ctx, size) => drawBands(ctx, size, ["rgba(255,255,255,0.16)", "rgba(43,126,145,0.11)"], 8, 0.08),
    },
    neptune: {
      colors: ["#9ab8ff", "#315fda", "#101f70"],
      noise: 0.16,
      painter: (ctx, size) => {
        drawBands(ctx, size, ["rgba(190,214,255,0.18)", "rgba(9,25,91,0.18)"], 9, 0.32);
        drawBlob(ctx, size, "#10216a", 0.64, 0.42, 0.16, 0.06);
      },
    },
  };
  const spec = specs[data.key] || { colors: [data.color, "#1b1f2a"], noise: 0.5 };
  const fallbackTexture = makeTexture(spec.colors, 224, spec.noise, spec.painter);
  const source = window.PLANET_TEXTURES?.[data.key] || `./assets/planets/${data.key}.png`;
  const texture = textureLoader.load(
    source,
    (loadedTexture) => {
      configureTextureColor(loadedTexture);
    },
    undefined,
    () => {
      console.warn(`Planet texture failed, using fallback: ${data.key}`);
    }
  );
  configureTextureColor(texture);
  texture.userData = texture.userData || {};
  texture.userData.fallbackTexture = fallbackTexture;
  return texture;
}

function configureTextureColor(texture) {
  if ("colorSpace" in texture && THREE.SRGBColorSpace) {
    texture.colorSpace = THREE.SRGBColorSpace;
  } else {
    texture.encoding = THREE.sRGBEncoding;
  }
}

function drawBands(ctx, size, colors, count, wave) {
  for (let i = 0; i < count; i += 1) {
    const y = (i / count) * size + Math.sin(i * 1.7) * size * 0.018;
    const h = size / count * (0.45 + Math.random() * 0.9);
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 8) {
      ctx.lineTo(x, y + Math.sin(x * 0.035 + i) * size * wave * 0.018);
    }
    ctx.lineTo(size, y + h);
    ctx.lineTo(0, y + h);
    ctx.closePath();
    ctx.fill();
  }
}

function drawBlob(ctx, size, color, cx, cy, rx, ry) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i <= 20; i += 1) {
    const a = (i / 20) * Math.PI * 2;
    const jitter = 0.82 + Math.sin(i * 2.3) * 0.08 + Math.random() * 0.13;
    const x = size * cx + Math.cos(a) * size * rx * jitter;
    const y = size * cy + Math.sin(a) * size * ry * jitter;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function createNavigation() {
  const bodies = [sunBody, ...planetData];
  for (const body of bodies) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.key = body.key;
    button.innerHTML = `<span class="planet-dot" style="background:${body.color}"></span><span class="planet-nav-name"></span>`;
    button.addEventListener("click", () => focusBody(body.key));
    planetNav.appendChild(button);
  }
  setActiveNav();
}

function createLabel(key, text, mesh) {
  const label = document.createElement("span");
  label.className = "planet-label";
  label.textContent = text;
  labelsLayer.appendChild(label);
  labelObjects.set(key, { label, mesh });
}

function bindControls() {
  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.setAttribute("aria-pressed", String(paused));
    pauseIcon.textContent = paused ? "▶" : "||";
    pauseText.textContent = paused ? copy[currentLang].resume : copy[currentLang].pause;
  });

  langBtn.addEventListener("click", () => {
    stopBodySound();
    currentLang = currentLang === "zh" ? "en" : "zh";
    renderLanguage();
  });

  resetBtn.addEventListener("click", () => {
    stopBodySound();
    activeKey = "earth";
    camera.position.set(0, 46, DEFAULT_ZOOM_DISTANCE);
    controls.target.set(0, 0, 0);
    zoomRange.value = String(DEFAULT_ZOOM_DISTANCE);
    updateZoomOutput();
    setActiveNav();
    updatePlanetDetails();
  });

  speedSelect.addEventListener("change", () => setSpeed(Number(speedSelect.value)));
  speedRange.addEventListener("input", () => setSpeed(Number(speedRange.value), false));
  zoomRange.addEventListener("input", () => setZoomDistance(Number(zoomRange.value)));
  soundBtn?.addEventListener("click", toggleBodySound);
  voiceSelect?.addEventListener("change", () => {
    selectedNarrationVoiceURI = voiceSelect.value || "auto";
    if (activeSpeechKey) {
      const key = activeSpeechKey;
      stopBodySound();
      activeSpeechKey = key;
      startNarration(key);
      renderSoundDetails();
    }
  });
  controls.addEventListener("change", syncZoomRange);

  canvas.addEventListener("click", handleCanvasClick);
  window.addEventListener("resize", handleResize);
}

function setSpeed(value, syncSelect = true) {
  speedFactor = Math.max(0, value);
  speedRange.value = String(speedFactor);
  speedOutput.textContent = `${speedFactor.toFixed(2)}x`;
  if (syncSelect) {
    speedSelect.value = String(value);
  }
}

function setZoomDistance(distance) {
  const clamped = THREE.MathUtils.clamp(distance, controls.minDistance, controls.maxDistance);
  const direction = camera.position.clone().sub(controls.target).normalize();
  camera.position.copy(controls.target).add(direction.multiplyScalar(clamped));
  zoomRange.value = String(Math.round(clamped));
  updateZoomOutput();
}

function syncZoomRange() {
  const distance = Math.round(camera.position.distanceTo(controls.target));
  zoomRange.value = String(THREE.MathUtils.clamp(distance, Number(zoomRange.min), Number(zoomRange.max)));
  updateZoomOutput();
}

function updateZoomOutput() {
  const distance = Number(zoomRange.value);
  zoomOutput.textContent = distance >= GALAXY_VIEW_DISTANCE ? `${zoomRange.value} ${copy[currentLang].galaxy}` : zoomRange.value;
  updateViewContext(distance);
}

function focusBody(key) {
  const body = planetObjects.get(key);
  if (!body) return;
  if (key !== activeKey) stopBodySound();
  activeKey = key;
  body.mesh.getWorldPosition(targetFocus);
  const distance = key === "sun" ? 18 : Math.max(8, body.radius * 4.7);
  const direction = camera.position.clone().sub(controls.target).normalize();
  camera.position.copy(targetFocus).add(direction.multiplyScalar(distance));
  controls.target.copy(targetFocus);
  syncZoomRange();
  setActiveNav();
  updatePlanetDetails();
}

function setActiveNav() {
  planetNav.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.key === activeKey);
  });
  labelObjects.forEach(({ label }, key) => {
    label.classList.toggle("active", key === activeKey);
  });
}

function updatePlanetDetails() {
  const body = planetObjects.get(activeKey);
  if (!body) return;
  const profile = bodyProfiles[activeKey];
  detailTitle.textContent = getBodyName(body);
  detailBody.textContent = currentLang === "zh" ? body.featureZh : body.featureEn;
  if (detailIntro && profile) {
    detailIntro.textContent = currentLang === "zh" ? profile.introZh : profile.introEn;
  }
  if (detailStats && profile) {
    const stats = currentLang === "zh" ? profile.statsZh : profile.statsEn;
    const labels = copy[currentLang];
    detailStats.innerHTML = [
      [labels.statDiameter, stats.diameter],
      [labels.statDistance, stats.distance],
      [labels.statOrbit, stats.orbit],
      [labels.statDay, stats.day],
    ].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
  }
  renderSoundDetails();
}

function renderSoundDetails() {
  const profile = bodyProfiles[activeKey];
  if (!profile || !soundBtn) return;
  const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const isPlaying = activeSpeechKey === activeKey;
  soundBtn.disabled = !canSpeak;
  soundBtn.setAttribute("aria-pressed", String(isPlaying));
  if (soundIcon) soundIcon.textContent = isPlaying ? "■" : "♪";
  if (soundText) soundText.textContent = isPlaying ? copy[currentLang].stopSound : copy[currentLang].playSound;
  if (voiceSelect) {
    voiceSelect.disabled = !canSpeak;
    voiceSelect.setAttribute("aria-label", copy[currentLang].voiceLabel);
  }
  if (soundMeta) soundMeta.textContent = canSpeak ? copy[currentLang].narrationReady : copy[currentLang].narrationUnsupported;
  if (soundSourceLink) {
    soundSourceLink.textContent = `${copy[currentLang].narrationSource}: NASA`;
    soundSourceLink.href = profile.sourceUrl || "https://science.nasa.gov/solar-system/planets/";
    soundSourceLink.hidden = false;
  }
}

async function toggleBodySound() {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
  if (activeSpeechKey === activeKey) {
    stopBodySound();
    renderSoundDetails();
    return;
  }
  stopBodySound();
  activeSpeechKey = activeKey;
  startNarration(activeKey);
  renderSoundDetails();
}

function stopBodySound() {
  if (speechPauseTimer) {
    clearTimeout(speechPauseTimer);
    speechPauseTimer = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  activeSpeechKey = null;
  currentUtterance = null;
}

function startNarration(key) {
  const lang = currentLang === "zh" ? "zh-CN" : "en-US";
  const chunks = splitNarrationIntoChunks(getNarrationText(key));
  const voice = pickNarrationVoice(lang);
  speakNarrationChunk(key, chunks, 0, lang, voice);
}

function speakNarrationChunk(key, chunks, index, lang, voice) {
  if (activeSpeechKey !== key || index >= chunks.length) {
    activeSpeechKey = null;
    currentUtterance = null;
    renderSoundDetails();
    return;
  }

  currentUtterance = new SpeechSynthesisUtterance(chunks[index]);
  currentUtterance.lang = lang;
  currentUtterance.rate = currentLang === "zh" ? 0.78 : 0.82;
  currentUtterance.pitch = currentLang === "zh" ? 1.06 : 0.98;
  currentUtterance.volume = 1;
  if (voice) currentUtterance.voice = voice;
  currentUtterance.onend = () => {
    currentUtterance = null;
    speechPauseTimer = setTimeout(() => {
      speechPauseTimer = null;
      speakNarrationChunk(key, chunks, index + 1, lang, voice);
    }, getNarrationPause(chunks[index]));
  };
  currentUtterance.onerror = () => {
    activeSpeechKey = null;
    currentUtterance = null;
    renderSoundDetails();
  };
  window.speechSynthesis.speak(currentUtterance);
}

function getNarrationText(key) {
  const body = planetObjects.get(key);
  const profile = bodyProfiles[key];
  if (!body || !profile) return "";
  const stats = currentLang === "zh" ? profile.statsZh : profile.statsEn;
  const labels = copy[currentLang];
  const feature = currentLang === "zh" ? body.featureZh : body.featureEn;
  const intro = currentLang === "zh" ? profile.introZh : profile.introEn;
  if (currentLang === "zh") {
    return `${getBodyName(body)}。${feature}${intro} 关键数据：${labels.statDiameter}，${stats.diameter}；${labels.statDistance}，${stats.distance}；${labels.statOrbit}，${stats.orbit}；${labels.statDay}，${stats.day}。`;
  }
  return `${getBodyName(body)}. ${feature} ${intro} Key facts: ${labels.statDiameter}, ${stats.diameter}; ${labels.statDistance}, ${stats.distance}; ${labels.statOrbit}, ${stats.orbit}; ${labels.statDay}, ${stats.day}.`;
}

function splitNarrationIntoChunks(text) {
  const raw = text
    .replace(/\s+/g, " ")
    .split(/(?<=[。！？.!?；;])\s*/u)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  const chunks = [];
  for (const chunk of raw) {
    if (chunk.length <= 130) {
      chunks.push(chunk);
      continue;
    }
    const parts = chunk.split(/(?<=[，,、])\s*/u).filter(Boolean);
    let current = "";
    for (const part of parts) {
      if ((current + part).length > 115 && current) {
        chunks.push(current);
        current = part;
      } else {
        current += part;
      }
    }
    if (current) chunks.push(current);
  }
  return chunks;
}

function getNarrationPause(chunk) {
  if (/[。.!?！？]$/.test(chunk)) return currentLang === "zh" ? 280 : 240;
  if (/[；;]$/.test(chunk)) return 220;
  return 150;
}

function pickNarrationVoice(lang) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  if (selectedNarrationVoiceURI !== "auto") {
    const selected = voices.find((voice) => voice.voiceURI === selectedNarrationVoiceURI);
    if (selected) return selected;
  }
  return voices
    .filter((voice) => voice.lang?.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()))
    .sort((a, b) => getVoiceNaturalnessScore(b, lang) - getVoiceNaturalnessScore(a, lang))[0]
    || voices.find((voice) => voice.lang === lang)
    || null;
}

function loadNarrationVoices() {
  if (!("speechSynthesis" in window)) {
    populateVoiceSelect([]);
    return;
  }
  populateVoiceSelect(window.speechSynthesis.getVoices());
  window.speechSynthesis.onvoiceschanged = () => {
    populateVoiceSelect(window.speechSynthesis.getVoices());
  };
}

function populateVoiceSelect(voices) {
  if (!voiceSelect) return;
  const langPrefix = currentLang === "zh" ? "zh" : "en";
  const matchingVoices = voices
    .filter((voice) => voice.lang?.toLowerCase().startsWith(langPrefix))
    .sort((a, b) => getVoiceNaturalnessScore(b, currentLang === "zh" ? "zh-CN" : "en-US") - getVoiceNaturalnessScore(a, currentLang === "zh" ? "zh-CN" : "en-US"));
  const previousValue = selectedNarrationVoiceURI;
  voiceSelect.innerHTML = "";

  const autoOption = document.createElement("option");
  autoOption.value = "auto";
  autoOption.textContent = copy[currentLang].autoVoice;
  voiceSelect.appendChild(autoOption);

  for (const voice of matchingVoices) {
    const option = document.createElement("option");
    option.value = voice.voiceURI;
    option.textContent = `${voice.name} · ${voice.lang}`;
    voiceSelect.appendChild(option);
  }

  const hasPrevious = [...voiceSelect.options].some((option) => option.value === previousValue);
  voiceSelect.value = hasPrevious ? previousValue : "auto";
  selectedNarrationVoiceURI = voiceSelect.value;
}

function getVoiceNaturalnessScore(voice, lang) {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  const langPrefix = lang.slice(0, 2).toLowerCase();
  let score = voice.lang?.toLowerCase().startsWith(langPrefix) ? 20 : 0;
  if (voice.localService) score += 6;
  const naturalNames = langPrefix === "zh"
    ? ["tingting", "mei-jia", "meijia", "sin-ji", "sinji", "xiaoxiao", "xiaoyi", "yunxi", "yunjian", "xiaobei", "xiaohan", "google", "microsoft"]
    : ["samantha", "ava", "allison", "karen", "daniel", "serena", "jenny", "aria", "guy", "google", "microsoft", "natural"];
  naturalNames.forEach((candidate, index) => {
    if (name.includes(candidate)) score += 36 - index;
  });
  if (name.includes("compact")) score -= 12;
  if (name.includes("eloquence")) score -= 8;
  return score;
}

function updateViewContext(distance) {
  const isClose = distance <= CLOSE_VIEW_DISTANCE;
  const isGalaxy = distance >= GALAXY_VIEW_DISTANCE;
  isGalaxyMode = isGalaxy;
  document.body.classList.toggle("close-view", isClose);
  document.body.classList.toggle("galaxy-view", isGalaxy);

  if (galaxyMaterial) {
    const opacity = THREE.MathUtils.clamp((distance - GALAXY_VIEW_DISTANCE) / 145, 0, 0.82);
    galaxyMaterial.opacity = opacity;
    galaxyMaterial.needsUpdate = true;
  }

  if (solarSystemOrbit?.material) {
    solarSystemOrbit.material.opacity = isGalaxy
      ? THREE.MathUtils.clamp((distance - GALAXY_VIEW_DISTANCE) / 120, 0, 0.36)
      : 0;
  }

  if (scaleNote) {
    scaleNote.textContent = isGalaxy
      ? copy[currentLang].galaxyScale
      : copy[currentLang].normalScale;
  }
}

function getBodyName(body) {
  return currentLang === "zh" ? `${body.zh} · ${body.name}` : `${body.name} · ${body.zh}`;
}

function renderLanguage() {
  const t = copy[currentLang];
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = t.appLabel;
  document.querySelector(".solar-app")?.setAttribute("aria-label", t.appLabel);
  document.querySelector(".topbar")?.setAttribute("aria-label", currentLang === "zh" ? "模拟器状态与快捷操作" : "Simulator status and shortcuts");
  document.querySelector(".focus-panel")?.setAttribute("aria-label", currentLang === "zh" ? "行星聚焦" : "Body focus");
  document.querySelector(".scale-panel")?.setAttribute("aria-label", currentLang === "zh" ? "尺度说明" : "Scale note");
  document.querySelector(".bottom-controls")?.setAttribute("aria-label", currentLang === "zh" ? "视角与速度控制" : "View and speed controls");
  document.querySelector(".detail-panel")?.setAttribute("aria-label", currentLang === "zh" ? "天体特征" : "Body features");

  pauseText.textContent = paused ? t.resume : t.pause;
  pauseBtn.setAttribute("aria-label", pauseText.textContent);
  langBtn.textContent = t.langButton;
  resetBtn.textContent = t.reset;
  document.querySelector(".select-control span").textContent = t.speed;
  speedSelect.setAttribute("aria-label", currentLang === "zh" ? "轨道运行速度" : "Orbital speed");

  const focusTitle = document.querySelector(".focus-panel h1");
  const focusHelp = document.querySelector(".focus-panel p");
  if (focusTitle) focusTitle.textContent = t.focusTitle;
  if (focusHelp) focusHelp.textContent = t.focusHelp;

  const scaleTitle = document.querySelector(".scale-panel h2");
  if (scaleTitle) scaleTitle.textContent = t.scaleTitle;
  const scaleRows = document.querySelectorAll(".scale-panel dl div");
  if (scaleRows[1]) {
    scaleRows[1].querySelector("dt").textContent = t.view;
    scaleRows[1].querySelector("dd").textContent = t.viewValue;
  }
  if (scaleRows[2]) {
    scaleRows[2].querySelector("dt").textContent = t.planets;
    scaleRows[2].querySelector("dd").textContent = t.planetsValue;
  }

  const detailKicker = document.querySelector(".detail-kicker");
  if (detailKicker) detailKicker.textContent = t.detailKicker;
  if ("speechSynthesis" in window) populateVoiceSelect(window.speechSynthesis.getVoices());

  const rangeLabels = document.querySelectorAll(".range-control > span");
  if (rangeLabels[0]) rangeLabels[0].textContent = t.speed;
  if (rangeLabels[1]) rangeLabels[1].textContent = t.zoom;
  speedRange.setAttribute("aria-label", currentLang === "zh" ? "速度微调" : "Fine speed adjustment");
  zoomRange.setAttribute("aria-label", currentLang === "zh" ? "视角缩放" : "View zoom");
  const hint = document.querySelector(".hint");
  if (hint) hint.textContent = t.hint;
  if (loadingText) loadingText.textContent = t.loading;

  planetNav.querySelectorAll("button").forEach((button) => {
    const body = planetObjects.get(button.dataset.key);
    const name = button.querySelector(".planet-nav-name");
    if (body && name) name.textContent = currentLang === "zh" ? body.zh : body.name;
    if (body) button.setAttribute("aria-label", getBodyName(body));
  });
  labelObjects.forEach(({ label }, key) => {
    const body = planetObjects.get(key);
    if (body) label.textContent = currentLang === "zh" ? body.zh : body.name;
  });
  updatePlanetDetails();
  updateZoomOutput();
}

function handleCanvasClick(event) {
  const pointer = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, camera);
  const meshes = [...planetObjects.values()].map((body) => body.mesh);
  const hits = raycaster.intersectObjects(meshes, true);
  const hit = hits.find((item) => item.object.userData.key || item.object.parent?.userData.key);
  const key = hit?.object.userData.key || hit?.object.parent?.userData.key;
  if (key) focusBody(key);
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.035);
  const elapsed = clock.elapsedTime;

  if (!paused) {
    planetObjects.forEach((body, key) => {
      body.mesh.rotation.y += delta * (key === "sun" ? 0.2 : 0.6);
      if (body.distance > 0) {
        body.angle += delta * speedFactor * body.speed * 0.34;
        body.mesh.position.copy(getOrbitPosition(body, body.angle));
      }
    });
  }

  const sun = planetObjects.get("sun")?.mesh;
  if (sun) sun.scale.setScalar(1 + Math.sin(elapsed * 1.6) * 0.018);
  if (galaxyGroup) galaxyGroup.rotation.y += delta * 0.006;
  updateSolarSystemGalacticMotion(delta);

  if (isGalaxyMode) {
    controls.target.lerp(new THREE.Vector3(0, -22, 0), 0.025);
  } else if (activeKey && activeKey !== "sun") {
    const active = planetObjects.get(activeKey);
    if (active) {
      const activeWorld = new THREE.Vector3();
      active.mesh.getWorldPosition(activeWorld);
      controls.target.lerp(activeWorld, 0.025);
    }
  }

  controls.update();
  updateLabels();
  renderer.render(scene, camera);
}

function updateSolarSystemGalacticMotion(delta) {
  const orbitRadiusX = 238;
  const orbitRadiusZ = 162;
  if (isGalaxyMode) {
    solarSystemOrbitAngle += delta * speedFactor * 0.018;
    const target = new THREE.Vector3(
      Math.cos(solarSystemOrbitAngle) * orbitRadiusX,
      -22,
      Math.sin(solarSystemOrbitAngle) * orbitRadiusZ
    );
    solarSystemGroup.position.lerp(target, 0.018);
    solarSystemGroup.rotation.x = THREE.MathUtils.lerp(solarSystemGroup.rotation.x, GALACTIC_ECLIPTIC_TILT, 0.025);
    solarSystemGroup.rotation.y += delta * 0.018;
    solarSystemGroup.rotation.z = THREE.MathUtils.lerp(solarSystemGroup.rotation.z, GALACTIC_ECLIPTIC_ROLL, 0.025);
  } else {
    solarSystemGroup.position.lerp(new THREE.Vector3(0, 0, 0), 0.035);
    solarSystemGroup.rotation.x = THREE.MathUtils.lerp(solarSystemGroup.rotation.x, 0, 0.04);
    solarSystemGroup.rotation.y *= 0.985;
    solarSystemGroup.rotation.z = THREE.MathUtils.lerp(solarSystemGroup.rotation.z, 0, 0.04);
  }
}

function updateLabels() {
  const rect = canvas.getBoundingClientRect();
  const vector = new THREE.Vector3();
  const labelWorld = new THREE.Vector3();
  const occluders = [...planetObjects.values()].map((body) => body.mesh);
  labelObjects.forEach(({ label, mesh }, key) => {
    mesh.getWorldPosition(labelWorld);
    labelWorld.y += key === "sun" ? 5.6 : (planetObjects.get(key)?.radius || 1) + 1.2;
    vector.copy(labelWorld).project(camera);
    const x = (vector.x * 0.5 + 0.5) * rect.width;
    const y = (-vector.y * 0.5 + 0.5) * rect.height;
    const visible = vector.z < 1
      && x > -80
      && x < rect.width + 80
      && y > -40
      && y < rect.height + 40
      && !isLabelOccluded(labelWorld, mesh, occluders);
    label.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    label.style.opacity = visible ? "1" : "0";
  });
}

function isLabelOccluded(labelWorld, ownerMesh, occluders) {
  labelDirection.copy(labelWorld).sub(camera.position);
  const labelDistance = labelDirection.length();
  labelDirection.normalize();
  labelRaycaster.set(camera.position, labelDirection);
  labelRaycaster.far = labelDistance - 0.25;
  const hits = labelRaycaster.intersectObjects(occluders.filter((mesh) => mesh !== ownerMesh), true);
  return hits.length > 0;
}
