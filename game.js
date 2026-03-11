const STORAGE_KEY = "faith-flight-best";
const LEADERBOARD_KEY = "faith-flight-leaderboard";
const AUTH_SESSION_KEY = "faith-flight-auth-session";
const MAX_LEADERBOARD_ENTRIES = 10;
const CLOUD_LEADERBOARD_FETCH_LIMIT = 200;
const SUPABASE_URL = "https://ntbmkktrjwxcfrgohnha.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Ym1ra3Ryand4Y2ZyZ29obmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTc1OTYsImV4cCI6MjA4ODc5MzU5Nn0.hLKErva9m7LTWX9g9X8TCAzSgAWaL6SVlxR6H5KIHrM";
const SUPABASE_LEADERBOARD_TABLE = "leaderboard_scores";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const appRoot = document.getElementById("app");

const menuScreen = document.getElementById("menuScreen");
const characterScreen = document.getElementById("characterScreen");
const controlsPanel = document.getElementById("controlsPanel");
const leaderboardScreen = document.getElementById("leaderboardScreen");
const characterGrid = document.getElementById("characterGrid");

const toSelectBtn = document.getElementById("toSelectBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const playBtn = document.getElementById("playBtn");
const launchBtn = document.getElementById("launchBtn");
const restartBtn = document.getElementById("restartBtn");
const angleSlider = document.getElementById("angleSlider");
const powerSlider = document.getElementById("powerSlider");
const angleLabel = document.getElementById("angleLabel");
const powerLabel = document.getElementById("powerLabel");
const abilityHint = document.getElementById("abilityHint");
const distanceValue = document.getElementById("distanceValue");
const heightValue = document.getElementById("heightValue");
const highScoreValue = document.getElementById("highScoreValue");
const mapNameLabel = document.getElementById("mapNameLabel");
const runStateLabel = document.getElementById("runStateLabel");
const switchMapBtn = document.getElementById("switchMapBtn");

const playerNameInput = document.getElementById("playerNameInput");
const submitScoreBtn = document.getElementById("submitScoreBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const finalScore = document.getElementById("finalScore");
const leaderboardList = document.getElementById("leaderboardList");
const leaderboardTitle = document.getElementById("leaderboardTitle");
const leaderboardModeBtn = document.getElementById("leaderboardModeBtn");
const leaderboardModeLabel = document.getElementById("leaderboardModeLabel");
const accountEmailInput = document.getElementById("accountEmailInput");
const accountPasswordInput = document.getElementById("accountPasswordInput");
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const accountStatus = document.getElementById("accountStatus");

let authSession = null;
let leaderboardViewMode = "character";
let leaderboardRunCharacterId = "";
let leaderboardRunCharacterName = "";

const world = {
  width: 12000,
  launchX: 160,
  gravity: 1200,
  markersEvery: 100,
  maxCameraX: 0,
  bestDistance: Number(localStorage.getItem(STORAGE_KEY) || 0),
};

const ABILITY_COOLDOWN_SECONDS = 3;
const JJ_TRUCK_MAX = 2;
const JJ_TRUCK_REGEN_SECONDS = 3;
const JJ_JUMP_MAX = 1;
const JJ_JUMP_REGEN_SECONDS = 1;
const KADE_JUMP_RESET_SPEED = 100; // px/s — base speed after jump penalty
const KADE_ACCEL = 280;            // px/s² passive BMW acceleration
const KADE_MAX_SPEED = 5000;       // px/s top speed cap
const CALEB_JUMP_VY = 760;         // fixed jump strength (clears Hugh Henderson)
const CALEB_ACCEL = 190;           // px/s² passive T-Rex acceleration
const CALEB_MAX_SPEED = 3600;      // px/s top speed cap

// Sal (anthony) shrink-on-distance constants
const SAL_SHRINK_INTERVAL = 100;   // metres between each shrink
const SAL_RADIUS_START  = 34;
const SAL_RADIUS_MIN    = 12;
const SAL_DRAG_START    = 0.16;
const SAL_DRAG_MIN      = 0.028;
const SAL_GRAV_START    = 1.09;
const SAL_GRAV_MIN      = 0.72;
const SAL_SPEED_BONUS   = 55;      // px/s bonus per shrink stage

// Lincoln James — ADHD collector
const LINCOLN_ADHD_JUMP_BASE   = 480; // base jump vy
const LINCOLN_ADHD_JUMP_BONUS  = 18;  // extra vy per ADHD collected
const LINCOLN_ADHD_JUMP_MAX_VY = 1100; // cap
const LINCOLN_ADHD_IMMUNITY_THRESHOLD = 10; // ADHD needed for immunity
const LINCOLN_IMMUNITY_DURATION = 20; // seconds

// Luke Pueppke — Red Bull + Coffee collector
const LUKE_ITEM_JUMP_BASE   = 420; // base jump vx boost
const LUKE_ITEM_JUMP_BONUS  = 14;  // extra vx per item
const LUKE_ITEM_JUMP_MAX    = 960; // cap
const LUKE_SUPERSPEED_THRESHOLD = 20;
const LUKE_SUPERSPEED_VX        = 4200; // px/s during superspeed
const LUKE_SUPERSPEED_DURATION  = 8;    // seconds

const maps = [
  { id: "campus", name: "Campus" },
  { id: "town-square", name: "Town Square" },
];
let currentMapIndex = 0;
let townSquareMapImg = null;
const townSquareMapImageCandidates = [
  "Map 2 (Town Sqaure).png",
  "Map 2 (Town Square).png",
  "assets/images/town-square.png",
];

const characters = [
  {
    id: "manning",
    name: "Manning",
    trait: "Stable glide",
    bio: "Bigger but aerodynamic. Stable flight with strong carry.",
    imageBase: "assets/images/manning",
    initials: "M",
    mass: 1.1,
    radius: 28,
    drag: 0.068,
    bounce: 0.46,
    gravityMult: 0.96,
    launchBoost: 1.18,
    unlockAt: 0,
    ability: "fishingrod",
  },
  {
    id: "hunter",
    name: "Hunter",
    trait: "Texas Tech rocket",
    bio: "Mid-small build. Low drag and a floaty arc.",
    imageBase: "assets/images/hunter",
    initials: "H",
    mass: 0.82,
    radius: 23,
    drag: 0.068,
    bounce: 0.66,
    gravityMult: 0.89,
    launchBoost: 1.34,
    unlockAt: 0,
    ability: "rocket",
  },
  {
    id: "anthony",
    name: "Anthony",
    trait: "Shrinking speedster",
    bio: "Big body with huge launch carry. Every 100m he loses weight and shrinks, but gets faster and faster.",
    imageBase: "assets/images/anthony",
    initials: "A",
    mass: 1.8,
    radius: 34,
    drag: 0.16,
    bounce: 0.60,
    gravityMult: 1.09,
    launchBoost: 1.10,
    unlockAt: 0,
    ability: "slam",
  },
  {
    id: "nate",
    name: "Nate",
    trait: "Chaos mode",
    bio: "Tiny and light. Goes the farthest of anyone. Pure chaos.",
    imageBase: "assets/images/nate",
    initials: "N",
    mass: 0.58,
    radius: 20,
    drag: 0.062,
    bounce: 0.72,
    gravityMult: 0.88,
    launchBoost: 1.30,
    unlockAt: 0,
    ability: "warp",
  },
  {
    id: "spencer",
    name: "Spencer",
    trait: "Bomb sprinter",
    bio: "Starts fast. Space for jump, double-Space for bomb. Bombs destroy Hugh Henderson but slow him down.",
    imageBase: "Spencer",
    initials: "S",
    mass: 1.82,
    radius: 38,
    drag: 0.06,
    bounce: 0.56,
    gravityMult: 0.90,
    launchBoost: 1.38,
    unlockAt: 0,
    ability: "jumpbomb",
  },
  {
    id: "eli",
    name: "Eli Ailshie",
    trait: "Backflip master",
    bio: "Nimble acrobat. Backflips on every bounce. Space for powered backflip — can do 2 per airtime!",
    imageBase: "Eli Ailshie",
    initials: "E",
    mass: 0.72,
    radius: 22,
    drag: 0.068,
    bounce: 0.56,
    gravityMult: 0.86,
    launchBoost: 1.28,
    unlockAt: 0,
    ability: "backflip",
  },
  {
    id: "candyjew",
    name: "Taylor",
    trait: "Sugar overdrive",
    bio: "Collect candies to get faster. Every 10 candies triggers rainbow beam overdrive.",
    imageBase: "Candy Jew",
    initials: "C",
    mass: 0.92,
    radius: 36,
    drag: 0.11,
    bounce: 0.58,
    gravityMult: 0.98,
    launchBoost: 1.08,
    unlockAt: 0,
    ability: "dunk",
  },
  {
    id: "brayden",
    name: "Brayden Voth",
    trait: "Tennis chaos",
    bio: "Collect beers. Every 5 beers starts spin mode with infinite jumps for 7.5s. At 20 beers, you die.",
    imageBase: "Brayden Voth",
    initials: "B",
    mass: 1.25,
    radius: 32,
    drag: 0.11,
    bounce: 0.48,
    gravityMult: 1.03,
    launchBoost: 1.14,
    unlockAt: 0,
    ability: "tennis",
  },
  {
    id: "reed",
    name: "Reed Blair",
    trait: "Cheeseburger gas boost",
    bio: "Press Space for a fart jump. Every 5 cheeseburgers launches him to the sky.",
    imageBase: "Reed Blair",
    initials: "R",
    mass: 1.05,
    radius: 31,
    drag: 0.09,
    bounce: 0.57,
    gravityMult: 0.94,
    launchBoost: 1.16,
    unlockAt: 0,
    ability: "fartpassive",
  },
  {
    id: "jackson",
    name: "Jackson",
    trait: "Truck + sky smash",
    bio: "Space uses truck boost. Every 10 footballs launches sky-smash on Hugh Henderson (max 5 per run).",
    imageBase: "Jackson",
    initials: "J",
    mass: 1.35,
    radius: 34,
    drag: 0.115,
    bounce: 0.50,
    gravityMult: 0.98,
    launchBoost: 1.06,
    unlockAt: 0,
    ability: "truck",
  },
  {
    id: "myer",
    name: "Myer the Leprechaun",
    trait: "Rainbow bounce luck",
    bio: "Space jumps upward. Every bounce leaves a rainbow trail, and every 10 Lucky Charms trigger a rainbow launch.",
    imageBase: "Myer",
    initials: "ML",
    mass: 0.84,
    radius: 27,
    drag: 0.082,
    bounce: 0.68,
    gravityMult: 0.9,
    launchBoost: 1.24,
    unlockAt: 0,
    ability: "leprejump",
  },
  {
    id: "jjfootballboss",
    name: "JJFootballBoss",
    trait: "Rolling growth machine",
    bio: "Roll over needles to get bigger and faster. Space uses truck boost. Double-Space for a jump.",
    imageBase: "JJFOOTBALLBOSS",
    initials: "JJ",
    mass: 1.22,
    radius: 30,
    drag: 0.082,
    bounce: 0.64,
    gravityMult: 0.94,
    launchBoost: 1.18,
    unlockAt: 0,
    ability: "truck",
  },
  {
    id: "kaderess",
    name: "Kade Ress",
    trait: "BMW throttle",
    bio: "His BMW accelerates faster and faster — but every jump resets speed to 10 mph. Build that speed!",
    imageBase: "Kade Ress",
    initials: "KR",
    mass: 1.55,
    radius: 34,
    drag: 0.028,
    bounce: 0.52,
    gravityMult: 0.96,
    launchBoost: 1.16,
    unlockAt: 0,
    ability: "bmwjump",
  },
  {
    id: "calebparker",
    name: "Caleb Parker",
    trait: "T-Rex rider",
    bio: "Rides a T-Rex that gets faster and faster. Space does a fixed-height jump high enough to clear Hugh Henderson.",
    imageBase: "Caleb Parker",
    initials: "CP",
    mass: 1.44,
    radius: 33,
    drag: 0.022,
    bounce: 0.56,
    gravityMult: 0.94,
    launchBoost: 1.22,
    unlockAt: 0,
    ability: "trexjump",
  },
  {
    id: "lincolnjames",
    name: "Lincoln James",
    trait: "ADHD hyperfocus",
    bio: "Collect ADHD to jump higher and faster. Collect 10 ADHD for 20s immunity to Hugh Henderson!",
    imageBase: "Lincoln James",
    initials: "LJ",
    mass: 0.88,
    radius: 24,
    drag: 0.076,
    bounce: 0.68,
    gravityMult: 0.91,
    launchBoost: 1.24,
    unlockAt: 0,
    ability: "lincolnjump",
  },
  {
    id: "lukepueppke",
    name: "Luke Pueppke",
    trait: "Caffeine rocket",
    bio: "Collect Red Bull & Coffee to jump further and faster. 20 items = SUPERSPEED for 8 seconds!",
    imageBase: "Luke Pueppke",
    initials: "LP",
    mass: 0.95,
    radius: 25,
    drag: 0.072,
    bounce: 0.62,
    gravityMult: 0.92,
    launchBoost: 1.26,
    unlockAt: 0,
    ability: "lukejump",
  },
];

let selectedCharacter = characters[0];
let cameraX = 0;
let particles = [];
let impactBursts = [];
let screenShakeTime = 0;
let screenShakeStrength = 0;
let screenShakeX = 0;
let screenShakeY = 0;
let lastSpaceTime = 0;
let pendingSpencerJumpTimeout = null;
let lastMouseX = canvas.width / 2;
let lastMouseY = canvas.height / 2;
let bombs = [];
let tennisBalls = [];
const destroyedJanets = new Set();

// Slingshot drag state
let isDragging = false;
let dragStart = null;
let launchVector = null;
const trajectoryDots = [];
const MAX_DRAG_DISTANCE = 300;
const DRAG_POWER_SCALE = 11;

const actor = {
  x: world.launchX,
  y: 0,
  vx: 0,
  vy: 0,
  radius: 26,
  mass: 1,
  drag: 0.13,
  bounce: 0.88,
  gravityMult: 1.0,
  state: "ready",
  maxX: world.launchX,
  usedAbility: false,
  abilityCooldown: 0,
  stoppedTimer: 0,
  truckCount: 3,
  isTrucking: false,
  truckTimer: 0,
  spencerBombsUsed: 0,
  backflipRotation: 0,
  backflipActive: false,
  eliFlipsUsed: 0,
  overdriveDunksLeft: 0,
  candyDunkCount: 0,
  candyOverdrivesUsed: 0,
  beerCount: 0,
  beerRageTimer: 0,
  burgerCount: 0,
  jacksonFootballCount: 0,
  jacksonSkySmashesUsed: 0,
  jacksonSkyModeTimer: 0,
  jacksonDiveActive: false,
  jacksonDiveDelay: 0,
  jacksonDiveTargetIndex: null,
  myerPotCount: 0,
  myerRainbowBoostTimer: 0,
  myerTrailTimer: 0,
  jjNeedleCount: 0,
  jjRollAngle: 0,
  salShrinkStage: 0,
  jjTruckRegenTimer: 0,
  jjJumpRegenTimer: 0,
  jjJumpCharges: 1,
  kadeSpeed: KADE_JUMP_RESET_SPEED,
  kadeSlowdownPending: false,
  calebSpeed: KADE_JUMP_RESET_SPEED,
  lincolnAdhd: 0,
  lincolnImmunityTimer: 0,
  lukeItemCount: 0,
  lukeSuperspeedTimer: 0,
};

const obstacles = [];
const confetti = [];

const bouncePadCache = new Map();
const janetCache = new Map();
const candyCache = new Map();
const beerCache = new Map();
const burgerCache = new Map();
const footballCache = new Map();
const potGoldCache = new Map();
const needleCache = new Map();
const collectedCandies = new Set();
const collectedBeers = new Set();
const collectedBurgers = new Set();
const collectedFootballs = new Set();
const collectedPots = new Set();
const collectedNeedles = new Set();

const JANET_BASE = {
  w: 56,
  h: 58,
  color: "#ffe0ea",
  label: "Hugh Henderson",
  fatal: true,
};

const fatalObstacleImageCandidates = [
  "Obstacle Hugh Henderson.jpeg",
  "Obstacle Hugh Henderson.png",
  "Obstacle TB.png",
  "assets/images/obstacle-hugh-henderson.png",
  "assets/images/obstacle-hugh-henderson.jpg",
  "assets/images/obstacle-tb.png",
  "assets/images/obstacle-tb.jpg",
  "assets/images/front-office.png",
  "assets/images/front-office.jpg",
  "assets/images/front-office-portrait.png",
  "assets/images/front-office-portrait.jpg",
  "assets/images/office-obstacle.png",
  "assets/images/office-obstacle.jpg",
  "front-office.png",
  "front-office.jpg",
  "office-obstacle.png",
  "office-obstacle.jpg",
];

let fatalObstacleImg = null;
let spencerBombImg = null;
let manningFishingRodImg = null;
let braydenBeerImg = null;
let braydenRacketImg = null;
let tennisBallImg = null;
let reedBurgerImg = null;
let jacksonFootballImg = null;
let myerPotGoldImg = null;
let jjNeedleImg = null;
const candyImgs = [];

let kadeBMWImg = null;
let calebTrexImg = null;
let lincolnAdhdImg = null;
let lukeRedBullImg = null;
let lukeCoffeeImg = null;


const spencerBombImageCandidates = [
  "characters props/Spencers Bomb.png",
  "Spencers Bomb.png",
  "assets/images/spencers-bomb.png",
  "assets/images/spencer-bomb.png",
  "assets/images/spencers-bomb.jpg",
  "assets/images/spencer-bomb.jpg",
];

const manningFishingRodImageCandidates = [
  "characters props/Mannings Fishing Rod.png",
  "Mannings Fishing Rod.png",
  "assets/images/mannings-fishing-rod.png",
  "assets/images/manning-fishing-rod.png",
  "assets/images/mannings-fishing-rod.jpg",
  "assets/images/manning-fishing-rod.jpg",
];

const candyImageCandidates = [
  "characters props/Candy Jew Candy.png",
  "characters props/Candy Jew Candy 2.png",
  "characters props/Candy Jew Candy 3.png",
  "characters props/Candy Jew Candy 4.png",
  "characters props/Candy Jew Candy 5.png",
  "characters props/Candy Jew Candy 6.png",
];

const braydenBeerImageCandidates = [
  "characters props/Brayden Beer Prop.png",
  "characters props/Brayen Beer Prop.png",
  "Brayden Beer Prop.png",
  "Brayen Beer Prop.png",
];

const braydenRacketImageCandidates = [
  "characters props/Brayden Tennis Raqet.png",
  "characters props/Brayden Tennis Racket.png",
  "characters props/Brayden Tennis.png",
  "Brayden Tennis Raqet.png",
  "Brayden Tennis Racket.png",
  "Brayden Tennis.png",
];

const tennisBallImageCandidates = [
  "characters props/Brayden Tennis ball.webp",
  "characters props/Brayden Tennis Ball.webp",
  "characters props/Brayden Tennis ball.png",
  "characters props/Brayden Tennis Ball.png",
  "Brayden Tennis ball.webp",
  "Brayden Tennis Ball.webp",
];

const reedBurgerImageCandidates = [
  "characters props/Reed Blair Cheese Burger.webp",
  "characters props/Reedblair cheeseburger.png",
  "characters props/Reed Blair Cheeseburger.png",
  "characters props/Reed Blair Cheeseburger.webp",
  "Reedblair cheeseburger.png",
  "Reed Blair Cheese Burger.webp",
  "Reed Blair Cheeseburger.webp",
  "Reed Blair Cheeseburger.png",
];

const jacksonFootballImageCandidates = [
  "characters props/Jacksons Football.png",
  "Jacksons Football.png",
  "assets/images/jackson-football.png",
  "assets/images/football.png",
];

const myerPotGoldImageCandidates = [
  "characters props/Myers Lucky Charms.jpg",
  "characters props/Myers Lucky Charms.png",
  "Myers Lucky Charms.jpg",
  "characters props/Myers Pot of gold.png",
  "characters props/Myers Pot Of Gold.png",
  "Myers Pot of gold.png",
  "assets/images/myers-pot-of-gold.png",
];

const jjNeedleImageCandidates = [
  "characters props/JJFOOTBALLBOSSNEEDLE.png",
  "JJFOOTBALLBOSSNEEDLE.png",
  "assets/images/jjfootballbossneedle.png",
];

const lincolnAdhdImageCandidates = [
  "characters props/Lincolns ADHD.png",
  "Lincolns ADHD.png",
];

const lukeRedBullImageCandidates = [
  "characters props/Lukes Redbull.png",
  "Lukes Redbull.png",
];

const lukeCoffeeImageCandidates = [
  "characters props/Lukes Coffe.png",
  "characters props/Lukes Coffee.png",
  "Lukes Coffe.png",
];


function encodeAssetPath(path) {
  return path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}

function buildSiteAssetUrl(path) {
  const encoded = encodeAssetPath(path);
  const pathname = window.location.pathname || "/";
  const baseDir = pathname.endsWith("/")
    ? pathname
    : pathname.slice(0, pathname.lastIndexOf("/") + 1);
  return `${baseDir}${encoded}`;
}

function seededNoise(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function createBouncePad(index) {
  const baseX = 1100 + index * 980;
  const offset = Math.floor(seededNoise(index + 1) * 280);
  const width = 74 + Math.floor(seededNoise(index + 2) * 32);
  const yOffset = 8 + Math.floor(seededNoise(index + 3) * 8);
  const boost = 1.28 + seededNoise(index + 4) * 0.42;

  return {
    x: baseX + offset,
    yOffset,
    w: width,
    h: 14,
    boost,
    color: "#ff7aa8",
  };
}

function getBouncePad(index) {
  if (!bouncePadCache.has(index)) {
    bouncePadCache.set(index, createBouncePad(index));
  }
  return bouncePadCache.get(index);
}

function getBouncePadsInRange(startX, endX) {
  const firstIndex = Math.max(0, Math.floor((startX - 1100) / 980) - 1);
  const lastIndex = Math.max(firstIndex, Math.floor((endX - 1100) / 980) + 1);
  const pads = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const pad = getBouncePad(index);
    if (pad.x + pad.w >= startX && pad.x <= endX) {
      pads.push(pad);
    }
  }

  return pads;
}

function createJanet(index) {
  const spacing = 1700;
  const startX = 3000;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 201) * 460) - 120;
  const yOffset = 58 + Math.floor(seededNoise(index + 202) * 16);

  return {
    index,
    x: baseX + offset,
    yOffset,
    w: JANET_BASE.w,
    h: JANET_BASE.h,
    color: JANET_BASE.color,
    label: JANET_BASE.label,
    fatal: true,
  };
}

