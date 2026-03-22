const STORAGE_KEY = "faith-flight-best";
const LEADERBOARD_KEY = "faith-flight-leaderboard";
const AUTH_SESSION_KEY = "faith-flight-auth-session";
const LOCAL_ACCOUNTS_KEY = "faith-flight-local-accounts";
const CUSTOM_CHARACTERS_KEY = "faith-flight-custom-characters";
const PROFILE_PICTURES_KEY = "faith-flight-profile-pictures";
const H2H_RANKINGS_KEY = "faith-flight-h2h-rankings";
const MAX_LEADERBOARD_ENTRIES = 10;
const CLOUD_LEADERBOARD_FETCH_LIMIT = 200;
const AUTH_ACCOUNT_DOMAIN = "faithflightgame.com";
const GAME_ACCOUNT_CREATE_RPC = "create_game_account";
const GAME_ACCOUNT_VERIFY_RPC = "verify_game_account";
const GAME_RANKED_UPSERT_RPC = "upsert_game_ranked_profile";
const SUPABASE_URL = "https://ntbmkktrjwxcfrgohnha.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50Ym1ra3Ryand4Y2ZyZ29obmhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTc1OTYsImV4cCI6MjA4ODc5MzU5Nn0.hLKErva9m7LTWX9g9X8TCAzSgAWaL6SVlxR6H5KIHrM";
const SUPABASE_LEADERBOARD_TABLE = "leaderboard_scores";
const SUPABASE_H2H_RANKED_TABLE = "head_to_head_rankings";
const ADMIN_ACCOUNT_NAME = "admin";
const ADMIN_ACCOUNT_PASSWORD = "admin123";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const appRoot = document.getElementById("app");

const menuScreen = document.getElementById("menuScreen");
const characterScreen = document.getElementById("characterScreen");
const controlsPanel = document.getElementById("controlsPanel");
const leaderboardScreen = document.getElementById("leaderboardScreen");
const characterGrid = document.getElementById("characterGrid");

const toSelectBtn = document.getElementById("toSelectBtn");
const headToHeadBtn = document.getElementById("headToHeadBtn");
const privateHeadToHeadBtn = document.getElementById("privateHeadToHeadBtn");
const headToHeadNameInput = document.getElementById("headToHeadNameInput");
const privateMatchCodeInput = document.getElementById("privateMatchCodeInput");
const matchmakingScreen = document.getElementById("matchmakingScreen");
const matchmakingStatus = document.getElementById("matchmakingStatus");
const cancelMatchmakingBtn = document.getElementById("cancelMatchmakingBtn");
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
const hudHeadToHeadBtn = document.getElementById("hudHeadToHeadBtn");
const mapSelectDropdown = document.getElementById("mapSelectDropdown");
const mobileControls = document.getElementById("mobileControls");
const mobilePrimaryBtn = document.getElementById("mobilePrimaryBtn");
const mobileSecondaryBtn = document.getElementById("mobileSecondaryBtn");

const playerNameInput = document.getElementById("playerNameInput");
const submitScoreBtn = document.getElementById("submitScoreBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const finalScore = document.getElementById("finalScore");
const leaderboardList = document.getElementById("leaderboardList");
const rankedLeaderboardList = document.getElementById("rankedLeaderboardList");
const leaderboardTitle = document.getElementById("leaderboardTitle");
const leaderboardCharBtn = document.getElementById("leaderboardCharBtn");
const leaderboardMapBtn = document.getElementById("leaderboardMapBtn");
const leaderboardAllBtn = document.getElementById("leaderboardAllBtn");
const accountEmailInput = document.getElementById("accountEmailInput");
const accountNameInput = accountEmailInput;
const accountPasswordInput = document.getElementById("accountPasswordInput");
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const accountStatus = document.getElementById("accountStatus");
const profilePicDrop = document.getElementById("profilePicDrop");
const profilePicInput = document.getElementById("profilePicInput");
const accountProfilePreview = document.getElementById("accountProfilePreview");
const adminCharacterPanel = document.getElementById("adminCharacterPanel");
const makerAiDescriptionInput = document.getElementById("makerAiDescription");
const makerAiGenerateBtn = document.getElementById("makerAiGenerateBtn");
const makerNameInput = document.getElementById("makerName");
const makerIdInput = document.getElementById("makerId");
const makerInitialsInput = document.getElementById("makerInitials");
const makerImageBaseInput = document.getElementById("makerImageBase");
const makerCharacterPngInput = document.getElementById("makerCharacterPngInput");
const makerItemPngInput = document.getElementById("makerItemPngInput");
const makerCharacterPreview = document.getElementById("makerCharacterPreview");
const makerItemPreview = document.getElementById("makerItemPreview");
const makerTraitInput = document.getElementById("makerTrait");
const makerBioInput = document.getElementById("makerBio");
const makerAbilityInput = document.getElementById("makerAbility");
const makerMassInput = document.getElementById("makerMass");
const makerRadiusInput = document.getElementById("makerRadius");
const makerDragInput = document.getElementById("makerDrag");
const makerBounceInput = document.getElementById("makerBounce");
const makerGravityMultInput = document.getElementById("makerGravityMult");
const makerLaunchBoostInput = document.getElementById("makerLaunchBoost");
const makerUnlockAtInput = document.getElementById("makerUnlockAt");
const makerAddBtn = document.getElementById("makerAddBtn");
const makerRemoveIdInput = document.getElementById("makerRemoveId");
const makerRemoveBtn = document.getElementById("makerRemoveBtn");
const hudTop = document.querySelector(".hud-top");

let authSession = null;
let rankedCloudFetchInFlight = false;
let rankedCloudLastFetchAt = 0;
let authRequestInFlight = false;
let leaderboardViewMode = "character";
let leaderboardRunCharacterId = "";
let leaderboardRunCharacterName = "";
let leaderboardRunMapId = "";
let leaderboardRunMapName = "";
const headToHeadRivals = ["Riley", "Jordan", "Blake", "Avery", "Parker", "Casey", "Logan", "Sky", "Taylor"];
const AIR_FORCE_RANKS = [
  { name: "Airman Basic", code: "AB/E-1", minRating: 1000 },
  { name: "Airman", code: "Amn/E-2", minRating: 1075 },
  { name: "Airman First Class", code: "A1C/E-3", minRating: 1150 },
  { name: "Senior Airman", code: "SrA/E-4", minRating: 1225 },
  { name: "Staff Sergeant", code: "SSgt/E-5", minRating: 1300 },
  { name: "Technical Sergeant", code: "TSgt/E-6", minRating: 1400 },
  { name: "Master Sergeant", code: "MSgt/E-7", minRating: 1500 },
  { name: "Senior Master Sergeant", code: "SMSgt/E-8", minRating: 1625 },
  { name: "Chief Master Sergeant", code: "CMSgt/E-9", minRating: 1750 },
  { name: "Command Chief Master Sergeant", code: "CCM/E-9S", minRating: 1900 },
  { name: "Chief Master Sergeant of the Air Force", code: "CMSAF/E-9S", minRating: 2100 },
];

const headToHeadState = {
  mode: "idle", // idle | searching | roulette | active
  active: false,
  searchTimer: 0,
  rouletteTimer: 0,
  rouletteTickTimer: 0,
  rouletteDuration: 2.8,
  randomCharacter: null,
  randomMapIndex: 0,
  rivalName: "Rival",
  opponentActor: null,
  opponentCameraX: 0,
  opponentJumpTimer: 0,
  opponentStoppedTimer: 0,
  opponentFinished: false,
  localFinished: false,
  localFinalDistance: 0,
  localFinishMessage: "",
  resultText: "",
  localWonLastMatch: false,
  liveNetwork: false,
};

const networkState = {
  enabled: false,
  client: null,
  queueChannel: null,
  roomChannel: null,
  playerId: `p-${Math.random().toString(36).slice(2, 10)}`,
  peerId: null,
  roomId: null,
  searching: false,
  searchElapsed: 0,
  heartbeatTimer: 0,
  snapshotTimer: 0,
  opponentSnapshot: null,
  opponentFinished: false,
  opponentFinalDistance: 0,
  localFinishSent: false,
  displayName: "",
  connectingRoom: false,
  privateCode: "",
  queueBridgeInterval: null,
  queueBridgeTimeout: null,
};

const world = {
  width: 12000,
  launchX: 160,
  gravity: 1200,
  markersEvery: 100,
  maxCameraX: 0,
  bestDistance: Number(localStorage.getItem(STORAGE_KEY) || 0),
};

const ABILITY_COOLDOWN_SECONDS = 3;
const JJ_TRUCK_MAX = 1;
const JJ_TRUCK_REGEN_SECONDS = 6;
const JJ_JUMP_MAX = 1;
const JJ_JUMP_REGEN_SECONDS = 3;
const KADE_JUMP_RESET_SPEED = 100; // px/s — base speed after jump penalty
const KADE_ACCEL = 280;            // px/s² passive BMW acceleration
const KADE_MAX_SPEED = 5000;       // px/s top speed cap
const NATHAN_JUMP_RESET_SPEED = 110;
const NATHAN_ACCEL = 255;
const NATHAN_MAX_SPEED = 4600;
const NATHAN_GAS_TARGET = 5;
const DAVY_JUMP_RESET_SPEED = 110;
const DAVY_ACCEL = 335;
const DAVY_MAX_SPEED = 6200;
const DAVY_GOD_MODE_DURATION = 5.2;
const DAVY_GOD_MODE_INTERVAL_MIN = 8;
const DAVY_GOD_MODE_INTERVAL_MAX = 14;
const CALEB_JUMP_VY = 760;         // fixed jump strength
const CALEB_JUMP_COOLDOWN = 2.5;   // seconds between jumps
const CALEB_ACCEL = 190;           // px/s² passive T-Rex acceleration
const CALEB_MAX_SPEED = 3600;      // px/s top speed cap
const CALEB_ON_FOOT_RADIUS = 24;
const CALEB_ON_FOOT_DRAG = 0.064;
const CALEB_ON_FOOT_BOUNCE = 0.5;
const CALEB_ON_FOOT_GRAVITY = 0.96;
const BRAYDEN_BASE_JUMP_COOLDOWN = 0.9;
const BRAYDEN_RAGE_JUMP_COOLDOWN = 1.5;
const SPENCER_MAX_HEIGHT_M = 200;

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
const LUKE_ITEM_JUMP_BONUS  = 9;   // extra vx per item
const LUKE_ITEM_JUMP_MAX    = 760; // cap
const LUKE_SUPERSPEED_THRESHOLD = 10;
const LUKE_SUPERSPEED_VX        = 3000; // px/s during superspeed
const LUKE_SUPERSPEED_DURATION  = 3;    // seconds
const NATE_PHASE_COOLDOWN       = 10;
const TRAVIS_CRADDLES_FOR_LAUNCH = 10;
const TRAVIS_LAUNCH_FORWARD_METERS = 300;
const SAM_DUMBBELLS_PER_BENCH = 5;
const SAM_BENCH_VISIBLE_SECONDS = 8;
const SAM_SWIM_ACTIVE_SECONDS = 4.0;
const SAM_JUMP_REGEN_SECONDS = 5.2;
const EVAN_BASKETBALL_COOLDOWN = 5;
const OWEN_MILKS_PER_LIFE = 5;
const STRIC_WOODS_BOSS_TRIGGER_M = 10000;
const NETWORK_QUEUE_CHANNEL = "faith-h2h-queue-v1";
const NETWORK_HEARTBEAT_SECONDS = 0.9;
const NETWORK_SEARCH_TIMEOUT_SECONDS = 12;
const NETWORK_SNAPSHOT_SECONDS = 0.09;

const maps = [
  { id: "campus", name: "Campus" },
  { id: "town-square", name: "Town Square" },
  { id: "long-john-silvers", name: "Long John Silvers" },
];
let currentMapIndex = 0;
let townSquareMapImg = null;
let stricWoodsMapImgs = [];
let longJohnSilversMapImg = null;
const townSquareMapImageCandidates = [
  "Map 2 (Town Sqaure).png",
  "Map 2 (Town Square).png",
  "assets/images/town-square.png",
];
const stricWoodsMapImageCandidates = [
  ["assets/images/stricwoods/page1.png"],
  ["assets/images/stricwoods/page2.png"],
  ["assets/images/stricwoods/page3.png"],
  ["assets/images/stricwoods/page4.png"],
];
const longJohnSilversMapImageCandidates = [
  "Long John Silvers Map.png",
  "Long John Silvers Map.pdf",
];

const ljsObstacleImageCandidates = [
  "Obstacle for Long John Silvers Map.png",
];
const ljsProjectileImageCandidates = [
  "Long John SIlvers Projectiles.jpg",
];
let ljsObstacleImg = null;
let ljsProjectileImg = null;
let davyRideImg = null;
const ljsObstaclePositionCache = [];
const ljsObstacleCache = new Map();
const ljsHazardCooldowns = new Map();

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
    trait: "Rocket boost",
    bio: "Mid-small build. Low drag and a floaty arc. Space fires a risky rocket burst.",
    imageBase: "assets/images/hunter",
    initials: "H",
    mass: 0.82,
    radius: 34,
    drag: 0.16,
    bounce: 0.60,
    gravityMult: 1.09,
    launchBoost: 1.10,
    unlockAt: 0,
    ability: "rocket",
  },
  {
    id: "anthony",
    name: "Anthony",
    trait: "Shrinking truck slammer",
    bio: "Space: slam upward. Double-Space: truck blast. Every 100m he shrinks, gets lighter, and gains speed.",
    imageBase: "Sal",
    initials: "A",
    mass: 0.82,
    radius: 34,
    drag: 0.16,
    bounce: 0.60,
    gravityMult: 1.09,
    launchBoost: 1.10,
    unlockAt: 0,
    ability: "slam",
  },
  {
    id: "davy",
    name: "Davy",
    trait: "Sailor's ride + shrimp cannon",
    bio: "Rides Davy's Ride like Nathan's Tacoma. Fires shrimp projectiles. On Long John Silvers map: rapid shrimp barrage + random god mode every 10-20s with a massive flame dive.",
    imageBase: "Davy",
    initials: "DV",
    mass: 1.48,
    radius: 33,
    drag: 0.03,
    bounce: 0.54,
    gravityMult: 0.96,
    launchBoost: 1.16,
    unlockAt: 0,
    ability: "davytruck",
  },
  {
    id: "nathan",
    name: "Nathan",
    trait: "Tacoma airstrike",
    bio: "Cruises in his Tacoma. Collect gas cans. Space: jump + aimable Trump shot. At 5 gallons, a translucent flag appears and next Space calls a jet airstrike.",
    imageBase: "Nate",
    initials: "NA",
    mass: 1.48,
    radius: 33,
    drag: 0.03,
    bounce: 0.54,
    gravityMult: 0.96,
    launchBoost: 1.16,
    unlockAt: 0,
    ability: "trumpjump",
  },
  {
    id: "nate",
    name: "Nate Elliot",
    trait: "Bouncer",
    bio: "Spring-loaded bouncer build. Pops off terrain and pads with huge rebound to keep chaining forward hops.",
    imageBase: "assets/images/nate",
    initials: "N",
    mass: 0.62,
    radius: 21,
    drag: 0.055,
    bounce: 0.9,
    gravityMult: 0.84,
    launchBoost: 1.30,
    unlockAt: 0,
    ability: "warp",
  },
  {
    id: "traviswilliams",
    name: "Travis Williams",
    trait: "Cradle snatcher",
    bio: "A lightweight chaos runner who snatches cradles off the track. Grab 10 cradles to rocket skyward and sling 300m forward.",
    imageBase: "Travis Williams",
    initials: "TW",
    mass: 0.58,
    radius: 20,
    drag: 0.062,
    bounce: 0.72,
    gravityMult: 0.88,
    launchBoost: 1.30,
    unlockAt: 0,
    ability: "travisjump",
  },
  {
    id: "matteo",
    name: "Matteo Schirripa",
    trait: "Cradle truck slammer",
    bio: "A powerhouse cradle snatcher with Anthony's road rage and Spencer's build. Space: slam, Double-Space: truck blast. Pocket 10 cradles to rocket 300m forward — don't leave yours unattended.",
    imageBase: "Matteo Schirripa",
    initials: "MS",
    mass: 1.68,
    radius: 38,
    drag: 0.05,
    bounce: 0.78,
    gravityMult: 0.86,
    launchBoost: 1.5,
    unlockAt: 0,
    ability: "slam",
  },
  {
    id: "spencer",
    name: "Spencer",
    trait: "Bomb sprinter",
    bio: "Starts fast. Space for jump, double-Space for bomb. Bombs destroy Hugh Henderson but slow him down.",
    imageBase: "Spencer",
    initials: "S",
    mass: 1.68,
    radius: 38,
    drag: 0.05,
    bounce: 0.78,
    gravityMult: 0.86,
    launchBoost: 1.56,
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
    bounce: 0.6,
    gravityMult: 0.86,
    launchBoost: 1.32,
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
    bio: "Roll over creatine tubs to get bigger and faster. Space uses truck boost. Double-Space for a jump.",
    imageBase: "JJFOOTBALLBOSS",
    initials: "JJ",
    mass: 1.22,
    radius: 30,
    drag: 0.096,
    bounce: 0.56,
    gravityMult: 1.02,
    launchBoost: 1.08,
    unlockAt: 0,
    ability: "truck",
  },
  {
    id: "kaderess",
    name: "Kade Rees",
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
    bio: "Collect Red Bull & Coffee to jump further and faster. 10 items = SUPERSPEED for 3 seconds!",
    imageBase: "Luke Pueppke",
    initials: "LP",
    mass: 0.95,
    radius: 25,
    drag: 0.072,
    bounce: 0.58,
    gravityMult: 0.92,
    launchBoost: 1.22,
    unlockAt: 0,
    ability: "lukejump",
  },
  {
    id: "owen",
    name: "Owen",
    trait: "Bone-strength collector",
    bio: "Average speed, jump, and launch. Collect milk: every 5 milks grants +1 life. Very hard falls cost a life.",
    imageBase: "Owen",
    initials: "O",
    mass: 1.0,
    radius: 26,
    drag: 0.105,
    bounce: 0.5,
    gravityMult: 1.0,
    launchBoost: 1.16,
    unlockAt: 0,
    ability: "owenjump",
  },
  {
    id: "samhallet",
    name: "Sam Hallet",
    trait: "Bench press swimmer",
    bio: "Balanced mover with high bounce. Collect dumbbells. Every 5 dumbbells spawns a temporary bench press. Hit bench for +1 swim charge and +1 Hugh pass per swim. Double-Space jump regenerates quickly.",
    imageBase: "Sam Hallet",
    initials: "SH",
    mass: 1.22,
    radius: 29,
    drag: 0.118,
    bounce: 0.78,
    gravityMult: 0.97,
    launchBoost: 1.04,
    unlockAt: 0,
    ability: "samswim",
  },
  {
    id: "evan",
    name: "Evan",
    trait: "Hooper launch",
    bio: "Shoots a basketball forward every 5 seconds and gets a Manning-style jump boost when he uses it.",
    imageBase: "Evan",
    initials: "EV",
    mass: 0.96,
    radius: 25,
    drag: 0.074,
    bounce: 0.61,
    gravityMult: 0.93,
    launchBoost: 1.22,
    unlockAt: 0,
    ability: "basketshot",
  },
  {
    id: "cael",
    name: "Cael",
    trait: "Sky-hoop shooter",
    bio: "A bouncier basketball sniper who launches the ball forward and gets a bigger burst upward every time he lets it fly.",
    imageBase: "Cael",
    initials: "CA",
    mass: 0.94,
    radius: 25,
    drag: 0.074,
    bounce: 0.61,
    gravityMult: 0.91,
    launchBoost: 1.22,
    unlockAt: 0,
    ability: "basketshot",
  },
];