function getJanet(index) {
  if (!janetCache.has(index)) {
    janetCache.set(index, createJanet(index));
  }
  return janetCache.get(index);
}

function getJanetsInRange(startX, endX) {
  const spacing = 1700;
  const startXBase = 3000;
  const firstIndex = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const lastIndex = Math.max(firstIndex, Math.floor((endX - startXBase) / spacing) + 1);
  const janets = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const janet = getJanet(index);
    if (destroyedJanets.has(janet.index)) continue;
    if (janet.x + janet.w >= startX && janet.x <= endX) {
      janets.push(janet);
    }
  }

  return janets;
}

function createCandy(index) {
  const spacing = 240;
  const startX = 700;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 501) * 180) - 60;
  const yOffset = 95 + Math.floor(seededNoise(index + 502) * 34);
  const variant = index % candyImageCandidates.length;

  return {
    index,
    x: baseX + offset,
    yOffset,
    r: 13,
    variant,
  };
}

function getCandy(index) {
  if (!candyCache.has(index)) {
    candyCache.set(index, createCandy(index));
  }
  return candyCache.get(index);
}

function getCandiesInRange(startX, endX) {
  const spacing = 240;
  const startXBase = 700;
  const firstIndex = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const lastIndex = Math.max(firstIndex, Math.floor((endX - startXBase) / spacing) + 2);
  const candies = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const candy = getCandy(index);
    if (collectedCandies.has(candy.index)) continue;
    if (candy.x + candy.r >= startX && candy.x - candy.r <= endX) {
      candies.push(candy);
    }
  }

  return candies;
}

function createBeer(index) {
  const spacing = 360;
  const startX = 1000;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 701) * 220) - 80;
  const yOffset = 98 + Math.floor(seededNoise(index + 702) * 30);

  return {
    index,
    x: baseX + offset,
    yOffset,
    r: 14,
  };
}

function getBeer(index) {
  if (!beerCache.has(index)) {
    beerCache.set(index, createBeer(index));
  }
  return beerCache.get(index);
}

function getBeersInRange(startX, endX) {
  const spacing = 360;
  const startXBase = 1000;
  const firstIndex = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const lastIndex = Math.max(firstIndex, Math.floor((endX - startXBase) / spacing) + 2);
  const beers = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const beer = getBeer(index);
    if (collectedBeers.has(beer.index)) continue;
    if (beer.x + beer.r >= startX && beer.x - beer.r <= endX) {
      beers.push(beer);
    }
  }

  return beers;
}

function createBurger(index) {
  const spacing = 320;
  const startX = 900;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 801) * 210) - 70;
  const yOffset = 105 + Math.floor(seededNoise(index + 802) * 26);

  return {
    index,
    x: baseX + offset,
    yOffset,
    r: 14,
  };
}

function getBurger(index) {
  if (!burgerCache.has(index)) {
    burgerCache.set(index, createBurger(index));
  }
  return burgerCache.get(index);
}

function getBurgersInRange(startX, endX) {
  const spacing = 320;
  const startXBase = 900;
  const firstIndex = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const lastIndex = Math.max(firstIndex, Math.floor((endX - startXBase) / spacing) + 2);
  const burgers = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const burger = getBurger(index);
    if (collectedBurgers.has(burger.index)) continue;
    if (burger.x + burger.r >= startX && burger.x - burger.r <= endX) {
      burgers.push(burger);
    }
  }

  return burgers;
}

function createFootball(index) {
  const spacing = 300;
  const startX = 1050;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 901) * 210) - 70;
  const yOffset = 110 + Math.floor(seededNoise(index + 902) * 28);

  return {
    index,
    x: baseX + offset,
    yOffset,
    r: 14,
  };
}

function getFootball(index) {
  if (!footballCache.has(index)) {
    footballCache.set(index, createFootball(index));
  }
  return footballCache.get(index);
}

function getFootballsInRange(startX, endX) {
  const spacing = 300;
  const startXBase = 1050;
  const firstIndex = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const lastIndex = Math.max(firstIndex, Math.floor((endX - startXBase) / spacing) + 2);
  const footballs = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const football = getFootball(index);
    if (collectedFootballs.has(football.index)) continue;
    if (football.x + football.r >= startX && football.x - football.r <= endX) {
      footballs.push(football);
    }
  }

  return footballs;
}

function createPotGold(index) {
  const spacing = 280;
  const startX = 960;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 951) * 220) - 80;
  const yOffset = 112 + Math.floor(seededNoise(index + 952) * 32);

  return {
    index,
    x: baseX + offset,
    yOffset,
    r: 16,
  };
}

function getPotGold(index) {
  if (!potGoldCache.has(index)) {
    potGoldCache.set(index, createPotGold(index));
  }
  return potGoldCache.get(index);
}

function getPotsGoldInRange(startX, endX) {
  const spacing = 280;
  const startXBase = 960;
  const firstIndex = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const lastIndex = Math.max(firstIndex, Math.floor((endX - startXBase) / spacing) + 2);
  const pots = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const pot = getPotGold(index);
    if (collectedPots.has(pot.index)) continue;
    if (pot.x + pot.r >= startX && pot.x - pot.r <= endX) {
      pots.push(pot);
    }
  }

  return pots;
}

function createNeedle(index) {
  const spacing = 300;
  const startX = 980;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 1001) * 210) - 80;
  const yOffset = 108 + Math.floor(seededNoise(index + 1002) * 36);

  return {
    index,
    x: baseX + offset,
    yOffset,
    r: 13,
  };
}

function getNeedle(index) {
  if (!needleCache.has(index)) {
    needleCache.set(index, createNeedle(index));
  }
  return needleCache.get(index);
}

function getNeedlesInRange(startX, endX) {
  const spacing = 300;
  const startXBase = 980;
  const firstIndex = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const lastIndex = Math.max(firstIndex, Math.floor((endX - startXBase) / spacing) + 2);
  const needles = [];

  for (let index = firstIndex; index <= lastIndex; index += 1) {
    const needle = getNeedle(index);
    if (collectedNeedles.has(needle.index)) continue;
    if (needle.x + needle.r >= startX && needle.x - needle.r <= endX) {
      needles.push(needle);
    }
  }

  return needles;
}

// ── Lincoln: ADHD pills ───────────────────────────────────────────────────────
const lincolnAdhdCache = new Map();
const collectedLincolnAdhd = new Set();

function createLincolnAdhd(index) {
  const spacing = 320;
  const startX = 800;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 1101) * 200) - 80;
  const yOffset = 100 + Math.floor(seededNoise(index + 1102) * 32);
  return { index, x: baseX + offset, yOffset, r: 13 };
}

function getLincolnAdhd(index) {
  if (!lincolnAdhdCache.has(index)) lincolnAdhdCache.set(index, createLincolnAdhd(index));
  return lincolnAdhdCache.get(index);
}

function getLincolnAdhdInRange(startX, endX) {
  const spacing = 320, startXBase = 800;
  const first = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const last  = Math.max(first, Math.floor((endX - startXBase) / spacing) + 2);
  const items = [];
  for (let i = first; i <= last; i++) {
    const a = getLincolnAdhd(i);
    if (collectedLincolnAdhd.has(a.index)) continue;
    if (a.x + a.r >= startX && a.x - a.r <= endX) items.push(a);
  }
  return items;
}

// ── Luke: Red Bull cans ───────────────────────────────────────────────────────
const lukeRedBullCache = new Map();
const collectedLukeRedBull = new Set();

function createLukeRedBull(index) {
  const spacing = 400;
  const startX = 900;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 1201) * 220) - 80;
  const yOffset = 105 + Math.floor(seededNoise(index + 1202) * 28);
  return { index, x: baseX + offset, yOffset, r: 14 };
}

function getLukeRedBull(index) {
  if (!lukeRedBullCache.has(index)) lukeRedBullCache.set(index, createLukeRedBull(index));
  return lukeRedBullCache.get(index);
}

function getLukeRedBullInRange(startX, endX) {
  const spacing = 400, startXBase = 900;
  const first = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const last  = Math.max(first, Math.floor((endX - startXBase) / spacing) + 2);
  const items = [];
  for (let i = first; i <= last; i++) {
    const rb = getLukeRedBull(i);
    if (collectedLukeRedBull.has(rb.index)) continue;
    if (rb.x + rb.r >= startX && rb.x - rb.r <= endX) items.push(rb);
  }
  return items;
}

// ── Luke: Coffee cups ─────────────────────────────────────────────────────────
const lukeCoffeeCache = new Map();
const collectedLukeCoffee = new Set();

function createLukeCoffee(index) {
  const spacing = 440;
  const startX = 1100;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 1301) * 210) - 80;
  const yOffset = 102 + Math.floor(seededNoise(index + 1302) * 30);
  return { index, x: baseX + offset, yOffset, r: 14 };
}

function getLukeCoffee(index) {
  if (!lukeCoffeeCache.has(index)) lukeCoffeeCache.set(index, createLukeCoffee(index));
  return lukeCoffeeCache.get(index);
}

function getLukeCoffeeInRange(startX, endX) {
  const spacing = 440, startXBase = 1100;
  const first = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const last  = Math.max(first, Math.floor((endX - startXBase) / spacing) + 2);
  const items = [];
  for (let i = first; i <= last; i++) {
    const c = getLukeCoffee(i);
    if (collectedLukeCoffee.has(c.index)) continue;
    if (c.x + c.r >= startX && c.x - c.r <= endX) items.push(c);
  }
  return items;
}



function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function tone(freq, duration = 0.09, type = "sine", volume = 0.08) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

function terrainY(x) {
  const base = 560;
  return (
    base
    - Math.sin(x * 0.0022) * 90
    - Math.sin((x + 300) * 0.0065) * 45
    - Math.max(0, Math.sin((x - 700) * 0.0014)) * 55
  );
}

function resetActor() {
  const forkY = terrainY(world.launchX) - 70;

  applyCharacterStats(selectedCharacter);

  actor.x = world.launchX;
  actor.y = forkY;
  actor.vx = 0;
  actor.vy = 0;
  actor.state = "ready";
  actor.usedAbility = false;
  actor.abilityCooldown = 0;
  actor.stoppedTimer = 0;
  actor.maxX = world.launchX;
  actor.truckCount = selectedCharacter.id === "jackson"
    ? 25
    : selectedCharacter.id === "jjfootballboss"
      ? JJ_TRUCK_MAX
      : 3;
  actor.isTrucking = false;
  actor.truckTimer = 0;
  actor.rocketSpiked = false;
  actor.spencerBombsUsed = 0;
  actor.backflipRotation = 0;
  actor.backflipActive = false;
  actor.eliFlipsUsed = 0;
  actor.candyCount = 0;
  actor.candySpeedBonus = 0;
  actor.rainbowModeTimer = 0;
  actor.rainbowBeamTimer = 0;
  actor.overdriveDunksLeft = 0;
  actor.candyDunkCount = 0;
  actor.candyOverdrivesUsed = 0;
  actor.beerCount = 0;
  actor.beerRageTimer = 0;
  actor.burgerCount = 0;
  actor.jacksonFootballCount = 0;
  actor.jacksonSkySmashesUsed = 0;
  actor.jacksonSkyModeTimer = 0;
  actor.jacksonDiveActive = false;
  actor.jacksonDiveDelay = 0;
  actor.jacksonDiveTargetIndex = null;
  actor.myerPotCount = 0;
  actor.myerRainbowBoostTimer = 0;
  actor.myerTrailTimer = 0;
  actor.jjNeedleCount = 0;
  actor.jjRollAngle = 0;
  actor.salShrinkStage = 0;
  actor.jjTruckRegenTimer = JJ_TRUCK_REGEN_SECONDS;
  actor.jjJumpRegenTimer = JJ_JUMP_REGEN_SECONDS;
  actor.jjJumpCharges = JJ_JUMP_MAX;
  actor.kadeSpeed = KADE_JUMP_RESET_SPEED;
  actor.kadeSlowdownPending = false;
  actor.calebSpeed = KADE_JUMP_RESET_SPEED;
  actor.lincolnAdhd = 0;
  actor.lincolnImmunityTimer = 0;
  actor.lukeItemCount = 0;
  actor.lukeSuperspeedTimer = 0;
  cameraX = 0;
  particles.length = 0;
  impactBursts.length = 0;
  bombs.length = 0;
  tennisBalls.length = 0;
  destroyedJanets.clear();
  collectedCandies.clear();
  collectedBeers.clear();
  collectedBurgers.clear();
  collectedFootballs.clear();
  collectedPots.clear();
  collectedNeedles.clear();
  collectedLincolnAdhd.clear();
  collectedLukeRedBull.clear();
  collectedLukeCoffee.clear();
  if (pendingSpencerJumpTimeout) {
    clearTimeout(pendingSpencerJumpTimeout);
    pendingSpencerJumpTimeout = null;
  }

  // Clear drag state
  isDragging = false;
  dragStart = null;
  launchVector = null;
  trajectoryDots.length = 0;

  runStateLabel.textContent = "Click and drag to aim";
  launchBtn.disabled = false;
  if (heightValue) {
    heightValue.textContent = "0";
  }
  updateAbilityHint();
}

function updateHeightUI() {
  if (!heightValue) return;
  const currentHeight = Math.max(0, (terrainY(actor.x) - (actor.y + actor.radius)) / 10);
  heightValue.textContent = currentHeight.toFixed(1);
}

function applyCharacterStats(character) {
  actor.radius    = character.radius;
  actor.mass      = character.mass;
  actor.drag      = character.drag;
  actor.bounce    = character.bounce;
  actor.gravityMult = character.gravityMult;
}

function spawnParticles(x, y, count, color = "#fff") {
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 250,
      vy: -Math.random() * 240,
      life: 0.6 + Math.random() * 0.6,
      size: 2 + Math.random() * 4,
      color,
    });
  }
}

function updateParticles(dt) {
  particles.forEach((p) => {
    p.life -= dt;
    p.vy += 480 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  });
  particles = particles.filter((p) => p.life > 0);
}

function spawnImpactBurst(x, y, intensity = 1) {
  impactBursts.push({
    x,
    y,
    life: 0.42,
    maxLife: 0.42,
    radius: 16,
    maxRadius: 72 + intensity * 24,
  });

  spawnParticles(x, y, Math.round(22 + intensity * 10), "#ff9b72");
  spawnParticles(x, y, Math.round(14 + intensity * 8), "#ffd86a");
  tone(95, 0.09, "sawtooth", 0.09);
  tone(145, 0.07, "triangle", 0.07);
}

function triggerConfetti() {
  // Create confetti particles at random positions across the canvas
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * canvas.width;
    const y = -20 - Math.random() * 50;
    const vx = (Math.random() - 0.5) * 400;
    const vy = Math.random() * 200 + 150;
    const colors = ["#ff7d5f", "#5f7bff", "#ffd180", "#80ff8f", "#ff80e0"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotation = Math.random() * Math.PI * 2;
    const rotVel = (Math.random() - 0.5) * 12;
    
    confetti.push({
      x, y, vx, vy, color, rotation, rotVel,
      life: 2.5,
      maxLife: 2.5,
      size: Math.random() * 6 + 4
    });
  }
}

function updateConfetti(dt) {
  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.x += c.vx * dt;
    c.y += c.vy * dt;
    c.rotation += c.rotVel * dt;
    c.vy += 800 * dt; // gravity
    c.life -= dt;
    
    if (c.life <= 0) {
      confetti.splice(i, 1);
    }
  }
}

function drawConfetti() {
  confetti.forEach(c => {
    const alpha = Math.max(0, c.life / c.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rotation);
    
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
    
    ctx.restore();
  });
}

function updateImpactBursts(dt) {
  impactBursts.forEach((b) => {
    b.life -= dt;
    const t = Math.max(0, 1 - b.life / b.maxLife);
    b.radius = b.maxRadius * t;
  });
  impactBursts = impactBursts.filter((b) => b.life > 0);
}

function startScreenShake(strength = 8, duration = 0.24) {
  screenShakeStrength = Math.max(screenShakeStrength, strength);
  screenShakeTime = Math.max(screenShakeTime, duration);
}

function triggerCandyOverdrive() {
  if (actor.candyOverdrivesUsed >= 10) return;
  actor.candyOverdrivesUsed += 1;
  actor.rainbowModeTimer = 6.0;
  actor.rainbowBeamTimer = 1.0;
  actor.overdriveDunksLeft = 5;
  actor.vy -= 420;
  actor.vx += 80;
  startScreenShake(14, 0.35);
  tone(740, 0.08, "triangle", 0.09);
  tone(910, 0.08, "triangle", 0.08);
  spawnParticles(actor.x, actor.y, 40, "#ffffff");
}

function triggerBeerRage() {
  actor.beerRageTimer = 7.5;
  actor.vy -= 260;
  actor.vx += 140;
  startScreenShake(10, 0.28);
  tone(260, 0.08, "square", 0.08);
  tone(330, 0.07, "sawtooth", 0.07);
  spawnParticles(actor.x, actor.y, 26, "#ffd27a");
}

function triggerReedBasicFartJump() {
  actor.vy -= 620;
  actor.vx += 120;
  tone(120, 0.05, "sawtooth", 0.06);
  spawnParticles(actor.x, actor.y + actor.radius * 0.5, 20, "#6b3e1f");
}

function triggerReedSkyLaunch() {
  actor.vy -= 1450;
  actor.vx += 320;
  startScreenShake(14, 0.36);
  tone(140, 0.09, "sawtooth", 0.09);
  tone(95, 0.08, "triangle", 0.08);
  spawnParticles(actor.x, actor.y + actor.radius * 0.5, 54, "#6b3e1f");
  spawnParticles(actor.x, actor.y + actor.radius * 0.5, 34, "#8c5a2e");
}

function findNearestHughAhead() {
  const candidates = getJanetsInRange(actor.x + 20, actor.x + 3600);
  if (!candidates.length) return null;
  let best = null;
  let bestDist = Infinity;
  candidates.forEach((hugh) => {
    const cx = hugh.x + hugh.w * 0.5;
    const dist = cx - actor.x;
    if (dist > 0 && dist < bestDist) {
      bestDist = dist;
      best = hugh;
    }
  });
  return best;
}

function triggerJacksonSkySmash() {
  if (actor.jacksonSkySmashesUsed >= 5) return;
  actor.jacksonSkySmashesUsed += 1;
  actor.jacksonSkyModeTimer = 5.0;
  actor.jacksonDiveActive = false;
  actor.jacksonDiveTargetIndex = null;
  actor.vy -= 1350;
  actor.vx += 260;
  startScreenShake(14, 0.36);
  spawnParticles(actor.x, actor.y, 48, "#f4d03f");
  tone(170, 0.08, "square", 0.08);
}

function spawnMyerRainbowTrail(strength = 1) {
  const colors = ["#ff4f7d", "#ff9f40", "#ffe45e", "#5cff7a", "#53a7ff", "#c47bff"];
  colors.forEach((color, index) => {
    particles.push({
      x: actor.x - 10 + index * 4,
      y: actor.y + actor.radius * 0.45,
      vx: -120 - Math.random() * 160,
      vy: -60 + index * 12 - Math.random() * 60,
      life: 0.38 + Math.random() * 0.28,
      size: 3 + Math.random() * 2 + strength,
      color,
    });
  });
}

function triggerMyerRainbowBoost() {
  actor.myerRainbowBoostTimer = 2.6;
  actor.myerTrailTimer = Math.max(actor.myerTrailTimer, 1.2);
  actor.vy -= 1180;
  actor.vx += 180;
  startScreenShake(12, 0.3);
  tone(760, 0.09, "triangle", 0.08);
  tone(960, 0.08, "triangle", 0.07);
  spawnParticles(actor.x, actor.y, 24, "#ffffff");
  spawnMyerRainbowTrail(2.2);
}

function updateScreenShake(dt) {
  const spinActive = selectedCharacter.id === "brayden" && actor.beerRageTimer > 0 && actor.state !== "ended";
  const spinDeg = spinActive ? (performance.now() * 0.38) % 360 : 0;

  if (screenShakeTime <= 0) {
    screenShakeX = 0;
    screenShakeY = 0;
    if (appRoot) {
      appRoot.style.transform = spinActive ? `rotate(${spinDeg}deg)` : "";
    }
    return;
  }

  screenShakeTime = Math.max(0, screenShakeTime - dt);
  // Hold full amplitude then quick taper at the very end
  const decay = Math.min(1, screenShakeTime * 7);
  const amplitude = screenShakeStrength * decay;
  screenShakeX = (Math.random() * 2 - 1) * amplitude;
  screenShakeY = (Math.random() * 2 - 1) * amplitude * 0.8;
  const rotDeg = (Math.random() * 2 - 1) * (amplitude * 0.15);

  if (appRoot) {
    appRoot.style.transform = `translate(${screenShakeX}px, ${screenShakeY}px) rotate(${rotDeg + spinDeg}deg)`;
  }

  if (screenShakeTime <= 0) {
    screenShakeStrength = 0;
    if (appRoot) appRoot.style.transform = "";
  }
}

function launch() {
  if (actor.state !== "ready" || !launchVector) return;
  ensureAudio();
  actor.vx = launchVector.vx * selectedCharacter.launchBoost;
  actor.vy = launchVector.vy * selectedCharacter.launchBoost;
  actor.state = "flying";
  actor.usedAbility = false;
  actor.stoppedTimer = 0;
  runStateLabel.textContent = "In flight...";
  tone(170, 0.12, "triangle", 0.14);
  tone(250, 0.1, "triangle", 0.1);
  spawnParticles(actor.x, actor.y, 26, "#ffe59a");
  
  // Clear trajectory and launch vector
  trajectoryDots.length = 0;
  launchVector = null;
}

function startNextRunSameCharacter() {
  leaderboardScreen.classList.remove("active");
  menuScreen.classList.remove("active");
  characterScreen.classList.remove("active");
  controlsPanel.classList.remove("hidden");
  applyCharacterStats(selectedCharacter);
  resetActor();
  distanceValue.textContent = "0";
  updateHeightUI();
}



function finishRun(message = "Run ended: no movement left. Press Restart Run.") {
  runStateLabel.textContent = message;
  launchBtn.disabled = true;
  actor.state = "ended";
  actor.vx = 0;
  actor.vy = 0;
  updateAbilityHint();

  // Show leaderboard page after a short delay.
  setTimeout(() => {
    showLeaderboardScreen(actor.maxX - world.launchX);
  }, 800);
}

function useAbility() {
  if (actor.state === "ready" || actor.state === "ended" || actor.abilityCooldown > 0) return;

  if (selectedCharacter.id === "candyjew" && actor.rainbowModeTimer > 0 && actor.overdriveDunksLeft <= 0) {
    tone(140, 0.05, "sine", 0.05);
    return;
  }

  actor.usedAbility = true;
  if (selectedCharacter.id === "manning") {
    actor.abilityCooldown = 1.5;
  } else if (selectedCharacter.id === "eli") {
    actor.abilityCooldown = 2.0;
  } else if (selectedCharacter.id === "hunter") {
    actor.abilityCooldown = 4.0;
  } else if (selectedCharacter.id === "candyjew") {
    actor.abilityCooldown = actor.rainbowModeTimer > 0 ? 0 : 0.45;
  } else if (selectedCharacter.id === "brayden") {
    actor.abilityCooldown = actor.beerRageTimer > 0 ? 0 : 0.65;
  } else if (selectedCharacter.id === "reed") {
    actor.abilityCooldown = 3.5;
  } else if (selectedCharacter.id === "jackson") {
    actor.abilityCooldown = 0;
  } else if (selectedCharacter.id === "jjfootballboss") {
    actor.abilityCooldown = 0;
  } else if (selectedCharacter.id === "myer") {
    actor.abilityCooldown = 1.15;
  } else if (selectedCharacter.id === "lincolnjames") {
    actor.abilityCooldown = 0.45;
  } else if (selectedCharacter.id === "lukepueppke") {
    actor.abilityCooldown = 0.4;
  } else {
    actor.abilityCooldown = ABILITY_COOLDOWN_SECONDS;
  }
  ensureAudio();

  switch (selectedCharacter.ability) {
    case "fishingrod": {
      // Fishing rod: boost toward mouse cursor direction with power
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseWorldX = lastMouseX * scaleX + cameraX;
      const mouseWorldY = lastMouseY * scaleY;
      const dx = mouseWorldX - actor.x;
      const dy = mouseWorldY - actor.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.max(1, dist);
      const dirX = dx / maxDist;
      const dirY = dy / maxDist;
      const boostStr = 920;
      actor.vx += dirX * boostStr;
      actor.vy += dirY * boostStr * 1.15;
      tone(480, 0.1, "triangle", 0.12);
      tone(340, 0.08, "square", 0.1);
      spawnParticles(actor.x, actor.y, 36, "#00d4ff");
      spawnParticles(actor.x, actor.y, 20, "#ffffff");
      startScreenShake(12, 0.25);
      break;
    }
    case "boost":
      actor.vx += 360;
      actor.vy -= 90;
      tone(420, 0.08, "sawtooth", 0.08);
      spawnParticles(actor.x, actor.y, 18, "#ffc857");
      break;
    case "spin":
      actor.vx *= 1.28;
      actor.vy *= 0.76;
      tone(540, 0.08, "square", 0.07);
      spawnParticles(actor.x, actor.y, 18, "#7cc2ff");
      break;
    case "rocket": {
      const goingUp = actor.vy < 0;
      if (goingUp) {
        // Rocket fires: reduced forward + reduced upward boost
        actor.vx += 320;
        actor.vy *= 1.28;
        tone(680, 0.09, "sawtooth", 0.1);
        tone(440, 0.07, "sawtooth", 0.08);
        spawnParticles(actor.x, actor.y, 32, "#ff4d00");
        spawnParticles(actor.x, actor.y, 16, "#ffcd3c");
        startScreenShake(10, 0.22);
      } else {
        // Fired downward — rocket drives him into the ground HARD
        actor.vy += 1200;
        actor.vx *= 0.2;
        tone(160, 0.12, "sawtooth", 0.12);
        tone(100, 0.1, "triangle", 0.09);
        spawnParticles(actor.x, actor.y, 28, "#ff4d00");
        spawnParticles(actor.x, actor.y, 14, "#333");
        startScreenShake(18, 0.40);
        // Flag him as ground-spiked — finishRun triggers on next ground hit
        actor.rocketSpiked = true;
      }
      break;
    }
    case "slam":
      actor.vy -= 860;
      actor.vx += 280;
      tone(140, 0.1, "triangle", 0.08);
      spawnParticles(actor.x, actor.y, 30, "#ff9b72");
      startScreenShake(32, 0.45);
      break;
    case "warp":
      actor.x += 130;
      actor.vx += 210;
      actor.vy -= 40;
      tone(620, 0.07, "square", 0.08);
      tone(330, 0.07, "square", 0.06);
      spawnParticles(actor.x, actor.y, 30, "#d39cff");
      break;
    case "backflip":
      // Eli's powered backflip - 2 uses per airtime
      actor.vy -= 700;
      actor.vx += 120;
      actor.vx *= 0.92;
      actor.backflipActive = true;
      actor.backflipRotation = 0;
      actor.eliFlipsUsed += 1;
      actor.abilityCooldown = 0.35; // short delay between the two flips
      tone(600, 0.08, "triangle", 0.1);
      tone(420, 0.06, "square", 0.08);
      spawnParticles(actor.x, actor.y, 32, "#ff66ff");
      spawnParticles(actor.x, actor.y, 16, "#ffaaff");
      startScreenShake(11, 0.26);
      break;
    case "dunk":
      if (actor.candyDunkCount >= 5) {
        tone(140, 0.05, "sine", 0.05);
        return;
      }
      actor.candyDunkCount += 1;
      if (actor.rainbowModeTimer > 0) {
        actor.overdriveDunksLeft = Math.max(0, actor.overdriveDunksLeft - 1);
      }
      actor.vy -= 360;
      actor.vx += 170;
      actor.vx *= 1.03;
      tone(300, 0.07, "square", 0.08);
      tone(220, 0.06, "triangle", 0.07);
      spawnParticles(actor.x, actor.y, 24, "#ffd95e");
      break;
    case "tennis": {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseWorldX = lastMouseX * scaleX + cameraX;
      const mouseWorldY = lastMouseY * scaleY;
      const dx = mouseWorldX - actor.x;
      const dy = mouseWorldY - actor.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const dirX = dx / dist;
      const dirY = dy / dist;

      tennisBalls.push({
        x: actor.x + dirX * (actor.radius + 6),
        y: actor.y + dirY * (actor.radius + 6),
        vx: dirX * 780 + actor.vx * 0.35,
        vy: dirY * 780 + actor.vy * 0.2,
        life: 2.2,
        radius: 10,
      });

      actor.vy -= actor.beerRageTimer > 0 ? 300 : 220;
      actor.vx += actor.beerRageTimer > 0 ? 160 : 110;

      tone(520, 0.06, "square", 0.08);
      tone(700, 0.05, "triangle", 0.06);
      spawnParticles(actor.x, actor.y, 16, "#b6ff6a");
      break;
    }
    case "fartpassive":
      triggerReedBasicFartJump();
      break;
    case "truck":
      useTruck();
      break;
    case "leprejump":
      actor.vy -= 560;
      actor.vx += 95;
      actor.myerTrailTimer = Math.max(actor.myerTrailTimer, 0.55);
      tone(640, 0.07, "triangle", 0.08);
      tone(880, 0.05, "triangle", 0.06);
      spawnMyerRainbowTrail(1.2);
      break;
    case "bmwjump":
      // Jump now, then slow BMW AFTER landing from this jump
      actor.vy -= 500;
      actor.kadeSlowdownPending = true;
      actor.abilityCooldown = 0.6;
      tone(320, 0.07, "triangle", 0.08);
      tone(180, 0.06, "sawtooth", 0.07);
      spawnParticles(actor.x, actor.y, 22, "#1a5cff");
      spawnParticles(actor.x, actor.y, 10, "#ffffff");
      startScreenShake(8, 0.18);
      break;
    case "trexjump": {
      // Only allow jump when on the ground
      const groundY = terrainY(actor.x);
      const isGrounded = actor.y + actor.radius >= groundY - 18;
      if (!isGrounded) {
        tone(120, 0.04, "sine", 0.04);
        break;
      }
      // Jump to exactly 30m height: v = sqrt(2 * g * h), h = 30m = 300px
      const effectiveGravity = world.gravity * actor.gravityMult;
      const jumpVy = Math.sqrt(2 * effectiveGravity * 300);
      actor.vy = -jumpVy;
      actor.abilityCooldown = 0.52;
      tone(240, 0.07, "square", 0.08);
      tone(520, 0.05, "triangle", 0.06);
      spawnParticles(actor.x, actor.y, 20, "#9bff74");
      spawnParticles(actor.x, actor.y, 10, "#ffffff");
      startScreenShake(7, 0.16);
      break;
    }
    case "lincolnjump": {
      // Jump height scales with ADHD collected
      const jumpVy = Math.min(LINCOLN_ADHD_JUMP_MAX_VY, LINCOLN_ADHD_JUMP_BASE + actor.lincolnAdhd * LINCOLN_ADHD_JUMP_BONUS);
      actor.vy -= jumpVy;
      actor.vx += 60 + actor.lincolnAdhd * 3;
      actor.bounce = Math.min(0.88, 0.68 + actor.lincolnAdhd * 0.008);
      actor.abilityCooldown = 0.45;
      tone(580 + Math.min(300, actor.lincolnAdhd * 8), 0.07, "triangle", 0.09);
      tone(380, 0.05, "square", 0.07);
      spawnParticles(actor.x, actor.y, 22, "#ff5ef5");
      spawnParticles(actor.x, actor.y, 12, "#ffffff");
      startScreenShake(8 + Math.min(8, actor.lincolnAdhd / 3), 0.18);
      break;
    }
    case "lukejump": {
      // Jump gives more forward distance with more items
      const boost = Math.min(LUKE_ITEM_JUMP_MAX, LUKE_ITEM_JUMP_BASE + actor.lukeItemCount * LUKE_ITEM_JUMP_BONUS);
      actor.vx += boost;
      actor.vy -= 340 + actor.lukeItemCount * 6;
      actor.abilityCooldown = 0.4;
      tone(460 + Math.min(280, actor.lukeItemCount * 7), 0.07, "sawtooth", 0.09);
      tone(280, 0.05, "triangle", 0.06);
      spawnParticles(actor.x, actor.y, 20, "#4fc3f7");
      spawnParticles(actor.x, actor.y, 10, "#ffffff");
      startScreenShake(7 + Math.min(8, actor.lukeItemCount / 4), 0.16);
      break;
    }
  }

  updateAbilityHint();
}

function useTruck() {
  if (selectedCharacter.id !== "anthony" && selectedCharacter.id !== "jackson" && selectedCharacter.id !== "jjfootballboss") return;
  if (actor.state === "ready" || actor.state === "ended") return;
  if (actor.truckCount <= 0) {
    tone(120, 0.06, "sine", 0.05);
    return;
  }

  actor.truckCount -= 1;
  if (selectedCharacter.id === "jjfootballboss") {
    actor.jjTruckRegenTimer = JJ_TRUCK_REGEN_SECONDS;
  }
  actor.isTrucking = true;
  actor.truckTimer = 2.5;
  actor.vx = Math.max(actor.vx + 380, 580); // nerfed forward burst
  actor.vy *= 0.4;                            // dampen vertical
  spawnParticles(actor.x, actor.y, 28, "#ffcd3c");
  spawnParticles(actor.x, actor.y, 14, "#ff9b72");
  tone(220, 0.08, "square", 0.1);
  tone(160, 0.06, "square", 0.08);
  startScreenShake(12, 0.28);
  updateAbilityHint();
}