function loadCustomCharacters() {
  try {
    const raw = localStorage.getItem(CUSTOM_CHARACTERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCustomCharacters(list) {
  try {
    localStorage.setItem(CUSTOM_CHARACTERS_KEY, JSON.stringify(Array.isArray(list) ? list : []));
    return true;
  } catch (e) {
    console.warn("Unable to persist custom characters:", e);
    return false;
  }
}

function loadProfilePictures() {
  try {
    const raw = localStorage.getItem(PROFILE_PICTURES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveProfilePictures(map) {
  localStorage.setItem(PROFILE_PICTURES_KEY, JSON.stringify(map || {}));
}

function sanitizePngDataUrl(value) {
  const raw = (value || "").toString();
  if (!raw.startsWith("data:image/png;base64,")) return "";
  if (raw.length > 900000) return "";
  return raw;
}

function getSignedInProfilePicture() {
  const accountName = normalizeAccountName(getSessionAccountName());
  if (!accountName) return "";
  const map = loadProfilePictures();
  return sanitizePngDataUrl(map[accountName]);
}

function setSignedInProfilePicture(dataUrl) {
  const accountName = normalizeAccountName(getSessionAccountName());
  if (!accountName) return false;
  const map = loadProfilePictures();
  map[accountName] = sanitizePngDataUrl(dataUrl);
  saveProfilePictures(map);
  return true;
}

function renderProfilePicturePreview() {
  if (!accountProfilePreview) return;
  const dataUrl = getSignedInProfilePicture();
  if (dataUrl) {
    accountProfilePreview.src = dataUrl;
    accountProfilePreview.style.display = "block";
  } else {
    accountProfilePreview.removeAttribute("src");
    accountProfilePreview.style.display = "none";
  }
}

function isPngFile(file) {
  if (!file) return false;
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  return type === "image/png" || name.endsWith(".png");
}

async function pngFileToDataUrl(file, maxSide = 360) {
  if (!file) throw new Error("No file selected.");
  if (!isPngFile(file)) {
    throw new Error("Only PNG files are supported for this upload.");
  }
  const blobUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Unable to read PNG image."));
      i.src = blobUrl;
    });
    const scale = Math.min(1, maxSide / Math.max(img.width || 1, img.height || 1));
    const w = Math.max(1, Math.round((img.width || 1) * scale));
    const h = Math.max(1, Math.round((img.height || 1) * scale));
    const temp = document.createElement("canvas");
    temp.width = w;
    temp.height = h;
    const tctx = temp.getContext("2d");
    tctx.drawImage(img, 0, 0, w, h);
    return temp.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function getSuggestedAbilityFromDescription(text) {
  const lower = text.toLowerCase();
  const map = [
    { keys: ["bomb", "explosive", "blast"], ability: "jumpbomb" },
    { keys: ["truck", "car", "vehicle"], ability: "truck" },
    { keys: ["dunk", "basketball", "hoop"], ability: "dunk" },
    { keys: ["tennis", "racket"], ability: "tennis" },
    { keys: ["fish", "hook", "rod"], ability: "fishingrod" },
    { keys: ["teleport", "warp", "blink"], ability: "warp" },
    { keys: ["slam", "smash", "ground pound"], ability: "slam" },
    { keys: ["jump", "double jump", "air jump"], ability: "backflip" },
    { keys: ["rocket", "boost", "jet"], ability: "rocket" },
  ];
  for (const entry of map) {
    if (entry.keys.some((k) => lower.includes(k))) return entry.ability;
  }
  return "rocket";
}

function buildAiDraftFromDescription(descriptionText) {
  const text = (descriptionText || "").trim();
  const lower = text.toLowerCase();
  let mass = 1.0;
  let radius = 28;
  let drag = 0.08;
  let bounce = 0.6;
  let gravityMult = 1.0;
  let launchBoost = 1.1;

  if (/(heavy|tank|big|giant|brute)/.test(lower)) {
    mass += 0.26;
    radius += 6;
    launchBoost -= 0.08;
    bounce -= 0.07;
  }
  if (/(fast|speed|quick|agile|nimble)/.test(lower)) {
    mass -= 0.14;
    drag -= 0.02;
    launchBoost += 0.18;
  }
  if (/(jump|air|float|glide|wing)/.test(lower)) {
    gravityMult -= 0.14;
    bounce += 0.08;
    launchBoost += 0.08;
  }
  if (/(bouncy|rubber|spring)/.test(lower)) {
    bounce += 0.2;
  }
  if (/(stable|accurate|precision|control)/.test(lower)) {
    drag += 0.02;
  }

  const suggestedAbility = getSuggestedAbilityFromDescription(text);
  return {
    trait: "AI-tuned build",
    bio: text.slice(0, 160) || "AI-generated character build.",
    ability: supportedMakerAbilities().has(suggestedAbility) ? suggestedAbility : "rocket",
    mass: clamp(mass, 0.72, 1.5).toFixed(2),
    radius: String(Math.round(clamp(radius, 18, 56))),
    drag: clamp(drag, 0.01, 0.3).toFixed(3),
    bounce: clamp(bounce, 0.2, 0.95).toFixed(2),
    gravityMult: clamp(gravityMult, 0.6, 1.4).toFixed(2),
    launchBoost: clamp(launchBoost, 0.7, 1.8).toFixed(2),
  };
}

function supportedMakerAbilities() {
  return new Set([
    "rocket", "fishingrod", "slam", "warp", "trumpjump", "jumpbomb", "backflip", "dunk", "tennis", "truck",
    "fartpassive", "leprejump", "bmwjump", "trexjump", "lincolnjump", "lukejump", "owenjump", "samswim", "basketshot", "travisjump", "davytruck",
  ]);
}

function normalizeCharacterId(value) {
  const base = (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
  return base.slice(0, 24);
}

function sanitizeCustomCharacter(raw) {
  const name = (raw?.name || "Custom").toString().trim().slice(0, 24);
  const id = normalizeCharacterId(raw?.id || name || `custom-${Date.now()}`);
  const initials = ((raw?.initials || name.slice(0, 2) || "C").toString().trim().slice(0, 3) || "C").toUpperCase();
  const ability = supportedMakerAbilities().has(raw?.ability) ? raw.ability : "rocket";
  const numberOr = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
  return {
    id,
    name,
    trait: (raw?.trait || "Custom build").toString().slice(0, 48),
    bio: (raw?.bio || "Admin-created character.").toString().slice(0, 160),
    imageBase: (raw?.imageBase || `characters/${name}`).toString().trim() || `characters/${name}`,
    initials,
    mass: numberOr(raw?.mass, 1.0),
    radius: Math.max(16, Math.min(56, Math.round(numberOr(raw?.radius, 28)))),
    drag: Math.max(0.01, Math.min(0.3, numberOr(raw?.drag, 0.08))),
    bounce: Math.max(0.2, Math.min(0.95, numberOr(raw?.bounce, 0.6))),
    gravityMult: Math.max(0.6, Math.min(1.4, numberOr(raw?.gravityMult, 1.0))),
    launchBoost: Math.max(0.7, Math.min(1.8, numberOr(raw?.launchBoost, 1.1))),
    unlockAt: Math.max(0, Math.round(numberOr(raw?.unlockAt, 0))),
    ability,
    imageData: sanitizePngDataUrl(raw?.imageData),
    itemImageData: sanitizePngDataUrl(raw?.itemImageData),
    custom: true,
  };
}

function applySavedCustomCharacters() {
  const saved = loadCustomCharacters();
  const baseIds = new Set(characters.map((c) => c.id));
  saved.forEach((entry) => {
    const c = sanitizeCustomCharacter(entry);
    if (!c.id || baseIds.has(c.id)) return;
    baseIds.add(c.id);
    characters.push(c);
  });
}

applySavedCustomCharacters();

let makerCharacterImageData = "";
let makerItemImageData = "";

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
let evanBasketballs = [];
let nathanTrumps = [];
let nathanAirstrikeBombs = [];
let enemyLasers = [];
let owenGoKarts = [];
let owenGoKartSpawnTimer = 4 + Math.random() * 6;
const destroyedJanets = new Set();
const mikeLaserCooldowns = new Map();
const stricBossState = {
  active: false,
  x: 0,
  y: 0,
  phase: 0,
  phaseTimer: 0,
  shotTimer: 0,
  angleTimer: 0,
};

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
  calebHasDino: true,
  lincolnAdhd: 0,
  lincolnImmunityTimer: 0,
  lukeItemCount: 0,
  lukeSuperspeedTimer: 0,
  owenMilks: 0,
  owenLives: 3,
  samDumbbellCount: 0,
  samBenchSets: 0,
  samSwimCharges: 1,
  samSwimPerTurn: 1,
  samSwimActive: false,
  samSwimPassesLeft: 0,
  samSwimTimer: 0,
  samJumpCharges: 1,
  samJumpRegenTimer: 0,
  natePhaseCooldown: 0,
  travisCraddleCount: 0,
  matteoCraddleCount: 0,
  nathanHasTruck: true,
  nathanSpeed: NATHAN_JUMP_RESET_SPEED,
  nathanSlowdownPending: false,
  nathanGas: 0,
  nathanAirstrikeReady: false,
  nathanAirstrikeTimer: 0,
  nathanNextBombTimer: 0,
  nathanBombsDropped: 0,
  nathanJetX: 0,
  nathanJetY: 0,
  nathanFlagTimer: 0,
  davyHasRide: true,
  davySpeed: DAVY_JUMP_RESET_SPEED,
  davySlowdownPending: false,
  davyShotTimer: 0.45,
  davyGodModeTimer: 0,
  davyGodModeCooldown: DAVY_GOD_MODE_INTERVAL_MIN,
  davyFlameTimer: 0,
  davyJumpCooldown: 0,
};

const obstacles = [];
const confetti = [];

const bouncePadCache = new Map();
const janetCache = new Map();
const mikeCache = new Map();
const mikePositionCache = [];
const candyCache = new Map();
const beerCache = new Map();
const burgerCache = new Map();
const footballCache = new Map();
const potGoldCache = new Map();
const needleCache = new Map();
const samDumbbellCache = new Map();
const nathanGasCache = new Map();
const travisCraddleCache = new Map();
const collectedCandies = new Set();
const collectedBeers = new Set();
const collectedBurgers = new Set();
const collectedFootballs = new Set();
const collectedPots = new Set();
const collectedNeedles = new Set();
const collectedOwenMilk = new Set();
const collectedSamDumbbells = new Set();
const collectedNathanGas = new Set();
const collectedTravisCraddles = new Set();
let samBenchPickup = null;

const JANET_BASE = {
  w: 56,
  h: 58,
  color: "#ffe0ea",
  label: "Hazard",
  fatal: true,
};

const fatalObstacleImageCandidates = [
  "Luke Kelly (Obstacle).png",
  "assets/images/office-obstacle.png",
  "office-obstacle.png",
];

const mikeObstacleImageCandidates = [];

const strickerBossImageCandidates = [];

let fatalObstacleImg = null;
let mikeObstacleImg = null;
let strickerBossImg = null;
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
let owenMilkImg = null;
let owenGoKartImg = null;
let samDumbbellImg = null;
let samBenchPressImg = null;
let evanBasketballImg = null;
let nathanTacomaImg = null;
let nathanGasImg = null;
let travisCraddleImg = null;
let nathanTrumpImg = null;
let nathanJetImg = null;
let nathanBombImg = null;
let nathanFlagImg = null;


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
  "characters props/JJs Creatine.webp",
  "JJs Creatine.webp",
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

const owenMilkImageCandidates = [
  "characters props/Owens Milk .png",
  "characters props/Owens Milk.png",
  "Owens Milk .png",
  "Owens Milk.png",
];

const owenGoKartImageCandidates = [
  "characters props/Owens extra obstacal go kart.webp",
  "Owens extra obstacal go kart.webp",
];

const samDumbbellImageCandidates = [
  "characters props/Sams Dumbells.png",
  "Sams Dumbells.png",
  "characters props/Sams Dumbbells.png",
  "Sams Dumbbells.png",
];

const samBenchPressImageCandidates = [
  "characters props/Sams Bench Press.png",
  "Sams Bench Press.png",
];

const evanBasketballImageCandidates = [
  "characters props/Evans Basketball.png",
  "Evans Basketball.png",
];

const nathanTacomaImageCandidates = [
  "characters props/Nathans Tacoma.png",
  "Nathans Tacoma.png",
  "characters props/Nathan Tacoma.png",
  "characters props/Nate Tacoma.png",
  "characters props/Nathans Truck.png",
  "characters props/Nathan Truck.png",
  "Nathans Tacoma.png",
  "Nathan Tacoma.png",
  "Nate Tacoma.png",
];

const nathanGasImageCandidates = [
  "characters props/Nathans Fuel.png",
  "Nathans Fuel.png",
  "characters props/Nathans Gas.png",
  "characters props/Nathan Gas.png",
  "characters props/Nate Gas.png",
  "characters props/Nathans Gas Can.png",
  "characters props/Nathan Gas Can.png",
  "Nathans Gas.png",
  "Nathan Fuel.png",
  "Nathan Gas.png",
];

const travisCraddleImageCandidates = [
  "characters props/Travis Cradle Snatch.png",
  "Travis Cradle Snatch.png",
  "characters props/Travis Craddle Snatch.png",
  "Travis Craddle Snatch.png",
];

const nathanTrumpImageCandidates = [
  "characters props/Nathans Trumps.png",
  "Nathans Trumps.png",
  "characters props/Nathan Trumps.png",
  "characters props/Nate Trumps.png",
  "characters props/Trumps.png",
  "Nathans Trumps.png",
  "Nathan Trumps.png",
  "Trumps.png",
];

const nathanJetImageCandidates = [
  "characters props/Nathans Jet.png",
  "Nathans Jet.png",
  "characters props/Nathan Jet.png",
  "characters props/Nate Jet.png",
  "characters props/Jet.png",
  "Nathans Jet.png",
  "Nathan Jet.png",
  "Jet.png",
];

const nathanBombImageCandidates = [
  "characters props/Nathans Jets Bomb.png",
  "Nathans Jets Bomb.png",
  "characters props/Nathans Bomb.png",
  "Nathans Bomb.png",
  "characters props/Nathan Bomb.png",
  "characters props/Nate Bomb.png",
  "characters props/Bomb.png",
  "Nathans Bomb.png",
  "Nathan Bomb.png",
  "Bomb.png",
];

const nathanFlagImageCandidates = [
  "characters props/Nathans Flag.png",
  "Nathans Flag.png",
  "characters props/Nathan Flag.png",
  "characters props/American Flag.png",
  "characters props/US Flag.png",
  "Nathans Flag.png",
  "Nathan Flag.png",
  "American Flag.png",
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

function getMikeBaseX(index) {
  while (mikePositionCache.length <= index) {
    const i = mikePositionCache.length;
    if (i === 0) {
      const firstX = 2200 + Math.floor(seededNoise(400) * 420);
      mikePositionCache.push(firstX);
    } else {
      const prevX = mikePositionCache[i - 1];
      const gap = 850 + Math.floor(seededNoise(i + 403) * 1700); // random spacing 850..2549
      mikePositionCache.push(prevX + gap);
    }
  }
  return mikePositionCache[index];
}

function createMike(index) {
  const baseX = getMikeBaseX(index);
  const offset = Math.floor(seededNoise(index + 401) * 240) - 120;
  const yOffset = 62 + Math.floor(seededNoise(index + 402) * 18);

  return {
    index: 100000 + index,
    x: baseX + offset,
    yOffset,
    w: 58,
    h: 60,
    color: "#ffe3d5",
    label: "Mike",
    fatal: true,
    isMike: true,
  };
}

function getMike(index) {
  if (!mikeCache.has(index)) {
    mikeCache.set(index, createMike(index));
  }
  return mikeCache.get(index);
}

function getMikesInRange(startX, endX) {
  const mikes = [];

  for (let index = 0; index < 2000; index += 1) {
    const baseX = getMikeBaseX(index);
    if (baseX > endX + 3000) break;

    const mike = getMike(index);
    if (destroyedJanets.has(mike.index)) continue;
    if (mike.x + mike.w >= startX && mike.x <= endX) {
      mikes.push(mike);
    }
  }

  return mikes;
}

function getLjsObstacleBaseX(index) {
  while (ljsObstaclePositionCache.length <= index) {
    const i = ljsObstaclePositionCache.length;
    if (i === 0) {
      const firstX = 2400 + Math.floor(seededNoise(900) * 480);
      ljsObstaclePositionCache.push(firstX);
    } else {
      const prevX = ljsObstaclePositionCache[i - 1];
      const gap = 820 + Math.floor(seededNoise(i + 901) * 1400);
      ljsObstaclePositionCache.push(prevX + gap);
    }
  }
  return ljsObstaclePositionCache[index];
}

function createLjsObstacle(index) {
  const baseX = getLjsObstacleBaseX(index);
  const offset = Math.floor(seededNoise(index + 920) * 200) - 100;
  const yOffset = 66 + Math.floor(seededNoise(index + 921) * 22);
  return {
    index: 200000 + index,
    x: baseX + offset,
    yOffset,
    w: 72,
    h: 72,
    color: "#f0d2a5",
    label: "Shrimp Turret",
    fatal: true,
    isLjsObstacle: true,
  };
}

function getLjsObstacle(index) {
  if (!ljsObstacleCache.has(index)) {
    ljsObstacleCache.set(index, createLjsObstacle(index));
  }
  return ljsObstacleCache.get(index);
}

function getLjsObstaclesInRange(startX, endX) {
  const ljs = [];
  for (let index = 0; index < 2000; index += 1) {
    const baseX = getLjsObstacleBaseX(index);
    if (baseX > endX + 3000) break;
    const obstacle = getLjsObstacle(index);
    if (destroyedJanets.has(obstacle.index)) continue;
    if (obstacle.x + obstacle.w >= startX && obstacle.x <= endX) {
      ljs.push(obstacle);
    }
  }
  return ljs;
}

function getFatalObstaclesInRange(startX, endX) {
  if (getCurrentMap().id === "long-john-silvers") {
    return getLjsObstaclesInRange(startX, endX);
  }
  return getJanetsInRange(startX, endX);
}

function spawnEnemyLaser(x, y, angle, speed = 920, life = 3.2, color = "#ff3b3b", isFire = false, spriteType = "") {
  enemyLasers.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life,
    radius: 7,
    color,
    isFire,
    spriteType,
  });
}

function fireDavyShrimp(angleJitter = 0, speedBonus = 0, radius = 12, life = 2.6) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouseWorldX = lastMouseX * scaleX + cameraX;
  const mouseWorldY = lastMouseY * scaleY;
  const dx = mouseWorldX - actor.x;
  const dy = mouseWorldY - actor.y;
  const dist = Math.max(1, Math.hypot(dx, dy));
  const baseAngle = Math.atan2(dy, dx) + angleJitter;
  const dirX = Math.cos(baseAngle);
  const dirY = Math.sin(baseAngle);
  nathanTrumps.push({
    x: actor.x + dirX * (actor.radius + 10),
    y: actor.y + dirY * (actor.radius + 10),
    vx: dirX * (860 + speedBonus) + actor.vx * 0.34,
    vy: dirY * (860 + speedBonus) + actor.vy * 0.2,
    life,
    radius,
    rotation: 0,
    isShrimp: true,
  });
}

function triggerDavyGodMode() {
  actor.davyGodModeTimer = DAVY_GOD_MODE_DURATION;
  actor.davyFlameTimer = DAVY_GOD_MODE_DURATION;
  actor.vy = Math.min(actor.vy, -1280);
  actor.vx = Math.max(actor.vx + 480, 1100);
  spawnParticles(actor.x, actor.y, 42, "#ff7a00");
  spawnParticles(actor.x, actor.y, 24, "#fff2b0");
  startScreenShake(20, 0.55);
  tone(160, 0.14, "sawtooth", 0.12);
  tone(280, 0.12, "square", 0.1);
  runStateLabel.textContent = "DAVY GOD MODE ACTIVATED!";
}

function updateLongJohnSilversHazards(dt, nearbyFatals) {
  if (getCurrentMap().id !== "long-john-silvers") {
    return;
  }

  for (const turret of nearbyFatals) {
    const current = ljsHazardCooldowns.get(turret.index) ?? (0.7 + seededNoise(turret.index + 40) * 0.8);
    const next = current - dt;
    if (next <= 0) {
      const oy = terrainY(turret.x) - turret.yOffset + turret.h * 0.44;
      const angle = Math.atan2(actor.y - oy, actor.x - turret.x) + (seededNoise(turret.index + performance.now() * 0.001) - 0.5) * 0.12;
      spawnEnemyLaser(turret.x + turret.w * 0.2, oy, angle, 880, 3.1, "#ff9c4a", false, "shrimp");
      ljsHazardCooldowns.set(turret.index, 0.9 + seededNoise(turret.index + 73) * 1.15);
    } else {
      ljsHazardCooldowns.set(turret.index, next);
    }
  }
}

function updateEnemyLasers(dt) {
  if (!enemyLasers.length) return false;

  for (const laser of enemyLasers) {
    laser.life -= dt;
    laser.x += laser.vx * dt;
    laser.y += laser.vy * dt;

    const dx = actor.x - laser.x;
    const dy = actor.y - laser.y;
    const hitR = actor.radius + laser.radius;
    if (dx * dx + dy * dy <= hitR * hitR) {
      if (selectedCharacter.id === "lukepueppke" && actor.lukeSuperspeedTimer > 0) {
        laser.life = -1;
        spawnParticles(actor.x, actor.y, 14, "#4fc3f7");
        tone(620, 0.04, "triangle", 0.05);
        continue;
      }
      spawnParticles(actor.x, actor.y, 30, "#ff6b6b");
      tone(160, 0.08, "sawtooth", 0.09);
      finishRun("Run ended: hit by laser fire.");
      return true;
    }
  }

  enemyLasers = enemyLasers.filter((laser) => laser.life > 0 && laser.x > actor.x - 3000 && laser.x < actor.x + 4500 && laser.y > -500 && laser.y < canvas.height + 500);
  return false;
}

function updateEvanBasketballs(dt) {
  evanBasketballs.forEach((ball) => {
    ball.life -= dt;
    ball.vy += world.gravity * 0.4 * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    ball.rotation += (ball.vx * 0.0035) * dt * 60;

    const nearbyJanets = getFatalObstaclesInRange(ball.x - 110, ball.x + 110);
    for (const janet of nearbyJanets) {
      const janetY = terrainY(janet.x) - janet.yOffset;
      const nearestX = Math.max(janet.x, Math.min(ball.x, janet.x + janet.w));
      const nearestY = Math.max(janetY, Math.min(ball.y, janetY + janet.h));
      const dx = ball.x - nearestX;
      const dy = ball.y - nearestY;
      if (dx * dx + dy * dy <= ball.radius * ball.radius) {
        destroyedJanets.add(janet.index);
        ball.life = -1;
        spawnParticles(ball.x, ball.y, 18, "#f59f36");
        tone(320, 0.05, "square", 0.06);
        break;
      }
    }

    const ground = terrainY(ball.x);
    if (ball.y + ball.radius >= ground) {
      ball.y = ground - ball.radius;
      ball.life = -1;
    }
  });

  evanBasketballs = evanBasketballs.filter((ball) => ball.life > 0);
}

function updateNathanTrumps(dt) {
  nathanTrumps.forEach((shot) => {
    shot.life -= dt;
    shot.vy += world.gravity * 0.38 * dt;
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.rotation += (shot.vx * 0.0032) * dt * 60;

    const nearbyHughs = getFatalObstaclesInRange(shot.x - 120, shot.x + 120);
    for (const hugh of nearbyHughs) {
      const hy = terrainY(hugh.x) - hugh.yOffset;
      const nearestX = Math.max(hugh.x, Math.min(shot.x, hugh.x + hugh.w));
      const nearestY = Math.max(hy, Math.min(shot.y, hy + hugh.h));
      const dx = shot.x - nearestX;
      const dy = shot.y - nearestY;
      if (dx * dx + dy * dy <= shot.radius * shot.radius) {
        destroyedJanets.add(hugh.index);
        shot.life = -1;
        spawnParticles(shot.x, shot.y, 20, "#ffd8a6");
        tone(410, 0.05, "square", 0.06);
        break;
      }
    }

    const ground = terrainY(shot.x);
    if (shot.y + shot.radius >= ground) {
      shot.y = ground - shot.radius;
      shot.life = -1;
    }
  });

  nathanTrumps = nathanTrumps.filter((shot) => shot.life > 0);
}

function triggerNathanAirstrike() {
  if (selectedCharacter.id !== "nathan" || !actor.nathanAirstrikeReady || actor.nathanGas < NATHAN_GAS_TARGET) {
    tone(130, 0.05, "sine", 0.05);
    return;
  }

  actor.nathanGas = Math.max(0, actor.nathanGas - NATHAN_GAS_TARGET);
  actor.nathanAirstrikeReady = false;
  actor.nathanAirstrikeTimer = 4.1;
  actor.nathanNextBombTimer = 0.08;
  actor.nathanBombsDropped = 0;
  actor.nathanJetX = actor.x - Math.max(canvas.width * 0.65, 860);
  actor.nathanJetY = terrainY(actor.x) - 390;
  actor.nathanFlagTimer = Math.max(actor.nathanFlagTimer, 2.2);

  spawnParticles(actor.x, actor.y, 40, "#ffffff");
  spawnParticles(actor.x, actor.y, 18, "#ff4d00");
  startScreenShake(18, 0.35);
  tone(180, 0.1, "sawtooth", 0.1);
  tone(120, 0.1, "triangle", 0.08);
  runStateLabel.textContent = "Nathan called the airstrike — Hugh got smoked.";
}

function updateNathanAirstrike(dt) {
  if (actor.nathanAirstrikeTimer > 0) {
    actor.nathanAirstrikeTimer = Math.max(0, actor.nathanAirstrikeTimer - dt);
    actor.nathanJetX += 1850 * dt;
    actor.nathanJetY += Math.sin((actor.nathanBombsDropped + actor.nathanAirstrikeTimer) * 2.3) * 16 * dt;
    actor.nathanNextBombTimer -= dt;

    if (actor.nathanNextBombTimer <= 0 && actor.nathanBombsDropped < 24) {
      actor.nathanNextBombTimer = 0.16;
      actor.nathanBombsDropped += 1;

      const dropX = actor.nathanJetX - 16 + (Math.random() - 0.5) * 26;
      const dropY = actor.nathanJetY + 20;
      nathanAirstrikeBombs.push({
        x: dropX,
        y: dropY,
        vx: -40 + Math.random() * 80,
        vy: 180 + Math.random() * 60,
        radius: 16,
        life: 3.2,
      });
    }
  }

  nathanAirstrikeBombs.forEach((bomb) => {
    bomb.life -= dt;
    bomb.vy += world.gravity * 0.92 * dt;
    bomb.x += bomb.vx * dt;
    bomb.y += bomb.vy * dt;

    const nearbyHughs = getFatalObstaclesInRange(bomb.x - 180, bomb.x + 180);
    let exploded = false;
    for (const hugh of nearbyHughs) {
      const hy = terrainY(hugh.x) - hugh.yOffset;
      const centerX = hugh.x + hugh.w * 0.5;
      const centerY = hy + hugh.h * 0.5;
      const dx = centerX - bomb.x;
      const dy = centerY - bomb.y;
      const blast = 170 + Math.max(hugh.w, hugh.h) * 0.45;
      if (dx * dx + dy * dy <= blast * blast) {
        destroyedJanets.add(hugh.index);
        exploded = true;
      }
    }

    const ground = terrainY(bomb.x);
    if (bomb.y + bomb.radius >= ground || exploded || bomb.life <= 0) {
      spawnImpactBurst(bomb.x, Math.min(bomb.y, ground - 6), 0.95);
      spawnParticles(bomb.x, Math.min(bomb.y, ground - 6), 24, "#ff5a1f");
      startScreenShake(8, 0.14);
      bomb.life = -1;
    }
  });

  nathanAirstrikeBombs = nathanAirstrikeBombs.filter((bomb) => bomb.life > 0);
}

function updateStricWoodsHazards(dt, nearbyFatals) {
  if (getCurrentMap().id !== "stric-woods") {
    stricBossState.active = false;
    return;
  }

  for (const mike of nearbyFatals) {
    const current = mikeLaserCooldowns.get(mike.index) ?? (0.9 + seededNoise(mike.index + 17) * 0.8);
    const next = current - dt;
    if (next <= 0) {
      const my = terrainY(mike.x) - mike.yOffset + mike.h * 0.45;
      spawnEnemyLaser(mike.x + 4, my, Math.PI, 900, 3.2, "#ff8c00", true);
      mikeLaserCooldowns.set(mike.index, 1.2 + seededNoise(mike.index + 71) * 1.0);
    } else {
      mikeLaserCooldowns.set(mike.index, next);
    }
  }

  const travelled = Math.max(0, (actor.maxX - world.launchX) / 10);
  if (!stricBossState.active && travelled >= STRIC_WOODS_BOSS_TRIGGER_M) {
    stricBossState.active = true;
    stricBossState.x = actor.x + 620;
    stricBossState.y = terrainY(stricBossState.x) - 260;
    stricBossState.phase = 0;
    stricBossState.phaseTimer = 3;
    stricBossState.shotTimer = 0.4;
    stricBossState.angleTimer = 0;
    startScreenShake(14, 0.32);
    tone(120, 0.12, "sawtooth", 0.1);
    tone(190, 0.1, "triangle", 0.09);
  }

  if (!stricBossState.active) return;

  const targetX = actor.x + 560;
  stricBossState.x += (targetX - stricBossState.x) * Math.min(1, dt * 3.8);
  stricBossState.angleTimer += dt;
  stricBossState.y = terrainY(stricBossState.x) - 250 + Math.sin(stricBossState.angleTimer * 1.6) * 65;

  stricBossState.phaseTimer -= dt;
  if (stricBossState.phaseTimer <= 0) {
    stricBossState.phase = (stricBossState.phase + 1) % 3;
    stricBossState.phaseTimer = 3.2;
  }

  stricBossState.shotTimer -= dt;
  if (stricBossState.shotTimer <= 0) {
    const bx = stricBossState.x;
    const by = stricBossState.y;
    if (stricBossState.phase === 0) {
      spawnEnemyLaser(bx - 20, by - 14, Math.PI - 0.2, 1100, 3.6, "#ff2a2a");
      spawnEnemyLaser(bx - 20, by, Math.PI, 1150, 3.6, "#ff2a2a");
      spawnEnemyLaser(bx - 20, by + 14, Math.PI + 0.2, 1100, 3.6, "#ff2a2a");
      stricBossState.shotTimer = 0.42;
    } else if (stricBossState.phase === 1) {
      const wave = Math.sin(stricBossState.angleTimer * 5.4) * 0.4;
      spawnEnemyLaser(bx - 20, by, Math.PI + wave, 1200, 3.8, "#ff4b4b");
      stricBossState.shotTimer = 0.24;
    } else {
      for (let i = -2; i <= 2; i += 1) {
        spawnEnemyLaser(bx - 20, by + i * 8, Math.PI + i * 0.14, 1080, 3.8, "#ff6b6b");
      }
      stricBossState.shotTimer = 0.58;
    }
  }
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

// ── Owen: Milk glasses ──────────────────────────────────────────────────────
const owenMilkCache = new Map();

function createOwenMilk(index) {
  const spacing = 430;
  const startX = 980;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 1401) * 220) - 90;
  const yOffset = 106 + Math.floor(seededNoise(index + 1402) * 28);
  return { index, x: baseX + offset, yOffset, r: 14 };
}

function getOwenMilk(index) {
  if (!owenMilkCache.has(index)) owenMilkCache.set(index, createOwenMilk(index));
  return owenMilkCache.get(index);
}

function getOwenMilkInRange(startX, endX) {
  const spacing = 430;
  const startXBase = 980;
  const first = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const last = Math.max(first, Math.floor((endX - startXBase) / spacing) + 2);
  const items = [];
  for (let i = first; i <= last; i += 1) {
    const milk = getOwenMilk(i);
    if (collectedOwenMilk.has(milk.index)) continue;
    if (milk.x + milk.r >= startX && milk.x - milk.r <= endX) items.push(milk);
  }
  return items;
}

// ── Sam: Dumbbells + bench press ───────────────────────────────────────────
function createSamDumbbell(index) {
  const spacing = 390;
  const startX = 940;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 1501) * 220) - 90;
  const yOffset = 104 + Math.floor(seededNoise(index + 1502) * 30);
  return { index, x: baseX + offset, yOffset, r: 14 };
}

function getSamDumbbell(index) {
  if (!samDumbbellCache.has(index)) samDumbbellCache.set(index, createSamDumbbell(index));
  return samDumbbellCache.get(index);
}