function useSpencerJump() {
  if (selectedCharacter.id !== "spencer") return;
  if (actor.state === "ready" || actor.state === "ended" || actor.abilityCooldown > 0) return;

  const jumpPower = Math.max(260, 520 - actor.spencerBombsUsed * 70);
  actor.vy -= jumpPower;
  actor.vx += 95;
  actor.usedAbility = true;
  actor.abilityCooldown = 0.55;
  tone(520, 0.07, "triangle", 0.08);
  spawnParticles(actor.x, actor.y, 16, "#99ddff");
  updateAbilityHint();
}

function useJJDoubleJump() {
  if (selectedCharacter.id !== "jjfootballboss") return;
  if (actor.state === "ready" || actor.state === "ended") return;
  if (actor.jjJumpCharges <= 0) {
    tone(140, 0.05, "sine", 0.05);
    return;
  }

  actor.jjJumpCharges -= 1;
  actor.jjJumpRegenTimer = JJ_JUMP_REGEN_SECONDS;
  actor.vy -= 320;
  actor.vx += 40;
  actor.vx = Math.max(actor.vx, 160);
  spawnParticles(actor.x, actor.y, 18, "#9be9ff");
  tone(620, 0.06, "triangle", 0.07);
  tone(760, 0.05, "triangle", 0.06);
  updateAbilityHint();
}

function explodeBomb(bomb) {
  if (bomb.exploded) return;
  bomb.exploded = true;
  bomb.life = -0.2;

  const blastRadius = 130;
  let kills = 0;
  const nearbyJanets = getJanetsInRange(bomb.x - 220, bomb.x + 220);

  nearbyJanets.forEach((janet) => {
    const centerX = janet.x + janet.w * 0.5;
    const centerY = terrainY(janet.x) - janet.yOffset + janet.h * 0.5;
    const dx = centerX - bomb.x;
    const dy = centerY - bomb.y;
    const hitRadius = blastRadius + Math.max(janet.w, janet.h) * 0.4;
    if (dx * dx + dy * dy <= hitRadius * hitRadius) {
      destroyedJanets.add(janet.index);
      kills += 1;
    }
  });

  spawnImpactBurst(bomb.x, bomb.y, 1.1 + kills * 0.45);
  spawnParticles(bomb.x, bomb.y, 36, "#ff4d00");
  spawnParticles(bomb.x, bomb.y, 20, "#333333");
  tone(120, 0.1, "sawtooth", 0.1);
  tone(85, 0.08, "triangle", 0.08);
  startScreenShake(10 + kills * 4, 0.24 + kills * 0.08);
}

function useSpencerBomb() {
  if (selectedCharacter.id !== "spencer") return;
  if (actor.state === "ready" || actor.state === "ended" || actor.abilityCooldown > 0) return;

  bombs.push({
    x: actor.x,
    y: actor.y + actor.radius * 0.25,
    vx: actor.vx * 0.68 + 70,
    vy: actor.vy * 0.32 + 120,
    life: 1.35,
    radius: 18,
    exploded: false,
  });

  actor.spencerBombsUsed += 1;
  actor.vx *= 0.86;
  actor.vy = Math.max(actor.vy, -140);
  actor.usedAbility = true;
  actor.abilityCooldown = 0.95;

  spawnParticles(actor.x, actor.y, 22, "#ffbf66");
  tone(250, 0.06, "square", 0.09);
  updateAbilityHint();
}

function updateBombs(dt) {
  bombs.forEach((bomb) => {
    if (bomb.exploded) return;
    bomb.life -= dt;
    bomb.vy += world.gravity * 0.9 * dt;
    bomb.x += bomb.vx * dt;
    bomb.y += bomb.vy * dt;

    const ground = terrainY(bomb.x);
    if (bomb.y + bomb.radius >= ground || bomb.life <= 0) {
      bomb.y = Math.min(bomb.y, ground - bomb.radius * 0.3);
      explodeBomb(bomb);
    }
  });

  bombs = bombs.filter((bomb) => !(bomb.exploded && bomb.life <= -0.15));
}

function updateTennisBalls(dt) {
  tennisBalls.forEach((ball) => {
    ball.life -= dt;
    ball.vy += world.gravity * 0.55 * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    const nearbyJanets = getJanetsInRange(ball.x - 90, ball.x + 90);
    for (const janet of nearbyJanets) {
      const janetY = terrainY(janet.x) - janet.yOffset;
      const nearestX = Math.max(janet.x, Math.min(ball.x, janet.x + janet.w));
      const nearestY = Math.max(janetY, Math.min(ball.y, janetY + janet.h));
      const dx = ball.x - nearestX;
      const dy = ball.y - nearestY;
      if (dx * dx + dy * dy <= ball.radius * ball.radius) {
        destroyedJanets.add(janet.index);
        ball.life = -1;
        spawnParticles(ball.x, ball.y, 18, "#b6ff6a");
        tone(360, 0.05, "square", 0.06);
        break;
      }
    }

    const ground = terrainY(ball.x);
    if (ball.y + ball.radius >= ground) {
      ball.y = ground - ball.radius;
      ball.life = -1;
    }
  });

  tennisBalls = tennisBalls.filter((ball) => ball.life > 0);
}

function collideRect(rect) {
  const y = terrainY(rect.x) - rect.yOffset;
  const nearestX = Math.max(rect.x, Math.min(actor.x, rect.x + rect.w));
  const nearestY = Math.max(y, Math.min(actor.y, y + rect.h));
  const dx = actor.x - nearestX;
  const dy = actor.y - nearestY;
  if (dx * dx + dy * dy <= actor.radius * actor.radius) {
    if (rect.fatal) {
      if (selectedCharacter.id === "candyjew" && actor.rainbowModeTimer > 0) {
        actor.vx += 240;
        actor.vy -= 120;
        spawnParticles(actor.x, actor.y, 28, "#ffffff");
        startScreenShake(10, 0.22);
        return;
      }
      if (selectedCharacter.id === "lincolnjames" && actor.lincolnImmunityTimer > 0) {
        // Immune — bounce off Hugh harmlessly
        actor.vx += 180;
        actor.vy -= 80;
        spawnParticles(actor.x, actor.y, 24, "#ff5ef5");
        startScreenShake(8, 0.18);
        return;
      }
      if (selectedCharacter.id === "jackson" && actor.jacksonSkyModeTimer > 0) {
        destroyedJanets.add(rect.index);
        actor.vy = Math.min(actor.vy, -1200);
        actor.vx = Math.max(actor.vx + 100, 760);
        spawnParticles(actor.x, actor.y, 30, "#f4d03f");
        startScreenShake(12, 0.24);
        return;
      }
      if (actor.isTrucking) {
        actor.vx += 220;
        spawnParticles(actor.x, actor.y, 40, "#ffcd3c");
        spawnParticles(actor.x, actor.y, 20, "#ff9b72");
        tone(280, 0.08, "square", 0.1);
        tone(180, 0.06, "square", 0.08);
        startScreenShake(18, 0.35);
        return;
      }
      actor.y = y - actor.radius;
      spawnParticles(actor.x, actor.y, 24, "#ff7d5f");
      tone(120, 0.12, "sawtooth", 0.08);
      finishRun("Run ended: Hugh Henderson collision.");
      return;
    }
    actor.y = y - actor.radius;
    actor.vy = -Math.abs(actor.vy) * Math.max(0.5, actor.bounce);
    actor.vx *= 0.92;
    spawnParticles(actor.x, actor.y, 12, "#ffffff");
    tone(240, 0.05, "triangle", 0.06);
  }
}

function collideBouncePad(pad) {
  const y = terrainY(pad.x) - pad.yOffset;
  const onPad = actor.x + actor.radius > pad.x
    && actor.x - actor.radius < pad.x + pad.w
    && actor.y + actor.radius >= y
    && actor.y < y + pad.h;

  if (onPad && actor.vy > -200) {
    actor.y = y - actor.radius;
    const isSal = selectedCharacter.id === "anthony";
    const verticalBoost = isSal ? pad.boost * 1.05 : pad.boost;
    const horizontalBoost = isSal ? 1.08 : 1.07;

    actor.vy = -Math.max(isSal ? 660 : 620, Math.abs(actor.vy) * verticalBoost);
    actor.vx *= horizontalBoost;

    if (isSal) {
      spawnImpactBurst(actor.x, actor.y + actor.radius * 0.25, 1.4);
      startScreenShake(7, 0.2);
    }

    if (selectedCharacter.id === "myer") {
      actor.myerTrailTimer = Math.max(actor.myerTrailTimer, 1.0);
      spawnMyerRainbowTrail(1.6);
    }

    spawnParticles(actor.x, actor.y, 16, "#ff7aa8");
    tone(620, 0.06, "triangle", 0.07);
  }
}

function update(dt) {

  updateBombs(dt);
  updateTennisBalls(dt);
  updateConfetti(dt);

  if (actor.state !== "ready" && actor.state !== "ended") {
    actor.abilityCooldown = Math.max(0, actor.abilityCooldown - dt);
    
    // Animate backflip rotation
    if (selectedCharacter.id === "eli" && actor.backflipActive) {
      actor.backflipRotation += dt * 12; // 12 radians per second = ~2 full rotations/sec
      if (actor.backflipRotation >= Math.PI * 2) {
        actor.backflipRotation = 0;
        actor.backflipActive = false;
      }
    }
    
    if (actor.isTrucking) {
      actor.truckTimer -= dt;
      if (actor.truckTimer <= 0) {
        actor.isTrucking = false;
        actor.truckTimer = 0;
      }
    }

    if (selectedCharacter.id === "candyjew") {
      actor.vx += actor.candyCount * 8 * dt;
      if (actor.rainbowModeTimer > 0) {
        actor.rainbowModeTimer = Math.max(0, actor.rainbowModeTimer - dt);
        actor.rainbowBeamTimer = Math.max(0, actor.rainbowBeamTimer - dt);
        const beamAngle = -0.92;
        const beamForce = 760;
        actor.vx += Math.cos(beamAngle) * beamForce * dt;
        actor.vy += Math.sin(beamAngle) * beamForce * dt;
      }
    }

    if (selectedCharacter.id === "brayden") {
      actor.beerRageTimer = Math.max(0, actor.beerRageTimer - dt);
    }

    if (selectedCharacter.id === "jackson" && actor.jacksonSkyModeTimer > 0) {
      actor.jacksonSkyModeTimer = Math.max(0, actor.jacksonSkyModeTimer - dt);
      actor.vy -= 520 * dt;
      actor.vx += 180 * dt;
      spawnParticles(actor.x, actor.y + actor.radius * 0.45, 4, "#f4d03f");
    }

    if (selectedCharacter.id === "myer") {
      actor.myerTrailTimer = Math.max(0, actor.myerTrailTimer - dt);
      if (actor.myerRainbowBoostTimer > 0) {
        actor.myerRainbowBoostTimer = Math.max(0, actor.myerRainbowBoostTimer - dt);
        actor.vy -= 520 * dt;
        actor.vx += 40 * dt;
        spawnMyerRainbowTrail(1.35);
      } else if (actor.myerTrailTimer > 0) {
        spawnMyerRainbowTrail(0.8);
      }
    }

    if (selectedCharacter.id === "jjfootballboss") {
      actor.jjRollAngle += (actor.vx * dt) / Math.max(10, actor.radius);

      if (actor.truckCount < JJ_TRUCK_MAX) {
        actor.jjTruckRegenTimer = Math.max(0, actor.jjTruckRegenTimer - dt);
        if (actor.jjTruckRegenTimer <= 0) {
          actor.truckCount += 1;
          actor.jjTruckRegenTimer = JJ_TRUCK_REGEN_SECONDS;
        }
      } else {
        actor.jjTruckRegenTimer = JJ_TRUCK_REGEN_SECONDS;
      }

      if (actor.jjJumpCharges < JJ_JUMP_MAX) {
        actor.jjJumpRegenTimer = Math.max(0, actor.jjJumpRegenTimer - dt);
        if (actor.jjJumpRegenTimer <= 0) {
          actor.jjJumpCharges += 1;
          actor.jjJumpRegenTimer = JJ_JUMP_REGEN_SECONDS;
        }
      } else {
        actor.jjJumpRegenTimer = JJ_JUMP_REGEN_SECONDS;
      }
    }

    if (selectedCharacter.id === "kaderess" && actor.state === "flying") {
      actor.kadeSpeed = Math.min(KADE_MAX_SPEED, actor.kadeSpeed + KADE_ACCEL * dt);
    }

    if (selectedCharacter.id === "calebparker" && actor.state === "flying") {
      actor.calebSpeed = Math.min(CALEB_MAX_SPEED, actor.calebSpeed + CALEB_ACCEL * dt);
    }

    if (selectedCharacter.id === "lincolnjames") {
      if (actor.lincolnImmunityTimer > 0) {
        actor.lincolnImmunityTimer = Math.max(0, actor.lincolnImmunityTimer - dt);
        // faint glow trail during immunity
        if (Math.random() < 0.4) spawnParticles(actor.x, actor.y, 2, "#ff5ef5");
      }
    }

    if (selectedCharacter.id === "lukepueppke") {
      if (actor.lukeSuperspeedTimer > 0) {
        actor.lukeSuperspeedTimer = Math.max(0, actor.lukeSuperspeedTimer - dt);
        actor.vx = Math.max(actor.vx, LUKE_SUPERSPEED_VX);
        if (Math.random() < 0.5) spawnParticles(actor.x, actor.y, 3, "#4fc3f7");
      }
    }

    if (selectedCharacter.id === "anthony" && actor.state === "flying") {
      const travelled = Math.max(0, (actor.maxX - world.launchX) / 10);
      const newStage = Math.floor(travelled / SAL_SHRINK_INTERVAL);
      if (newStage > actor.salShrinkStage) {
        const stagesGained = newStage - actor.salShrinkStage;
        actor.salShrinkStage = newStage;
        // Shrink radius
        const t = Math.min(1, actor.salShrinkStage / 11); // 0 → 1 over 11 stages (1100m)
        actor.radius = Math.round(SAL_RADIUS_START - (SAL_RADIUS_START - SAL_RADIUS_MIN) * t);
        // Reduce drag and gravity → faster, lighter
        actor.drag = SAL_DRAG_START - (SAL_DRAG_START - SAL_DRAG_MIN) * t;
        actor.gravityMult = SAL_GRAV_START - (SAL_GRAV_START - SAL_GRAV_MIN) * t;
        // Speed burst for each new stage
        actor.vx += SAL_SPEED_BONUS * stagesGained;
        // Visual feedback
        spawnParticles(actor.x, actor.y, 18, "#ffe8a0");
        spawnParticles(actor.x, actor.y, 10, "#ffffff");
        tone(560, 0.06, "triangle", 0.08);
        tone(780, 0.05, "triangle", 0.06);
        startScreenShake(6, 0.14);
      }
    }

    actor.vy += world.gravity * actor.gravityMult * dt;
    actor.vx -= actor.vx * actor.drag * dt;

    if (selectedCharacter.id === "kaderess" && actor.state === "flying") {
      // BMW engine never lets vx drop below current accumulated speed
      actor.vx = Math.max(actor.vx, actor.kadeSpeed);
    }
    if (selectedCharacter.id === "calebparker" && actor.state === "flying") {
      // T-Rex momentum keeps building through the run
      actor.vx = Math.max(actor.vx, actor.calebSpeed);
    }
    actor.x += actor.vx * dt;
    actor.y += actor.vy * dt;
    const nearbyBouncePads = getBouncePadsInRange(actor.x - 260, actor.x + 520);
    const nearbyJanets = getJanetsInRange(actor.x - 220, actor.x + 560);
    const nearbyCandies = selectedCharacter.id === "candyjew"
      ? getCandiesInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbyBeers = selectedCharacter.id === "brayden"
      ? getBeersInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbyBurgers = selectedCharacter.id === "reed"
      ? getBurgersInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbyFootballs = selectedCharacter.id === "jackson"
      ? getFootballsInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbyPots = selectedCharacter.id === "myer"
      ? getPotsGoldInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbyNeedles = selectedCharacter.id === "jjfootballboss"
      ? getNeedlesInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbyLincolnAdhd = selectedCharacter.id === "lincolnjames"
      ? getLincolnAdhdInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbyLukeRedBull = selectedCharacter.id === "lukepueppke"
      ? getLukeRedBullInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbyLukeCoffee = selectedCharacter.id === "lukepueppke"
      ? getLukeCoffeeInRange(actor.x - 260, actor.x + 560)
      : [];

    obstacles.forEach(collideRect);
    nearbyJanets.forEach(collideRect);
    nearbyBouncePads.forEach(collideBouncePad);

    nearbyCandies.forEach((candy) => {
      const cy = terrainY(candy.x) - candy.yOffset;
      const dx = actor.x - candy.x;
      const dy = actor.y - cy;
      const hitR = actor.radius + candy.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedCandies.add(candy.index);
        actor.candyCount += 1;
        actor.candySpeedBonus = Math.min(0.8, actor.candyCount * 0.018);
        actor.vx += 8 + Math.min(60, actor.candyCount * 1.2);
        spawnParticles(candy.x, cy, 14, "#ffd95e");
        tone(560 + Math.min(360, actor.candyCount * 4), 0.05, "triangle", 0.06);
        if (actor.candyCount % 10 === 0 && actor.candyOverdrivesUsed < 10) {
          triggerCandyOverdrive();
        }
      }
    });

    for (const beer of nearbyBeers) {
      const by = terrainY(beer.x) - beer.yOffset;
      const dx = actor.x - beer.x;
      const dy = actor.y - by;
      const hitR = actor.radius + beer.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedBeers.add(beer.index);
        actor.beerCount += 1;
        spawnParticles(beer.x, by, 16, "#ffd27a");
        tone(310 + Math.min(280, actor.beerCount * 7), 0.05, "triangle", 0.06);

        if (actor.beerCount % 5 === 0) {
          triggerBeerRage();
        }

        if (actor.beerCount >= 20) {
          finishRun("Run ended: Brayden hit 20 beers.");
          return;
        }
      }
    }

    for (const burger of nearbyBurgers) {
      const by = terrainY(burger.x) - burger.yOffset;
      const dx = actor.x - burger.x;
      const dy = actor.y - by;
      const hitR = actor.radius + burger.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedBurgers.add(burger.index);
        actor.burgerCount += 1;
        spawnParticles(burger.x, by, 14, "#a66a3a");
        tone(240 + Math.min(220, actor.burgerCount * 5), 0.05, "triangle", 0.06);

        if (actor.burgerCount % 5 === 0) {
          triggerReedSkyLaunch();
        }
      }
    }

    for (const football of nearbyFootballs) {
      const fy = terrainY(football.x) - football.yOffset;
      const dx = actor.x - football.x;
      const dy = actor.y - fy;
      const hitR = actor.radius + football.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedFootballs.add(football.index);
        actor.jacksonFootballCount += 1;
        spawnParticles(football.x, fy, 14, "#c97b35");
        tone(260 + Math.min(260, actor.jacksonFootballCount * 4), 0.05, "triangle", 0.06);

        if (actor.jacksonFootballCount % 10 === 0 && actor.jacksonSkySmashesUsed < 5) {
          triggerJacksonSkySmash();
        }
      }
    }

    for (const pot of nearbyPots) {
      const py = terrainY(pot.x) - pot.yOffset;
      const dx = actor.x - pot.x;
      const dy = actor.y - py;
      const hitR = actor.radius + pot.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedPots.add(pot.index);
        actor.myerPotCount += 1;
        spawnParticles(pot.x, py, 18, "#ffd84d");
        spawnParticles(pot.x, py, 8, "#fff6b0");
        tone(480 + Math.min(280, actor.myerPotCount * 10), 0.05, "triangle", 0.06);

        if (actor.myerPotCount % 10 === 0) {
          triggerMyerRainbowBoost();
        }
      }
    }

    for (const needle of nearbyNeedles) {
      const ny = terrainY(needle.x) - needle.yOffset;
      const dx = actor.x - needle.x;
      const dy = actor.y - ny;
      const hitR = actor.radius + needle.r * 0.86;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedNeedles.add(needle.index);
        actor.jjNeedleCount += 1;
        actor.radius = Math.min(48, actor.radius + 0.35);
        actor.vx = Math.max(120, actor.vx * 1.012 + 10);
        actor.drag = Math.max(0.065, actor.drag - 0.0008);
        spawnParticles(needle.x, ny, 16, "#8ee8ff");
        tone(520 + Math.min(260, actor.jjNeedleCount * 7), 0.05, "triangle", 0.06);
      }
    }

    for (const adhd of nearbyLincolnAdhd) {
      const ay = terrainY(adhd.x) - adhd.yOffset;
      const dx = actor.x - adhd.x;
      const dy = actor.y - ay;
      const hitR = actor.radius + adhd.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedLincolnAdhd.add(adhd.index);
        actor.lincolnAdhd += 1;
        spawnParticles(adhd.x, ay, 18, "#ff5ef5");
        spawnParticles(adhd.x, ay, 8, "#ffffff");
        tone(500 + Math.min(300, actor.lincolnAdhd * 10), 0.05, "triangle", 0.07);
        // Trigger immunity at threshold
        if (actor.lincolnAdhd >= LINCOLN_ADHD_IMMUNITY_THRESHOLD && actor.lincolnImmunityTimer <= 0) {
          actor.lincolnImmunityTimer = LINCOLN_IMMUNITY_DURATION;
          startScreenShake(12, 0.3);
          spawnParticles(actor.x, actor.y, 40, "#ff5ef5");
          spawnParticles(actor.x, actor.y, 20, "#ffffff");
          tone(740, 0.08, "triangle", 0.09);
          tone(960, 0.07, "triangle", 0.08);
        }
      }
    }

    for (const rb of nearbyLukeRedBull) {
      const ry = terrainY(rb.x) - rb.yOffset;
      const dx = actor.x - rb.x;
      const dy = actor.y - ry;
      const hitR = actor.radius + rb.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedLukeRedBull.add(rb.index);
        actor.lukeItemCount += 1;
        actor.vx += 18;
        spawnParticles(rb.x, ry, 16, "#4fc3f7");
        tone(420 + Math.min(280, actor.lukeItemCount * 7), 0.05, "triangle", 0.06);
        if (actor.lukeItemCount >= LUKE_SUPERSPEED_THRESHOLD && actor.lukeSuperspeedTimer <= 0) {
          actor.lukeSuperspeedTimer = LUKE_SUPERSPEED_DURATION;
          startScreenShake(14, 0.35);
          spawnParticles(actor.x, actor.y, 44, "#4fc3f7");
          spawnParticles(actor.x, actor.y, 22, "#ffffff");
          tone(680, 0.08, "sawtooth", 0.1);
          tone(880, 0.07, "triangle", 0.09);
        }
      }
    }

    for (const cof of nearbyLukeCoffee) {
      const cy2 = terrainY(cof.x) - cof.yOffset;
      const dx = actor.x - cof.x;
      const dy = actor.y - cy2;
      const hitR = actor.radius + cof.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedLukeCoffee.add(cof.index);
        actor.lukeItemCount += 1;
        actor.vx += 14;
        spawnParticles(cof.x, cy2, 16, "#8d6e63");
        tone(380 + Math.min(280, actor.lukeItemCount * 7), 0.05, "triangle", 0.06);
        if (actor.lukeItemCount >= LUKE_SUPERSPEED_THRESHOLD && actor.lukeSuperspeedTimer <= 0) {
          actor.lukeSuperspeedTimer = LUKE_SUPERSPEED_DURATION;
          startScreenShake(14, 0.35);
          spawnParticles(actor.x, actor.y, 44, "#4fc3f7");
          spawnParticles(actor.x, actor.y, 22, "#ffffff");
          tone(680, 0.08, "sawtooth", 0.1);
          tone(880, 0.07, "triangle", 0.09);
        }
      }
    }

    if (selectedCharacter.id === "jackson" && actor.jacksonSkyModeTimer > 0) {
      nearbyJanets.forEach((hugh) => {
        if (destroyedJanets.has(hugh.index)) return;
        const hy = terrainY(hugh.x) - hugh.yOffset;
        const passesOver = actor.x + actor.radius > hugh.x
          && actor.x - actor.radius < hugh.x + hugh.w
          && actor.y < hy + hugh.h * 0.8;
        if (passesOver) {
          destroyedJanets.add(hugh.index);
          actor.vy = Math.min(actor.vy, -1100);
          actor.vx = Math.max(actor.vx + 120, 780);
          spawnImpactBurst(actor.x, actor.y, 1.8);
          spawnParticles(actor.x, actor.y, 24, "#ffd48a");
          startScreenShake(12, 0.24);
        }
      });
    }

    const ground = terrainY(actor.x);
    if (actor.y + actor.radius >= ground) {
      actor.y = ground - actor.radius;
      if (actor.rocketSpiked) {
        actor.rocketSpiked = false;
        spawnParticles(actor.x, actor.y, 36, "#ff4d00");
        spawnParticles(actor.x, actor.y, 20, "#333");
        tone(120, 0.14, "sawtooth", 0.1);
        startScreenShake(20, 0.42);
        finishRun("Run ended: Hunter rocketed into the ground.");
        return;
      }
      if (Math.abs(actor.vy) > 80) {
        const impactVy = Math.abs(actor.vy);
        let bounceFactor = Math.max(0.62, actor.bounce * 1.22);
        if (selectedCharacter.id === "anthony") {
          const impactIntensity = Math.min(2.4, impactVy / 420);
          spawnImpactBurst(actor.x, actor.y + actor.radius * 0.35, impactIntensity);
          bounceFactor = Math.min(bounceFactor, 0.82);
          startScreenShake(22 + impactIntensity * 6.0, 0.45);
        } else if (selectedCharacter.id === "eli") {
          bounceFactor *= 0.86;
        } else if (selectedCharacter.id === "myer") {
          actor.myerTrailTimer = Math.max(actor.myerTrailTimer, 0.9);
          spawnMyerRainbowTrail(1.5);
        }
        actor.vy = -impactVy * bounceFactor;
        actor.vx *= selectedCharacter.id === "eli" ? 0.9 : 0.965;
        spawnParticles(actor.x, actor.y, 9, "#f5e8b2");
        tone(190, 0.04, "sine", 0.05);
        
        // Auto-backflip for Eli only on stronger bounces
        if (selectedCharacter.id === "eli" && impactVy > 230) {
          actor.backflipActive = true;
          actor.backflipRotation = 0;
          actor.eliFlipsUsed = 0; // reset so next airtime allows 2 more flips
        }
      } else {
        actor.vy = 0;
        actor.vx *= 0.975;
        if (selectedCharacter.id === "eli") actor.eliFlipsUsed = 0;
      }

      if (selectedCharacter.id === "kaderess" && actor.kadeSlowdownPending) {
        actor.kadeSlowdownPending = false;
        actor.kadeSpeed = actor.kadeSpeed * 0.75;
        actor.vx = actor.vx * 0.75;
        spawnParticles(actor.x, actor.y, 12, "#9bc1ff");
      }

      if (Math.abs(actor.vx) < 55) {
        actor.vx = 55;
      }
      actor.state = "flying";
      actor.stoppedTimer = 0;
    }

    actor.x = Math.max(actor.x, 0);
    actor.maxX = Math.max(actor.maxX, actor.x);

    const travelled = Math.max(0, (actor.maxX - world.launchX) / 10);
    distanceValue.textContent = travelled.toFixed(1);
    updateHeightUI();


    if (travelled > world.bestDistance) {
      world.bestDistance = travelled;
      localStorage.setItem(STORAGE_KEY, String(world.bestDistance));
      updateHighScoreUI();
      renderCharacterCards();
    }

    cameraX = Math.max(0, actor.x - canvas.width * 0.25);
    world.maxCameraX = Math.max(world.maxCameraX, cameraX);

    updateAbilityHint();
  }

  updateParticles(dt);
  updateImpactBursts(dt);
  updateScreenShake(dt);
}

function updateHighScoreUI() {
  highScoreValue.textContent = world.bestDistance.toFixed(1);
}

function getCurrentMap() {
  return maps[currentMapIndex] || maps[0];
}

function updateMapUI() {
  if (mapNameLabel) {
    mapNameLabel.textContent = `Map: ${getCurrentMap().name}`;
  }
}

function toggleMap() {
  currentMapIndex = (currentMapIndex + 1) % maps.length;
  updateMapUI();
}

function getAbilityLabel(character) {
  switch (character.ability) {
    case "fishingrod":
      return "fishing rod (point & boost)";
    case "boost":
      return "snack boost";
    case "spin":
      return "spin burst";
    case "rocket":
      return "rocket (↑ good, ↓ crash)";
    case "slam":
      return "power slam";
    case "warp":
      return "blink warp";
    case "jumpbomb":
      return "jump / bomb";
    case "backflip":
      return "powered backflip";
    case "dunk":
      return "dunk hurdle";
    case "tennis":
      return "tennis jump / shot";
    case "truck":
      return "truck boost";
    case "fartpassive":
      return "fart boost (passive)";
    case "leprejump":
      return "leprechaun jump";
    case "bmwjump":
      return "BMW jump";
    case "trexjump":
      return "T-Rex jump";
    default:
      return "ability";
  }
}

function updateAbilityHint() {
  if (actor.state === "ended") {
    abilityHint.textContent = "Run ended. Press Restart Run to launch again.";
    return;
  }

  if (selectedCharacter.id === "manning" && actor.state === "flying") {
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `Rod recharging: ${actor.abilityCooldown.toFixed(1)}s`;
      return;
    }
    abilityHint.textContent = "Space: cast rod (point cursor to aim)";
    return;
  }

  if (selectedCharacter.id === "anthony") {
    const slamReady = actor.abilityCooldown <= 0;
    const slamText = slamReady ? "Space: slam" : `Slam: ${actor.abilityCooldown.toFixed(1)}s`;
    const truckText = actor.truckCount > 0
      ? `Double-Space: truck (${actor.truckCount} left)`
      : "No trucks left";
    const nextShrinkAt = (actor.salShrinkStage + 1) * SAL_SHRINK_INTERVAL;
    const shrinkText = actor.salShrinkStage > 0
      ? `Stage ${actor.salShrinkStage} (size ${actor.radius}) | Next shrink at ${nextShrinkAt}m`
      : `Shrinks at ${SAL_SHRINK_INTERVAL}m, ${SAL_SHRINK_INTERVAL * 2}m…`;
    abilityHint.textContent = `${slamText}  |  ${truckText}  |  ${shrinkText}`;
    return;
  }

  if (selectedCharacter.id === "hunter" && actor.state === "flying") {
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `Rocket recharging: ${actor.abilityCooldown.toFixed(1)}s`;
      return;
    }
    abilityHint.textContent = `Space: rocket`;
    return;
  }

  if (selectedCharacter.id === "spencer") {
    if (actor.state === "ready") {
      abilityHint.textContent = "Space: jump  |  Double-Space: bomb (kills Hugh Henderson, slows you)";
      return;
    }
    const jumpPower = Math.max(220, 560 - actor.spencerBombsUsed * 95);
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `Recharging: ${actor.abilityCooldown.toFixed(1)}s | Jump power: ${Math.round(jumpPower)}`;
      return;
    }
    abilityHint.textContent = `Space: jump (${Math.round(jumpPower)})  |  Double-Space: bomb  |  Bombs used: ${actor.spencerBombsUsed}`;
    return;
  }

  if (selectedCharacter.id === "candyjew") {
    const candyText = `Candies: ${actor.candyCount}`;
    const dunksLeft = 5 - actor.candyDunkCount;
    const overdrivesLeft = 10 - actor.candyOverdrivesUsed;
    if (actor.state === "ready") {
      abilityHint.textContent = `${candyText}  |  ODs left: ${overdrivesLeft}/10  |  Space: dunk (${dunksLeft}/5 left)`;
      return;
    }
    if (actor.rainbowModeTimer > 0) {
      abilityHint.textContent = `${candyText}  |  OVERDRIVE ${actor.rainbowModeTimer.toFixed(1)}s | Dunks left: ${actor.overdriveDunksLeft} | ODs left: ${overdrivesLeft}/10`;
      return;
    }
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `${candyText}  |  ODs left: ${overdrivesLeft}/10  |  Dunk: ${actor.abilityCooldown.toFixed(1)}s (${dunksLeft}/5 left)`;
      return;
    }
    if (dunksLeft <= 0) {
      abilityHint.textContent = `${candyText}  |  ODs left: ${overdrivesLeft}/10  |  Out of dunks!`;
      return;
    }
    abilityHint.textContent = `${candyText}  |  ODs left: ${overdrivesLeft}/10  |  Space: dunk (${dunksLeft}/5 left)`;
    return;
  }

  if (selectedCharacter.id === "brayden") {
    const beerText = `Beers: ${actor.beerCount}/20`;
    if (actor.state === "ready") {
      abilityHint.textContent = `${beerText}  |  Space: jump + aimable tennis shot`;
      return;
    }
    if (actor.beerRageTimer > 0) {
      abilityHint.textContent = `${beerText}  |  SPIN MODE ${actor.beerRageTimer.toFixed(1)}s | Infinite jumps`;
      return;
    }
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `${beerText}  |  Reload: ${actor.abilityCooldown.toFixed(1)}s`;
      return;
    }
    abilityHint.textContent = `${beerText}  |  Space: jump + tennis shot`;
    return;
  }

  if (selectedCharacter.id === "reed") {
    const burgerText = `Cheeseburgers: ${actor.burgerCount}`;
    const nextSkyIn = 5 - (actor.burgerCount % 5 || 5);
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `${burgerText}  |  Space: fart jump in ${actor.abilityCooldown.toFixed(1)}s | Sky launch in ${nextSkyIn === 0 ? 5 : nextSkyIn}`;
      return;
    }
    abilityHint.textContent = `${burgerText}  |  Space: fart jump | Sky launch every 5 burgers (in ${nextSkyIn === 0 ? 5 : nextSkyIn})`;
    return;
  }

  if (selectedCharacter.id === "jackson") {
    const footballText = `Footballs: ${actor.jacksonFootballCount}`;
    const nextSkyIn = 10 - (actor.jacksonFootballCount % 10 || 10);
    const smashesLeft = 5 - actor.jacksonSkySmashesUsed;
    const truckText = actor.truckCount > 0
      ? `Space: truck (${actor.truckCount} left)`
      : "No trucks left";
    if (actor.jacksonSkyModeTimer > 0) {
      abilityHint.textContent = `${footballText}  |  GOLD MODE ${actor.jacksonSkyModeTimer.toFixed(1)}s | Invincible | Uses left: ${smashesLeft}`;
      return;
    }
    abilityHint.textContent = `${footballText}  |  ${truckText}  |  Sky smash in ${nextSkyIn === 0 ? 10 : nextSkyIn} | Uses left: ${smashesLeft}`;
    return;
  }

  if (selectedCharacter.id === "jjfootballboss") {
    const needleText = `Needles: ${actor.jjNeedleCount}`;
    const truckText = actor.truckCount > 0
      ? `Space: truck (${actor.truckCount} left)`
      : "No trucks left";
    const truckRegenText = actor.truckCount < JJ_TRUCK_MAX ? `Truck +1 in ${actor.jjTruckRegenTimer.toFixed(1)}s` : "Truck full";
    const jumpText = actor.jjJumpCharges > 0
      ? `Double-Space: jump (${actor.jjJumpCharges})`
      : `Jump +1 in ${actor.jjJumpRegenTimer.toFixed(1)}s`;
    abilityHint.textContent = `${needleText}  |  ${truckText}  |  ${truckRegenText}  |  ${jumpText}`;
    return;
  }

  if (selectedCharacter.id === "kaderess") {
    const mphApprox = (actor.kadeSpeed / 22.4).toFixed(0);
    const resetText = actor.kadeSlowdownPending ? "reset queued on landing" : "next jump queues reset";
    abilityHint.textContent = `BMW speed: ~${mphApprox} mph  |  Space: jump (${resetText})`;
    return;
  }

  if (selectedCharacter.id === "calebparker") {
    const mphApprox = (actor.calebSpeed / 22.4).toFixed(0);
    abilityHint.textContent = `T-Rex speed: ~${mphApprox} mph  |  Space: fixed jump (clears Hugh)`;
    return;
  }

  if (selectedCharacter.id === "lincolnjames") {
    const adhdText = `ADHD: ${actor.lincolnAdhd}`;
    const immuneText = actor.lincolnImmunityTimer > 0
      ? `IMMUNE ${actor.lincolnImmunityTimer.toFixed(1)}s`
      : actor.lincolnAdhd >= LINCOLN_ADHD_IMMUNITY_THRESHOLD
        ? "Immunity active on next 10"
        : `Immunity at ${LINCOLN_ADHD_IMMUNITY_THRESHOLD} ADHD`;
    const jumpPow = Math.min(LINCOLN_ADHD_JUMP_MAX_VY, LINCOLN_ADHD_JUMP_BASE + actor.lincolnAdhd * LINCOLN_ADHD_JUMP_BONUS);
    abilityHint.textContent = `${adhdText}  |  ${immuneText}  |  Space: jump (power ${Math.round(jumpPow)})`;
    return;
  }

  if (selectedCharacter.id === "lukepueppke") {
    const itemText = `Items: ${actor.lukeItemCount}`;
    const speedText = actor.lukeSuperspeedTimer > 0
      ? `SUPERSPEED ${actor.lukeSuperspeedTimer.toFixed(1)}s`
      : `Superspeed at ${LUKE_SUPERSPEED_THRESHOLD} items`;
    const boost = Math.min(LUKE_ITEM_JUMP_MAX, LUKE_ITEM_JUMP_BASE + actor.lukeItemCount * LUKE_ITEM_JUMP_BONUS);
    abilityHint.textContent = `${itemText}  |  ${speedText}  |  Space: jump (boost +${Math.round(boost)})`;
    return;
  }

  if (selectedCharacter.id === "myer") {
    const potText = `Lucky Charms: ${actor.myerPotCount}`;
    const nextBoostIn = 10 - (actor.myerPotCount % 10 || 10);
    if (actor.myerRainbowBoostTimer > 0) {
      abilityHint.textContent = `${potText}  |  RAINBOW BOOST ${actor.myerRainbowBoostTimer.toFixed(1)}s | Space: jump`;
      return;
    }
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `${potText}  |  Space jump in ${actor.abilityCooldown.toFixed(1)}s | Rainbow launch in ${nextBoostIn === 0 ? 10 : nextBoostIn}`;
      return;
    }
    abilityHint.textContent = `${potText}  |  Space: jump | Rainbow launch every 10 Lucky Charms (in ${nextBoostIn === 0 ? 10 : nextBoostIn})`;
    return;
  }

  if (actor.state === "ready") {
    abilityHint.textContent = `Press Space for ${selectedCharacter.name}'s ${getAbilityLabel(selectedCharacter)}.`;
    return;
  }

  if (actor.abilityCooldown > 0) {
    abilityHint.textContent = `Ability recharging: ${actor.abilityCooldown.toFixed(1)}s`;
    return;
  }

  abilityHint.textContent = `Ability ready — press Space for ${getAbilityLabel(selectedCharacter)}.`;
}