function getSamDumbbellsInRange(startX, endX) {
  const spacing = 390;
  const startXBase = 940;
  const first = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const last = Math.max(first, Math.floor((endX - startXBase) / spacing) + 2);
  const items = [];
  for (let i = first; i <= last; i += 1) {
    const dumbbell = getSamDumbbell(i);
    if (collectedSamDumbbells.has(dumbbell.index)) continue;
    if (dumbbell.x + dumbbell.r >= startX && dumbbell.x - dumbbell.r <= endX) items.push(dumbbell);
  }
  return items;
}

function createNathanGas(index) {
  const spacing = 410;
  const startX = 880;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 1601) * 230) - 90;
  const yOffset = 108 + Math.floor(seededNoise(index + 1602) * 30);
  return { index, x: baseX + offset, yOffset, r: 14 };
}

function getNathanGas(index) {
  if (!nathanGasCache.has(index)) nathanGasCache.set(index, createNathanGas(index));
  return nathanGasCache.get(index);
}

function getNathanGasInRange(startX, endX) {
  const spacing = 410;
  const startXBase = 880;
  const first = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const last = Math.max(first, Math.floor((endX - startXBase) / spacing) + 2);
  const items = [];
  for (let i = first; i <= last; i += 1) {
    const gas = getNathanGas(i);
    if (collectedNathanGas.has(gas.index)) continue;
    if (gas.x + gas.r >= startX && gas.x - gas.r <= endX) items.push(gas);
  }
  return items;
}

function createTravisCraddle(index) {
  const spacing = 420;
  const startX = 930;
  const baseX = startX + index * spacing;
  const offset = Math.floor(seededNoise(index + 1701) * 220) - 90;
  const yOffset = 112 + Math.floor(seededNoise(index + 1702) * 30);
  return { index, x: baseX + offset, yOffset, r: 15 };
}

function getTravisCraddle(index) {
  if (!travisCraddleCache.has(index)) travisCraddleCache.set(index, createTravisCraddle(index));
  return travisCraddleCache.get(index);
}

function getTravisCraddlesInRange(startX, endX) {
  const spacing = 420;
  const startXBase = 930;
  const first = Math.max(0, Math.floor((startX - startXBase) / spacing) - 1);
  const last = Math.max(first, Math.floor((endX - startXBase) / spacing) + 2);
  const items = [];
  for (let i = first; i <= last; i += 1) {
    const craddle = getTravisCraddle(i);
    if (collectedTravisCraddles.has(craddle.index)) continue;
    if (craddle.x + craddle.r >= startX && craddle.x - craddle.r <= endX) items.push(craddle);
  }
  return items;
}


let audioCtx = null;



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
  if (getCurrentMap().id === "town-square" || getCurrentMap().id === "stric-woods" || getCurrentMap().id === "long-john-silvers") {
    return base;
  }
  return (
    base
    - Math.sin(x * 0.0022) * 90
    - Math.sin((x + 300) * 0.0065) * 45
    - Math.max(0, Math.sin((x - 700) * 0.0014)) * 55
  );
}

async function loadLongJohnSilversMapFromPdf() {
  if (!longJohnSilversMapImageCandidates.length) return false;
  try {
    const img = new Image();
    let idx = 0;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        idx += 1;
        if (idx < longJohnSilversMapImageCandidates.length) {
          img.src = encodeURI(longJohnSilversMapImageCandidates[idx]);
        } else {
          reject(new Error("Long John Silvers map image not found"));
        }
      };
      img.src = encodeURI(longJohnSilversMapImageCandidates[idx]);
    });
    longJohnSilversMapImg = img;
    return true;
  } catch (err) {
    console.error("Failed to load Long John Silvers map asset:", err);
    return false;
  }
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
  actor.calebHasDino = true;
  actor.lincolnAdhd = 0;
  actor.lincolnImmunityTimer = 0;
  actor.lukeItemCount = 0;
  actor.lukeSuperspeedTimer = 0;
  actor.owenMilks = 0;
  actor.owenLives = 3;
  actor.samDumbbellCount = 0;
  actor.samBenchSets = 0;
  actor.samSwimCharges = 1;
  actor.samSwimPerTurn = 1;
  actor.samSwimActive = false;
  actor.samSwimPassesLeft = 0;
  actor.samSwimTimer = 0;
  actor.samJumpCharges = 1;
  actor.samJumpRegenTimer = 0;
  actor.natePhaseCooldown = 0;
  actor.travisCraddleCount = 0;
  actor.matteoCraddleCount = 0;
  actor.nathanHasTruck = true;
  actor.nathanSpeed = NATHAN_JUMP_RESET_SPEED;
  actor.nathanSlowdownPending = false;
  actor.nathanGas = 0;
  actor.nathanAirstrikeReady = false;
  actor.nathanAirstrikeTimer = 0;
  actor.nathanNextBombTimer = 0;
  actor.nathanBombsDropped = 0;
  actor.nathanJetX = world.launchX - 920;
  actor.nathanJetY = terrainY(world.launchX) - 390;
  actor.nathanFlagTimer = 0;
  actor.davyHasRide = true;
  actor.davySpeed = DAVY_JUMP_RESET_SPEED;
  actor.davySlowdownPending = false;
  actor.davyShotTimer = getCurrentMap().id === "long-john-silvers" ? 0.08 : 0.3;
  actor.davyGodModeTimer = 0;
  actor.davyGodModeCooldown = DAVY_GOD_MODE_INTERVAL_MIN + Math.random() * (DAVY_GOD_MODE_INTERVAL_MAX - DAVY_GOD_MODE_INTERVAL_MIN);
  actor.davyFlameTimer = 0;
  actor.davyJumpCooldown = 0;
  samBenchPickup = null;
  cameraX = 0;
  particles.length = 0;
  impactBursts.length = 0;
  bombs.length = 0;
  tennisBalls.length = 0;
  evanBasketballs.length = 0;
  nathanTrumps.length = 0;
  nathanAirstrikeBombs.length = 0;
  enemyLasers.length = 0;
  owenGoKarts.length = 0;
  resetOwenGoKartTimer();
  destroyedJanets.clear();
  mikeLaserCooldowns.clear();
  ljsHazardCooldowns.clear();
  stricBossState.active = false;
  stricBossState.phase = 0;
  stricBossState.phaseTimer = 0;
  stricBossState.shotTimer = 0;
  stricBossState.angleTimer = 0;
  collectedCandies.clear();
  collectedBeers.clear();
  collectedBurgers.clear();
  collectedFootballs.clear();
  collectedPots.clear();
  collectedNeedles.clear();
  collectedLincolnAdhd.clear();
  collectedLukeRedBull.clear();
  collectedLukeCoffee.clear();
  collectedOwenMilk.clear();
  collectedSamDumbbells.clear();
  collectedNathanGas.clear();
  collectedTravisCraddles.clear();
  if (pendingSpencerJumpTimeout) {
    clearTimeout(pendingSpencerJumpTimeout);
    pendingSpencerJumpTimeout = null;
  }

  // Clear drag state
  isDragging = false;
  dragStart = null;
  launchVector = null;
  trajectoryDots.length = 0;

  runStateLabel.textContent = "Drag or touch to aim";
  launchBtn.disabled = false;
  if (switchMapBtn) switchMapBtn.disabled = !!headToHeadState.active;
  if (heightValue) {
    heightValue.textContent = "0";
  }
  if (headToHeadState.active && !headToHeadState.liveNetwork) {
    initHeadToHeadOpponent();
  }
  headToHeadState.localFinished = false;
  headToHeadState.localFinalDistance = 0;
  headToHeadState.localFinishMessage = "";
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
  if (switchMapBtn) switchMapBtn.disabled = true;
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


function finalizeHeadToHeadIfReady() {
  if (!headToHeadState.active) return false;
  if (!headToHeadState.localFinished || !headToHeadState.opponentFinished) return false;

  const playerM = headToHeadState.localFinalDistance;
  const oppM = headToHeadState.liveNetwork
    ? networkState.opponentFinalDistance
    : (headToHeadState.opponentActor
      ? Math.max(0, (headToHeadState.opponentActor.maxX - world.launchX) / 10)
      : 0);

  const isDraw = Math.abs(playerM - oppM) <= 0.05;
  const localWin = !isDraw && playerM > oppM;
  const result = isDraw
    ? `Head-to-head draw! (${playerM.toFixed(1)}m vs ${oppM.toFixed(1)}m)`
    : localWin
      ? `You win the head-to-head! (${playerM.toFixed(1)}m vs ${oppM.toFixed(1)}m)`
      : `${headToHeadState.rivalName} wins the head-to-head. (${oppM.toFixed(1)}m vs ${playerM.toFixed(1)}m)`;
  const rankedSummary = applyHeadToHeadRankedResult(
    getNetworkPlayerName(),
    headToHeadState.rivalName || "Opponent",
    isDraw ? 0 : (localWin ? 1 : -1),
    playerM - oppM
  );

  const finalMessage = `${headToHeadState.localFinishMessage || "Run ended."} ${result} ${rankedSummary}`;
  headToHeadState.resultText = result;
  headToHeadState.localWonLastMatch = !isDraw && localWin;
  if (localWin) triggerConfetti();

  if (headToHeadState.liveNetwork) {
    stopLiveNetworkSession();
  }
  headToHeadState.active = false;
  headToHeadState.mode = "idle";

  runStateLabel.textContent = finalMessage;
  launchBtn.disabled = true;
  actor.state = "ended";
  actor.vx = 0;
  actor.vy = 0;
  updateAbilityHint();

  setTimeout(() => {
    showLeaderboardScreen(actor.maxX - world.launchX);
  }, 800);

  return true;
}



function finishRun(message = "Run ended: no movement left. Press Restart Run.") {
  if (headToHeadState.active) {
    if (!headToHeadState.localFinished) {
      headToHeadState.localFinished = true;
      headToHeadState.localFinalDistance = Math.max(0, (actor.maxX - world.launchX) / 10);
      headToHeadState.localFinishMessage = message;

      if (headToHeadState.liveNetwork && networkState.roomChannel && !networkState.localFinishSent) {
        networkState.localFinishSent = true;
        networkState.roomChannel.send({
          type: "broadcast",
          event: "finish",
          payload: {
            playerId: networkState.playerId,
            message: `${getNetworkPlayerName()} finished.`,
            distance: headToHeadState.localFinalDistance,
          },
        });
      }

      actor.state = "ended";
      actor.vx = 0;
      actor.vy = 0;
      launchBtn.disabled = true;
      runStateLabel.textContent = `${message} Waiting for ${headToHeadState.rivalName} to finish...`;
      updateAbilityHint();
    }

    finalizeHeadToHeadIfReady();
    return;
  }

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

function trySpendOwenLife(statusMessage) {
  if (selectedCharacter.id !== "owen" || actor.owenLives <= 0) return false;
  actor.owenLives -= 1;
  spawnParticles(actor.x, actor.y, 26, "#e7eef8");
  spawnParticles(actor.x, actor.y, 12, "#ffffff");
  tone(250, 0.07, "triangle", 0.08);
  tone(170, 0.06, "triangle", 0.06);
  startScreenShake(9, 0.2);
  runStateLabel.textContent = `${statusMessage} Lives left: ${actor.owenLives}`;
  return true;
}

function spawnSamBenchPress() {
  samBenchPickup = {
    x: actor.x + 560 + Math.floor(seededNoise(actor.samDumbbellCount + actor.maxX) * 180),
    yOffset: 118,
    w: 170,
    h: 94,
    life: SAM_BENCH_VISIBLE_SECONDS,
  };
}

function resetOwenGoKartTimer() {
  owenGoKartSpawnTimer = 4 + Math.random() * 6;
}

function spawnOwenGoKart() {
  const spawnX = actor.x + canvas.width + 260 + Math.random() * 260;
  const ground = terrainY(spawnX);
  owenGoKarts.push({
    x: spawnX,
    y: ground - 42,
    vx: -(720 + Math.random() * 280),
    w: 150,
    h: 84,
    life: 6,
    rotation: -0.04 + Math.random() * 0.08,
  });
}

function updateOwenGoKarts(dt) {
  if (selectedCharacter.id !== "owen" || actor.state === "ready" || actor.state === "ended") {
    owenGoKarts = [];
    resetOwenGoKartTimer();
    return false;
  }

  owenGoKartSpawnTimer -= dt;
  if (owenGoKartSpawnTimer <= 0) {
    spawnOwenGoKart();
    resetOwenGoKartTimer();
  }

  for (const kart of owenGoKarts) {
    kart.life -= dt;
    kart.x += kart.vx * dt;
    kart.y = terrainY(kart.x) - 42;

    const nearestX = Math.max(kart.x, Math.min(actor.x, kart.x + kart.w));
    const nearestY = Math.max(kart.y, Math.min(actor.y, kart.y + kart.h));
    const dx = actor.x - nearestX;
    const dy = actor.y - nearestY;
    if (dx * dx + dy * dy <= actor.radius * actor.radius) {
      if (trySpendOwenLife("Go-kart hit! Owen lost a life.")) {
        actor.vx = Math.max(100, actor.vx * 0.72);
        actor.vy = -Math.max(180, Math.abs(actor.vy) * 0.45 + 120);
        spawnParticles(actor.x, actor.y, 30, "#3a3a3a");
        startScreenShake(14, 0.28);
        kart.life = -1;
        continue;
      }
      finishRun("Run ended: Owen got smoked by a go-kart.");
      return true;
    }
  }

  owenGoKarts = owenGoKarts.filter((kart) => kart.life > 0 && kart.x + kart.w > actor.x - 900);
  return false;
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
    actor.abilityCooldown = actor.beerRageTimer > 0 ? BRAYDEN_RAGE_JUMP_COOLDOWN : BRAYDEN_BASE_JUMP_COOLDOWN;
  } else if (selectedCharacter.id === "reed") {
    actor.abilityCooldown = 3.5;
  } else if (selectedCharacter.id === "jackson") {
    actor.abilityCooldown = 0;
  } else if (selectedCharacter.id === "jjfootballboss") {
    actor.abilityCooldown = 0;
  } else if (selectedCharacter.id === "myer") {
    actor.abilityCooldown = 1.15;
  } else if (selectedCharacter.id === "calebparker") {
    actor.abilityCooldown = CALEB_JUMP_COOLDOWN;
  } else if (selectedCharacter.id === "lincolnjames") {
    actor.abilityCooldown = 2;
  } else if (selectedCharacter.id === "lukepueppke") {
    actor.abilityCooldown = 2;
  } else if (selectedCharacter.id === "owen") {
    actor.abilityCooldown = 1.1;
  } else if (selectedCharacter.id === "traviswilliams") {
    actor.abilityCooldown = 1.1;
  } else if (selectedCharacter.id === "samhallet") {
    actor.abilityCooldown = 0.25;
  } else if (selectedCharacter.id === "nathan") {
    actor.abilityCooldown = 0.7;
  } else if (selectedCharacter.id === "evan" || selectedCharacter.id === "cael") {
    actor.abilityCooldown = EVAN_BASKETBALL_COOLDOWN;
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
    case "trumpjump": {
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

      nathanTrumps.push({
        x: actor.x + dirX * (actor.radius + 8),
        y: actor.y + dirY * (actor.radius + 8),
        vx: dirX * 840 + actor.vx * 0.3,
        vy: dirY * 840 + actor.vy * 0.2,
        life: 2.4,
        radius: 12,
        rotation: 0,
      });

      actor.vy -= 430;
      actor.vx += 120;
      actor.nathanSlowdownPending = actor.nathanHasTruck;

      tone(520, 0.06, "square", 0.08);
      tone(700, 0.05, "triangle", 0.06);
      spawnParticles(actor.x, actor.y, 20, "#ffd8a6");
      break;
    }
    case "davytruck": {
      fireDavyShrimp(0, getCurrentMap().id === "long-john-silvers" ? 200 : 40, getCurrentMap().id === "long-john-silvers" ? 13 : 12, 2.8);
      if (getCurrentMap().id === "long-john-silvers") {
        actor.vy -= 340;
        actor.vx += 160;
      } else {
        actor.vy -= 430;
        actor.vx += 120;
      }
      actor.davySlowdownPending = actor.davyHasRide;
      tone(520, 0.06, "square", 0.08);
      tone(700, 0.05, "triangle", 0.06);
      spawnParticles(actor.x, actor.y, 20, "#ffd8a6");
      break;
    }
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
      actor.abilityCooldown = actor.eliFlipsUsed >= 2 ? 3 : 0.35; // 3s cooldown after 2nd flip, short delay between flips
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

      actor.vy -= actor.beerRageTimer > 0 ? 240 : 190;
      actor.vx += actor.beerRageTimer > 0 ? 130 : 90;

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
      actor.vy -= CALEB_JUMP_VY;
      actor.vx += actor.calebHasDino ? 80 : 55;
      actor.abilityCooldown = CALEB_JUMP_COOLDOWN;
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
      actor.abilityCooldown = 2;
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
      actor.abilityCooldown = 2;
      tone(460 + Math.min(280, actor.lukeItemCount * 7), 0.07, "sawtooth", 0.09);
      tone(280, 0.05, "triangle", 0.06);
      spawnParticles(actor.x, actor.y, 20, "#4fc3f7");
      spawnParticles(actor.x, actor.y, 10, "#ffffff");
      startScreenShake(7 + Math.min(8, actor.lukeItemCount / 4), 0.16);
      break;
    }
    case "travisjump": {
      actor.vx += 95;
      actor.vy -= 540;
      actor.abilityCooldown = 1.1;
      tone(520, 0.06, "triangle", 0.08);
      tone(760, 0.05, "square", 0.06);
      spawnParticles(actor.x, actor.y, 18, "#f1d6b8");
      break;
    }
    case "owenjump": {
      actor.vx += 140;
      actor.vy -= 390;
      actor.abilityCooldown = 1.1;
      tone(420, 0.06, "triangle", 0.07);
      tone(300, 0.05, "triangle", 0.06);
      spawnParticles(actor.x, actor.y, 16, "#e7eef8");
      break;
    }
    case "samswim": {
      if (actor.samSwimCharges <= 0) {
        tone(130, 0.06, "sine", 0.05);
        actor.abilityCooldown = 0.2;
        break;
      }
      actor.samSwimCharges -= 1;
      actor.samSwimActive = true;
      actor.samSwimTimer = SAM_SWIM_ACTIVE_SECONDS;
      actor.samSwimPassesLeft = Math.max(1, actor.samSwimPerTurn);
      actor.abilityCooldown = 0.9;
      actor.vx += 170;
      actor.vy -= 110;
      tone(300, 0.08, "triangle", 0.08);
      tone(460, 0.06, "triangle", 0.07);
      spawnParticles(actor.x, actor.y, 24, "#bde7ff");
      startScreenShake(9, 0.2);
      break;
    }
    case "basketshot": {
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

      const jumpBoost = selectedCharacter.id === "cael" ? 1040 : 880;
      const horizontalBoost = selectedCharacter.id === "evan" ? 860 : 720;
      const ballSpeed = selectedCharacter.id === "evan" ? 1120 : 900;
      actor.vx += dirX * horizontalBoost;
      actor.vy += dirY * jumpBoost;

      evanBasketballs.push({
        x: actor.x + actor.radius * 0.7,
        y: actor.y - actor.radius * 0.15,
        vx: Math.max(760, actor.vx + ballSpeed),
        vy: Math.min(-60, actor.vy * 0.18 - 60),
        life: 2.7,
        radius: 16,
        rotation: 0,
      });

      actor.abilityCooldown = EVAN_BASKETBALL_COOLDOWN;
      tone(460, 0.07, "triangle", 0.09);
      tone(290, 0.06, "square", 0.07);
      spawnParticles(actor.x, actor.y, 24, "#f59f36");
      startScreenShake(8, 0.18);
      break;
    }
  }

  updateAbilityHint();
}

function useTruck() {
  if (selectedCharacter.id !== "anthony" && selectedCharacter.id !== "jackson" && selectedCharacter.id !== "jjfootballboss" && selectedCharacter.id !== "matteo") return;
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
  actor.truckTimer = 1.5;
  actor.vx = Math.max(actor.vx + 220, 360);
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

  const jumpPower = Math.max(420, 740 - actor.spencerBombsUsed * 50);
  actor.vy -= jumpPower;
  actor.vx += 170;
  actor.usedAbility = true;
  actor.abilityCooldown = 0.3;
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
  actor.vy -= 210;
  actor.vx += 15;
  spawnParticles(actor.x, actor.y, 18, "#9be9ff");
  tone(620, 0.06, "triangle", 0.07);
  tone(760, 0.05, "triangle", 0.06);
  updateAbilityHint();
}

function useSamJump() {
  if (selectedCharacter.id !== "samhallet") return;
  if (actor.state === "ready" || actor.state === "ended") return;
  if (actor.samJumpCharges <= 0) {
    tone(130, 0.05, "sine", 0.05);
    return;
  }

  actor.samJumpCharges -= 1;
  actor.samJumpRegenTimer = SAM_JUMP_REGEN_SECONDS;
  actor.vy -= 700;
  actor.vx += 120;
  spawnParticles(actor.x, actor.y, 18, "#d6f0ff");
  tone(560, 0.06, "triangle", 0.07);
  tone(760, 0.05, "triangle", 0.06);
  updateAbilityHint();
}

function useDavyJump() {
  if (selectedCharacter.id !== "davy") return;
  if (actor.state === "ready" || actor.state === "ended") return;
  if (actor.davyJumpCooldown > 0) {
    tone(140, 0.05, "sine", 0.05);
    return;
  }

  const inLjs = getCurrentMap().id === "long-john-silvers";
  actor.vy -= inLjs ? 760 : 650;
  actor.vx += inLjs ? 200 : 140;
  actor.davyJumpCooldown = inLjs ? 1.05 : 1.35;
  spawnParticles(actor.x, actor.y, 20, "#ffc48a");
  tone(620, 0.06, "triangle", 0.08);
  tone(760, 0.05, "triangle", 0.06);
  updateAbilityHint();
}

function explodeBomb(bomb) {
  if (bomb.exploded) return;
  bomb.exploded = true;
  bomb.life = -0.2;

  const blastRadius = 260;
  let kills = 0;
  const nearbyJanets = getFatalObstaclesInRange(bomb.x - 220, bomb.x + 220);

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
    radius: 26,
    exploded: false,
  });

  actor.spencerBombsUsed += 1;
  actor.vx *= 0.97;
  actor.vx += 60;
  actor.vy = Math.max(actor.vy, -240);
  actor.usedAbility = true;
  actor.abilityCooldown = 0.55;

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

    const nearbyJanets = getFatalObstaclesInRange(ball.x - 90, ball.x + 90);
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
      if (selectedCharacter.id === "lukepueppke" && actor.lukeSuperspeedTimer > 0) {
        destroyedJanets.add(rect.index);
        actor.vx = Math.max(actor.vx + 160, 420);
        actor.vy = Math.min(actor.vy - 60, -60);
        spawnParticles(actor.x, actor.y, 26, "#4fc3f7");
        spawnParticles(actor.x, actor.y, 10, "#ffffff");
        startScreenShake(8, 0.18);
        tone(700, 0.05, "sawtooth", 0.06);
        return;
      }
      if (selectedCharacter.id === "samhallet" && actor.samSwimActive && actor.samSwimPassesLeft > 0) {
        destroyedJanets.add(rect.index);
        actor.samSwimPassesLeft -= 1;
        actor.vx = Math.max(actor.vx + 120, 260);
        actor.vy = Math.min(actor.vy, -80);
        spawnParticles(actor.x, actor.y, 22, "#9ad8ff");
        tone(520, 0.05, "triangle", 0.07);
        if (actor.samSwimPassesLeft <= 0) {
          actor.samSwimActive = false;
          actor.samSwimTimer = 0;
        }
        return;
      }
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
      if (selectedCharacter.id === "nate" && actor.natePhaseCooldown <= 0) {
        actor.natePhaseCooldown = NATE_PHASE_COOLDOWN;
        actor.x = Math.max(actor.x, rect.x + rect.w + actor.radius + 8);
        actor.vx = Math.max(actor.vx, 420);
        actor.vy = Math.min(actor.vy - 50, -50);
        spawnParticles(actor.x, actor.y, 34, "#b986ff");
        spawnParticles(actor.x, actor.y, 14, "#ffffff");
        tone(760, 0.06, "triangle", 0.08);
        tone(980, 0.04, "square", 0.06);
        runStateLabel.textContent = "Nate phased through Hugh!";
        return;
      }
      if (selectedCharacter.id === "nathan" && actor.nathanHasTruck) {
        actor.nathanHasTruck = false;
        actor.nathanSlowdownPending = false;
        actor.radius = CALEB_ON_FOOT_RADIUS;
        actor.drag = CALEB_ON_FOOT_DRAG;
        actor.bounce = CALEB_ON_FOOT_BOUNCE;
        actor.gravityMult = CALEB_ON_FOOT_GRAVITY;
        actor.vx = Math.max(actor.vx * 0.78, 250);
        actor.vy = Math.min(actor.vy - 130, -130);
        destroyedJanets.add(rect.index);
        spawnParticles(actor.x, actor.y, 34, "#a8d9ff");
        spawnParticles(actor.x, actor.y, 14, "#ffffff");
        tone(170, 0.08, "square", 0.09);
        tone(110, 0.08, "triangle", 0.08);
        startScreenShake(13, 0.24);
        runStateLabel.textContent = "Nathan lost the Tacoma but keeps running!";
        return;
      }
      if (selectedCharacter.id === "davy" && actor.davyHasRide) {
        actor.davyHasRide = false;
        actor.davySlowdownPending = false;
        actor.radius = CALEB_ON_FOOT_RADIUS;
        actor.drag = CALEB_ON_FOOT_DRAG;
        actor.bounce = CALEB_ON_FOOT_BOUNCE;
        actor.gravityMult = CALEB_ON_FOOT_GRAVITY;
        actor.vx = Math.max(actor.vx * 0.78, 250);
        actor.vy = Math.min(actor.vy - 130, -130);
        destroyedJanets.add(rect.index);
        spawnParticles(actor.x, actor.y, 34, "#ffd39a");
        spawnParticles(actor.x, actor.y, 14, "#ffffff");
        tone(220, 0.08, "square", 0.09);
        tone(140, 0.08, "triangle", 0.08);
        startScreenShake(13, 0.24);
        runStateLabel.textContent = "Davy lost the ride but keeps running!";
        return;
      }
      if (selectedCharacter.id === "calebparker" && actor.calebHasDino) {
        actor.calebHasDino = false;
        actor.radius = CALEB_ON_FOOT_RADIUS;
        actor.drag = CALEB_ON_FOOT_DRAG;
        actor.bounce = CALEB_ON_FOOT_BOUNCE;
        actor.gravityMult = CALEB_ON_FOOT_GRAVITY;
        actor.vx = Math.max(actor.vx * 0.78, 260);
        actor.vy = Math.min(actor.vy - 140, -140);
        destroyedJanets.add(rect.index);
        spawnParticles(actor.x, actor.y, 34, "#9bff74");
        spawnParticles(actor.x, actor.y, 14, "#ffffff");
        tone(170, 0.08, "square", 0.09);
        tone(110, 0.08, "triangle", 0.08);
        startScreenShake(13, 0.24);
        runStateLabel.textContent = "Caleb lost the T-Rex but keeps running!";
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
      if (selectedCharacter.id === "owen" && trySpendOwenLife("Bone hit! Owen lost a life.")) {
        actor.y = y - actor.radius;
        actor.vx = Math.max(130, actor.vx * 0.85);
        actor.vy = -Math.max(180, Math.abs(actor.vy) * 0.42);
        return;
      }
      actor.y = y - actor.radius;
      spawnParticles(actor.x, actor.y, 24, "#ff7d5f");
      tone(120, 0.12, "sawtooth", 0.08);
      finishRun(`Run ended: ${rect.label || "fatal obstacle"} collision.`);
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
  updateEvanBasketballs(dt);
  updateNathanTrumps(dt);
  updateNathanAirstrike(dt);
  updateConfetti(dt);
  if (updateOwenGoKarts(dt)) {
    return;
  }

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

    if (selectedCharacter.id === "nathan" && actor.state === "flying" && actor.nathanHasTruck) {
      actor.nathanSpeed = Math.min(NATHAN_MAX_SPEED, actor.nathanSpeed + NATHAN_ACCEL * dt);
    }
    if (selectedCharacter.id === "davy" && actor.state === "flying" && actor.davyHasRide) {
      actor.davySpeed = Math.min(DAVY_MAX_SPEED, actor.davySpeed + DAVY_ACCEL * dt);
      actor.davyShotTimer -= dt;
      if (actor.davyShotTimer <= 0) {
        if (getCurrentMap().id === "long-john-silvers") {
          fireDavyShrimp((Math.random() - 0.5) * 0.22, 260, 13, 3.1);
          actor.davyShotTimer = 0.07 + Math.random() * 0.06;
        } else {
          fireDavyShrimp((Math.random() - 0.5) * 0.06, 70, 12, 2.8);
          actor.davyShotTimer = 0.26 + Math.random() * 0.12;
        }
      }
    }
    if (selectedCharacter.id === "davy" && actor.davyJumpCooldown > 0) {
      actor.davyJumpCooldown = Math.max(0, actor.davyJumpCooldown - dt);
    }

    if (selectedCharacter.id === "davy" && getCurrentMap().id === "long-john-silvers") {
      if (actor.davyGodModeTimer > 0) {
        actor.davyGodModeTimer = Math.max(0, actor.davyGodModeTimer - dt);
        actor.davyFlameTimer = Math.max(0, actor.davyFlameTimer - dt);
        actor.vx = Math.max(actor.vx, 1280);
        actor.vy = Math.min(actor.vy - 120 * dt, -220);
        const nearbyTargets = getFatalObstaclesInRange(actor.x - 260, actor.x + 520);
        nearbyTargets.forEach((target) => destroyedJanets.add(target.index));
        if (Math.random() < 0.85) {
          spawnEnemyLaser(actor.x - actor.radius * 0.6, actor.y + actor.radius * 0.8, Math.PI / 2 + (Math.random() - 0.5) * 0.18, 980, 0.55, "#ff7a00", true);
        }
      } else {
        actor.davyGodModeCooldown = Math.max(0, actor.davyGodModeCooldown - dt);
        if (actor.davyGodModeCooldown <= 0) {
          triggerDavyGodMode();
          actor.davyGodModeCooldown = DAVY_GOD_MODE_INTERVAL_MIN + Math.random() * (DAVY_GOD_MODE_INTERVAL_MAX - DAVY_GOD_MODE_INTERVAL_MIN);
        }
      }
    }

    if (selectedCharacter.id === "nathan" && actor.nathanFlagTimer > 0) {
      actor.nathanFlagTimer = Math.max(0, actor.nathanFlagTimer - dt);
    }
    if (selectedCharacter.id === "nathan" && actor.nathanAirstrikeReady && actor.nathanGas >= NATHAN_GAS_TARGET && actor.nathanFlagTimer <= 0) {
      triggerNathanAirstrike();
    }

    if (selectedCharacter.id === "nate" && actor.natePhaseCooldown > 0) {
      actor.natePhaseCooldown = Math.max(0, actor.natePhaseCooldown - dt);
    }

    if (selectedCharacter.id === "calebparker" && actor.state === "flying" && actor.calebHasDino) {
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

    if (selectedCharacter.id === "samhallet") {
      if (actor.samJumpCharges < 1) {
        actor.samJumpRegenTimer = Math.max(0, actor.samJumpRegenTimer - dt);
        if (actor.samJumpRegenTimer <= 0) {
          actor.samJumpCharges = 1;
          actor.samJumpRegenTimer = 0;
          spawnParticles(actor.x, actor.y, 10, "#d6f0ff");
          tone(680, 0.05, "triangle", 0.06);
        }
      }

      if (actor.samSwimActive) {
        actor.samSwimTimer = Math.max(0, actor.samSwimTimer - dt);
        actor.vx += 48 * dt;
        if (Math.random() < 0.4) spawnParticles(actor.x - actor.radius * 0.4, actor.y, 2, "#9ad8ff");
        if (actor.samSwimTimer <= 0 || actor.samSwimPassesLeft <= 0) {
          actor.samSwimActive = false;
          actor.samSwimTimer = 0;
        }
      }

      if (samBenchPickup) {
        samBenchPickup.life = Math.max(0, samBenchPickup.life - dt);
        if (samBenchPickup.life <= 0) {
          samBenchPickup = null;
        }
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
    if (selectedCharacter.id === "nathan" && actor.state === "flying" && actor.nathanHasTruck) {
      // Tacoma momentum keeps climbing unless reset by jump landing
      actor.vx = Math.max(actor.vx, actor.nathanSpeed);
    }
    if (selectedCharacter.id === "davy" && actor.state === "flying" && actor.davyHasRide) {
      actor.vx = Math.max(actor.vx, actor.davySpeed);
    }
    if (selectedCharacter.id === "calebparker" && actor.state === "flying" && actor.calebHasDino) {
      // T-Rex momentum keeps building through the run
      actor.vx = Math.max(actor.vx, actor.calebSpeed);
    }
    actor.x += actor.vx * dt;
    actor.y += actor.vy * dt;

    if (selectedCharacter.id === "spencer") {
      const maxHeightPx = SPENCER_MAX_HEIGHT_M * 10;
      const minAllowedY = terrainY(actor.x) - actor.radius - maxHeightPx;
      if (actor.y < minAllowedY) {
        actor.y = minAllowedY;
        if (actor.vy < 0) actor.vy = 0;
      }
    }

    const nearbyBouncePads = getBouncePadsInRange(actor.x - 260, actor.x + 520);
    const nearbyJanets = getFatalObstaclesInRange(actor.x - 220, actor.x + 560);
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
    const nearbyOwenMilk = selectedCharacter.id === "owen"
      ? getOwenMilkInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbySamDumbbells = selectedCharacter.id === "samhallet"
      ? getSamDumbbellsInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbyNathanGas = selectedCharacter.id === "nathan"
      ? getNathanGasInRange(actor.x - 260, actor.x + 560)
      : [];
    const nearbyTravisCraddles = (selectedCharacter.id === "traviswilliams" || selectedCharacter.id === "matteo")
      ? getTravisCraddlesInRange(actor.x - 260, actor.x + 560)
      : [];

    updateStricWoodsHazards(dt, nearbyJanets);
    updateLongJohnSilversHazards(dt, nearbyJanets);
    if (updateEnemyLasers(dt)) {
      return;
    }

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
        actor.radius = Math.min(42, actor.radius + 0.18);
        actor.vx = Math.max(90, actor.vx * 1.005 + 4);
        actor.drag = Math.max(0.082, actor.drag - 0.00035);
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

    for (const milk of nearbyOwenMilk) {
      const my = terrainY(milk.x) - milk.yOffset;
      const dx = actor.x - milk.x;
      const dy = actor.y - my;
      const hitR = actor.radius + milk.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedOwenMilk.add(milk.index);
        actor.owenMilks += 1;
        spawnParticles(milk.x, my, 16, "#e7eef8");
        tone(430 + Math.min(260, actor.owenMilks * 6), 0.05, "triangle", 0.06);

        if (actor.owenMilks % OWEN_MILKS_PER_LIFE === 0) {
          actor.owenLives += 1;
          startScreenShake(8, 0.18);
          spawnParticles(actor.x, actor.y, 24, "#ffffff");
          tone(700, 0.07, "triangle", 0.08);
          tone(920, 0.05, "triangle", 0.07);
          runStateLabel.textContent = `Bones stronger! Owen gained a life (${actor.owenLives}).`;
        }
      }
    }

    for (const dumbbell of nearbySamDumbbells) {
      const dyPos = terrainY(dumbbell.x) - dumbbell.yOffset;
      const dx = actor.x - dumbbell.x;
      const dy = actor.y - dyPos;
      const hitR = actor.radius + dumbbell.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedSamDumbbells.add(dumbbell.index);
        actor.samDumbbellCount += 1;
        spawnParticles(dumbbell.x, dyPos, 14, "#d5d5d5");
        tone(350 + Math.min(240, actor.samDumbbellCount * 8), 0.05, "triangle", 0.06);

        if (actor.samDumbbellCount % SAM_DUMBBELLS_PER_BENCH === 0) {
          spawnSamBenchPress();
          startScreenShake(8, 0.18);
          runStateLabel.textContent = "Bench spawned! Hit it before it disappears.";
        }
      }
    }

    for (const gas of nearbyNathanGas) {
      const gy = terrainY(gas.x) - gas.yOffset;
      const dx = actor.x - gas.x;
      const dy = actor.y - gy;
      const hitR = actor.radius + gas.r * 0.82;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedNathanGas.add(gas.index);
        actor.nathanGas += 1;
        actor.vx += 18;
        spawnParticles(gas.x, gy, 16, "#9be9ff");
        tone(420 + Math.min(260, actor.nathanGas * 11), 0.05, "triangle", 0.06);

        if (!actor.nathanAirstrikeReady && actor.nathanGas >= NATHAN_GAS_TARGET) {
          actor.nathanAirstrikeReady = true;
          actor.nathanFlagTimer = 1.4;
          startScreenShake(10, 0.2);
          spawnParticles(actor.x, actor.y, 28, "#ffffff");
          tone(740, 0.07, "triangle", 0.08);
          runStateLabel.textContent = `${NATHAN_GAS_TARGET} gallons! Flag up — airstrike incoming.`;
        }
      }
    }

    for (const craddle of nearbyTravisCraddles) {
      const cy = terrainY(craddle.x) - craddle.yOffset;
      const dx = actor.x - craddle.x;
      const dy = actor.y - cy;
      const hitR = actor.radius + craddle.r * 0.84;
      if (dx * dx + dy * dy <= hitR * hitR) {
        collectedTravisCraddles.add(craddle.index);
        const isMatteo = selectedCharacter.id === "matteo";
        const craddleCountKey = isMatteo ? "matteoCraddleCount" : "travisCraddleCount";
        actor[craddleCountKey] += 1;
        actor.vx += 14;
        spawnParticles(craddle.x, cy, 18, "#dcb892");
        tone(380 + Math.min(280, actor[craddleCountKey] * 9), 0.05, "triangle", 0.06);

        if (actor[craddleCountKey] >= TRAVIS_CRADDLES_FOR_LAUNCH) {
          actor[craddleCountKey] -= TRAVIS_CRADDLES_FOR_LAUNCH;
          actor.y -= 80;
          actor.vy = -1650;
          actor.x += TRAVIS_LAUNCH_FORWARD_METERS * 10;
          actor.vx = Math.max(actor.vx + 900, 1400);
          spawnParticles(actor.x, actor.y, 44, "#ffe0bf");
          spawnParticles(actor.x, actor.y, 28, "#ffffff");
          startScreenShake(16, 0.32);
          tone(820, 0.08, "triangle", 0.1);
          tone(620, 0.06, "square", 0.08);
          const name = isMatteo ? "Matteo" : "Travis";
          runStateLabel.textContent = `Cradle snatch! ${name} blasted ${TRAVIS_LAUNCH_FORWARD_METERS}m forward.`;
        }
      }
    }

    if (selectedCharacter.id === "samhallet" && samBenchPickup) {
      const by = terrainY(samBenchPickup.x) - samBenchPickup.yOffset;
      const nearestX = Math.max(samBenchPickup.x, Math.min(actor.x, samBenchPickup.x + samBenchPickup.w));
      const nearestY = Math.max(by, Math.min(actor.y, by + samBenchPickup.h));
      const dx = actor.x - nearestX;
      const dy = actor.y - nearestY;
      if (dx * dx + dy * dy <= actor.radius * actor.radius) {
        actor.samBenchSets += 1;
        actor.samSwimCharges += 1;
        actor.samSwimPerTurn = 1 + actor.samBenchSets;
        spawnParticles(actor.x, actor.y, 32, "#9ad8ff");
        tone(620, 0.08, "triangle", 0.08);
        tone(810, 0.06, "triangle", 0.07);
        startScreenShake(12, 0.24);
        runStateLabel.textContent = `Bench set complete! Swim charges: ${actor.samSwimCharges}. Hugh passes per swim: ${actor.samSwimPerTurn}.`;
        samBenchPickup = null;
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
      const impactVy = Math.abs(actor.vy);
      if (impactVy > 80) {
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

      if (selectedCharacter.id === "nathan" && actor.nathanSlowdownPending && actor.nathanHasTruck) {
        actor.nathanSlowdownPending = false;
        actor.nathanSpeed = actor.nathanSpeed * 0.75;
        actor.vx = actor.vx * 0.75;
        spawnParticles(actor.x, actor.y, 12, "#c7e3ff");
      }

      if (selectedCharacter.id === "davy" && actor.davySlowdownPending && actor.davyHasRide) {
        actor.davySlowdownPending = false;
        actor.davySpeed = actor.davySpeed * 0.75;
        actor.vx = actor.vx * 0.75;
        spawnParticles(actor.x, actor.y, 12, "#ffd2a8");
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

    if (headToHeadState.active && !headToHeadState.localFinished && headToHeadState.opponentFinished) {
      const oppM = headToHeadState.liveNetwork
        ? networkState.opponentFinalDistance
        : (headToHeadState.opponentActor
          ? Math.max(0, (headToHeadState.opponentActor.maxX - world.launchX) / 10)
          : 0);
      if (travelled > oppM + 0.05) {
        headToHeadState.localFinished = true;
        headToHeadState.localFinalDistance = travelled;
        headToHeadState.localFinishMessage = "Auto-win secured: you passed opponent distance.";

        if (headToHeadState.liveNetwork && networkState.roomChannel && !networkState.localFinishSent) {
          networkState.localFinishSent = true;
          networkState.roomChannel.send({
            type: "broadcast",
            event: "finish",
            payload: {
              playerId: networkState.playerId,
              message: `${getNetworkPlayerName()} auto-won by passing distance.`,
              distance: travelled,
              ts: Date.now(),
            },
          });
        }

        finalizeHeadToHeadIfReady();
      }
    }


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
  updateHeadToHeadOpponent(dt);
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
  if (headToHeadState.active || headToHeadState.mode === "searching" || headToHeadState.mode === "roulette") return;
  if (actor.state === "flying") return; // no map switch mid-run
  currentMapIndex = (currentMapIndex + 1) % maps.length;
  updateMapUI();
  if (mapSelectDropdown) mapSelectDropdown.value = String(currentMapIndex);
}

function cloneActorState(sourceActor) {
  return JSON.parse(JSON.stringify(sourceActor));
}

function hideAllOverlays() {
  menuScreen.classList.remove("active");
  characterScreen.classList.remove("active");
  leaderboardScreen.classList.remove("active");
  matchmakingScreen?.classList.remove("active");
}
function isHeadToHeadLocked() {
  return headToHeadState.mode === "searching"
    || headToHeadState.mode === "roulette"
    || headToHeadState.active;
}
function refreshHeadToHeadLocks() {
  if (restartBtn) restartBtn.disabled = isHeadToHeadLocked();
}

function getNetworkPlayerName() {
  const accountName = getSessionAccountName();
  if (accountName) return accountName;
  if (networkState.displayName) return networkState.displayName;
  return `Player-${networkState.playerId.slice(-4)}`;
}

function normalizeRankedName(name) {
  return (name || "Player")
    .toString()
    .trim()
    .slice(0, 16)
    .toLowerCase();
}

function normalizeAccountName(name) {
  return (name || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, "")
    .slice(0, 16);
}

function validateAccountName(name) {
  const normalized = normalizeAccountName(name);
  if (normalized.length < 3) {
    throw new Error("Account names must be 3-16 characters using letters, numbers, dots, dashes, or underscores.");
  }
  return normalized;
}

function buildAccountEmail(accountName) {
  return `${validateAccountName(accountName)}@${AUTH_ACCOUNT_DOMAIN}`;
}

function getSessionAccountName(session = authSession) {
  const metadataName = session?.user?.user_metadata?.account_name;
  if (metadataName) return metadataName.toString().slice(0, 16);
  const email = session?.user?.email;
  if (email && email.includes("@")) return email.split("@")[0].slice(0, 16);
  return "";
}

function getAuthenticatedRankedKey() {
  const id = authSession?.user?.id;
  return id ? `uid:${id}` : "";
}

function getDefaultRankedDisplayName() {
  const accountName = getSessionAccountName();
  if (accountName) return accountName;
  return `Player-${networkState.playerId.slice(-4)}`;
}

function requireAuthenticatedAccount(actionLabel = "play") {
  if (authSession?.user?.id) return true;
  alert(`You need to create or sign into an account with an account name and password before you can ${actionLabel}.`);
  accountNameInput?.focus();
  return false;
}

function setAuthControlsDisabled(disabled) {
  authRequestInFlight = !!disabled;
  if (accountNameInput) accountNameInput.disabled = !!disabled;
  if (accountPasswordInput) accountPasswordInput.disabled = !!disabled;
  if (signUpBtn) signUpBtn.disabled = !!disabled;
  if (signInBtn) signInBtn.disabled = !!disabled;
}

function getAuthErrorMessage(error) {
  const raw = (error?.message || error?.error_description || error?.msg || "Authentication failed").toString();
  const lower = raw.toLowerCase();
  if (lower.includes("email logins are disabled") || lower.includes("email signups are disabled") || lower.includes("email provider is disabled")) {
    return "Supabase Email auth is disabled. In Supabase: Authentication → Providers → Email, turn Email provider ON, then disable Confirm email for instant username-style signup.";
  }
  if (lower.includes("rate limit") || lower.includes("email rate limit") || String(error?.status || "") === "429") {
    return "Too many account creation attempts right now. Wait 60-120 seconds, then try Create Account once.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Invalid login credentials. Either the account was never created, the password is wrong, or signup was blocked by rate limits.";
  }
  if (lower.includes("user already registered")) {
    return "That account name already exists. Use Sign In instead.";
  }
  if (lower.includes("email not confirmed") || lower.includes("confirm") || lower.includes("confirmation")) {
    return "Your Supabase project is still requiring email confirmation. Turn off Confirm email in Supabase Auth settings so account-name login works immediately.";
  }
  return raw;
}

function updateAccountStatusMessage(message) {
  if (!accountStatus) return;
  accountStatus.textContent = message;
}

function isAdminSignedIn() {
  return getSessionAccountName() === ADMIN_ACCOUNT_NAME;
}

function refreshAdminCharacterPanel() {
  if (!adminCharacterPanel) return;
  adminCharacterPanel.style.display = isAdminSignedIn() ? "block" : "none";
}

function syncSignedInIdentityUI() {
  const accountName = getSessionAccountName();
  if (headToHeadNameInput) {
    headToHeadNameInput.value = accountName;
    headToHeadNameInput.disabled = true;
  }
  if (playerNameInput && accountName) {
    playerNameInput.value = accountName;
  }
}

function clearSignedInIdentityUI() {
  if (headToHeadNameInput) {
    headToHeadNameInput.value = "";
    headToHeadNameInput.disabled = true;
  }
}

function getRankedLocalIdentity(preferredName) {
  const chosenDisplay = (preferredName || "").toString().trim().slice(0, 16);
  const authKey = getAuthenticatedRankedKey();
  if (authKey) {
    return {
      key: authKey,
      cloudName: authKey,
      displayName: chosenDisplay || getDefaultRankedDisplayName(),
      authenticated: true,
    };
  }

  const fallback = chosenDisplay || getDefaultRankedDisplayName();
  return {
    key: `guest:${normalizeRankedName(fallback)}`,
    cloudName: fallback,
    displayName: fallback,
    authenticated: false,
  };
}

function loadHeadToHeadRankings() {
  try {
    const raw = localStorage.getItem(H2H_RANKINGS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function saveHeadToHeadRankings(data) {
  localStorage.setItem(H2H_RANKINGS_KEY, JSON.stringify(data || {}));
}

function getOrCreateHeadToHeadProfile(data, playerName, options = {}) {
  const identity = options.isLocalPlayer ? getRankedLocalIdentity(playerName) : null;
  const key = identity
    ? identity.key
    : ((playerName || "Player").toString().startsWith("uid:")
      ? (playerName || "Player").toString()
      : normalizeRankedName(playerName));
  if (!data[key]) {
    data[key] = {
      key,
      name: identity ? identity.cloudName : (playerName || "Player").toString().slice(0, 64),
      displayName: identity ? identity.displayName : (playerName || "Player").toString().slice(0, 16),
      wins: 0,
      losses: 0,
      draws: 0,
      matches: 0,
      rating: 1000,
      peakRating: 1000,
      bestWinMargin: 0,
    };
  } else if (identity) {
    data[key].key = key;
    data[key].name = identity.cloudName;
    data[key].displayName = identity.displayName;
  } else {
    if (!data[key].key) data[key].key = key;
    if (!data[key].displayName) {
      data[key].displayName = (data[key].name || playerName || "Player").toString().slice(0, 16);
    }
  }
  const parsedRating = Number.isFinite(Number(data[key].rating)) ? Number(data[key].rating) : 1000;
  data[key].rating = parsedRating;
  if (!Number.isFinite(Number(data[key].peakRating))) {
    data[key].peakRating = parsedRating;
  }
  return data[key];
}

function getRankTierFromRating(rating) {
  const numericRating = Number(rating) || 0;
  let currentRank = AIR_FORCE_RANKS[0];
  AIR_FORCE_RANKS.forEach((rank) => {
    if (numericRating >= rank.minRating) currentRank = rank;
  });
  return `${currentRank.name} (${currentRank.code})`;
}

function getRankFloorFromPeakRating(peakRating) {
  const numericPeak = Number(peakRating) || 0;
  let floor = AIR_FORCE_RANKS[0].minRating;
  AIR_FORCE_RANKS.forEach((rank) => {
    if (numericPeak >= rank.minRating) floor = rank.minRating;
  });
  return floor;
}

function getHeadToHeadProfileSummary(playerName) {
  const data = loadHeadToHeadRankings();
  const p = getOrCreateHeadToHeadProfile(data, playerName, { isLocalPlayer: true });
  const tier = getRankTierFromRating(p.rating);
  return `${tier} ${Math.round(p.rating)} • W:${p.wins} L:${p.losses} D:${p.draws}`;
}

async function fetchCloudHeadToHeadRankings(force = false) {
  if (rankedCloudFetchInFlight) return false;
  const now = Date.now();
  if (!force && now - rankedCloudLastFetchAt < 10000) return false;

  rankedCloudFetchInFlight = true;
  try {
    const fullUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_H2H_RANKED_TABLE}?select=player_key,player_name,display_name,rating,peak_rating,wins,losses,draws,matches,best_win_margin,updated_at&order=rating.desc&limit=200`;
    const basicUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_H2H_RANKED_TABLE}?select=player_name,rating,wins,losses&order=rating.desc&limit=200`;
    const minimalUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_H2H_RANKED_TABLE}?select=player_name,rating&order=rating.desc&limit=200`;

    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${getAuthToken()}`,
    };

    let res = await fetch(fullUrl, { cache: "no-store", headers });
    if (!res.ok) res = await fetch(basicUrl, { cache: "no-store", headers });
    if (!res.ok) res = await fetch(minimalUrl, { cache: "no-store", headers });
    if (!res.ok) return false;

    const rows = await res.json();
    if (!Array.isArray(rows)) return false;

    const local = loadHeadToHeadRankings();
    rows.forEach((r) => {
      const cloudName = (r.player_name || "Player").toString().slice(0, 64);
      const key = (r.player_key || "").toString().trim()
        || (cloudName.startsWith("uid:") ? cloudName : normalizeRankedName(cloudName));
      const existing = local[key];
      const rating = Number.isFinite(Number(r.rating)) ? Number(r.rating) : 1000;
      local[key] = {
        key,
        name: cloudName,
        displayName: (r.display_name || existing?.displayName || cloudName).toString().slice(0, 16),
        rating,
        wins: Number.isFinite(Number(r.wins)) ? Number(r.wins) : 0,
        losses: Number.isFinite(Number(r.losses)) ? Number(r.losses) : 0,
        draws: Number.isFinite(Number(r.draws)) ? Number(r.draws) : 0,
        matches: Number.isFinite(Number(r.matches)) ? Number(r.matches) : 0,
        peakRating: Math.max(
          rating,
          Number.isFinite(Number(r.peak_rating)) ? Number(r.peak_rating) : 0,
          Number.isFinite(Number(existing?.peakRating)) ? Number(existing.peakRating) : 0,
        ),
        bestWinMargin: Number.isFinite(Number(r.best_win_margin)) ? Number(r.best_win_margin) : 0,
      };
    });
    saveHeadToHeadRankings(local);
    rankedCloudLastFetchAt = now;
    return true;
  } catch (e) {
    console.error("fetchCloudHeadToHeadRankings error:", e);
    return false;
  } finally {
    rankedCloudFetchInFlight = false;
  }
}

async function pushCloudHeadToHeadProfile(profile) {
  if (!profile) return false;

  if (!hasCloudAuthSession()) {
    return pushRankedProfileViaGameAccountRpc(profile);
  }

  try {
    const key = (profile.key || profile.name || "").toString().slice(0, 64);
    const cloudName = (profile.name || "Player").toString().slice(0, 64);
    const displayName = (profile.displayName || getNetworkPlayerName()).toString().slice(0, 16);
    const urlByKey = `${SUPABASE_URL}/rest/v1/${SUPABASE_H2H_RANKED_TABLE}?on_conflict=player_key`;
    const urlByName = `${SUPABASE_URL}/rest/v1/${SUPABASE_H2H_RANKED_TABLE}?on_conflict=player_name`;
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    };

    const fullBody = JSON.stringify({
      player_key: key,
      player_name: cloudName,
      display_name: displayName,
      rating: Math.round(Number(profile.rating) || 1000),
      peak_rating: Math.round(Number(profile.peakRating) || Number(profile.rating) || 1000),
      wins: Number(profile.wins) || 0,
      losses: Number(profile.losses) || 0,
      draws: Number(profile.draws) || 0,
      matches: Number(profile.matches) || 0,
      best_win_margin: Number(profile.bestWinMargin) || 0,
      updated_at: new Date().toISOString(),
    });
    const basicBody = JSON.stringify({
      player_key: key,
      player_name: cloudName,
      display_name: displayName,
      rating: Math.round(Number(profile.rating) || 1000),
      wins: Number(profile.wins) || 0,
      losses: Number(profile.losses) || 0,
    });
    const minimalBody = JSON.stringify({
      player_name: cloudName,
      rating: Math.round(Number(profile.rating) || 1000),
    });

    let res = await fetch(urlByKey, { method: "POST", headers, body: fullBody });
    if (!res.ok) res = await fetch(urlByName, { method: "POST", headers, body: fullBody });
    if (!res.ok) res = await fetch(urlByName, { method: "POST", headers, body: basicBody });
    if (!res.ok) res = await fetch(urlByName, { method: "POST", headers, body: minimalBody });
    return res.ok;
  } catch (e) {
    console.error("pushCloudHeadToHeadProfile error:", e);
    return false;
  }
}

function applyHeadToHeadRankedResult(localName, rivalName, outcome, marginMeters) {
  const data = loadHeadToHeadRankings();
  const localProfile = getOrCreateHeadToHeadProfile(data, localName, { isLocalPlayer: true });
  const rivalProfile = getOrCreateHeadToHeadProfile(data, rivalName || "Opponent");

  const expected = 1 / (1 + (10 ** ((rivalProfile.rating - localProfile.rating) / 400)));
  const score = outcome > 0 ? 1 : outcome < 0 ? 0 : 0.5;
  const k = 24;
  localProfile.rating = Math.max(100, Math.round(localProfile.rating + k * (score - expected)));
  localProfile.peakRating = Math.max(Number(localProfile.peakRating) || 1000, Number(localProfile.rating) || 1000);
  const rankFloor = getRankFloorFromPeakRating(localProfile.peakRating);
  localProfile.rating = Math.max(rankFloor, localProfile.rating);

  localProfile.matches += 1;
  if (outcome > 0) {
    localProfile.wins += 1;
    localProfile.bestWinMargin = Math.max(localProfile.bestWinMargin || 0, Number(Math.max(0, marginMeters).toFixed(1)));
  } else if (outcome < 0) {
    localProfile.losses += 1;
  } else {
    localProfile.draws += 1;
  }

  saveHeadToHeadRankings(data);
  pushCloudHeadToHeadProfile(localProfile).then(() => fetchCloudHeadToHeadRankings(true).then(() => renderRankedLeaderboard()));
  return `(Ranked: ${getRankTierFromRating(localProfile.rating)} ${Math.round(localProfile.rating)} | W:${localProfile.wins} L:${localProfile.losses} D:${localProfile.draws})`;
}

function ensureNetworkClient() {
  if (networkState.client) return true;
  const supabaseLib = window.supabase;
  if (!supabaseLib?.createClient) return false;
  try {
    networkState.client = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    networkState.enabled = true;
    return true;
  } catch {
    networkState.enabled = false;
    return false;
  }
}

function cleanupNetworkQueue() {
  if (networkState.queueBridgeInterval) {
    clearInterval(networkState.queueBridgeInterval);
    networkState.queueBridgeInterval = null;
  }
  if (networkState.queueBridgeTimeout) {
    clearTimeout(networkState.queueBridgeTimeout);
    networkState.queueBridgeTimeout = null;
  }
  networkState.searching = false;
  networkState.searchElapsed = 0;
  networkState.heartbeatTimer = 0;
  if (networkState.queueChannel) {
    networkState.client?.removeChannel(networkState.queueChannel);
    networkState.queueChannel = null;
  }
}

function cleanupNetworkRoom() {
  networkState.snapshotTimer = 0;
  networkState.opponentSnapshot = null;
  networkState.opponentFinished = false;
  networkState.opponentFinalDistance = 0;
  networkState.localFinishSent = false;
  networkState.connectingRoom = false;
  if (networkState.roomChannel) {
    networkState.client?.removeChannel(networkState.roomChannel);
    networkState.roomChannel = null;
  }
  networkState.roomId = null;
}

function deterministicLiveMatchFromIds(aId, bId) {
  const [low, high] = [aId, bId].sort();
  const key = `${low}:${high}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = ((hash * 31) + key.charCodeAt(i)) >>> 0;
  }
  const characterIndex = hash % characters.length;
  const mapIndex = ((hash >>> 8) || hash) % maps.length;
  return {
    roomId: `room-${hash.toString(36)}`,
    characterId: characters[characterIndex].id,
    mapIndex,
  };
}

function normalizePrivateCode(code) {
  return (code || "")
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

function isQueueCompatible(otherCode) {
  const mine = normalizePrivateCode(networkState.privateCode);
  const theirs = normalizePrivateCode(otherCode);
  return mine === theirs;
}

function sendQueueHeartbeat() {
  if (!networkState.queueChannel || !networkState.searching) return;
  networkState.queueChannel.send({
    type: "broadcast",
    event: "queue",
    payload: {
      type: "searching",
      playerId: networkState.playerId,
      name: getNetworkPlayerName(),
      privateCode: normalizePrivateCode(networkState.privateCode),
      ts: Date.now(),
    },
  });
}

function broadcastMatchFoundInvite(targetPlayerId, match, rivalName) {
  if (!networkState.queueChannel || !targetPlayerId || !match) return;
  const payload = {
    type: "match-found",
    playerId: networkState.playerId,
    targetId: targetPlayerId,
    name: getNetworkPlayerName(),
    privateCode: normalizePrivateCode(networkState.privateCode),
    roomId: match.roomId,
    characterId: match.characterId,
    mapIndex: match.mapIndex,
    ts: Date.now(),
  };

  // Send multiple times to reduce missed packets when the other player is joining.
  networkState.queueChannel.send({ type: "broadcast", event: "queue", payload });
  setTimeout(() => {
    if (networkState.searching || networkState.connectingRoom) {
      networkState.queueChannel?.send({ type: "broadcast", event: "queue", payload });
    }
  }, 220);
  setTimeout(() => {
    if (networkState.searching || networkState.connectingRoom) {
      networkState.queueChannel?.send({ type: "broadcast", event: "queue", payload });
    }
  }, 520);
}

function startQueueBridgeAfterRoomJoin(match, targetPlayerId) {
  if (!networkState.queueChannel || !targetPlayerId || !match) return;

  if (networkState.queueBridgeInterval) {
    clearInterval(networkState.queueBridgeInterval);
  }
  if (networkState.queueBridgeTimeout) {
    clearTimeout(networkState.queueBridgeTimeout);
  }

  networkState.queueBridgeInterval = setInterval(() => {
    if (!networkState.queueChannel) return;
    if (networkState.opponentSnapshot) {
      cleanupNetworkQueue();
      return;
    }
    sendQueueHeartbeat();
    broadcastMatchFoundInvite(targetPlayerId, match, "Opponent");
  }, 700);

  networkState.queueBridgeTimeout = setTimeout(() => {
    cleanupNetworkQueue();
  }, 10000);
}

function startLiveNetworkSearch() {
  if (!ensureNetworkClient()) return false;

  cleanupNetworkQueue();
  cleanupNetworkRoom();
  networkState.peerId = null;

  const queueChannel = networkState.client.channel(NETWORK_QUEUE_CHANNEL);
  networkState.queueChannel = queueChannel;
  networkState.searching = true;
  networkState.searchElapsed = 0;
  networkState.heartbeatTimer = 0;

  queueChannel.on("broadcast", { event: "queue" }, ({ payload }) => {
    if (!payload || !networkState.searching) return;
    if (payload.type === "searching") {
      if (!payload.playerId || payload.playerId === networkState.playerId) return;
      if (!isQueueCompatible(payload.privateCode)) return;
      if (networkState.peerId) return;
      if (networkState.connectingRoom || networkState.roomId) return;

      const myId = networkState.playerId;
      const otherId = payload.playerId;
      networkState.peerId = otherId;
      networkState.connectingRoom = true;
      const match = deterministicLiveMatchFromIds(myId, otherId);
      broadcastMatchFoundInvite(otherId, match, payload.name || "Opponent");
      if (matchmakingStatus) matchmakingStatus.textContent = `Live opponent found: ${payload.name || "Opponent"}. Joining room...`;
      joinLiveNetworkRoom(match.roomId, match.characterId, match.mapIndex, payload.name || "Opponent");
    }

    if (payload.type === "match-found") {
      if (!payload.playerId || payload.playerId === networkState.playerId) return;
      if (payload.targetId !== networkState.playerId) return;
      if (!isQueueCompatible(payload.privateCode)) return;
      if (networkState.peerId || networkState.connectingRoom || networkState.roomId) return;

      networkState.peerId = payload.playerId;
      networkState.connectingRoom = true;
      if (matchmakingStatus) matchmakingStatus.textContent = `Live opponent found: ${payload.name || "Opponent"}. Joining room...`;
      joinLiveNetworkRoom(
        payload.roomId || deterministicLiveMatchFromIds(networkState.playerId, payload.playerId).roomId,
        payload.characterId || deterministicLiveMatchFromIds(networkState.playerId, payload.playerId).characterId,
        Number.isFinite(Number(payload.mapIndex)) ? Number(payload.mapIndex) : deterministicLiveMatchFromIds(networkState.playerId, payload.playerId).mapIndex,
        payload.name || "Opponent"
      );
      return;
    }
  });

  queueChannel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      sendQueueHeartbeat();
    }
  });

  return true;
}

function joinLiveNetworkRoom(roomId, characterId, mapIndex, rivalName) {
  cleanupNetworkRoom();
  networkState.connectingRoom = true;

  const roomChannel = networkState.client.channel(`faith-h2h-${roomId}`);
  networkState.roomChannel = roomChannel;
  networkState.roomId = roomId;
  networkState.opponentSnapshot = null;
  networkState.opponentFinished = false;
  networkState.opponentFinalDistance = 0;

  roomChannel.on("broadcast", { event: "state" }, ({ payload }) => {
    if (!payload || payload.playerId === networkState.playerId) return;
    networkState.opponentSnapshot = payload;
  });

  roomChannel.on("broadcast", { event: "finish" }, ({ payload }) => {
    if (!payload || payload.playerId === networkState.playerId) return;
    networkState.opponentFinished = true;
    networkState.opponentFinalDistance = Number(payload.distance) || 0;
    if (headToHeadState.opponentActor) {
      headToHeadState.opponentActor.state = "ended";
      headToHeadState.opponentActor.vx = 0;
      headToHeadState.opponentActor.vy = 0;
      const maxX = world.launchX + networkState.opponentFinalDistance * 10;
      headToHeadState.opponentActor.maxX = Math.max(headToHeadState.opponentActor.maxX || world.launchX, maxX);
      headToHeadState.opponentFinished = true;
    }
    if (headToHeadState.active && runStateLabel) {
      runStateLabel.textContent = payload.message || `${headToHeadState.rivalName} finished. Keep going!`;
    }
    finalizeHeadToHeadIfReady();
  });

  roomChannel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      const match = { roomId, characterId, mapIndex };
      networkState.connectingRoom = false;
      // Keep queue alive briefly for late peer handoff; cleanup happens automatically.
      networkState.searching = true;
      startQueueBridgeAfterRoomJoin(match, networkState.peerId);
      headToHeadState.liveNetwork = true;
      headToHeadState.rivalName = rivalName || "Opponent";
      headToHeadState.randomCharacter = characters.find((c) => c.id === characterId) || characters[0];
      headToHeadState.randomMapIndex = Math.max(0, Math.min(maps.length - 1, mapIndex));
      startHeadToHeadMatch();
      return;
    }

    if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
      networkState.connectingRoom = false;
      cleanupNetworkRoom();
      if (headToHeadState.mode === "searching") {
        if (matchmakingStatus) matchmakingStatus.textContent = "Live room failed, still searching...";
        networkState.searching = true;
        networkState.searchElapsed = Math.max(0, networkState.searchElapsed - 1.2);
      }
    }
  });
}

function sendLiveNetworkSnapshot() {
  if (!headToHeadState.active || !headToHeadState.liveNetwork || !networkState.roomChannel) return;
  networkState.roomChannel.send({
    type: "broadcast",
    event: "state",
    payload: {
      playerId: networkState.playerId,
      x: actor.x,
      y: actor.y,
      vx: actor.vx,
      vy: actor.vy,
      radius: actor.radius,
      drag: actor.drag,
      bounce: actor.bounce,
      gravityMult: actor.gravityMult,
      maxX: actor.maxX,
      state: actor.state,
      cameraX,
      ts: Date.now(),
    },
  });
}

function stopLiveNetworkSession() {
  cleanupNetworkQueue();
  cleanupNetworkRoom();
  networkState.peerId = null;
  headToHeadState.liveNetwork = false;
}

function beginHeadToHeadSearch(options = {}) {
  if (!authSession?.user?.id) {
    alert("Ranked head-to-head now requires a claimed account. Create or sign into an account name + password first.");
    return;
  }

  const enteredName = getSessionAccountName().slice(0, 16);
  if (!enteredName) {
    alert("Sign into your account before searching for a head-to-head match.");
    return;
  }
  if (headToHeadNameInput) headToHeadNameInput.value = enteredName;
  networkState.displayName = enteredName.slice(0, 16);
  localStorage.setItem("faith-h2h-name", networkState.displayName);

  const privateCode = normalizePrivateCode(options.privateCode ?? privateMatchCodeInput?.value ?? "");
  if (options.requirePrivate && !privateCode) {
    alert("Enter a private match code first.");
    privateMatchCodeInput?.focus();
    return;
  }
  networkState.privateCode = privateCode;
  if (privateMatchCodeInput) privateMatchCodeInput.value = privateCode;
  localStorage.setItem("faith-h2h-private-code", privateCode);

  stopLiveNetworkSession();
  headToHeadState.mode = "searching";
  headToHeadState.active = false;
  headToHeadState.searchTimer = 1.6 + Math.random() * 2.2;
  headToHeadState.rouletteTimer = 0;
  headToHeadState.rouletteTickTimer = 0;
  headToHeadState.randomCharacter = null;
  headToHeadState.liveNetwork = false;
  headToHeadState.rivalName = headToHeadRivals[Math.floor(Math.random() * headToHeadRivals.length)];
  hideAllOverlays();
  matchmakingScreen?.classList.add("active");
  controlsPanel.classList.add("hidden");
  refreshHeadToHeadLocks();
  const liveStarted = startLiveNetworkSearch();
  if (matchmakingStatus) {
    const rankedSummary = getHeadToHeadProfileSummary(networkState.displayName);
    matchmakingStatus.textContent = liveStarted
      ? (privateCode ? `Searching private code ${privateCode}... (${rankedSummary})` : `Searching live network for opponent... (${rankedSummary})`)
      : "Searching for game...";
  }
}

function cancelHeadToHeadSearch() {
  stopLiveNetworkSession();
  headToHeadState.mode = "idle";
  headToHeadState.active = false;
  headToHeadState.opponentActor = null;
  matchmakingScreen?.classList.remove("active");
  refreshHeadToHeadLocks();
  showMenu();
}

function initHeadToHeadOpponent() {
  const forkY = terrainY(world.launchX) - 70;
  headToHeadState.opponentActor = cloneActorState(actor);
  headToHeadState.opponentActor.x = world.launchX;
  headToHeadState.opponentActor.y = forkY;
  headToHeadState.opponentActor.vx = (560 + Math.random() * 200) * selectedCharacter.launchBoost;
  headToHeadState.opponentActor.vy = (-420 - Math.random() * 130) * selectedCharacter.launchBoost;
  headToHeadState.opponentActor.state = "flying";
  headToHeadState.opponentActor.maxX = world.launchX;
  headToHeadState.opponentCameraX = 0;
  headToHeadState.opponentJumpTimer = 1.0 + Math.random() * 1.8;
  headToHeadState.opponentStoppedTimer = 0;
  headToHeadState.opponentFinished = false;
}

function startHeadToHeadMatch() {
  if (!headToHeadState.randomCharacter) {
    headToHeadState.randomCharacter = characters[Math.floor(Math.random() * characters.length)];
  }
  selectedCharacter = headToHeadState.randomCharacter;
  currentMapIndex = headToHeadState.randomMapIndex;
  headToHeadState.mode = "active";
  headToHeadState.active = true;
  headToHeadState.localFinished = false;
  headToHeadState.localFinalDistance = 0;
  headToHeadState.localFinishMessage = "";
  headToHeadState.resultText = "";
  headToHeadState.localWonLastMatch = false;
  headToHeadState.opponentFinished = false;
  networkState.localFinishSent = false;
  refreshHeadToHeadLocks();

  hideAllOverlays();
  controlsPanel.classList.remove("hidden");
  applyCharacterStats(selectedCharacter);
  resetActor();
  updateMapUI();
  if (mapSelectDropdown) mapSelectDropdown.value = String(currentMapIndex);

  if (!headToHeadState.liveNetwork) {
    initHeadToHeadOpponent();
  } else {
    headToHeadState.opponentActor = cloneActorState(actor);
  }
  refreshHeadToHeadLocks();
  runStateLabel.textContent = `Ranked Head-to-Head vs ${headToHeadState.rivalName} — ${selectedCharacter.name} on ${getCurrentMap().name}`;
  updateAbilityHint();
}

function updateHeadToHeadMatchmaking(dt) {
  if (headToHeadState.mode === "searching") {
    if (networkState.connectingRoom) {
      if (matchmakingStatus) matchmakingStatus.textContent = "Joining live room...";
      networkState.heartbeatTimer -= dt;
      if (networkState.heartbeatTimer <= 0) {
        networkState.heartbeatTimer = NETWORK_HEARTBEAT_SECONDS;
        sendQueueHeartbeat();
      }
      return;
    }

    if (networkState.searching) {
      networkState.searchElapsed += dt;
      networkState.heartbeatTimer -= dt;
      if (networkState.heartbeatTimer <= 0) {
        networkState.heartbeatTimer = NETWORK_HEARTBEAT_SECONDS;
        sendQueueHeartbeat();
      }

      if (networkState.searchElapsed >= NETWORK_SEARCH_TIMEOUT_SECONDS) {
        cleanupNetworkQueue();
        if (matchmakingStatus) matchmakingStatus.textContent = "No live opponent found. Switching to bot matchmaking...";
      } else {
        return;
      }
    }

    headToHeadState.searchTimer -= dt;
    if (headToHeadState.searchTimer <= 0) {
      headToHeadState.mode = "roulette";
      headToHeadState.rouletteTimer = headToHeadState.rouletteDuration;
      headToHeadState.rouletteTickTimer = 0;
      if (matchmakingStatus) matchmakingStatus.textContent = "Match found! Randomizing character + map...";
    }
    return;
  }

  if (headToHeadState.mode === "roulette") {
    headToHeadState.rouletteTimer -= dt;
    headToHeadState.rouletteTickTimer -= dt;
    if (headToHeadState.rouletteTickTimer <= 0) {
      headToHeadState.rouletteTickTimer = 0.08;
      const tempCharacter = characters[Math.floor(Math.random() * characters.length)];
      const tempMapIndex = Math.floor(Math.random() * maps.length);
      if (matchmakingStatus) {
        matchmakingStatus.textContent = `Match found vs ${headToHeadState.rivalName}! ${tempCharacter.name} • ${maps[tempMapIndex].name}`;
      }
    }

    if (headToHeadState.rouletteTimer <= 0) {
      headToHeadState.randomCharacter = characters[Math.floor(Math.random() * characters.length)];
      headToHeadState.randomMapIndex = Math.floor(Math.random() * maps.length);
      startHeadToHeadMatch();
    }
  }
}

function updateHeadToHeadOpponent(dt) {
  if (!headToHeadState.active || !headToHeadState.opponentActor || headToHeadState.opponentFinished) return;

  if (headToHeadState.liveNetwork) {
    if (networkState.opponentSnapshot) {
      const snap = networkState.opponentSnapshot;
      headToHeadState.opponentActor = {
        ...headToHeadState.opponentActor,
        x: snap.x,
        y: snap.y,
        vx: snap.vx,
        vy: snap.vy,
        radius: snap.radius,
        drag: snap.drag,
        bounce: snap.bounce,
        gravityMult: snap.gravityMult,
        maxX: snap.maxX,
        state: snap.state,
      };
      headToHeadState.opponentCameraX = snap.cameraX || 0;
      headToHeadState.opponentFinished = snap.state === "ended";
      finalizeHeadToHeadIfReady();
    }
    return;
  }

  const opp = headToHeadState.opponentActor;
  opp.vy += world.gravity * opp.gravityMult * dt;
  opp.vx -= opp.vx * opp.drag * dt;

  headToHeadState.opponentJumpTimer -= dt;
  if (headToHeadState.opponentJumpTimer <= 0) {
    opp.vy -= 360 + Math.random() * 170;
    opp.vx += 70 + Math.random() * 90;
    headToHeadState.opponentJumpTimer = 1.5 + Math.random() * 2.6;
  }

  opp.x += opp.vx * dt;
  opp.y += opp.vy * dt;

  const nearbyOppFatals = getFatalObstaclesInRange(opp.x - 220, opp.x + 560);
  for (const rect of nearbyOppFatals) {
    const ry = terrainY(rect.x) - rect.yOffset;
    const nearestX = Math.max(rect.x, Math.min(opp.x, rect.x + rect.w));
    const nearestY = Math.max(ry, Math.min(opp.y, ry + rect.h));
    const dx = opp.x - nearestX;
    const dy = opp.y - nearestY;
    if (dx * dx + dy * dy <= opp.radius * opp.radius) {
      headToHeadState.opponentFinished = true;
      opp.state = "ended";
      opp.vx = 0;
      opp.vy = 0;
      finalizeHeadToHeadIfReady();
      return;
    }
  }

  const nearbyOppPads = getBouncePadsInRange(opp.x - 260, opp.x + 520);
  for (const pad of nearbyOppPads) {
    const py = terrainY(pad.x) - pad.yOffset;
    const onPad = opp.x + opp.radius > pad.x
      && opp.x - opp.radius < pad.x + pad.w
      && opp.y + opp.radius >= py
      && opp.y < py + pad.h;
    if (onPad && opp.vy > -220) {
      opp.y = py - opp.radius;
      opp.vy = -Math.max(620, Math.abs(opp.vy) * pad.boost);
      opp.vx *= 1.06;
    }
  }

  const ground = terrainY(opp.x);
  if (opp.y + opp.radius >= ground) {
    opp.y = ground - opp.radius;
    const impactVy = Math.abs(opp.vy);
    if (impactVy > 80) {
      opp.vy = -impactVy * Math.max(0.6, opp.bounce * 1.15);
      opp.vx *= 0.97;
    } else {
      opp.vy = 0;
      opp.vx *= 0.984;
    }
    if (Math.abs(opp.vx) < 52) {
      opp.vx = 52;
    }
  }

  opp.maxX = Math.max(opp.maxX, opp.x);
  headToHeadState.opponentCameraX = Math.max(0, opp.x - canvas.width * 0.25);

  if (Math.abs(opp.vx) < 60) headToHeadState.opponentStoppedTimer += dt;
  else headToHeadState.opponentStoppedTimer = 0;

  if (headToHeadState.opponentStoppedTimer > 2.5) {
    headToHeadState.opponentFinished = true;
    opp.state = "ended";
    opp.vx = 0;
    opp.vy = 0;
    finalizeHeadToHeadIfReady();
  }
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
      return "blink warp + auto phase";
    case "trumpjump":
      return "jump + Trump shot";
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
    case "owenjump":
      return "steady jump";
    case "travisjump":
      return "cradle hop";
    case "samswim":
      return "swim through Hugh / double-jump";
    case "basketshot":
      return "basketball shot + boost";
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
    const jumpPower = Math.max(390, 700 - actor.spencerBombsUsed * 50);
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
      abilityHint.textContent = `${beerText}  |  SPIN MODE ${actor.beerRageTimer.toFixed(1)}s | Jump every ${BRAYDEN_RAGE_JUMP_COOLDOWN.toFixed(1)}s`;
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
    const needleText = `Creatine: ${actor.jjNeedleCount}`;
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

  if (selectedCharacter.id === "nathan") {
    const mphApprox = (actor.nathanSpeed / 22.4).toFixed(0);
    const gasText = `Gas: ${actor.nathanGas}/${NATHAN_GAS_TARGET} gal`;
    const strikeText = actor.nathanAirstrikeReady
      ? `Flag up: airstrike in ${Math.max(0, actor.nathanFlagTimer).toFixed(1)}s`
      : `Airstrike at ${NATHAN_GAS_TARGET} gal`;
    const modeText = actor.nathanHasTruck ? `Tacoma speed: ~${mphApprox} mph` : "On foot (Tacoma lost)";
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `${gasText}  |  ${modeText}  |  Reload: ${actor.abilityCooldown.toFixed(1)}s  |  ${strikeText}`;
      return;
    }
    abilityHint.textContent = `${gasText}  |  ${modeText}  |  Space: jump + aimable Trump shot  |  ${strikeText}`;
    return;
  }

  if (selectedCharacter.id === "davy") {
    const mphApprox = (actor.davySpeed / 22.4).toFixed(0);
    const modeText = actor.davyHasRide ? `Ride speed: ~${mphApprox} mph` : "On foot (ride lost)";
    const jumpText = actor.davyJumpCooldown <= 0 ? "B: jump ready" : `B: jump ${actor.davyJumpCooldown.toFixed(1)}s`;
    if (getCurrentMap().id === "long-john-silvers") {
      const godText = actor.davyGodModeTimer > 0
        ? `GOD MODE: ${actor.davyGodModeTimer.toFixed(1)}s`
        : `God mode in ${Math.max(0, actor.davyGodModeCooldown).toFixed(1)}s`;
      abilityHint.textContent = `${modeText}  |  Auto shrimp barrage  |  ${jumpText}  |  ${godText}`;
      return;
    }
    abilityHint.textContent = `${modeText}  |  Auto shrimp shots  |  Space: shrimp burst  |  ${jumpText}`;
    return;
  }

  if (selectedCharacter.id === "nate") {
    const phaseText = actor.natePhaseCooldown <= 0
      ? "Phase ready"
      : `Phase in ${actor.natePhaseCooldown.toFixed(1)}s`;
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `${phaseText}  |  Warp in ${actor.abilityCooldown.toFixed(1)}s`;
      return;
    }
    abilityHint.textContent = `${phaseText}  |  Space: blink warp  |  Auto-phase through Hugh every ${NATE_PHASE_COOLDOWN}s`;
    return;
  }

  if (selectedCharacter.id === "traviswilliams") {
    const craddleText = `Cradles: ${actor.travisCraddleCount}/${TRAVIS_CRADDLES_FOR_LAUNCH}`;
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `${craddleText}  |  Jump in ${actor.abilityCooldown.toFixed(1)}s  |  10 cradles = +${TRAVIS_LAUNCH_FORWARD_METERS}m launch`;
      return;
    }
    abilityHint.textContent = `${craddleText}  |  Space: basic jump  |  10 cradles = fly up +${TRAVIS_LAUNCH_FORWARD_METERS}m`;
    return;
  }

  if (selectedCharacter.id === "matteo") {
    const craddleText = `Cradles: ${actor.matteoCraddleCount}/${TRAVIS_CRADDLES_FOR_LAUNCH}`;
    const slamReady = actor.abilityCooldown <= 0;
    const slamText = slamReady ? "Space: slam" : `Slam: ${actor.abilityCooldown.toFixed(1)}s`;
    const truckText = actor.truckCount > 0
      ? `Double-Space: truck (${actor.truckCount} left)`
      : "No trucks left";
    abilityHint.textContent = `${craddleText}  |  ${slamText}  |  ${truckText}  |  10 cradles = fly up +${TRAVIS_LAUNCH_FORWARD_METERS}m`;
    return;
  }

  if (selectedCharacter.id === "calebparker") {
    const jumpReady = actor.abilityCooldown <= 0;
    const cooldownText = jumpReady ? "Jump ready" : `Jump in ${actor.abilityCooldown.toFixed(1)}s`;
    if (actor.calebHasDino) {
      const mphApprox = (actor.calebSpeed / 22.4).toFixed(0);
      abilityHint.textContent = `T-Rex speed: ~${mphApprox} mph  |  Space: jump  |  ${cooldownText}`;
    } else {
      abilityHint.textContent = `On foot (T-Rex lost)  |  Space: jump  |  ${cooldownText}`;
    }
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

  if (selectedCharacter.id === "owen") {
    const milkText = `Milks: ${actor.owenMilks}`;
    const lifeText = `Extra lives: ${actor.owenLives}`;
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `${milkText}  |  ${lifeText}  |  Jump in ${actor.abilityCooldown.toFixed(1)}s`;
      return;
    }
    abilityHint.textContent = `${milkText}  |  ${lifeText}  |  Space: jump  |  +1 life every ${OWEN_MILKS_PER_LIFE} milks`;
    return;
  }

  if (selectedCharacter.id === "samhallet") {
    const dumbbellText = `Dumbbells: ${actor.samDumbbellCount}`;
    const benchText = samBenchPickup
      ? `Bench live: ${samBenchPickup.life.toFixed(1)}s`
      : `Bench every ${SAM_DUMBBELLS_PER_BENCH} dumbbells`;
    const chargeText = `Swim charges: ${actor.samSwimCharges}`;
    const powerText = `Passes/swim: ${actor.samSwimPerTurn}`;
    const jumpText = actor.samJumpCharges > 0
      ? `Jump ready`
      : `Jump in ${actor.samJumpRegenTimer.toFixed(1)}s`;

    if (actor.samSwimActive) {
      abilityHint.textContent = `${dumbbellText}  |  ${chargeText}  |  ${jumpText}  |  SWIM ${actor.samSwimTimer.toFixed(1)}s (${actor.samSwimPassesLeft} passes left)`;
      return;
    }
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `${dumbbellText}  |  ${benchText}  |  ${chargeText}  |  ${powerText}  |  ${jumpText}  |  Ability in ${actor.abilityCooldown.toFixed(1)}s`;
      return;
    }
    abilityHint.textContent = `${dumbbellText}  |  ${benchText}  |  ${chargeText}  |  ${powerText}  |  ${jumpText}  |  Space: swim through Hugh, Double-Space: jump`;
    return;
  }

  if (selectedCharacter.id === "evan") {
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `Basketball reload: ${actor.abilityCooldown.toFixed(1)}s  |  Space: shoot ball + jump boost`;
      return;
    }
    abilityHint.textContent = "Space: shoot basketball forward + Manning-style jump boost";
    return;
  }

  if (selectedCharacter.id === "cael") {
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `Basketball reload: ${actor.abilityCooldown.toFixed(1)}s  |  Space: shoot ball + higher jump boost`;
      return;
    }
    abilityHint.textContent = "Space: shoot basketball forward + extra-high jump boost";
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
    const mapId = typeof entry.mapId === "string" ? entry.mapId : "";
    const mapName = typeof entry.mapName === "string" ? entry.mapName : "";
    const date = entry.date || new Date().toLocaleDateString();
    return {
      name,
      distance: Number(distance.toFixed(1)),
      date,
      characterId,
      characterName,
      mapId,
      mapName,
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
      mapId: typeof s.mapId === "string" ? s.mapId : "",
      mapName: typeof s.mapName === "string" ? s.mapName : "",
    }));
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(normalized));
  window.sharedLeaderboardCache = normalized;
}

function getAuthToken() {
  return authSession?.access_token || SUPABASE_ANON_KEY;
}

function hasCloudAuthSession() {
  return !!authSession?.access_token;
}

function getLocalSessionPasswordHash() {
  return (authSession?.user?.user_metadata?.account_password_hash || "").toString();
}

async function callSupabaseRpc(rpcName, payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${rpcName}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${getAuthToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload || {}),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

async function createCloudGameAccount(accountName, passwordHash) {
  try {
    const { ok, data } = await callSupabaseRpc(GAME_ACCOUNT_CREATE_RPC, {
      p_account_name: accountName,
      p_password_hash: passwordHash,
    });
    if (!ok) return { ok: false, exists: false };
    return {
      ok: !!(data?.ok ?? data?.created ?? false),
      exists: !!data?.exists,
    };
  } catch {
    return { ok: false, exists: false };
  }
}

async function verifyCloudGameAccount(accountName, passwordHash) {
  try {
    const { ok, data } = await callSupabaseRpc(GAME_ACCOUNT_VERIFY_RPC, {
      p_account_name: accountName,
      p_password_hash: passwordHash,
    });
    if (!ok) return false;
    return !!(data?.ok ?? data?.valid ?? false);
  } catch {
    return false;
  }
}

async function pushRankedProfileViaGameAccountRpc(profile) {
  const accountName = getSessionAccountName();
  const passwordHash = getLocalSessionPasswordHash();
  if (!accountName || !passwordHash || !profile) return false;
  try {
    const { ok, data } = await callSupabaseRpc(GAME_RANKED_UPSERT_RPC, {
      p_account_name: normalizeAccountName(accountName),
      p_password_hash: passwordHash,
      p_display_name: (profile.displayName || accountName).toString().slice(0, 16),
      p_rating: Math.round(Number(profile.rating) || 1000),
      p_peak_rating: Math.round(Number(profile.peakRating) || Number(profile.rating) || 1000),
      p_wins: Number(profile.wins) || 0,
      p_losses: Number(profile.losses) || 0,
      p_draws: Number(profile.draws) || 0,
      p_matches: Number(profile.matches) || 0,
      p_best_win_margin: Number(profile.bestWinMargin) || 0,
    });
    return !!(ok && (data?.ok ?? true));
  } catch {
    return false;
  }
}

function updateAccountUI() {
  if (!accountStatus) return;
  const accountName = getSessionAccountName();
  if (authSession?.user?.id && accountName) {
    const modeText = hasCloudAuthSession() ? "cloud auth" : "local account mode";
    accountStatus.textContent = `Account: ${accountName} (signed in, required to play • ${modeText})`;
    syncSignedInIdentityUI();
  } else {
    accountStatus.textContent = "Account: Guest (create or sign in to play)";
    clearSignedInIdentityUI();
  }
  renderProfilePicturePreview();
  refreshAdminCharacterPanel();
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
  if (session?.user?.id && hasCloudAuthSession()) {
    fetchCloudHeadToHeadRankings(true).then(() => renderRankedLeaderboard());
  }
}

function loadLocalAccounts() {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveLocalAccounts(accounts) {
  localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts || {}));
}

async function hashAccountPassword(password) {
  const input = `${password}::faith-flight`;
  if (window.crypto?.subtle && window.TextEncoder) {
    const bytes = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return btoa(input);
}

function buildLocalSession(accountName, passwordHash = "", cloudLinked = false) {
  const normalized = normalizeAccountName(accountName);
  return {
    provider: "local",
    token_type: "local",
    access_token: null,
    expires_in: null,
    user: {
      id: `local-${normalized}`,
      email: `${normalized}@local.account`,
      user_metadata: {
        account_name: normalized,
        account_password_hash: passwordHash,
        account_cloud_linked: !!cloudLinked,
      },
      app_metadata: { provider: "local" },
      created_at: new Date().toISOString(),
    },
  };
}

async function signUpLocalAccount(accountName, password) {
  const normalized = validateAccountName(accountName);
  if ((password || "").length < 4) {
    throw new Error("Password must be at least 4 characters.");
  }
  const accounts = loadLocalAccounts();
  if (accounts[normalized]) {
    throw new Error("That account name already exists. Use Sign In instead.");
  }
  const passwordHash = await hashAccountPassword(password);
  const cloudCreate = await createCloudGameAccount(normalized, passwordHash);
  if (cloudCreate.exists) {
    throw new Error("That account name already exists. Use Sign In instead.");
  }

  accounts[normalized] = {
    passwordHash,
    createdAt: Date.now(),
  };
  saveLocalAccounts(accounts);
  const session = buildLocalSession(normalized, passwordHash, cloudCreate.ok);
  saveAuthSession(session);
  return session;
}

async function ensureAdminAccountExists() {
  try {
    const accounts = loadLocalAccounts();
    const key = normalizeAccountName(ADMIN_ACCOUNT_NAME);
    if (accounts[key]) return;
    accounts[key] = {
      passwordHash: await hashAccountPassword(ADMIN_ACCOUNT_PASSWORD),
      createdAt: Date.now(),
    };
    saveLocalAccounts(accounts);
  } catch (e) {
    console.warn("Failed to seed admin account:", e);
  }
}

function clearMakerFields() {
  [
    makerNameInput,
    makerIdInput,
    makerInitialsInput,
    makerImageBaseInput,
    makerTraitInput,
    makerBioInput,
    makerMassInput,
    makerRadiusInput,
    makerDragInput,
    makerBounceInput,
    makerGravityMultInput,
    makerLaunchBoostInput,
    makerUnlockAtInput,
    makerRemoveIdInput,
  ].forEach((el) => {
    if (el) el.value = "";
  });
  if (makerAbilityInput) makerAbilityInput.value = "rocket";
  makerCharacterImageData = "";
  makerItemImageData = "";
  if (makerCharacterPreview) {
    makerCharacterPreview.removeAttribute("src");
    makerCharacterPreview.style.display = "none";
  }
  if (makerItemPreview) {
    makerItemPreview.removeAttribute("src");
    makerItemPreview.style.display = "none";
  }
  if (makerCharacterPngInput) makerCharacterPngInput.value = "";
  if (makerItemPngInput) makerItemPngInput.value = "";
}

function applyAiBuildToMaker() {
  if (!isAdminSignedIn()) {
    alert("Admin account required to use Character Maker.");
    return;
  }
  const prompt = (makerAiDescriptionInput?.value || "").trim();
  if (!prompt) {
    alert("Add a character description first.");
    return;
  }
  const draft = buildAiDraftFromDescription(prompt);
  if (makerTraitInput && !makerTraitInput.value.trim()) makerTraitInput.value = draft.trait;
  if (makerBioInput) makerBioInput.value = draft.bio;
  if (makerAbilityInput) makerAbilityInput.value = draft.ability;
  if (makerMassInput) makerMassInput.value = draft.mass;
  if (makerRadiusInput) makerRadiusInput.value = draft.radius;
  if (makerDragInput) makerDragInput.value = draft.drag;
  if (makerBounceInput) makerBounceInput.value = draft.bounce;
  if (makerGravityMultInput) makerGravityMultInput.value = draft.gravityMult;
  if (makerLaunchBoostInput) makerLaunchBoostInput.value = draft.launchBoost;

  if (makerNameInput && !makerNameInput.value.trim()) {
    const firstWords = prompt
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
    makerNameInput.value = firstWords || "AI Hero";
  }

  if (makerIdInput && !makerIdInput.value.trim()) {
    makerIdInput.value = normalizeCharacterId(makerNameInput?.value || "ai-hero");
  }

  if (makerInitialsInput && !makerInitialsInput.value.trim()) {
    const name = (makerNameInput?.value || "AI").trim();
    const initials = name
      .split(/\s+/)
      .map((w) => w.charAt(0))
      .join("")
      .slice(0, 3)
      .toUpperCase();
    makerInitialsInput.value = initials || "AI";
  }
}

function updateMakerImagePreview(imgEl, dataUrl) {
  if (!imgEl) return;
  if (dataUrl) {
    imgEl.src = dataUrl;
    imgEl.style.display = "block";
  } else {
    imgEl.removeAttribute("src");
    imgEl.style.display = "none";
  }
}

async function handleMakerImageUpload(inputEl, type) {
  const file = inputEl?.files?.[0];
  if (!file) return;
  try {
    const dataUrl = sanitizePngDataUrl(await pngFileToDataUrl(file, 320));
    if (!dataUrl) {
      alert("PNG is too large after processing. Try a smaller image.");
      return;
    }
    if (type === "character") {
      makerCharacterImageData = dataUrl;
      updateMakerImagePreview(makerCharacterPreview, makerCharacterImageData);
    } else {
      makerItemImageData = dataUrl;
      updateMakerImagePreview(makerItemPreview, makerItemImageData);
    }
  } catch (e) {
    alert(e?.message || "PNG upload failed.");
  }
}

function bindProfilePngDropZone() {
  if (!profilePicDrop || !profilePicInput) return;

  const openPicker = () => {
    if (!getSessionAccountName()) {
      alert("Sign in first, then add a profile picture.");
      return;
    }
    profilePicInput.click();
  };

  profilePicDrop.addEventListener("click", openPicker);
  profilePicDrop.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      openPicker();
    }
  });

  profilePicDrop.addEventListener("dragover", (ev) => {
    ev.preventDefault();
    profilePicDrop.classList.add("drag-over");
  });
  profilePicDrop.addEventListener("dragleave", () => {
    profilePicDrop.classList.remove("drag-over");
  });
  profilePicDrop.addEventListener("drop", async (ev) => {
    ev.preventDefault();
    profilePicDrop.classList.remove("drag-over");
    if (!getSessionAccountName()) {
      alert("Sign in first, then add a profile picture.");
      return;
    }
    const file = ev.dataTransfer?.files?.[0];
    if (!file) return;
    try {
      const dataUrl = sanitizePngDataUrl(await pngFileToDataUrl(file, 256));
      if (!dataUrl) {
        alert("PNG is too large after processing. Try a smaller image.");
        return;
      }
      setSignedInProfilePicture(dataUrl);
      renderProfilePicturePreview();
    } catch (e) {
      alert(e?.message || "Profile picture upload failed.");
    }
  });

  profilePicInput.addEventListener("change", async () => {
    const file = profilePicInput.files?.[0];
    if (!file) return;
    try {
      const dataUrl = sanitizePngDataUrl(await pngFileToDataUrl(file, 256));
      if (!dataUrl) {
        alert("PNG is too large after processing. Try a smaller image.");
        return;
      }
      if (!setSignedInProfilePicture(dataUrl)) {
        alert("Sign in first, then add a profile picture.");
        return;
      }
      renderProfilePicturePreview();
    } catch (e) {
      alert(e?.message || "Profile picture upload failed.");
    } finally {
      profilePicInput.value = "";
    }
  });
}

function addCustomCharacterFromMaker() {
  if (!isAdminSignedIn()) {
    alert("Admin account required to use Character Maker.");
    return;
  }
  const candidate = sanitizeCustomCharacter({
    name: makerNameInput?.value,
    id: makerIdInput?.value,
    initials: makerInitialsInput?.value,
    imageBase: makerImageBaseInput?.value,
    imageData: makerCharacterImageData,
    itemImageData: makerItemImageData,
    trait: makerTraitInput?.value,
    bio: makerBioInput?.value,
    ability: makerAbilityInput?.value,
    mass: makerMassInput?.value,
    radius: makerRadiusInput?.value,
    drag: makerDragInput?.value,
    bounce: makerBounceInput?.value,
    gravityMult: makerGravityMultInput?.value,
    launchBoost: makerLaunchBoostInput?.value,
    unlockAt: makerUnlockAtInput?.value,
  });

  if (!candidate.id || !candidate.name) {
    alert("Name is required.");
    return;
  }
  if (characters.some((c) => c.id === candidate.id)) {
    alert("Character ID already exists. Use a different ID.");
    return;
  }

  characters.push(candidate);
  const saved = loadCustomCharacters();
  saved.push(candidate);
  const savedOk = saveCustomCharacters(saved);

  const img = new Image();
  const [pngPath, jpgPath] = getCharacterImageCandidates(candidate);
  img.onerror = () => {
    if (jpgPath && !img.src.endsWith(".jpg")) {
      img.src = jpgPath;
      return;
    }
  };
  img.src = pngPath;
  candidate._img = img;

  clearMakerFields();
  renderCharacterCards();
  if (!savedOk) {
    alert(`Added character: ${candidate.name} (session only; local storage is full).`);
  } else {
    alert(`Added character: ${candidate.name}`);
  }
}

function removeCustomCharacterById() {
  if (!isAdminSignedIn()) {
    alert("Admin account required to use Character Maker.");
    return;
  }
  const rawId = makerRemoveIdInput?.value || makerIdInput?.value || "";
  const id = normalizeCharacterId(rawId);
  if (!id) {
    alert("Enter a character ID to remove.");
    return;
  }
  const idx = characters.findIndex((c) => c.id === id && c.custom);
  if (idx === -1) {
    alert("Custom character not found.");
    return;
  }
  if (selectedCharacter?.id === id) {
    selectedCharacter = characters[0];
    applyCharacterStats(selectedCharacter);
  }
  characters.splice(idx, 1);
  const saved = loadCustomCharacters().filter((c) => sanitizeCustomCharacter(c).id !== id);
  const savedOk = saveCustomCharacters(saved);
  renderCharacterCards();
  if (!savedOk) {
    alert(`Removed character: ${id} (session only; local storage update failed).`);
  } else {
    alert(`Removed character: ${id}`);
  }
}

async function signInLocalAccount(accountName, password) {
  const normalized = validateAccountName(accountName);
  const passwordHash = await hashAccountPassword(password);
  const accounts = loadLocalAccounts();
  const entry = accounts[normalized];

  if (!entry) {
    const cloudValid = await verifyCloudGameAccount(normalized, passwordHash);
    if (!cloudValid) {
      throw new Error("Invalid login credentials.");
    }
    accounts[normalized] = {
      passwordHash,
      createdAt: Date.now(),
    };
    saveLocalAccounts(accounts);
    const cloudSession = buildLocalSession(normalized, passwordHash, true);
    saveAuthSession(cloudSession);
    return cloudSession;
  }

  if (entry.passwordHash !== passwordHash) {
    throw new Error("Invalid login credentials.");
  }
  const cloudValid = await verifyCloudGameAccount(normalized, passwordHash);
  const session = buildLocalSession(normalized, passwordHash, cloudValid);
  saveAuthSession(session);
  return session;
}

function isEmailAuthDisabledMessage(message) {
  const lower = (message || "").toString().toLowerCase();
  return lower.includes("email signups are disabled")
    || lower.includes("email logins are disabled")
    || lower.includes("email provider is disabled");
}

async function signUpAccount(email, password) {
  const accountName = validateAccountName(email);
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: buildAccountEmail(accountName), password, data: { account_name: accountName } }),
  });
  const data = await res.json();
  if (!res.ok) {
    const message = data?.msg || data?.error_description || "Sign up failed";
    if (isEmailAuthDisabledMessage(message)) {
      return signUpLocalAccount(accountName, password);
    }
    const err = new Error(message);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  if (data?.user && !data.user.user_metadata?.account_name) {
    data.user.user_metadata = { ...(data.user.user_metadata || {}), account_name: accountName };
  }
  if (data?.access_token) {
    saveAuthSession(data);
    return data;
  }
  throw new Error("Account created, but no session was returned. Disable email confirmation in Supabase Auth settings, then sign in again.");
}

async function signInAccount(email, password) {
  const accountName = validateAccountName(email);
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: buildAccountEmail(accountName), password }),
  });
  const data = await res.json();
  if (!res.ok) {
    const message = data?.msg || data?.error_description || "Sign in failed";
    if (isEmailAuthDisabledMessage(message)) {
      return signInLocalAccount(accountName, password);
    }
    const err = new Error(message);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  if (data?.user && !data.user.user_metadata?.account_name) {
    data.user.user_metadata = { ...(data.user.user_metadata || {}), account_name: accountName };
  }
  saveAuthSession(data);
  return data;
}

function signOutAccount() {
  saveAuthSession(null);
  networkState.displayName = "";
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
    mapId: maps[currentMapIndex]?.id || "",
    mapName: maps[currentMapIndex]?.name || "",
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
      mapId: typeof s.map_id === "string" ? s.map_id : "",
      mapName: typeof s.map_name === "string" ? s.map_name : "",
    }));

  try {
    const extendedUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_LEADERBOARD_TABLE}?select=Name,distance,created_at,character_id,character_name,map_id,map_name&order=distance.desc&limit=${CLOUD_LEADERBOARD_FETCH_LIMIT}`;
    const basicUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_LEADERBOARD_TABLE}?select=Name,distance,created_at,character_id,character_name&order=distance.desc&limit=${CLOUD_LEADERBOARD_FETCH_LIMIT}`;
    const minimalUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_LEADERBOARD_TABLE}?select=Name,distance,created_at&order=distance.desc&limit=${CLOUD_LEADERBOARD_FETCH_LIMIT}`;

    console.log("Fetching from Supabase:", extendedUrl);
    let res = await fetch(extendedUrl, {
      cache: "no-store",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!res.ok) {
      console.warn("Extended leaderboard fetch failed, trying character-only columns");
      res = await fetch(basicUrl, {
        cache: "no-store",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
    }
    if (!res.ok) {
      console.warn("Character-only fetch failed, trying minimal columns");
      res = await fetch(minimalUrl, {
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
    // Merge with local data to preserve characterId/mapId metadata that cloud may lack
    let existingLocal = [];
    try {
      existingLocal = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
    } catch { existingLocal = []; }
    const enriched = normalized.map(cs => {
      if (!cs.characterId || !cs.mapId) {
        const match = existingLocal.find(ls =>
          ls.name === cs.name && Math.abs(Number(ls.distance) - cs.distance) < 0.15
        );
        if (match) {
          return {
            ...cs,
            characterId: cs.characterId || (typeof match.characterId === "string" ? match.characterId : ""),
            characterName: cs.characterName || (typeof match.characterName === "string" ? match.characterName : ""),
            mapId: cs.mapId || (typeof match.mapId === "string" ? match.mapId : ""),
            mapName: cs.mapName || (typeof match.mapName === "string" ? match.mapName : ""),
          };
        }
      }
      return cs;
    });
    saveLeaderboard(enriched);
    return true;
  } catch (e) {
    console.error("fetchCloudLeaderboard error:", e);
    return false;
  }
}

async function pushCloudLeaderboardEntry(playerName, travelledMeters) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${SUPABASE_LEADERBOARD_TABLE}`;
    const fullBody = JSON.stringify({
      Name: playerName.slice(0, 20),
      distance: Number(travelledMeters.toFixed(1)),
      character_id: selectedCharacter?.id || "",
      character_name: selectedCharacter?.name || "",
      map_id: maps[currentMapIndex]?.id || "",
      map_name: maps[currentMapIndex]?.name || "",
    });
    const charBody = JSON.stringify({
      Name: playerName.slice(0, 20),
      distance: Number(travelledMeters.toFixed(1)),
      character_id: selectedCharacter?.id || "",
      character_name: selectedCharacter?.name || "",
    });
    const basicBody = JSON.stringify({
      Name: playerName.slice(0, 20),
      distance: Number(travelledMeters.toFixed(1)),
    });
    console.log("Pushing to Supabase:", url, fullBody);
    let insertRes = await fetch(url, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: fullBody,
    });
    if (!insertRes.ok) {
      console.warn("Full leaderboard insert failed, trying character-only payload");
      insertRes = await fetch(url, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: charBody,
      });
    }
    if (!insertRes.ok) {
      console.warn("Character insert failed, trying basic payload");
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
  if (leaderboardViewMode === "map" && leaderboardRunMapId) {
    return allScores
      .filter((s) => s.mapId === leaderboardRunMapId)
      .slice(0, MAX_LEADERBOARD_ENTRIES);
  }
  return allScores.slice(0, MAX_LEADERBOARD_ENTRIES);
}

function updateLeaderboardModeUI() {
  const charLabel = leaderboardRunCharacterName || selectedCharacter?.name || "Character";
  const mapLabel = leaderboardRunMapName || maps[currentMapIndex]?.name || "Map";
  if (leaderboardTitle) {
    if (leaderboardViewMode === "character") {
      leaderboardTitle.textContent = `${charLabel} Leaderboard`;
    } else if (leaderboardViewMode === "map") {
      leaderboardTitle.textContent = `${mapLabel} Leaderboard`;
    } else {
      leaderboardTitle.textContent = "All-Time Leaderboard";
    }
  }
  [leaderboardCharBtn, leaderboardMapBtn, leaderboardAllBtn].forEach(btn => {
    if (btn) btn.classList.remove("lb-tab-active");
  });
  if (leaderboardViewMode === "character" && leaderboardCharBtn) leaderboardCharBtn.classList.add("lb-tab-active");
  if (leaderboardViewMode === "map" && leaderboardMapBtn) leaderboardMapBtn.classList.add("lb-tab-active");
  if (leaderboardViewMode === "all" && leaderboardAllBtn) leaderboardAllBtn.classList.add("lb-tab-active");
}

function getRankedLeaderboardEntries(limit = 10) {
  const data = loadHeadToHeadRankings();
  return Object.values(data)
    .filter((p) => p && Number.isFinite(Number(p.rating)))
    .sort((a, b) => {
      if (Number(b.rating) !== Number(a.rating)) return Number(b.rating) - Number(a.rating);
      if (Number(b.wins) !== Number(a.wins)) return Number(b.wins) - Number(a.wins);
      return Number(b.matches || 0) - Number(a.matches || 0);
    })
    .slice(0, limit);
}

function getRankedDisplayName(entry) {
  if (!entry || typeof entry !== "object") return "Player";
  const explicit = (entry.displayName || "").toString().trim();
  if (explicit) return explicit.slice(0, 16);

  const raw = (entry.name || "Player").toString();
  if (raw.startsWith("uid:")) {
    const id = raw.slice(4);
    return `Account-${id.slice(0, 4)}${id.length > 8 ? `…${id.slice(-4)}` : ""}`;
  }
  return raw.slice(0, 16);
}

function renderRankedLeaderboard() {
  if (!rankedLeaderboardList) return;
  fetchCloudHeadToHeadRankings(false).then((synced) => {
    if (synced) renderRankedLeaderboard();
  });
  const entries = getRankedLeaderboardEntries(10);
  rankedLeaderboardList.innerHTML = "";

  if (!entries.length) {
    rankedLeaderboardList.innerHTML = "<p style=\"margin:10px;\">No ranked matches yet.</p>";
    return;
  }

  entries.forEach((entry, idx) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.padding = "8px 10px";
    row.style.borderBottom = "1px solid #e8edff";
    row.style.fontSize = "0.9rem";

    const left = document.createElement("div");
    const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "";
    const tier = getRankTierFromRating(Number(entry.rating) || 0);
    left.textContent = `${medal} ${idx + 1}. ${getRankedDisplayName(entry)} (${tier})`;

    const right = document.createElement("div");
    right.style.fontWeight = "700";
    right.style.color = "#3f5dff";
    right.textContent = `${Math.round(Number(entry.rating) || 0)} • W${entry.wins || 0}-L${entry.losses || 0}-D${entry.draws || 0}`;

    row.appendChild(left);
    row.appendChild(right);
    rankedLeaderboardList.appendChild(row);
  });
}

function displayLeaderboard() {
  const scores = getLeaderboardScoresForView();
  updateLeaderboardModeUI();
  renderRankedLeaderboard();
  leaderboardList.innerHTML = "";
  if (scores.length === 0) {
    leaderboardList.innerHTML = leaderboardViewMode === "character"
      ? "<p>No scores yet for this character.</p>"
      : leaderboardViewMode === "map"
      ? "<p>No scores yet for this map.</p>"
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
    const nameCol = document.createElement("div");
    nameCol.style.display = "flex";
    nameCol.style.flexDirection = "column";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${medal} ${idx + 1}. ${score.name}`;
    nameCol.appendChild(nameSpan);
    if ((leaderboardViewMode === "all" || leaderboardViewMode === "map") && score.characterName) {
      const subLabel = document.createElement("span");
      subLabel.textContent = score.characterName;
      subLabel.style.fontSize = "0.75rem";
      subLabel.style.color = "#888";
      subLabel.style.fontWeight = "400";
      nameCol.appendChild(subLabel);
    }
    
    const distSpan = document.createElement("span");
    distSpan.textContent = `${score.distance}m`;
    distSpan.style.color = idx < 3 ? "#5f7bff" : "#666";
    distSpan.style.fontWeight = "700";
    distSpan.style.flexShrink = "0";
    
    entry.appendChild(nameCol);
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
  const winnerLine = headToHeadState.resultText ? `${headToHeadState.resultText} • ` : "";
  finalScore.textContent = `${winnerLine}Your Score: ${travelled}m`;
  leaderboardRunCharacterId = selectedCharacter?.id || "";
  leaderboardRunCharacterName = selectedCharacter?.name || "";
  leaderboardRunMapId = maps[currentMapIndex]?.id || "";
  leaderboardRunMapName = maps[currentMapIndex]?.name || "";
  leaderboardViewMode = "character";
  playerNameInput.value = "";
  playerNameInput.focus();
  
  // Check if top 3 and trigger confetti
  const scores = getLeaderboardScoresForView();
  const tempScore = parseFloat(travelled);
  const isTop3 = scores.slice(0, 3).some(s => Math.abs(s.distance - tempScore) < 0.1) || scores.length < 3;
  if ((isTop3 && scores.length > 0) || headToHeadState.localWonLastMatch) {
    triggerConfetti();
  }

  headToHeadState.resultText = "";
  headToHeadState.localWonLastMatch = false;
  
  fetchCloudHeadToHeadRankings(true).then(() => renderRankedLeaderboard());
  fetchCloudLeaderboard().then(() => displayLeaderboard());
}

function getCharacterImageCandidates(character) {
  if (character?.imageData) {
    return [character.imageData, ""];
  }
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
  if (character.id === "anthony") {
    return ["characters/Sal.png", "Sal.png"];
  }
  if (character.id === "nathan") {
    return ["characters/Nathan.png", "Nathan.png"];
  }
  if (character.id === "traviswilliams") {
    return ["characters/Travis Williams.png", "Travis Williams.png"];
  }
  if (character.id === "matteo") {
    return ["characters/Matteo Schirripa v2.png", "characters/Matteo Schirripa.png"];
  }
  if (character.id === "kaderess") {
    return ["characters/Kade Ress.png", "Kade Ress.png"];
  }
  if (character.id === "calebparker") {
    return ["characters/Caleb Parker.png", "Caleb Parker.png"];
  }
  if (character.id === "davy") {
    return ["Davy.png", "characters/Davy.png"];
  }
  if (character.id === "lincolnjames") {
    return ["characters/Lincoln James.png", "Lincoln James.png"];
  }
  if (character.id === "lukepueppke") {
    return ["characters/Luke Pueppke.png", "Luke Pueppke.png"];
  }
  if (character.id === "owen") {
    return ["characters/Owen .png", "Owen .png"];
  }
  if (character.id === "samhallet") {
    return ["characters/Sam Hallet.png", "Sam Hallet.png"];
  }
  if (character.id === "evan") {
    return ["characters/Evan.png", "Evan.png"];
  }
  if (character.id === "cael") {
    return ["characters/Cael.png", "Cael.png"];
  }
  return [`${character.imageBase}.png`, `${character.imageBase}.jpg`];
}

function drawBackground() {
  const currentMap = getCurrentMap();

  if (currentMap.id === "long-john-silvers") {
    const bg = longJohnSilversMapImg;
    if (bg && bg.complete && bg.naturalWidth > 8) {
      const drawH = canvas.height + 90;
      const drawW = drawH * (bg.naturalWidth / bg.naturalHeight);
      const scroll = cameraX * 0.18;
      const offset = ((scroll % drawW) + drawW) % drawW;

      for (let x = -offset - drawW; x < canvas.width + drawW; x += drawW) {
        ctx.drawImage(bg, x, -45, drawW, drawH);
      }
    } else {
      ctx.fillStyle = "#0f1115";
      ctx.fillRect(-40, -40, canvas.width + 80, canvas.height + 80);
    }
    return;
  }

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
  const mapId = getCurrentMap().id;
  if (mapId === "town-square" || mapId === "long-john-silvers") {
    return;
  }

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
  const mapId = getCurrentMap().id;
  const isLjs = mapId === "long-john-silvers";

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px Trebuchet MS";
  const mapTitle = mapId === "town-square"
    ? "Town Square"
    : mapId === "long-john-silvers"
      ? "Long John Silvers"
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

  const visibleFatals = getFatalObstaclesInRange(cameraX - 120, cameraX + canvas.width + 120);
  visibleFatals.forEach((fatalRect) => {
    const janetY = terrainY(fatalRect.x) - fatalRect.yOffset;
    const janetSX = fatalRect.x - cameraX;
    if (janetSX <= -fatalRect.w - 60 || janetSX >= canvas.width + 60) return;

    const obstacleImg = getCurrentMap().id === "long-john-silvers" ? ljsObstacleImg : fatalObstacleImg;
    if (obstacleImg && obstacleImg.complete && obstacleImg.naturalWidth > 10) {
      ctx.save();
      if (!isLjs) {
        ctx.fillStyle = "#ffffffd9";
        ctx.fillRect(janetSX - 6, janetY - 6, fatalRect.w + 12, fatalRect.h + 12);
      }
      ctx.drawImage(obstacleImg, janetSX, janetY, fatalRect.w, fatalRect.h);
      ctx.restore();
    } else if (!isLjs) {
      ctx.fillStyle = fatalRect.color;
      ctx.fillRect(janetSX, janetY, fatalRect.w, fatalRect.h);
      ctx.fillStyle = "#8f4f64";
      ctx.beginPath();
      ctx.arc(janetSX + fatalRect.w / 2, janetY + 40, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 38px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.fillText("!", janetSX + fatalRect.w / 2, janetY + 54);
      ctx.textAlign = "start";
    }
    if (!isLjs) {
      ctx.fillStyle = "#8f3f5b";
      ctx.font = "bold 13px Trebuchet MS";
      ctx.fillText(fatalRect.label, janetSX + 4, janetY - 8);
    } else if (isLjs) {
      ctx.fillStyle = "#fff5d6";
      ctx.font = "bold 13px Trebuchet MS";
      ctx.fillText(fatalRect.label, janetSX + 2, janetY - 8);
    }
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
  const visibleOwenMilk = selectedCharacter.id === "owen"
    ? getOwenMilkInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visibleSamDumbbells = selectedCharacter.id === "samhallet"
    ? getSamDumbbellsInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visibleNathanGas = selectedCharacter.id === "nathan"
    ? getNathanGasInRange(cameraX - 120, cameraX + canvas.width + 120)
    : [];
  const visibleTravisCraddles = (selectedCharacter.id === "traviswilliams" || selectedCharacter.id === "matteo")
    ? getTravisCraddlesInRange(cameraX - 120, cameraX + canvas.width + 120)
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
      ctx.rotate(Math.sin((performance.now() * 0.003) + needle.index) * 0.08);
      ctx.drawImage(jjNeedleImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.roundRect(sx - needle.r * 0.95, ny - needle.r * 1.1, needle.r * 1.9, needle.r * 2.2, needle.r * 0.28);
      ctx.fill();
      ctx.fillStyle = "#58c46b";
      ctx.fillRect(sx - needle.r * 0.95, ny + needle.r * 0.15, needle.r * 1.9, needle.r * 0.95);
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.round(needle.r * 0.72)}px Trebuchet MS`;
      ctx.textAlign = "center";
      ctx.fillText("C", sx, ny + needle.r * 0.88);
      ctx.textAlign = "start";
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

  // Owen milk glasses
  visibleOwenMilk.forEach((milk) => {
    const my = terrainY(milk.x) - milk.yOffset;
    const sx = milk.x - cameraX;
    if (sx < -80 || sx > canvas.width + 80) return;
    const size = milk.r * 2.8;
    if (owenMilkImg && owenMilkImg.complete && owenMilkImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, my);
      ctx.rotate(Math.sin((performance.now() * 0.003) + milk.index) * 0.1);
      ctx.drawImage(owenMilkImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#e6edf7";
      ctx.beginPath();
      ctx.roundRect(sx - milk.r * 0.55, my - milk.r, milk.r * 1.1, milk.r * 2, milk.r * 0.25);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.round(milk.r * 0.8)}px Trebuchet MS`;
      ctx.textAlign = "center";
      ctx.fillText("🥛", sx, my + milk.r * 0.35);
      ctx.textAlign = "start";
    }
  });

  // Sam dumbbells
  visibleSamDumbbells.forEach((dumbbell) => {
    const dyPos = terrainY(dumbbell.x) - dumbbell.yOffset;
    const sx = dumbbell.x - cameraX;
    if (sx < -80 || sx > canvas.width + 80) return;
    const size = dumbbell.r * 2.8;
    if (samDumbbellImg && samDumbbellImg.complete && samDumbbellImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, dyPos);
      ctx.rotate(Math.sin((performance.now() * 0.003) + dumbbell.index) * 0.11);
      ctx.drawImage(samDumbbellImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#2d2d2d";
      ctx.fillRect(sx - dumbbell.r * 0.7, dyPos - 3, dumbbell.r * 1.4, 6);
      ctx.beginPath();
      ctx.arc(sx - dumbbell.r * 0.9, dyPos, dumbbell.r * 0.4, 0, Math.PI * 2);
      ctx.arc(sx + dumbbell.r * 0.9, dyPos, dumbbell.r * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  visibleNathanGas.forEach((gas) => {
    const gy = terrainY(gas.x) - gas.yOffset;
    const sx = gas.x - cameraX;
    if (sx < -80 || sx > canvas.width + 80) return;
    const size = gas.r * 2.9;
    if (nathanGasImg && nathanGasImg.complete && nathanGasImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, gy);
      ctx.rotate(Math.sin((performance.now() * 0.003) + gas.index) * 0.12);
      ctx.drawImage(nathanGasImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#7fa3b7";
      ctx.beginPath();
      ctx.roundRect(sx - gas.r * 0.65, gy - gas.r, gas.r * 1.3, gas.r * 2, gas.r * 0.2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.round(gas.r * 0.72)}px Trebuchet MS`;
      ctx.textAlign = "center";
      ctx.fillText("G", sx, gy + gas.r * 0.28);
      ctx.textAlign = "start";
    }
  });

  visibleTravisCraddles.forEach((craddle) => {
    const cy = terrainY(craddle.x) - craddle.yOffset;
    const sx = craddle.x - cameraX;
    if (sx < -100 || sx > canvas.width + 100) return;
    const size = craddle.r * 3.2;
    if (travisCraddleImg && travisCraddleImg.complete && travisCraddleImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, cy);
      ctx.rotate(Math.sin((performance.now() * 0.0024) + craddle.index) * 0.08);
      ctx.drawImage(travisCraddleImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#9a6b3d";
      ctx.beginPath();
      ctx.roundRect(sx - craddle.r * 1.2, cy - craddle.r * 0.95, craddle.r * 2.4, craddle.r * 1.9, craddle.r * 0.32);
      ctx.fill();
      ctx.strokeStyle = "#d8b384";
      ctx.lineWidth = 2;
      ctx.strokeRect(sx - craddle.r * 1.05, cy - craddle.r * 0.8, craddle.r * 2.1, craddle.r * 1.6);
    }
  });

  if (selectedCharacter.id === "samhallet" && samBenchPickup) {
    const bx = samBenchPickup.x - cameraX;
    const by = terrainY(samBenchPickup.x) - samBenchPickup.yOffset;
    if (bx > -samBenchPickup.w - 120 && bx < canvas.width + 120) {
      if (samBenchPressImg && samBenchPressImg.complete && samBenchPressImg.naturalWidth > 8) {
        ctx.drawImage(samBenchPressImg, bx, by, samBenchPickup.w, samBenchPickup.h);
      } else {
        ctx.fillStyle = "#1f1f1f";
        ctx.fillRect(bx + 18, by + samBenchPickup.h * 0.55, samBenchPickup.w - 36, 14);
        ctx.fillRect(bx + 26, by + samBenchPickup.h * 0.2, 10, samBenchPickup.h * 0.55);
        ctx.fillRect(bx + samBenchPickup.w - 36, by + samBenchPickup.h * 0.2, 10, samBenchPickup.h * 0.55);
      }

      const samImg = selectedCharacter?._img;
      if (samImg && samImg.complete && samImg.naturalWidth > 8) {
        const faceSize = 42;
        ctx.save();
        ctx.fillStyle = "#ffffffd9";
        ctx.fillRect(bx + samBenchPickup.w * 0.5 - faceSize * 0.5 - 3, by + 8, faceSize + 6, faceSize + 6);
        ctx.drawImage(samImg, bx + samBenchPickup.w * 0.5 - faceSize * 0.5, by + 11, faceSize, faceSize);
        ctx.restore();
      }
    }
  }

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

function drawNathanTacoma() {
  if (selectedCharacter.id !== "nathan" || actor.state === "ready" || !actor.nathanHasTruck) return;
  const sx = actor.x - cameraX;
  const sy = actor.y;
  const r = actor.radius;

  const truckW = r * 4.6;
  const truckH = r * 2.15;
  const truckX = sx - truckW / 2;
  const truckY = sy - r * 0.36;

  ctx.save();
  if (nathanTacomaImg && nathanTacomaImg.complete && nathanTacomaImg.naturalWidth > 10) {
    ctx.drawImage(nathanTacomaImg, truckX, truckY, truckW, truckH);
  } else {
    ctx.fillStyle = "#4f5964";
    ctx.strokeStyle = "#1e2328";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(truckX, truckY + truckH * 0.32, truckW, truckH * 0.54, 8);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(truckX + truckW * 0.14, truckY + truckH * 0.02, truckW * 0.48, truckH * 0.43, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#21262d";
    ctx.beginPath(); ctx.arc(truckX + truckW * 0.2, truckY + truckH * 0.86, r * 0.38, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(truckX + truckW * 0.8, truckY + truckH * 0.86, r * 0.38, 0, Math.PI * 2); ctx.fill();
  }

  if (actor.nathanSpeed > 560) {
    const alpha = Math.min(0.52, (actor.nathanSpeed - 560) / 2900);
    const grd = ctx.createRadialGradient(sx, sy, r * 0.3, sx, sy, r * 3.0);
    grd.addColorStop(0, `rgba(120,180,255,${alpha})`);
    grd.addColorStop(1, "rgba(120,180,255,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(sx - r * 1.4, sy + r * 0.35, r * 2.4, r * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDavyRide() {
  if (selectedCharacter.id !== "davy" || actor.state === "ready" || !actor.davyHasRide) return;
  const sx = actor.x - cameraX;
  const sy = actor.y;
  const r = actor.radius;

  const rideW = r * 4.7;
  const rideH = r * 2.2;
  const rideX = sx - rideW / 2;
  const rideY = sy - r * 0.36;

  ctx.save();
  if (davyRideImg && davyRideImg.complete && davyRideImg.naturalWidth > 10) {
    ctx.drawImage(davyRideImg, rideX, rideY, rideW, rideH);
  } else {
    ctx.fillStyle = "#a45c22";
    ctx.fillRect(rideX, rideY + rideH * 0.25, rideW, rideH * 0.52);
    ctx.fillStyle = "#ffd18a";
    ctx.fillRect(rideX + rideW * 0.15, rideY, rideW * 0.5, rideH * 0.38);
  }

  if (actor.davySpeed > 560) {
    const alpha = Math.min(0.52, (actor.davySpeed - 560) / 2900);
    const grd = ctx.createRadialGradient(sx, sy, r * 0.3, sx, sy, r * 3.0);
    grd.addColorStop(0, `rgba(255,180,120,${alpha})`);
    grd.addColorStop(1, "rgba(255,180,120,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(sx - r * 1.4, sy + r * 0.35, r * 2.4, r * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCalebTrex() {
  if (selectedCharacter.id !== "calebparker" || actor.state === "ready" || !actor.calebHasDino) return;
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

function drawNathanTrumps() {
  nathanTrumps.forEach((shot) => {
    const sx = shot.x - cameraX;
    if (sx < -90 || sx > canvas.width + 90) return;
    const size = shot.radius * 2.2;
    if (shot.isShrimp && ljsProjectileImg && ljsProjectileImg.complete && ljsProjectileImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, shot.y);
      ctx.rotate(shot.rotation || 0);
      ctx.drawImage(ljsProjectileImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else if (nathanTrumpImg && nathanTrumpImg.complete && nathanTrumpImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, shot.y);
      ctx.rotate(shot.rotation || 0);
      ctx.drawImage(nathanTrumpImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#ffd8a6";
      ctx.beginPath();
      ctx.arc(sx, shot.y, shot.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawNathanAirstrike() {
  if (selectedCharacter.id === "nathan" && actor.nathanFlagTimer > 0) {
    const fw = Math.min(canvas.width * 0.72, 900);
    const fh = fw * 0.56;
    const fy = canvas.height * 0.08;
    const pulse = 0.92 + Math.sin(performance.now() * 0.009) * 0.08;
    const drawW = fw * pulse;
    const drawH = fh * pulse;
    const drawX = canvas.width * 0.5 - drawW * 0.5;
    const drawY = fy;
    ctx.save();
    ctx.globalAlpha = Math.min(0.92, 0.42 + actor.nathanFlagTimer * 0.22);
    if (nathanFlagImg && nathanFlagImg.complete && nathanFlagImg.naturalWidth > 8) {
      ctx.drawImage(nathanFlagImg, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(drawX, drawY, drawW, drawH);
      ctx.fillStyle = "#b22234";
      for (let i = 0; i < 7; i += 1) {
        ctx.fillRect(drawX, drawY + i * (drawH / 7), drawW, drawH / 14);
      }
      ctx.fillStyle = "#3c3b6e";
      ctx.fillRect(drawX, drawY, drawW * 0.4, drawH * 0.52);
    }
    ctx.restore();
  }

  if (actor.nathanAirstrikeTimer > 0) {
    const sx = actor.nathanJetX - cameraX;
    const sy = actor.nathanJetY;
    if (sx > -240 && sx < canvas.width + 240) {
      const w = 220;
      const h = 118;
      if (nathanJetImg && nathanJetImg.complete && nathanJetImg.naturalWidth > 8) {
        ctx.save();
        ctx.globalAlpha = 0.98;
        ctx.drawImage(nathanJetImg, sx - w * 0.5, sy - h * 0.5, w, h);
        ctx.restore();
      } else {
        ctx.fillStyle = "#aab5c2";
        ctx.beginPath();
        ctx.moveTo(sx - 75, sy);
        ctx.lineTo(sx + 55, sy - 22);
        ctx.lineTo(sx + 72, sy);
        ctx.lineTo(sx + 55, sy + 22);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  nathanAirstrikeBombs.forEach((bomb) => {
    const sx = bomb.x - cameraX;
    if (sx < -90 || sx > canvas.width + 90) return;
    const size = bomb.radius * 2.15;
    if (nathanBombImg && nathanBombImg.complete && nathanBombImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, bomb.y);
      ctx.rotate((bomb.vx * 0.003 + bomb.vy * 0.0012) * 0.8);
      ctx.drawImage(nathanBombImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#2f3439";
      ctx.beginPath();
      ctx.arc(sx, bomb.y, bomb.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function drawEvanBasketballs() {
  evanBasketballs.forEach((ball) => {
    const sx = ball.x - cameraX;
    if (sx < -80 || sx > canvas.width + 80) return;
    const size = ball.radius * 2;
    if (evanBasketballImg && evanBasketballImg.complete && evanBasketballImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx, ball.y);
      ctx.rotate(ball.rotation || 0);
      ctx.drawImage(evanBasketballImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#d9811d";
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

function drawEnemyLasersAndBoss() {
  if (stricBossState.active) {
    const bx = stricBossState.x - cameraX;
    const by = stricBossState.y;
    const size = 210;
    if (strickerBossImg && strickerBossImg.complete && strickerBossImg.naturalWidth > 10) {
      ctx.save();
      ctx.globalAlpha = 0.96;
      ctx.drawImage(strickerBossImg, bx - size * 0.5, by - size * 0.55, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = "#ffb4b4";
      ctx.beginPath();
      ctx.arc(bx, by, 72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4a0f0f";
      ctx.font = "bold 18px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.fillText("STRICKER", bx, by + 6);
      ctx.textAlign = "start";
    }
  }

  enemyLasers.forEach((laser) => {
    const sx = laser.x - cameraX;
    if (sx < -220 || sx > canvas.width + 220) return;
    if (laser.spriteType === "shrimp" && ljsProjectileImg && ljsProjectileImg.complete && ljsProjectileImg.naturalWidth > 8) {
      const size = laser.radius * 4.2;
      ctx.save();
      ctx.translate(sx, laser.y);
      ctx.rotate(Math.atan2(laser.vy, laser.vx));
      ctx.drawImage(ljsProjectileImg, -size * 0.5, -size * 0.28, size, size * 0.56);
      ctx.restore();
    } else if (laser.isFire) {
      const cx = sx;
      const cy = laser.y;
      const r = laser.radius * 2.4;
      ctx.save();
      // Flame tail trailing to the right (projectile moves left)
      const tailLen = r * 5.5;
      const tailGrad = ctx.createLinearGradient(cx + tailLen, cy, cx, cy);
      tailGrad.addColorStop(0, "rgba(255,60,0,0)");
      tailGrad.addColorStop(0.35, "rgba(255,110,0,0.18)");
      tailGrad.addColorStop(0.72, "rgba(255,170,0,0.4)");
      tailGrad.addColorStop(1, "rgba(255,220,40,0.6)");
      ctx.fillStyle = tailGrad;
      ctx.beginPath();
      ctx.ellipse(cx + tailLen * 0.42, cy, tailLen * 0.58, r * 0.44, 0, 0, Math.PI * 2);
      ctx.fill();
      // Outer glow
      const outerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.5);
      outerGrad.addColorStop(0, "rgba(255,210,60,0.6)");
      outerGrad.addColorStop(0.45, "rgba(255,90,0,0.32)");
      outerGrad.addColorStop(1, "rgba(180,10,0,0)");
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Core fireball
      const coreGrad = ctx.createRadialGradient(cx - r * 0.18, cy - r * 0.2, 0, cx, cy, r);
      coreGrad.addColorStop(0, "#fff5d0");
      coreGrad.addColorStop(0.22, "#ffe566");
      coreGrad.addColorStop(0.55, "#ff7800");
      coreGrad.addColorStop(1, "#cc1500");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.strokeStyle = laser.color;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(sx, laser.y);
      ctx.lineTo(sx - laser.vx * 0.018, laser.y - laser.vy * 0.018);
      ctx.stroke();
      ctx.fillStyle = "#ffd6d6";
      ctx.beginPath();
      ctx.arc(sx, laser.y, laser.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  owenGoKarts.forEach((kart) => {
    const sx = kart.x - cameraX;
    if (sx < -kart.w - 160 || sx > canvas.width + 160) return;

    if (owenGoKartImg && owenGoKartImg.complete && owenGoKartImg.naturalWidth > 8) {
      ctx.save();
      ctx.translate(sx + kart.w * 0.5, kart.y + kart.h * 0.5);
      ctx.rotate(kart.rotation);
      ctx.drawImage(owenGoKartImg, -kart.w * 0.5, -kart.h * 0.5, kart.w, kart.h);
      ctx.restore();
    } else {
      ctx.fillStyle = "#141414";
      ctx.fillRect(sx + 18, kart.y + 22, kart.w - 32, kart.h - 26);
      ctx.fillStyle = "#d92a2a";
      ctx.fillRect(sx + 26, kart.y + 34, kart.w - 56, 18);
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.arc(sx + 28, kart.y + kart.h - 8, 14, 0, Math.PI * 2);
      ctx.arc(sx + kart.w - 28, kart.y + kart.h - 8, 14, 0, Math.PI * 2);
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

function drawSceneCore() {
  drawBackground();
  drawGround();
  drawMapDecor();
  drawEnemyLasersAndBoss();
  drawNathanAirstrike();
  drawCatapult();
  drawSlingshotBands();
  drawTrajectory();
  drawKadeBMW();
  drawNathanTacoma();
  drawDavyRide();
  drawCalebTrex();
  drawActor();
  drawFishingRod();
  drawBraydenRacket();
  drawCandyBeam();
  drawTennisBalls();
  drawNathanTrumps();
  drawEvanBasketballs();
  drawBombs();
  drawParticles();
}

function getHeadToHeadPaneMetrics() {
  const panelHeight = canvas.height / 2;
  const paneScale = panelHeight / canvas.height;
  const paneDrawWidth = canvas.width * paneScale;
  const paneXOffset = (canvas.width - paneDrawWidth) / 2;
  return {
    panelHeight,
    paneScale,
    paneDrawWidth,
    paneXOffset,
  };
}

function drawHeadToHeadViewport(viewActor, viewCameraX, yOffset, panelLabel, panelDistance) {
  const { panelHeight, paneScale, paneXOffset } = getHeadToHeadPaneMetrics();
  const actorSnapshot = cloneActorState(actor);
  const cameraSnapshot = cameraX;

  Object.assign(actor, viewActor);
  cameraX = viewCameraX;

  ctx.save();
  ctx.fillStyle = "#b6e8ff";
  ctx.fillRect(0, yOffset, canvas.width, panelHeight);
  ctx.beginPath();
  ctx.rect(0, yOffset, canvas.width, panelHeight);
  ctx.clip();
  ctx.translate(paneXOffset, yOffset);
  ctx.scale(paneScale, paneScale);
  drawSceneCore();
  ctx.restore();

  Object.assign(actor, actorSnapshot);
  cameraX = cameraSnapshot;

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
  ctx.fillRect(12, yOffset + 10, 280, 44);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Trebuchet MS";
  ctx.fillText(panelLabel, 24, yOffset + 30);
  ctx.font = "bold 14px Trebuchet MS";
  ctx.fillText(`Distance: ${panelDistance.toFixed(1)}m`, 24, yOffset + 47);
  ctx.restore();
}

function drawHeadToHeadSplit() {
  const { panelHeight } = getHeadToHeadPaneMetrics();
  const bottomOffset = panelHeight;
  const playerDistance = Math.max(0, (actor.maxX - world.launchX) / 10);
  const opponentDistance = headToHeadState.opponentActor
    ? Math.max(0, (headToHeadState.opponentActor.maxX - world.launchX) / 10)
    : 0;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHeadToHeadViewport(actor, cameraX, 0, "YOU", playerDistance);

  if (headToHeadState.opponentActor) {
    drawHeadToHeadViewport(
      headToHeadState.opponentActor,
      headToHeadState.opponentCameraX,
      bottomOffset,
      `OPPONENT: ${headToHeadState.rivalName}`,
      opponentDistance,
    );
  }

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(0, panelHeight - 2, canvas.width, 4);
  ctx.restore();
}

function draw() {
  if (headToHeadState.active && headToHeadState.opponentActor) {
    drawHeadToHeadSplit();
    return;
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(screenShakeX, screenShakeY);
  drawSceneCore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawConfetti();
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  updateHeadToHeadMatchmaking(dt);
  if (headToHeadState.active && headToHeadState.liveNetwork) {
    networkState.snapshotTimer -= dt;
    if (networkState.snapshotTimer <= 0) {
      networkState.snapshotTimer = NETWORK_SNAPSHOT_SECONDS;
      sendLiveNetworkSnapshot();
    }
  }
  update(dt);
  updateMobileControls();
  draw();
  requestAnimationFrame(frame);
}

function isLikelyMobile() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches || window.innerWidth <= 900;
}

function getSecondaryActionLabel() {
  switch (selectedCharacter.id) {
    case "spencer":
      return "B: Bomb";
    case "anthony":
    case "matteo":
      return "B: Truck";
    case "jjfootballboss":
      return "B: Jump";
    case "samhallet":
      return "B: Jump";
    case "davy":
      return "B: Jump";
    default:
      return "B: Alt";
  }
}

function updateMobileControls() {
  if (!mobileControls || !mobilePrimaryBtn || !mobileSecondaryBtn) return;

  const overlayActive = menuScreen.classList.contains("active")
    || characterScreen.classList.contains("active")
    || leaderboardScreen.classList.contains("active")
    || !!matchmakingScreen?.classList.contains("active");

  const show = isLikelyMobile() && !overlayActive;
  mobileControls.classList.toggle("active", show);
  if (!show) return;

  const canUseActions = actor.state !== "ready" && actor.state !== "ended";
  mobilePrimaryBtn.disabled = !canUseActions;

  const hasSecondaryAction = selectedCharacter.id === "spencer"
    || selectedCharacter.id === "anthony"
    || selectedCharacter.id === "matteo"
    || selectedCharacter.id === "jjfootballboss"
    || selectedCharacter.id === "samhallet"
    || selectedCharacter.id === "davy";
  mobileSecondaryBtn.disabled = !canUseActions || !hasSecondaryAction;

  mobilePrimaryBtn.textContent = selectedCharacter.id === "spencer" ? "A: Jump" : "A: Ability";
  mobileSecondaryBtn.textContent = getSecondaryActionLabel();
}

function updateViewportLayout() {
  const hudHeight = hudTop?.offsetHeight || 0;
  const mobileHeight = mobileControls?.classList.contains("active")
    ? (mobileControls.offsetHeight || 68)
    : 0;
  document.documentElement.style.setProperty("--hud-height", `${hudHeight}px`);
  document.documentElement.style.setProperty("--mobile-controls-height", `${mobileHeight}px`);
}

function triggerPrimaryAction() {
  ensureAudio();
  if (selectedCharacter.id === "spencer") {
    useSpencerJump();
    return;
  }
  useAbility();
}

function triggerSecondaryAction() {
  ensureAudio();
  if (selectedCharacter.id === "spencer") {
    useSpencerBomb();
    return true;
  }
  if (selectedCharacter.id === "anthony" || selectedCharacter.id === "matteo") {
    useTruck();
    return true;
  }
  if (selectedCharacter.id === "jjfootballboss") {
    useJJDoubleJump();
    return true;
  }
  if (selectedCharacter.id === "samhallet") {
    useSamJump();
    return true;
  }
  if (selectedCharacter.id === "davy") {
    useDavyJump();
    return true;
  }
  return false;
}

function bindMobileActionButton(button, action) {
  if (!button) return;
  button.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    button.classList.add("is-pressed");
    action();
  });
  const release = () => button.classList.remove("is-pressed");
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("pointercancel", release);
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
      if (jpgPath && img.src.endsWith(".png")) {
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
    if (c.itemImageData) {
      const itemBadge = document.createElement("img");
      itemBadge.className = "character-item-badge";
      itemBadge.alt = `${c.name} item`;
      itemBadge.src = c.itemImageData;
      card.append(itemBadge);
    }

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
  if (headToHeadState.mode === "searching" || headToHeadState.liveNetwork) {
    stopLiveNetworkSession();
    headToHeadState.mode = "idle";
    headToHeadState.active = false;
  }
  menuScreen.classList.add("active");
  characterScreen.classList.remove("active");
  matchmakingScreen?.classList.remove("active");
  controlsPanel.classList.add("hidden");
}

function showCharacterSelect() {
  menuScreen.classList.remove("active");
  characterScreen.classList.add("active");
  matchmakingScreen?.classList.remove("active");
  controlsPanel.classList.add("hidden");
  if (mapSelectDropdown) mapSelectDropdown.value = String(currentMapIndex);
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
      if (jpgPath && !img.src.endsWith(".jpg")) {
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
  mikeObstacleImg = null;

  ljsObstacleImg = new Image();
  let ljsObstacleIdx = 0;
  ljsObstacleImg.onerror = () => {
    ljsObstacleIdx += 1;
    if (ljsObstacleIdx < ljsObstacleImageCandidates.length) {
      ljsObstacleImg.src = ljsObstacleImageCandidates[ljsObstacleIdx];
    }
  };
  ljsObstacleImg.src = ljsObstacleImageCandidates[ljsObstacleIdx];

  ljsProjectileImg = new Image();
  let ljsProjectileIdx = 0;
  ljsProjectileImg.onerror = () => {
    ljsProjectileIdx += 1;
    if (ljsProjectileIdx < ljsProjectileImageCandidates.length) {
      ljsProjectileImg.src = ljsProjectileImageCandidates[ljsProjectileIdx];
    }
  };
  ljsProjectileImg.src = ljsProjectileImageCandidates[ljsProjectileIdx];

  strickerBossImg = null;

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

  owenMilkImg = new Image();
  let owenMilkIdx = 0;
  owenMilkImg.onerror = () => {
    owenMilkIdx += 1;
    if (owenMilkIdx < owenMilkImageCandidates.length) owenMilkImg.src = owenMilkImageCandidates[owenMilkIdx];
  };
  owenMilkImg.src = owenMilkImageCandidates[0];

  owenGoKartImg = new Image();
  let owenGoKartIdx = 0;
  owenGoKartImg.onerror = () => {
    owenGoKartIdx += 1;
    if (owenGoKartIdx < owenGoKartImageCandidates.length) owenGoKartImg.src = owenGoKartImageCandidates[owenGoKartIdx];
  };
  owenGoKartImg.src = owenGoKartImageCandidates[0];

  samDumbbellImg = new Image();
  let samDumbbellIdx = 0;
  samDumbbellImg.onerror = () => {
    samDumbbellIdx += 1;
    if (samDumbbellIdx < samDumbbellImageCandidates.length) samDumbbellImg.src = samDumbbellImageCandidates[samDumbbellIdx];
  };
  samDumbbellImg.src = samDumbbellImageCandidates[0];

  samBenchPressImg = new Image();
  let samBenchIdx = 0;
  samBenchPressImg.onerror = () => {
    samBenchIdx += 1;
    if (samBenchIdx < samBenchPressImageCandidates.length) samBenchPressImg.src = samBenchPressImageCandidates[samBenchIdx];
  };
  samBenchPressImg.src = samBenchPressImageCandidates[0];

  evanBasketballImg = new Image();
  let evanBasketballIdx = 0;
  evanBasketballImg.onerror = () => {
    evanBasketballIdx += 1;
    if (evanBasketballIdx < evanBasketballImageCandidates.length) evanBasketballImg.src = evanBasketballImageCandidates[evanBasketballIdx];
  };
  evanBasketballImg.src = evanBasketballImageCandidates[0];

  nathanTacomaImg = new Image();
  let nathanTacomaIdx = 0;
  nathanTacomaImg.onerror = () => {
    nathanTacomaIdx += 1;
    if (nathanTacomaIdx < nathanTacomaImageCandidates.length) nathanTacomaImg.src = nathanTacomaImageCandidates[nathanTacomaIdx];
  };
  nathanTacomaImg.src = nathanTacomaImageCandidates[0];

  davyRideImg = new Image();
  davyRideImg.src = "Davys Ride.webp";

  nathanGasImg = new Image();
  let nathanGasIdx = 0;
  nathanGasImg.onerror = () => {
    nathanGasIdx += 1;
    if (nathanGasIdx < nathanGasImageCandidates.length) nathanGasImg.src = nathanGasImageCandidates[nathanGasIdx];
  };
  nathanGasImg.src = nathanGasImageCandidates[0];

  travisCraddleImg = new Image();
  let travisCraddleIdx = 0;
  travisCraddleImg.onerror = () => {
    travisCraddleIdx += 1;
    if (travisCraddleIdx < travisCraddleImageCandidates.length) travisCraddleImg.src = travisCraddleImageCandidates[travisCraddleIdx];
  };
  travisCraddleImg.src = travisCraddleImageCandidates[0];

  nathanTrumpImg = new Image();
  let nathanTrumpIdx = 0;
  nathanTrumpImg.onerror = () => {
    nathanTrumpIdx += 1;
    if (nathanTrumpIdx < nathanTrumpImageCandidates.length) nathanTrumpImg.src = nathanTrumpImageCandidates[nathanTrumpIdx];
  };
  nathanTrumpImg.src = nathanTrumpImageCandidates[0];

  nathanJetImg = new Image();
  let nathanJetIdx = 0;
  nathanJetImg.onerror = () => {
    nathanJetIdx += 1;
    if (nathanJetIdx < nathanJetImageCandidates.length) nathanJetImg.src = nathanJetImageCandidates[nathanJetIdx];
  };
  nathanJetImg.src = nathanJetImageCandidates[0];

  nathanBombImg = new Image();
  let nathanBombIdx = 0;
  nathanBombImg.onerror = () => {
    nathanBombIdx += 1;
    if (nathanBombIdx < nathanBombImageCandidates.length) nathanBombImg.src = nathanBombImageCandidates[nathanBombIdx];
  };
  nathanBombImg.src = nathanBombImageCandidates[0];

  nathanFlagImg = new Image();
  let nathanFlagIdx = 0;
  nathanFlagImg.onerror = () => {
    nathanFlagIdx += 1;
    if (nathanFlagIdx < nathanFlagImageCandidates.length) nathanFlagImg.src = nathanFlagImageCandidates[nathanFlagIdx];
  };
  nathanFlagImg.src = nathanFlagImageCandidates[0];

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

  longJohnSilversMapImg = null;
  loadLongJohnSilversMapFromPdf();

  stricWoodsMapImgs = [];

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

toSelectBtn.addEventListener("click", () => {
  if (!requireAuthenticatedAccount("play")) return;
  showCharacterSelect();
});
headToHeadBtn?.addEventListener("click", beginHeadToHeadSearch);
privateHeadToHeadBtn?.addEventListener("click", () => beginHeadToHeadSearch({ requirePrivate: true }));
hudHeadToHeadBtn?.addEventListener("click", () => {
  if (!requireAuthenticatedAccount("enter head-to-head")) return;
  beginHeadToHeadSearch();
});
cancelMatchmakingBtn?.addEventListener("click", cancelHeadToHeadSearch);
backToMenuBtn.addEventListener("click", showMenu);
document.getElementById("changeCharBtn").addEventListener("click", () => {
  showCharacterSelect();
});
switchMapBtn?.addEventListener("click", toggleMap);
makerAddBtn?.addEventListener("click", addCustomCharacterFromMaker);
makerRemoveBtn?.addEventListener("click", removeCustomCharacterById);
makerAiGenerateBtn?.addEventListener("click", applyAiBuildToMaker);
makerCharacterPngInput?.addEventListener("change", () => handleMakerImageUpload(makerCharacterPngInput, "character"));
makerItemPngInput?.addEventListener("change", () => handleMakerImageUpload(makerItemPngInput, "item"));
signUpBtn?.addEventListener("click", async () => {
  if (authRequestInFlight) return;
  try {
    const email = accountNameInput?.value?.trim();
    const password = accountPasswordInput?.value || "";
    if (!email || !password) {
      alert("Enter an account name and password first.");
      return;
    }
    setAuthControlsDisabled(true);
    updateAccountStatusMessage("Creating account...");
    await signUpAccount(email, password);
    updateAccountStatusMessage(`Account: ${validateAccountName(email)} (signed in, required to play)`);
  } catch (e) {
    const message = getAuthErrorMessage(e);
    updateAccountStatusMessage(`Account issue: ${message}`);
    alert(message || "Sign-up failed");
  } finally {
    setAuthControlsDisabled(false);
  }
});

signInBtn?.addEventListener("click", async () => {
  if (authRequestInFlight) return;
  try {
    const email = accountNameInput?.value?.trim();
    const password = accountPasswordInput?.value || "";
    if (!email || !password) {
      alert("Enter an account name and password first.");
      return;
    }
    setAuthControlsDisabled(true);
    updateAccountStatusMessage("Signing in...");
    await signInAccount(email, password);
  } catch (e) {
    const message = getAuthErrorMessage(e);
    updateAccountStatusMessage(`Account issue: ${message}`);
    alert(message || "Sign-in failed");
  } finally {
    setAuthControlsDisabled(false);
  }
});

signOutBtn?.addEventListener("click", () => {
  signOutAccount();
});

playBtn.addEventListener("click", () => {
  if (!requireAuthenticatedAccount("play")) return;
  stopLiveNetworkSession();
  headToHeadState.mode = "idle";
  headToHeadState.active = false;
  headToHeadState.liveNetwork = false;
  headToHeadState.opponentActor = null;
  matchmakingScreen?.classList.remove("active");
  refreshHeadToHeadLocks();
  if (!isUnlocked(selectedCharacter)) {
    selectedCharacter = characters.find((c) => isUnlocked(c)) || characters[0];
  }
  if (mapSelectDropdown) {
    currentMapIndex = parseInt(mapSelectDropdown.value, 10) || 0;
    updateMapUI();
  }
  startGame();
  resetActor();
});
launchBtn.addEventListener("click", launch);
restartBtn.addEventListener("click", () => {
  if (isHeadToHeadLocked()) return;
  resetActor();
  distanceValue.textContent = "0";
  updateHeightUI();
});

function isTypingIntoField(target) {
  if (!target) return false;
  if (target.isContentEditable) return true;
  const tag = (target.tagName || "").toUpperCase();
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

window.addEventListener("keydown", (ev) => {
  if (ev.code === "Space") {
    if (isTypingIntoField(ev.target)) return;
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

    const didSecondary = now - lastSpaceTime < 320 && triggerSecondaryAction();
    if (didSecondary) {
      lastSpaceTime = 0;
    } else {
      triggerPrimaryAction();
      lastSpaceTime = now;
    }
  }
});

// Helper: convert a MouseEvent into canvas-space world coordinates
function canvasCoords(ev) {
  const rect   = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  const localX = (ev.clientX - rect.left) * scaleX;
  const localY = (ev.clientY - rect.top) * scaleY;

  if (headToHeadState.active) {
    const { panelHeight, paneScale, paneXOffset, paneDrawWidth } = getHeadToHeadPaneMetrics();
    if (localY > panelHeight || localX < paneXOffset || localX > paneXOffset + paneDrawWidth) {
      return {
        wx: localX + cameraX,
        wy: null,
        inPlayerPane: false,
      };
    }

    const logicalX = (localX - paneXOffset) / paneScale;
    const logicalY = localY / paneScale;
    return {
      wx: logicalX + cameraX,
      wy: logicalY,
      inPlayerPane: true,
    };
  }

  return {
    wx: localX + cameraX,
    wy: localY,
    inPlayerPane: true,
  };
}

function canStartDragFromPos(clientX, clientY) {
  const { wx, wy, inPlayerPane } = canvasCoords({ clientX, clientY });
  if (!inPlayerPane || wy == null) return false;

  const actorDx = wx - actor.x;
  const actorDy = wy - actor.y;
  const actorHitRadius = actor.radius + 18;
  if (Math.sqrt(actorDx * actorDx + actorDy * actorDy) < actorHitRadius) return true;

  if (!isLikelyMobile()) return false;

  const anchorX = world.launchX;
  const anchorY = terrainY(world.launchX) - 70;
  const anchorDx = wx - anchorX;
  const anchorDy = wy - anchorY;
  return Math.sqrt(anchorDx * anchorDx + anchorDy * anchorDy) < 150;
}

function beginDragAtClientPos(clientX, clientY) {
  if (actor.state !== "ready") return;

  if (canStartDragFromPos(clientX, clientY)) {
    isDragging = true;
    ensureAudio();
    updateAimAndDragAtClientPos(clientX, clientY);
  }
}

function updateAimAndDragAtClientPos(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const rawX = clientX - rect.left;
  const rawY = clientY - rect.top;

  if (headToHeadState.active) {
    const localX = rawX * scaleX;
    const localY = rawY * scaleY;
    const { paneScale, paneXOffset } = getHeadToHeadPaneMetrics();
    const logicalX = (localX - paneXOffset) / paneScale;
    const logicalY = localY / paneScale;
    lastMouseX = logicalX / scaleX;
    lastMouseY = logicalY / scaleY;
  } else {
    lastMouseX = rawX;
    lastMouseY = rawY;
  }

  if (!isDragging || actor.state !== "ready") return;

  const { wx, wy, inPlayerPane } = canvasCoords({ clientX, clientY });
  if (!inPlayerPane || wy == null) return;
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
}

function endDragLaunch() {
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
}

function cancelDragLaunch() {
  if (!isDragging) return;
  isDragging = false;
  dragStart  = null;
  actor.x    = world.launchX;
  actor.y    = terrainY(world.launchX) - 70;
  launchVector = null;
  trajectoryDots.length = 0;
}

canvas.addEventListener("mousedown", (ev) => {
  beginDragAtClientPos(ev.clientX, ev.clientY);
});

canvas.addEventListener("mousemove", (ev) => {
  updateAimAndDragAtClientPos(ev.clientX, ev.clientY);
});

canvas.addEventListener("mouseup", () => {
  endDragLaunch();
});

canvas.addEventListener("mouseleave", () => {
  cancelDragLaunch();
});

canvas.addEventListener("touchstart", (ev) => {
  if (!ev.touches.length) return;
  ev.preventDefault();
  const t = ev.touches[0];
  beginDragAtClientPos(t.clientX, t.clientY);
}, { passive: false });

canvas.addEventListener("touchmove", (ev) => {
  if (!ev.touches.length) return;
  ev.preventDefault();
  const t = ev.touches[0];
  updateAimAndDragAtClientPos(t.clientX, t.clientY);
}, { passive: false });

canvas.addEventListener("touchend", (ev) => {
  ev.preventDefault();
  if (ev.changedTouches && ev.changedTouches.length) {
    const t = ev.changedTouches[0];
    updateAimAndDragAtClientPos(t.clientX, t.clientY);
  }
  endDragLaunch();
}, { passive: false });

canvas.addEventListener("touchcancel", (ev) => {
  ev.preventDefault();
  cancelDragLaunch();
}, { passive: false });

window.addEventListener("mouseup", () => {
  endDragLaunch();
});

window.addEventListener("touchend", () => {
  endDragLaunch();
}, { passive: true });

window.addEventListener("touchcancel", () => {
  cancelDragLaunch();
}, { passive: true });

bindMobileActionButton(mobilePrimaryBtn, () => {
  triggerPrimaryAction();
});

bindMobileActionButton(mobileSecondaryBtn, () => {
  triggerSecondaryAction();
});

preloadCharacterImages();
ensureAdminAccountExists();
bindProfilePngDropZone();
const storedH2HName = localStorage.getItem("faith-h2h-name");
if (storedH2HName && !authSession?.user?.id) {
  networkState.displayName = storedH2HName.slice(0, 16);
  if (headToHeadNameInput) headToHeadNameInput.value = networkState.displayName;
}
const storedPrivateCode = localStorage.getItem("faith-h2h-private-code");
if (storedPrivateCode && privateMatchCodeInput) {
  privateMatchCodeInput.value = normalizePrivateCode(storedPrivateCode);
}
updateHighScoreUI();
updateHeightUI();
updateMapUI();
loadAuthSession();
if (authSession?.user?.id) {
  const accountName = getSessionAccountName();
  if (accountNameInput) accountNameInput.value = accountName;
}
subscribeToLeaderboard();
window.addEventListener("resize", updateViewportLayout);
window.visualViewport?.addEventListener("resize", updateViewportLayout);
showMenu();
resetActor();
updateViewportLayout();

submitScoreBtn.addEventListener("click", async () => {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Please enter your name!");
    return;
  }
  const distance = actor.maxX - world.launchX;
  const travelled = parseFloat((distance / 10).toFixed(1));
  // Always save locally first with full character + map metadata
  addScoreToLeaderboard(name, distance);
  const cloudOk = await pushCloudLeaderboardEntry(name, travelled);
  await fetchCloudLeaderboard();
  displayLeaderboard();
  submitScoreBtn.disabled = true;
  playerNameInput.disabled = true;
  playerNameInput.value = cloudOk ? "Score submitted!" : "Saved locally (cloud sync failed)";
});

if (leaderboardCharBtn) {
  leaderboardCharBtn.addEventListener("click", () => {
    leaderboardViewMode = "character";
    displayLeaderboard();
  });
}
if (leaderboardMapBtn) {
  leaderboardMapBtn.addEventListener("click", () => {
    leaderboardViewMode = "map";
    displayLeaderboard();
  });
}
if (leaderboardAllBtn) {
  leaderboardAllBtn.addEventListener("click", () => {
    leaderboardViewMode = "all";
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