function loadLeaderboard() {
  const normalize = (entry) => {
    if (!entry || typeof entry !== "object") return null;
    const name = typeof entry.name === "string" ? entry.name.slice(0, 20) : "Player";
    const distance = Number(entry.distance);
    if (!Number.isFinite(distance)) return null;
    const characterId = typeof entry.characterId === "string" ? entry.characterId : "";
    const characterName = typeof entry.characterName === "string" ? entry.characterName : "";
    const date = entry.date || new Date().toLocaleDateString();
    return {
      name,
      distance: Number(distance.toFixed(1)),
      date,
      characterId,
      characterName,
    };
  };

  let source = [];
  if (Array.isArray(window.sharedLeaderboardCache) && window.sharedLeaderboardCache.length > 0) {
    source = window.sharedLeaderboardCache;
  } else {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    source = stored ? JSON.parse(stored) : [];
  }

  return (Array.isArray(source) ? source : [])
    .map(normalize)
    .filter(Boolean)
    .sort((a, b) => b.distance - a.distance);
}

function saveLeaderboard(scores) {
  const normalized = (Array.isArray(scores) ? scores : [])
    .filter((s) => s && Number.isFinite(Number(s.distance)))
    .sort((a, b) => Number(b.distance) - Number(a.distance))
    .map((s) => ({
      name: (s.name || "Player").toString().slice(0, 20),
      distance: Number(Number(s.distance).toFixed(1)),
      date: s.date || new Date().toLocaleDateString(),
      characterId: typeof s.characterId === "string" ? s.characterId : "",
      characterName: typeof s.characterName === "string" ? s.characterName : "",
    }));
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(normalized));
  window.sharedLeaderboardCache = normalized;
}

function getAuthToken() {
  return authSession?.access_token || SUPABASE_ANON_KEY;
}

function updateAccountUI() {
  if (!accountStatus) return;
  if (authSession?.user?.email) {
    accountStatus.textContent = `Account: ${authSession.user.email}`;
  } else {
    accountStatus.textContent = "Account: Guest";
  }
}

function loadAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    authSession = raw ? JSON.parse(raw) : null;
  } catch {
    authSession = null;
  }
  updateAccountUI();
}

function saveAuthSession(session) {
  authSession = session;
  if (session) localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(AUTH_SESSION_KEY);
  updateAccountUI();
}

async function signUpAccount(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg || data?.error_description || "Sign up failed");
  if (data?.access_token) {
    saveAuthSession(data);
  }
  return data;
}

async function signInAccount(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.msg || data?.error_description || "Sign in failed");
  saveAuthSession(data);
  return data;
}

function signOutAccount() {
  saveAuthSession(null);
}

function addScoreToLeaderboard(playerName, distance) {
  const leaderboard = loadLeaderboard();
  const travelled = parseFloat((distance / 10).toFixed(1));
  leaderboard.push({
    name: playerName,
    distance: travelled,
    date: new Date().toLocaleDateString(),
    characterId: selectedCharacter?.id || "",
    characterName: selectedCharacter?.name || "",
  });
  leaderboard.sort((a, b) => b.distance - a.distance);
  saveLeaderboard(leaderboard);
  return leaderboard;
}

async function fetchCloudLeaderboard() {
  const normalizeRows = (data) => data
    .filter((s) => s && typeof s.Name === "string" && Number.isFinite(Number(s.distance)))
    .sort((a, b) => Number(b.distance) - Number(a.distance))
    .map((s) => ({
      name: s.Name.slice(0, 20),
      distance: Number(Number(s.distance).toFixed(1)),
      date: s.created_at ? new Date(s.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
      characterId: typeof s.character_id === "string" ? s.character_id : "",
      characterName: typeof s.character_name === "string" ? s.character_name : "",
    }));

  try {
    const extendedUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_LEADERBOARD_TABLE}?select=Name,distance,created_at,character_id,character_name&order=distance.desc&limit=${CLOUD_LEADERBOARD_FETCH_LIMIT}`;
    const basicUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_LEADERBOARD_TABLE}?select=Name,distance,created_at&order=distance.desc&limit=${CLOUD_LEADERBOARD_FETCH_LIMIT}`;

    console.log("Fetching from Supabase:", extendedUrl);
    let res = await fetch(extendedUrl, {
      cache: "no-store",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!res.ok) {
      console.warn("Extended leaderboard fetch failed, trying basic columns");
      res = await fetch(basicUrl, {
        cache: "no-store",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    }

    console.log("Supabase fetch response:", res.status, res.statusText);
    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Supabase fetch failed: ${res.status} ${res.statusText}`, errBody);
      return false;
    }
    const data = await res.json();
    console.log("Supabase data:", data);
    if (!Array.isArray(data)) {
      console.warn("Supabase returned non-array data");
      return false;
    }
    const normalized = normalizeRows(data);
    saveLeaderboard(normalized);
    return true;
  } catch (e) {
    console.error("fetchCloudLeaderboard error:", e);
    return false;
  }
}

async function pushCloudLeaderboardEntry(playerName, travelledMeters) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${SUPABASE_LEADERBOARD_TABLE}`;
    const extendedBody = JSON.stringify({
      Name: playerName.slice(0, 20),
      distance: Number(travelledMeters.toFixed(1)),
      character_id: selectedCharacter?.id || "",
      character_name: selectedCharacter?.name || "",
    });
    const basicBody = JSON.stringify({
      Name: playerName.slice(0, 20),
      distance: Number(travelledMeters.toFixed(1)),
    });
    console.log("Pushing to Supabase:", url, extendedBody);
    let insertRes = await fetch(url, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: extendedBody,
    });
    if (!insertRes.ok) {
      console.warn("Extended leaderboard insert failed, trying basic payload");
      insertRes = await fetch(url, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: basicBody,
      });
    }
    console.log("Supabase insert response:", insertRes.status, insertRes.statusText);
    if (insertRes.ok) {
      console.log("Score inserted to Supabase successfully");
      await fetchCloudLeaderboard();
      return true;
    }
    const errText = await insertRes.text();
    console.error(`Supabase insert failed: ${insertRes.status} ${insertRes.statusText}`, errText);
    return false;
  } catch (e) {
    console.error("pushCloudLeaderboardEntry error:", e);
    return false;
  }
}

function subscribeToLeaderboard() {
  fetchCloudLeaderboard().then(() => displayLeaderboard());
  if (window.leaderboardPollTimer) {
    clearInterval(window.leaderboardPollTimer);
  }
  window.leaderboardPollTimer = setInterval(() => {
    fetchCloudLeaderboard();
  }, 12000);
}

function getLeaderboardScoresForView() {
  const allScores = loadLeaderboard();
  if (leaderboardViewMode === "character" && leaderboardRunCharacterId) {
    return allScores
      .filter((s) => s.characterId === leaderboardRunCharacterId)
      .slice(0, MAX_LEADERBOARD_ENTRIES);
  }
  return allScores.slice(0, MAX_LEADERBOARD_ENTRIES);
}

function updateLeaderboardModeUI() {
  const charLabel = leaderboardRunCharacterName || selectedCharacter?.name || "Character";
  if (leaderboardTitle) {
    leaderboardTitle.textContent = leaderboardViewMode === "character"
      ? `${charLabel} Leaderboard`
      : "All-Time Leaderboard";
  }
  if (leaderboardModeBtn) {
    leaderboardModeBtn.textContent = leaderboardViewMode === "character"
      ? "Show: All-Time"
      : "Show: Current Character";
  }
  if (leaderboardModeLabel) {
    leaderboardModeLabel.textContent = leaderboardViewMode === "character"
      ? `Viewing: ${charLabel}`
      : "Viewing: All Characters";
  }
}

function displayLeaderboard() {
  const scores = getLeaderboardScoresForView();
  updateLeaderboardModeUI();
  leaderboardList.innerHTML = "";
  if (scores.length === 0) {
    leaderboardList.innerHTML = leaderboardViewMode === "character"
      ? "<p>No scores yet for this character.</p>"
      : "<p>No scores yet. Be the first!</p>";
    return;
  }
  scores.forEach((score, idx) => {
    const entry = document.createElement("div");
    entry.style.padding = "10px 12px";
    entry.style.display = "flex";
    entry.style.justifyContent = "space-between";
    entry.style.alignItems = "center";
    entry.style.borderBottom = "1px solid #e0e0ff";
    entry.style.fontSize = "0.95rem";
    entry.style.fontWeight = idx < 3 ? "600" : "400";
    
    const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${medal} ${idx + 1}. ${score.name}`;
    
    const distSpan = document.createElement("span");
    distSpan.textContent = `${score.distance}m`;
    distSpan.style.color = idx < 3 ? "#5f7bff" : "#666";
    distSpan.style.fontWeight = "700";
    
    entry.appendChild(nameSpan);
    entry.appendChild(distSpan);
    leaderboardList.appendChild(entry);
  });
}

function showLeaderboardScreen(distance) {
  menuScreen.classList.remove("active");
  characterScreen.classList.remove("active");
  controlsPanel.classList.add("hidden");
  leaderboardScreen.classList.add("active");
  
  const travelled = (distance / 10).toFixed(1);
  finalScore.textContent = `Your Score: ${travelled}m`;
  leaderboardRunCharacterId = selectedCharacter?.id || "";
  leaderboardRunCharacterName = selectedCharacter?.name || "";
  leaderboardViewMode = "character";
  playerNameInput.value = "";
  playerNameInput.focus();
  
  // Check if top 3 and trigger confetti
  const scores = getLeaderboardScoresForView();
  const tempScore = parseFloat(travelled);
  const isTop3 = scores.slice(0, 3).some(s => Math.abs(s.distance - tempScore) < 0.1) || scores.length < 3;
  if (isTop3 && scores.length > 0) {
    triggerConfetti();
  }
  
  fetchCloudLeaderboard().then(() => displayLeaderboard());
}

function getCharacterImageCandidates(character) {
  if (character.id === "brayden") {
    return ["characters/Brayden Voth.png", "Brayden Voth.png"];
  }
  if (character.id === "candyjew") {
    return ["characters/Candy Jew.png", "Candy Jew.png"];
  }
  if (character.id === "spencer") {
    return ["characters/Spencer.png", "Spencer.png"];
  }
  if (character.id === "eli") {
    return ["characters/Eli Ailshie.png", "Eli Ailshie.png"];
  }
  if (character.id === "reed") {
    return ["characters/Reed Blair.png", "characters/Reed Blair.jpg"];
  }
  if (character.id === "jackson") {
    return ["characters/Jackson .png", "characters/Jackson .jpg"];
  }
  if (character.id === "myer") {
    return ["characters/Myer.png", "characters/Myer.jpg"];
  }
  if (character.id === "jjfootballboss") {
    return ["characters/JJFOOTBALLBOSS.png", "characters/JJFOOTBALLBOSS.jpg"];
  }
  if (character.id === "kaderess") {
    return ["characters/Kade Ress.png", "Kade Ress.png"];
  }
  if (character.id === "calebparker") {
    return ["characters/Caleb Parker.png", "Caleb Parker.png"];
  }
  if (character.id === "lincolnjames") {
    return ["characters/Lincoln James.png", "Lincoln James.png"];
  }
  if (character.id === "lukepueppke") {
    return ["characters/Luke Pueppke.png", "Luke Pueppke.png"];
  }
  return [`${character.imageBase}.png`, `${character.imageBase}.jpg`];
}

function drawBackground() {
  const currentMap = getCurrentMap();

  if (currentMap.id === "town-square" && townSquareMapImg && townSquareMapImg.complete && townSquareMapImg.naturalWidth > 8) {
    const drawH = canvas.height + 80;
    const drawW = drawH * (townSquareMapImg.naturalWidth / townSquareMapImg.naturalHeight);
    const scroll = cameraX * 0.2;
    const offset = ((scroll % drawW) + drawW) % drawW;

    for (let x = -offset - drawW; x < canvas.width + drawW; x += drawW) {
      ctx.drawImage(townSquareMapImg, x, -40, drawW, drawH);
    }

    if (selectedCharacter.id === "jackson" && actor.jacksonSkyModeTimer > 0) {
      ctx.fillStyle = "rgba(255, 211, 79, 0.35)";
      ctx.fillRect(-40, -40, canvas.width + 80, canvas.height + 80);
    }

    drawCloud(180, 120);
    drawCloud(500, 90);
    drawCloud(880, 145);
    return;
  }

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  if (selectedCharacter.id === "jackson" && actor.jacksonSkyModeTimer > 0) {
    grad.addColorStop(0, "#ffe58a");
    grad.addColorStop(0.55, "#ffd34f");
    grad.addColorStop(1, "#f7b733");
  } else if (selectedCharacter.id === "candyjew" && actor.rainbowModeTimer > 0) {
    const t = performance.now() * 0.0026;
    const hueA = (t * 180) % 360;
    const hueB = (hueA + 120) % 360;
    const hueC = (hueA + 240) % 360;
    grad.addColorStop(0, `hsl(${hueA} 90% 70%)`);
    grad.addColorStop(0.5, `hsl(${hueB} 92% 68%)`);
    grad.addColorStop(1, `hsl(${hueC} 92% 72%)`);
  } else {
    grad.addColorStop(0, "#90d9ff");
    grad.addColorStop(1, "#dbf6ff");
  }
  ctx.fillStyle = grad;
  ctx.fillRect(-40, -40, canvas.width + 80, canvas.height + 80);

  ctx.fillStyle = "#fff9b1";
  ctx.beginPath();
  ctx.arc(1120, 95, 50, 0, Math.PI * 2);
  ctx.fill();

  drawCloud(180, 120);
  drawCloud(500, 90);
  drawCloud(880, 145);
}

function drawCloud(x, y) {
  ctx.save();
  ctx.translate(x - cameraX * 0.15, y);
  ctx.fillStyle = "#ffffffcf";
  ctx.beginPath();
  ctx.arc(-25, 10, 18, 0, Math.PI * 2);
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.arc(26, 11, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGround() {
  ctx.fillStyle = "#78bf6e";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  for (let sx = 0; sx <= canvas.width; sx += 12) {
    const wx = sx + cameraX;
    ctx.lineTo(sx, terrainY(wx));
  }
  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#4e9046";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let sx = 0; sx <= canvas.width; sx += 8) {
    const wx = sx + cameraX;
    const y = terrainY(wx);
    if (sx === 0) ctx.moveTo(sx, y);
    else ctx.lineTo(sx, y);
  }
  ctx.stroke();
}

function drawMapDecor() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px Trebuchet MS";
  const mapTitle = getCurrentMap().id === "town-square"
    ? "Town Square"
    : "Faith Christian Campus (Fictional)";
  ctx.fillText(mapTitle, 18, 35);

  const markerStep = world.markersEvery * 10;
  const startMarkerX = Math.max(
    world.launchX,
    world.launchX + Math.floor((cameraX - world.launchX) / markerStep) * markerStep
  );
  const endMarkerX = cameraX + canvas.width + markerStep;

  for (let wx = startMarkerX; wx <= endMarkerX; wx += markerStep) {
    const sx = wx - cameraX;
    if (sx < -40 || sx > canvas.width + 40) continue;
    const gy = terrainY(wx);
    const markerMeters = Math.max(0, Math.round((wx - world.launchX) / 10));
    ctx.strokeStyle = "#ffffff99";
    ctx.beginPath();
    ctx.moveTo(sx, gy - 35);
    ctx.lineTo(sx, gy);
    ctx.stroke();
    ctx.fillStyle = "#ffffffcc";
    ctx.font = "12px Trebuchet MS";
    ctx.fillText(`${markerMeters}m`, sx - 18, gy - 40);
  }

  obstacles.forEach((o) => {
    const y = terrainY(o.x) - o.yOffset;
    const sx = o.x - cameraX;
    ctx.fillStyle = o.color;
    ctx.fillRect(sx, y, o.w, o.h);
    ctx.fillStyle = "#1d2552";
    ctx.font = "bold 12px Trebuchet MS";
    ctx.fillText(o.label, sx + 6, y - 6);
  });

  const visibleJanets = getJanetsInRange(cameraX - 120, cameraX + canvas.width + 120);
  visibleJanets.forEach((janet) => {
    const janetY = terrainY(janet.x) - janet.yOffset;
    const janetSX = janet.x - cameraX;
    if (janetSX <= -janet.w - 60 || janetSX >= canvas.width + 60) return;

    if (fatalObstacleImg && fatalObstacleImg.complete && fatalObstacleImg.naturalWidth > 10) {
      ctx.save();
      ctx.fillStyle = "#ffffffd9";
      ctx.fillRect(janetSX - 6, janetY - 6, janet.w + 12, janet.h + 12);
      ctx.drawImage(fatalObstacleImg, janetSX, janetY, janet.w, janet.h);
      ctx.restore();
    } else {
      ctx.fillStyle = janet.color;
      ctx.fillRect(janetSX, janetY, janet.w, janet.h);
      ctx.fillStyle = "#8f4f64";
      ctx.beginPath();
      ctx.arc(janetSX + janet.w / 2, janetY + 40, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 38px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.fillText("!", janetSX + janet.w / 2, janetY + 54);
      ctx.textAlign = "start";
    }
    ctx.fillStyle = "#8f3f5b";
    ctx.font = "bold 13px Trebuchet MS";
    ctx.fillText(janet.label, janetSX + 4, janetY - 8);
  });

  const visibleBouncePads = getBouncePadsInRange(cameraX - 120, cameraX + canvas.width + 120);
  const visibleCandies = selectedCharacter.id === "candyjew"
    ? getCandiesInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visibleBeers = selectedCharacter.id === "brayden"
    ? getBeersInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visibleBurgers = selectedCharacter.id === "reed"
    ? getBurgersInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visibleFootballs = selectedCharacter.id === "jackson"
    ? getFootballsInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visiblePots = selectedCharacter.id === "myer"
    ? getPotsGoldInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visibleNeedles = selectedCharacter.id === "jjfootballboss"
    ? getNeedlesInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visibleLincolnAdhd = selectedCharacter.id === "lincolnjames"
    ? getLincolnAdhdInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visibleLukeRedBull = selectedCharacter.id === "lukepueppke"
    ? getLukeRedBullInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visibleLukeCoffee = selectedCharacter.id === "lukepueppke"
    ? getLukeCoffeeInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];

  visibleCandies.forEach((candy) => {
    const cy = terrainY(candy.x) - candy.yOffset;
    const sx = candy.x - cameraX;
    if (sx < -60 || sx > canvas.width + 60) return;

    const img = candyImgs[candy.variant];
    const size = candy.r * 2.25;
    if (img && img.complete && img.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, cy);
      ctx.rotate(Math.sin((performance.now() * 0.003) + candy.index) * 0.15);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#ffd95e";
      ctx.beginPath();
      ctx.arc(sx, cy, candy.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px Trebuchet MS";
      ctx.fillText("C", sx - 4, cy + 4);
    }
  });

  visibleBeers.forEach((beer) => {
    const by = terrainY(beer.x) - beer.yOffset;
    const sx = beer.x - cameraX;
    if (sx < -70 || sx > canvas.width + 70) return;

    const size = beer.r * 2.3;
    if (braydenBeerImg && braydenBeerImg.complete && braydenBeerImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, by);
      ctx.rotate(Math.sin((performance.now() * 0.0035) + beer.index) * 0.13);
      ctx.drawImage(braydenBeerImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#f6b64d";
      ctx.beginPath();
      ctx.arc(sx, by, beer.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px Trebuchet MS";
      ctx.fillText("B", sx - 4, by + 4);
    }
  });

  visibleBurgers.forEach((burger) => {
    const by = terrainY(burger.x) - burger.yOffset;
    const sx = burger.x - cameraX;
    if (sx < -70 || sx > canvas.width + 70) return;

    const size = burger.r * 2.5;
    if (reedBurgerImg && reedBurgerImg.complete && reedBurgerImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, by);
      ctx.rotate(Math.sin((performance.now() * 0.0035) + burger.index) * 0.12);
      ctx.drawImage(reedBurgerImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      const r = burger.r;
      // Top bun
      ctx.fillStyle = "#d7a35e";
      ctx.beginPath();
      ctx.arc(sx, by - 3, r, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      // Patty + lettuce + cheese
      ctx.fillStyle = "#5b3420";
      ctx.fillRect(sx - r, by - 2, r * 2, 5);
      ctx.fillStyle = "#5ba84a";
      ctx.fillRect(sx - r, by + 3, r * 2, 3);
      ctx.fillStyle = "#f0c43c";
      ctx.fillRect(sx - r + 2, by + 6, r * 2 - 4, 3);
      // Bottom bun
      ctx.fillStyle = "#c48a4a";
      ctx.fillRect(sx - r, by + 9, r * 2, 6);
    }
  });

  visibleFootballs.forEach((football) => {
    const fy = terrainY(football.x) - football.yOffset;
    const sx = football.x - cameraX;
    if (sx < -70 || sx > canvas.width + 70) return;

    const size = football.r * 2.6;
    if (jacksonFootballImg && jacksonFootballImg.complete && jacksonFootballImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, fy);
      ctx.rotate(Math.sin((performance.now() * 0.0035) + football.index) * 0.12);
      ctx.drawImage(jacksonFootballImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#9a4f20";
      ctx.beginPath();
      ctx.ellipse(sx, fy, football.r * 1.1, football.r * 0.75, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  visiblePots.forEach((pot) => {
    const py = terrainY(pot.x) - pot.yOffset;
    const sx = pot.x - cameraX;
    if (sx < -80 || sx > canvas.width + 80) return;

    const size = pot.r * 2.9;
    if (myerPotGoldImg && myerPotGoldImg.complete && myerPotGoldImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, py);
      ctx.rotate(Math.sin((performance.now() * 0.003) + pot.index) * 0.12);
      ctx.drawImage(myerPotGoldImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#0f8d37";
      ctx.beginPath();
      ctx.arc(sx, py + 2, pot.r * 0.92, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffd84d";
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.arc(sx + i * 8, py - 8 + Math.abs(i) * 2, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  visibleNeedles.forEach((needle) => {
    const ny = terrainY(needle.x) - needle.yOffset;
    const sx = needle.x - cameraX;
    if (sx < -80 || sx > canvas.width + 80) return;

    const size = needle.r * 3.4;
    if (jjNeedleImg && jjNeedleImg.complete && jjNeedleImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, ny);
      ctx.rotate(-0.58 + Math.sin((performance.now() * 0.003) + needle.index) * 0.04);
      ctx.drawImage(jjNeedleImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.save();
      ctx.strokeStyle = "#9be9ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sx - needle.r * 1.2, ny + needle.r * 0.35);
      ctx.lineTo(sx + needle.r * 1.35, ny - needle.r * 0.5);
      ctx.stroke();
      ctx.restore();
    }
  });

  visibleBouncePads.forEach((b) => {
    const y = terrainY(b.x) - b.yOffset;
    const sx = b.x - cameraX;
    ctx.fillStyle = b.color;
    ctx.fillRect(sx, y, b.w, b.h);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Trebuchet MS";
    ctx.fillText("BOUNCE", sx + 10, y + 11);
  });

  // Lincoln ADHD pills
  visibleLincolnAdhd.forEach((adhd) => {
    const ay = terrainY(adhd.x) - adhd.yOffset;
    const sx = adhd.x - cameraX;
    if (sx < -80 || sx > canvas.width + 80) return;
    const size = adhd.r * 3.2;
    if (lincolnAdhdImg && lincolnAdhdImg.complete && lincolnAdhdImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, ay);
      ctx.rotate(Math.sin((performance.now() * 0.003) + adhd.index) * 0.15);
      ctx.drawImage(lincolnAdhdImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#ff5ef5";
      ctx.beginPath();
      ctx.roundRect(sx - adhd.r * 0.55, ay - adhd.r, adhd.r * 1.1, adhd.r * 2, adhd.r * 0.45);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${adhd.r}px Trebuchet MS`;
      ctx.textAlign = "center";
      ctx.fillText("A", sx, ay + adhd.r * 0.38);
      ctx.textAlign = "start";
    }
  });

  // Luke Red Bull cans
  visibleLukeRedBull.forEach((rb) => {
    const ry = terrainY(rb.x) - rb.yOffset;
    const sx = rb.x - cameraX;
    if (sx < -80 || sx > canvas.width + 80) return;
    const size = rb.r * 2.8;
    if (lukeRedBullImg && lukeRedBullImg.complete && lukeRedBullImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, ry);
      ctx.rotate(Math.sin((performance.now() * 0.0032) + rb.index) * 0.12);
      ctx.drawImage(lukeRedBullImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#1c5fcf";
      ctx.beginPath();
      ctx.roundRect(sx - rb.r * 0.55, ry - rb.r, rb.r * 1.1, rb.r * 2, rb.r * 0.2);
      ctx.fill();
      ctx.fillStyle = "#ff2a2a";
      ctx.font = `bold ${Math.round(rb.r * 0.75)}px Trebuchet MS`;
      ctx.textAlign = "center";
      ctx.fillText("RB", sx, ry + rb.r * 0.35);
      ctx.textAlign = "start";
    }
  });

  // Luke Coffee cups
  visibleLukeCoffee.forEach((cof) => {
    const cy2 = terrainY(cof.x) - cof.yOffset;
    const sx = cof.x - cameraX;
    if (sx < -80 || sx > canvas.width + 80) return;
    const size = cof.r * 2.8;
    if (lukeCoffeeImg && lukeCoffeeImg.complete && lukeCoffeeImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, cy2);
      ctx.rotate(Math.sin((performance.now() * 0.003) + cof.index) * 0.1);
      ctx.drawImage(lukeCoffeeImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#8d6e63";
      ctx.beginPath();
      ctx.arc(sx, cy2, cof.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.round(cof.r * 0.8)}px Trebuchet MS`;
      ctx.textAlign = "center";
      ctx.fillText("☕", sx, cy2 + cof.r * 0.35);
      ctx.textAlign = "start";
    }
  });

  // Lincoln immunity glow ring
  if (selectedCharacter.id === "lincolnjames" && actor.lincolnImmunityTimer > 0) {
    const sx = actor.x - cameraX;
    const pulse = 0.55 + 0.45 * Math.sin(performance.now() * 0.008);
    ctx.save();
    ctx.globalAlpha = pulse * 0.55;
    ctx.strokeStyle = "#ff5ef5";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(sx, actor.y, actor.radius + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Luke superspeed glow ring
  if (selectedCharacter.id === "lukepueppke" && actor.lukeSuperspeedTimer > 0) {
    const sx = actor.x - cameraX;
    const pulse = 0.55 + 0.45 * Math.sin(performance.now() * 0.01);
    ctx.save();
    ctx.globalAlpha = pulse * 0.6;
    ctx.strokeStyle = "#4fc3f7";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(sx, actor.y, actor.radius + 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

function drawCatapult() {
  const baseX = world.launchX - cameraX;
  const baseY = terrainY(world.launchX);
  const forkY  = baseY - 70;

  // Base platform
  ctx.fillStyle = "#8d5a3d";
  ctx.fillRect(baseX - 20, baseY - 14, 56, 18);

  // Vertical post
  ctx.fillStyle = "#6d3d2c";
  ctx.fillRect(baseX - 2, baseY - 72, 12, 60);

  // Y-fork left prong
  ctx.strokeStyle = "#6d3d2c";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(baseX + 4, forkY);
  ctx.lineTo(baseX - 12, forkY - 22);
  ctx.stroke();

  // Y-fork right prong
  ctx.beginPath();
  ctx.moveTo(baseX + 4, forkY);
  ctx.lineTo(baseX + 20, forkY - 22);
  ctx.stroke();
}

function drawActor() {
  const sx = actor.x - cameraX;
  const sy = actor.y;
  const image = selectedCharacter._img;

  ctx.save();
  
  // Apply backflip rotation for Eli
  if (selectedCharacter.id === "eli" && actor.backflipRotation > 0) {
    ctx.translate(sx, sy);
    ctx.rotate(actor.backflipRotation);
    ctx.translate(-sx, -sy);
  }

  if (selectedCharacter.id === "jjfootballboss" && actor.state !== "ready") {
    ctx.translate(sx, sy);
    ctx.rotate(actor.jjRollAngle || 0);
    ctx.translate(-sx, -sy);
  }
  
  ctx.beginPath();
  ctx.arc(sx, sy, actor.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  if (image && image.complete && image.naturalWidth > 10) {
    ctx.drawImage(image, sx - actor.radius, sy - actor.radius, actor.radius * 2, actor.radius * 2);
  } else {
    ctx.fillStyle = "#ffd6a6";
    ctx.fillRect(sx - actor.radius, sy - actor.radius, actor.radius * 2, actor.radius * 2);
    ctx.fillStyle = "#1b2442";
    ctx.font = `bold ${Math.round(actor.radius)}px Trebuchet MS`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(selectedCharacter.initials, sx, sy);
  }
  ctx.restore();

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ffffffdd";
  ctx.beginPath();
  ctx.arc(sx, sy, actor.radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFishingRod() {
  if (selectedCharacter.id !== "manning" || actor.state === "ready" || actor.state === "ended") return;

  const sx = actor.x - cameraX;
  const sy = actor.y;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouseWorldX = lastMouseX * scaleX + cameraX;
  const mouseWorldY = lastMouseY * scaleY;
  const dx = mouseWorldX - sx;
  const dy = mouseWorldY - sy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxDist = Math.max(1, dist);
  const dirX = dx / maxDist;
  const dirY = dy / maxDist;
  const angle = Math.atan2(dirY, dirX);
  const rodLength = 110;
  const rodEndX = sx + dirX * rodLength;
  const rodEndY = sy + dirY * rodLength;

  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(angle);

  if (manningFishingRodImg && manningFishingRodImg.complete && manningFishingRodImg.naturalWidth > 10) {
    const rodWidth = 40;
    const rodHeight = Math.max(90, rodLength * 0.9);
    ctx.drawImage(manningFishingRodImg, 0, -rodHeight / 2, rodWidth, rodHeight);
  } else {
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#8B6914";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rodLength, 0);
    ctx.stroke();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#DAA520";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rodLength, 0);
    ctx.stroke();
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(rodLength, 0, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawBraydenRacket() {
  if (selectedCharacter.id !== "brayden" || actor.state === "ended") return;

  const sx = actor.x - cameraX;
  const sy = actor.y;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouseWorldX = lastMouseX * scaleX + cameraX;
  const mouseWorldY = lastMouseY * scaleY;
  const angle = Math.atan2(mouseWorldY - sy, mouseWorldX - sx);

  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(angle);
  if (braydenRacketImg && braydenRacketImg.complete && braydenRacketImg.naturalWidth > 10) {
    ctx.drawImage(braydenRacketImg, -6, -22, 58, 44);
  } else {
    ctx.strokeStyle = "#e8e8e8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(36, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(44, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawKadeBMW() {
  if (selectedCharacter.id !== "kaderess" || actor.state === "ready") return;
  const sx = actor.x - cameraX;
  const sy = actor.y;
  const r = actor.radius;

  // BMW body — wider and lower than the portrait
  const carW = r * 4.2;
  const carH = r * 2.0;
  const carX = sx - carW / 2;
  const carY = sy - r * 0.3;  // sits just below portrait center

  ctx.save();
  if (kadeBMWImg && kadeBMWImg.complete && kadeBMWImg.naturalWidth > 10) {
    ctx.drawImage(kadeBMWImg, carX, carY, carW, carH);
  } else {
    // Fallback: draw a simple white car silhouette
    ctx.fillStyle = "#f0f0f0";
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(carX, carY + carH * 0.3, carW, carH * 0.55, 8);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(carX + carW * 0.18, carY, carW * 0.64, carH * 0.42, 6);
    ctx.fill();
    ctx.stroke();
    // Wheels
    ctx.fillStyle = "#222";
    ctx.beginPath(); ctx.arc(carX + carW * 0.22, carY + carH * 0.85, r * 0.36, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(carX + carW * 0.78, carY + carH * 0.85, r * 0.36, 0, Math.PI * 2); ctx.fill();
    // BMW roundel placeholder
    ctx.fillStyle = "#1c6fc9";
    ctx.beginPath(); ctx.arc(sx, carY + carH * 0.57, r * 0.22, 0, Math.PI * 2); ctx.fill();
  }

  // Speed glow when going fast
  if (actor.kadeSpeed > 600) {
    const alpha = Math.min(0.55, (actor.kadeSpeed - 600) / 2600);
    ctx.save();
    const grd = ctx.createRadialGradient(sx, sy, r * 0.3, sx, sy, r * 2.8);
    grd.addColorStop(0, `rgba(26,92,255,${alpha})`);
    grd.addColorStop(1, `rgba(26,92,255,0)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(sx - r * 1.2, sy + r * 0.3, r * 2.2, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawCalebTrex() {
  if (selectedCharacter.id !== "calebparker" || actor.state === "ready") return;
  const sx = actor.x - cameraX;
  const sy = actor.y;
  const r = actor.radius;

  const trexW = r * 5.8;
  const trexH = r * 3.2;
  const trexX = sx - trexW * 0.52;
  const trexY = sy - r * 0.35;

  ctx.save();
  if (calebTrexImg && calebTrexImg.complete && calebTrexImg.naturalWidth > 10) {
    ctx.drawImage(calebTrexImg, trexX, trexY, trexW, trexH);
  } else {
    // Fallback dinosaur shape
    ctx.fillStyle = "#4f6d3a";
    ctx.beginPath();
    ctx.ellipse(sx - r * 0.4, sy + r * 0.2, r * 2.2, r * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(sx + r * 1.7, sy - r * 0.3, r * 1.0, r * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(sx - r * 2.2, sy);
    ctx.lineTo(sx - r * 3.5, sy - r * 0.9);
    ctx.lineTo(sx - r * 2.8, sy + r * 0.2);
    ctx.closePath();
    ctx.fill();
  }

  if (actor.calebSpeed > 650) {
    const alpha = Math.min(0.5, (actor.calebSpeed - 650) / 2700);
    const grd = ctx.createRadialGradient(sx, sy, r * 0.3, sx, sy, r * 3.0);
    grd.addColorStop(0, `rgba(135,255,120,${alpha})`);
    grd.addColorStop(1, "rgba(135,255,120,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(sx - r * 1.4, sy + r * 0.4, r * 2.6, r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawTennisBalls() {
  tennisBalls.forEach((ball) => {
    const sx = ball.x - cameraX;
    if (sx < -60 || sx > canvas.width + 60) return;
    const size = ball.radius * 2;
    if (tennisBallImg && tennisBallImg.complete && tennisBallImg.naturalWidth > 8) {
      ctx.drawImage(tennisBallImg, sx - size / 2, ball.y - size / 2, size, size);
    } else {
      ctx.fillStyle = "#b6ff6a";
      ctx.beginPath();
      ctx.arc(sx, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawCandyBeam() {
  if (selectedCharacter.id !== "candyjew" || actor.rainbowBeamTimer <= 0) return;

  const sx = actor.x - cameraX;
  const sy = actor.y;
  const angle = -0.62;
  const len = 500;
  const ex = sx + Math.cos(angle) * len;
  const ey = sy + Math.sin(angle) * len;
  const alpha = Math.min(1, actor.rainbowBeamTimer * 2.5);
  const colors = ["#ff3b3b", "#ffa53b", "#ffe73b", "#57ff57", "#4aa3ff", "#c266ff"];

  ctx.save();
  ctx.globalAlpha = alpha * 0.82;
  ctx.lineCap = "round";
  colors.forEach((color, i) => {
    const offset = (i - 2.5) * 5;
    const ox = Math.cos(angle + Math.PI / 2) * offset;
    const oy = Math.sin(angle + Math.PI / 2) * offset;
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(sx + ox, sy + oy);
    ctx.lineTo(ex + ox, ey + oy);
    ctx.stroke();
  });
  ctx.restore();
}

function drawParticles() {
  impactBursts.forEach((b) => {
    const alpha = Math.max(0, b.life / b.maxLife);
    ctx.globalAlpha = alpha * 0.65;
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#ffb067";
    ctx.beginPath();
    ctx.arc(b.x - cameraX, b.y, b.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.35;
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#ff6e5a";
    ctx.beginPath();
    ctx.arc(b.x - cameraX, b.y, b.radius * 0.6, 0, Math.PI * 2);
    ctx.stroke();
  });

  particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x - cameraX, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawBombs() {
  bombs.forEach((bomb) => {
    if (bomb.exploded) return;
    const sx = bomb.x - cameraX;
    if (sx < -120 || sx > canvas.width + 120) return;

    if (spencerBombImg && spencerBombImg.complete && spencerBombImg.naturalWidth > 10) {
      const size = bomb.radius * 2.2;
      ctx.save();
      ctx.translate(sx, bomb.y);
      ctx.rotate((bomb.vx * 0.002 + bomb.vy * 0.001) * 0.6);
      ctx.drawImage(spencerBombImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#2b2b2b";
      ctx.beginPath();
      ctx.arc(sx, bomb.y, bomb.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffb347";
      ctx.beginPath();
      ctx.arc(sx + 4, bomb.y - 5, bomb.radius * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawTrajectory() {
  if (!isDragging || !launchVector) return;
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  trajectoryDots.forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x - cameraX, dot.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSlingshotBands() {
  if (!isDragging || actor.state !== "ready") return;

  const baseX  = world.launchX - cameraX;
  const baseY  = terrainY(world.launchX);
  const forkY  = baseY - 70;
  const actorSX = actor.x - cameraX;

  ctx.strokeStyle = "#8B4513";
  ctx.lineWidth = 4;

  // Left band: left prong tip → actor
  ctx.beginPath();
  ctx.moveTo(baseX - 12, forkY - 22);
  ctx.lineTo(actorSX, actor.y);
  ctx.stroke();

  // Right band: right prong tip → actor
  ctx.beginPath();
  ctx.moveTo(baseX + 20, forkY - 22);
  ctx.lineTo(actorSX, actor.y);
  ctx.stroke();
}

function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(screenShakeX, screenShakeY);
  drawBackground();
  drawGround();
  drawMapDecor();
  drawCatapult();
  drawSlingshotBands();
  drawTrajectory();
  drawKadeBMW();
  drawCalebTrex();
  drawActor();
  drawFishingRod();
  drawBraydenRacket();
  drawCandyBeam();
  drawTennisBalls();
  drawBombs();
  drawParticles();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawConfetti();
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

function isUnlocked(c) {
  return c.unlockAt <= world.bestDistance;
}

function renderCharacterCards() {
  characterGrid.innerHTML = "";
  characters.forEach((c) => {
    const card = document.createElement("article");
    card.className = `character-card ${selectedCharacter.id === c.id ? "selected" : ""} ${isUnlocked(c) ? "" : "locked"}`;

    const img = document.createElement("img");
    img.alt = `${c.name} portrait`;
    const [pngPath, jpgPath] = getCharacterImageCandidates(c);
    img.src = pngPath;

    const fallback = document.createElement("div");
    fallback.className = "character-fallback";
    fallback.textContent = c.initials;

    img.onerror = () => {
      if (img.src.endsWith(".png")) {
        img.src = jpgPath;
        return;
      }
      img.replaceWith(fallback);
    };

    const title = document.createElement("h3");
    title.textContent = c.name;

    const trait = document.createElement("p");
    trait.textContent = c.bio;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = isUnlocked(c) ? c.trait : `Unlock at ${c.unlockAt}m`;

    card.append(img, title, trait, tag);

    card.addEventListener("click", () => {
      if (!isUnlocked(c)) return;
      selectedCharacter = c;
      applyCharacterStats(c);
      updateAbilityHint();
      renderCharacterCards();
    });

    characterGrid.append(card);
  });
}

function showMenu() {
  menuScreen.classList.add("active");
  characterScreen.classList.remove("active");
  controlsPanel.classList.add("hidden");
}

function showCharacterSelect() {
  menuScreen.classList.remove("active");
  characterScreen.classList.add("active");
  controlsPanel.classList.add("hidden");
  renderCharacterCards();
}

function startGame() {
  menuScreen.classList.remove("active");
  characterScreen.classList.remove("active");
  controlsPanel.classList.remove("hidden");
  applyCharacterStats(selectedCharacter);
  resetActor();
}

function preloadCharacterImages() {
  characters.forEach((c) => {
    const img = new Image();
    const [pngPath, jpgPath] = getCharacterImageCandidates(c);
    img.onerror = () => {
      if (!img.src.endsWith(".jpg")) {
        img.src = jpgPath;
      }
    };
    img.src = pngPath;
    c._img = img;
  });

  fatalObstacleImg = new Image();
  let fatalIndex = 0;
  fatalObstacleImg.onerror = () => {
    fatalIndex += 1;
    if (fatalIndex < fatalObstacleImageCandidates.length) {
      fatalObstacleImg.src = fatalObstacleImageCandidates[fatalIndex];
    }
  };
  fatalObstacleImg.src = fatalObstacleImageCandidates[fatalIndex];

  spencerBombImg = new Image();
  let bombIndex = 0;
  spencerBombImg.onerror = () => {
    bombIndex += 1;
    if (bombIndex < spencerBombImageCandidates.length) {
      spencerBombImg.src = spencerBombImageCandidates[bombIndex];
    }
  };
  spencerBombImg.src = spencerBombImageCandidates[bombIndex];

  manningFishingRodImg = new Image();
  let rodIndex = 0;
  manningFishingRodImg.onerror = () => {
    rodIndex += 1;
    if (rodIndex < manningFishingRodImageCandidates.length) {
      manningFishingRodImg.src = manningFishingRodImageCandidates[rodIndex];
    }
  };
  manningFishingRodImg.src = manningFishingRodImageCandidates[rodIndex];

  braydenBeerImg = new Image();
  let beerIndex = 0;
  braydenBeerImg.onerror = () => {
    beerIndex += 1;
    if (beerIndex < braydenBeerImageCandidates.length) {
      braydenBeerImg.src = braydenBeerImageCandidates[beerIndex];
    }
  };
  braydenBeerImg.src = braydenBeerImageCandidates[beerIndex];

  braydenRacketImg = new Image();
  let racketIndex = 0;
  braydenRacketImg.onerror = () => {
    racketIndex += 1;
    if (racketIndex < braydenRacketImageCandidates.length) {
      braydenRacketImg.src = braydenRacketImageCandidates[racketIndex];
    }
  };
  braydenRacketImg.src = braydenRacketImageCandidates[racketIndex];

  tennisBallImg = new Image();
  let tennisBallIndex = 0;
  tennisBallImg.onerror = () => {
    tennisBallIndex += 1;
    if (tennisBallIndex < tennisBallImageCandidates.length) {
      tennisBallImg.src = tennisBallImageCandidates[tennisBallIndex];
    }
  };
  tennisBallImg.src = tennisBallImageCandidates[tennisBallIndex];

  reedBurgerImg = new Image();
  let reedBurgerIndex = 0;
  reedBurgerImg.onerror = () => {
    reedBurgerIndex += 1;
    if (reedBurgerIndex < reedBurgerImageCandidates.length) {
      reedBurgerImg.src = reedBurgerImageCandidates[reedBurgerIndex];
    }
  };
  reedBurgerImg.src = reedBurgerImageCandidates[reedBurgerIndex];

  myerPotGoldImg = new Image();
  let myerPotGoldIndex = 0;
  myerPotGoldImg.onerror = () => {
    myerPotGoldIndex += 1;
    if (myerPotGoldIndex < myerPotGoldImageCandidates.length) {
      myerPotGoldImg.src = myerPotGoldImageCandidates[myerPotGoldIndex];
    }
  };
  myerPotGoldImg.src = myerPotGoldImageCandidates[myerPotGoldIndex];

  jjNeedleImg = new Image();
  let jjNeedleIndex = 0;
  jjNeedleImg.onerror = () => {
    jjNeedleIndex += 1;
    if (jjNeedleIndex < jjNeedleImageCandidates.length) {
      jjNeedleImg.src = jjNeedleImageCandidates[jjNeedleIndex];
    }
  };
  jjNeedleImg.src = jjNeedleImageCandidates[jjNeedleIndex];

  kadeBMWImg = new Image();
  kadeBMWImg.src = "characters props/Kade BMW.png";

  calebTrexImg = new Image();
  calebTrexImg.src = "characters props/Caleb Trex.webp";

  lincolnAdhdImg = new Image();
  let lincolnAdhdIdx = 0;
  lincolnAdhdImg.onerror = () => {
    lincolnAdhdIdx += 1;
    if (lincolnAdhdIdx < lincolnAdhdImageCandidates.length) lincolnAdhdImg.src = lincolnAdhdImageCandidates[lincolnAdhdIdx];
  };
  lincolnAdhdImg.src = lincolnAdhdImageCandidates[0];

  lukeRedBullImg = new Image();
  let lukeRedBullIdx = 0;
  lukeRedBullImg.onerror = () => {
    lukeRedBullIdx += 1;
    if (lukeRedBullIdx < lukeRedBullImageCandidates.length) lukeRedBullImg.src = lukeRedBullImageCandidates[lukeRedBullIdx];
  };
  lukeRedBullImg.src = lukeRedBullImageCandidates[0];

  lukeCoffeeImg = new Image();
  let lukeCoffeeIdx = 0;
  lukeCoffeeImg.onerror = () => {
    lukeCoffeeIdx += 1;
    if (lukeCoffeeIdx < lukeCoffeeImageCandidates.length) lukeCoffeeImg.src = lukeCoffeeImageCandidates[lukeCoffeeIdx];
  };
  lukeCoffeeImg.src = lukeCoffeeImageCandidates[0];

  jacksonFootballImg = new Image();
  let jacksonFootballIndex = 0;
  jacksonFootballImg.onerror = () => {
    jacksonFootballIndex += 1;
    if (jacksonFootballIndex < jacksonFootballImageCandidates.length) {
      jacksonFootballImg.src = jacksonFootballImageCandidates[jacksonFootballIndex];
    }
  };
  jacksonFootballImg.src = jacksonFootballImageCandidates[jacksonFootballIndex];

  townSquareMapImg = new Image();
  let townSquareIdx = 0;
  townSquareMapImg.onerror = () => {
    townSquareIdx += 1;
    if (townSquareIdx < townSquareMapImageCandidates.length) {
      townSquareMapImg.src = townSquareMapImageCandidates[townSquareIdx];
    }
  };
  townSquareMapImg.src = townSquareMapImageCandidates[townSquareIdx];

  candyImgs.length = 0;
  candyImageCandidates.forEach((path) => {
    const img = new Image();
    img.src = path;
    candyImgs.push(img);
  });
}

angleSlider.addEventListener("input", () => {
  angleLabel.textContent = angleSlider.value;
});

powerSlider.addEventListener("input", () => {
  powerLabel.textContent = `${powerSlider.value}`;
});

toSelectBtn.addEventListener("click", showCharacterSelect);
backToMenuBtn.addEventListener("click", showMenu);
document.getElementById("changeCharBtn").addEventListener("click", () => {
  showCharacterSelect();
});
switchMapBtn?.addEventListener("click", toggleMap);
signUpBtn?.addEventListener("click", async () => {
  try {
    const email = accountEmailInput?.value?.trim();
    const password = accountPasswordInput?.value || "";
    if (!email || !password) {
      alert("Enter email and password first.");
      return;
    }
    const data = await signUpAccount(email, password);
    if (!data?.access_token) {
      alert("Sign-up created. If email confirmation is enabled, confirm then sign in.");
    }
  } catch (e) {
    alert(e.message || "Sign-up failed");
  }
});

signInBtn?.addEventListener("click", async () => {
  try {
    const email = accountEmailInput?.value?.trim();
    const password = accountPasswordInput?.value || "";
    if (!email || !password) {
      alert("Enter email and password first.");
      return;
    }
    await signInAccount(email, password);
  } catch (e) {
    alert(e.message || "Sign-in failed");
  }
});

signOutBtn?.addEventListener("click", () => {
  signOutAccount();
});

playBtn.addEventListener("click", () => {
  if (!isUnlocked(selectedCharacter)) {
    selectedCharacter = characters.find((c) => isUnlocked(c)) || characters[0];
  }
  startGame();
  resetActor();
});
launchBtn.addEventListener("click", launch);
restartBtn.addEventListener("click", () => {
  resetActor();
  distanceValue.textContent = "0";
  updateHeightUI();
});

window.addEventListener("keydown", (ev) => {
  if (ev.code === "Space") {
    ev.preventDefault();
    const now = performance.now();

    if (selectedCharacter.id === "spencer") {
      if (pendingSpencerJumpTimeout && now - lastSpaceTime < 300) {
        clearTimeout(pendingSpencerJumpTimeout);
        pendingSpencerJumpTimeout = null;
        useSpencerBomb();
        lastSpaceTime = 0;
      } else {
        lastSpaceTime = now;
        pendingSpencerJumpTimeout = setTimeout(() => {
          pendingSpencerJumpTimeout = null;
          useSpencerJump();
        }, 220);
      }
      return;
    }

    if (selectedCharacter.id === "anthony" && now - lastSpaceTime < 320) {
      useTruck();
      lastSpaceTime = 0; // reset so triple-tap doesn't double-trigger
    } else if (selectedCharacter.id === "jjfootballboss" && now - lastSpaceTime < 320) {
      useJJDoubleJump();
      lastSpaceTime = 0;
    } else {
      useAbility();
      lastSpaceTime = now;
    }
  }
});

// Helper: convert a MouseEvent into canvas-space world coordinates
function canvasCoords(ev) {
  const rect   = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    wx: (ev.clientX - rect.left) * scaleX + cameraX,
    wy: (ev.clientY - rect.top)  * scaleY,
  };
}

canvas.addEventListener("mousedown", (ev) => {
  if (actor.state !== "ready") return;

  const { wx, wy } = canvasCoords(ev);
  const dx = wx - actor.x;
  const dy = wy - actor.y;

  if (Math.sqrt(dx * dx + dy * dy) < actor.radius + 18) {
    isDragging = true;
    ensureAudio();
  }
});

canvas.addEventListener("mousemove", (ev) => {
  lastMouseX = ev.clientX - canvas.getBoundingClientRect().left;
  lastMouseY = ev.clientY - canvas.getBoundingClientRect().top;

  if (!isDragging || actor.state !== "ready") return;

  const { wx, wy } = canvasCoords(ev);
  const anchorX = world.launchX;
  const anchorY = terrainY(world.launchX) - 70;

  const dragDx  = wx - anchorX;
  const dragDy  = wy - anchorY;
  const dragDist = Math.sqrt(dragDx * dragDx + dragDy * dragDy);

  const clamped   = Math.min(dragDist, MAX_DRAG_DISTANCE);
  const dragAngle = Math.atan2(dragDy, dragDx);

  // Move actor to clamped drag position (world coords)
  actor.x = anchorX + Math.cos(dragAngle) * clamped;
  actor.y = anchorY + Math.sin(dragAngle) * clamped;

  // Launch is the opposite direction
  const launchAngle = dragAngle + Math.PI;
  const power       = clamped * DRAG_POWER_SCALE;

  launchVector = {
    vx:    Math.cos(launchAngle) * power,
    vy:    Math.sin(launchAngle) * power,
    power: (clamped / MAX_DRAG_DISTANCE) * 100,
  };

  // Update display labels
  const displayDeg = Math.round(
    Math.atan2(-launchVector.vy, launchVector.vx) * (180 / Math.PI)
  );
  angleLabel.textContent = displayDeg;
  powerLabel.textContent = Math.round(launchVector.power);

  // Trajectory prediction via proper physics integration
  trajectoryDots.length = 0;
  let tx  = actor.x;
  let ty  = actor.y;
  let tvx = launchVector.vx * selectedCharacter.launchBoost;
  let tvy = launchVector.vy * selectedCharacter.launchBoost;
  const DT = 0.04;

  for (let i = 0; i < 50; i++) {
    tvx -= tvx * actor.drag * DT;
    tvy += world.gravity * actor.gravityMult * DT;
    tx  += tvx * DT;
    ty  += tvy * DT;
    trajectoryDots.push({ x: tx, y: ty });
    if (ty > terrainY(tx) || tx < 0) break;
  }
});

canvas.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;

  if (launchVector) {
    launch();
  } else {
    // Snap back to fork
    actor.x = world.launchX;
    actor.y = terrainY(world.launchX) - 70;
    trajectoryDots.length = 0;
  }
  dragStart = null;
});

canvas.addEventListener("mouseleave", () => {
  if (!isDragging) return;
  isDragging = false;
  dragStart  = null;
  actor.x    = world.launchX;
  actor.y    = terrainY(world.launchX) - 70;
  launchVector = null;
  trajectoryDots.length = 0;
});

preloadCharacterImages();
updateHighScoreUI();
updateHeightUI();
updateMapUI();
loadAuthSession();
subscribeToLeaderboard();
showMenu();
resetActor();

submitScoreBtn.addEventListener("click", async () => {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Please enter your name!");
    return;
  }
  const distance = actor.maxX - world.launchX;
  const travelled = parseFloat((distance / 10).toFixed(1));
  const cloudOk = await pushCloudLeaderboardEntry(name, travelled);
  if (!cloudOk) {
    addScoreToLeaderboard(name, distance);
  }
  await fetchCloudLeaderboard();
  displayLeaderboard();
  submitScoreBtn.disabled = true;
  playerNameInput.disabled = true;
  playerNameInput.value = cloudOk ? "Score submitted!" : "Saved locally (cloud sync failed)";
});

if (leaderboardModeBtn) {
  leaderboardModeBtn.addEventListener("click", () => {
    leaderboardViewMode = leaderboardViewMode === "character" ? "all" : "character";
    displayLeaderboard();
  });
}

playAgainBtn.addEventListener("click", () => {
  startNextRunSameCharacter();
  world.bestDistance = Math.max(world.bestDistance, actor.maxX - world.launchX);
  localStorage.setItem(STORAGE_KEY, String(world.bestDistance));
  updateHighScoreUI();
});

requestAnimationFrame(frame);
