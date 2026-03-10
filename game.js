const STORAGE_KEY = "faith-flight-best";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const appRoot = document.getElementById("app");

const menuScreen = document.getElementById("menuScreen");
const characterScreen = document.getElementById("characterScreen");
const controlsPanel = document.getElementById("controlsPanel");
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
const highScoreValue = document.getElementById("highScoreValue");
const runStateLabel = document.getElementById("runStateLabel");

const world = {
  width: 12000,
  launchX: 160,
  gravity: 1200,
  markersEvery: 100,
  maxCameraX: 0,
  bestDistance: Number(localStorage.getItem(STORAGE_KEY) || 0),
};

const ABILITY_COOLDOWN_SECONDS = 3;

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
    drag: 0.12,
    bounce: 0.34,
    gravityMult: 1.04,
    launchBoost: 1.00,
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
    drag: 0.08,
    bounce: 0.66,
    gravityMult: 0.92,
    launchBoost: 1.28,
    unlockAt: 0,
    ability: "rocket",
  },
  {
    id: "anthony",
    name: "Anthony",
    trait: "Heavy impact",
    bio: "Big body with huge launch carry. Massive jump burst and heavy impact.",
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
    drag: 0.074,
    bounce: 0.72,
    gravityMult: 0.92,
    launchBoost: 1.22,
    unlockAt: 0,
    ability: "warp",
  },
  {
    id: "spencer",
    name: "Spencer",
    trait: "Bomb sprinter",
    bio: "Starts fast. Space for jump, double-Space for bomb. Bombs destroy Janet but slow him down.",
    imageBase: "Spencer",
    initials: "S",
    mass: 2.05,
    radius: 40,
    drag: 0.06,
    bounce: 0.52,
    gravityMult: 0.90,
    launchBoost: 1.48,
    unlockAt: 0,
    ability: "jumpbomb",
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
};

const obstacles = [];

const bouncePadCache = new Map();
const janetCache = new Map();

const JANET_BASE = {
  w: 56,
  h: 58,
  color: "#ffe0ea",
  label: "Janet",
  fatal: true,
};

const fatalObstacleImageCandidates = [
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

const spencerBombImageCandidates = [
  "Spencers Bomb.png",
  "assets/images/spencers-bomb.png",
  "assets/images/spencer-bomb.png",
  "assets/images/spencers-bomb.jpg",
  "assets/images/spencer-bomb.jpg",
];

const manningFishingRodImageCandidates = [
  "Mannings Fishing Rod.png",
  "assets/images/mannings-fishing-rod.png",
  "assets/images/manning-fishing-rod.png",
  "assets/images/mannings-fishing-rod.jpg",
  "assets/images/manning-fishing-rod.jpg",
];

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

let audioCtx;

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

  actor.x = world.launchX;
  actor.y = forkY;
  actor.vx = 0;
  actor.vy = 0;
  actor.state = "ready";
  actor.usedAbility = false;
  actor.abilityCooldown = 0;
  actor.stoppedTimer = 0;
  actor.maxX = world.launchX;
  actor.truckCount = 3;
  actor.isTrucking = false;
  actor.truckTimer = 0;
  actor.rocketSpiked = false;
  actor.spencerBombsUsed = 0;
  cameraX = 0;
  particles.length = 0;
  impactBursts.length = 0;
  bombs.length = 0;
  destroyedJanets.clear();
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
  updateAbilityHint();
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

function updateScreenShake(dt) {
  if (screenShakeTime <= 0) {
    screenShakeX = 0;
    screenShakeY = 0;
    if (appRoot) appRoot.style.transform = "";
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
    appRoot.style.transform = `translate(${screenShakeX}px, ${screenShakeY}px) rotate(${rotDeg}deg)`;
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

function finishRun(message = "Run ended: no movement left. Press Restart Run.") {
  runStateLabel.textContent = message;
  launchBtn.disabled = true;
  actor.state = "ended";
  actor.vx = 0;
  actor.vy = 0;
  updateAbilityHint();
}

function useAbility() {
  if (actor.state === "ready" || actor.state === "ended" || actor.abilityCooldown > 0) return;

  actor.usedAbility = true;
  actor.abilityCooldown = selectedCharacter.id === "manning" ? 5.0 : ABILITY_COOLDOWN_SECONDS;
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
      const boostStr = 680;
      actor.vx += dirX * boostStr;
      actor.vy += dirY * boostStr * 1.05;
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
        // Rocket fires: big forward + amplify upward momentum
        actor.vx += 480;
        actor.vy *= 1.55;
        tone(680, 0.09, "sawtooth", 0.1);
        tone(440, 0.07, "sawtooth", 0.08);
        spawnParticles(actor.x, actor.y, 32, "#ff4d00");
        spawnParticles(actor.x, actor.y, 16, "#ffcd3c");
        startScreenShake(10, 0.22);
      } else {
        // Fired downward — rocket drives him into the ground
        actor.vy += 900;
        actor.vx *= 0.4;
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
      actor.vy -= 680;
      actor.vx += 200;
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
    default:
      break;
  }

  updateAbilityHint();
}

function useTruck() {
  if (selectedCharacter.id !== "anthony") return;
  if (actor.state === "ready" || actor.state === "ended") return;
  if (actor.truckCount <= 0) {
    tone(120, 0.06, "sine", 0.05);
    return;
  }

  actor.truckCount -= 1;
  actor.isTrucking = true;
  actor.truckTimer = 0.85;
  actor.vx = Math.max(actor.vx + 620, 820); // big forward burst
  actor.vy *= 0.25;                           // kill vertical so he goes flat
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

  const jumpPower = Math.max(220, 560 - actor.spencerBombsUsed * 95);
  actor.vy -= jumpPower;
  actor.vx += 110;
  actor.usedAbility = true;
  actor.abilityCooldown = 0.55;
  tone(520, 0.07, "triangle", 0.08);
  spawnParticles(actor.x, actor.y, 16, "#99ddff");
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
    vx: actor.vx * 0.7 + 90,
    vy: actor.vy * 0.35 + 140,
    life: 1.35,
    radius: 18,
    exploded: false,
  });

  actor.spencerBombsUsed += 1;
  actor.vx *= 0.78;
  actor.vy = Math.max(actor.vy, -120);
  actor.usedAbility = true;
  actor.abilityCooldown = 1.05;

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

function collideRect(rect) {
  const y = terrainY(rect.x) - rect.yOffset;
  const nearestX = Math.max(rect.x, Math.min(actor.x, rect.x + rect.w));
  const nearestY = Math.max(y, Math.min(actor.y, y + rect.h));
  const dx = actor.x - nearestX;
  const dy = actor.y - nearestY;
  if (dx * dx + dy * dy <= actor.radius * actor.radius) {
    if (rect.fatal) {
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
      finishRun("Run ended: Janet collision.");
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

    spawnParticles(actor.x, actor.y, 16, "#ff7aa8");
    tone(620, 0.06, "triangle", 0.07);
  }
}

function update(dt) {
  updateBombs(dt);

  if (actor.state !== "ready" && actor.state !== "ended") {
    actor.abilityCooldown = Math.max(0, actor.abilityCooldown - dt);
    if (actor.isTrucking) {
      actor.truckTimer -= dt;
      if (actor.truckTimer <= 0) {
        actor.isTrucking = false;
        actor.truckTimer = 0;
      }
    }
    actor.vy += world.gravity * actor.gravityMult * dt;
    actor.vx -= actor.vx * actor.drag * dt;
    actor.x += actor.vx * dt;
    actor.y += actor.vy * dt;
    const nearbyBouncePads = getBouncePadsInRange(actor.x - 260, actor.x + 520);
    const nearbyJanets = getJanetsInRange(actor.x - 220, actor.x + 560);

    obstacles.forEach(collideRect);
    nearbyJanets.forEach(collideRect);
    nearbyBouncePads.forEach(collideBouncePad);

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
        let bounceFactor = Math.max(0.62, actor.bounce * 1.22);
        if (selectedCharacter.id === "anthony") {
          const impactIntensity = Math.min(2.4, Math.abs(actor.vy) / 420);
          spawnImpactBurst(actor.x, actor.y + actor.radius * 0.35, impactIntensity);
          bounceFactor = Math.min(bounceFactor, 0.82);
          startScreenShake(22 + impactIntensity * 6.0, 0.45);
        }
        actor.vy = -Math.abs(actor.vy) * bounceFactor;
        actor.vx *= 0.965;
        spawnParticles(actor.x, actor.y, 9, "#f5e8b2");
        tone(190, 0.04, "sine", 0.05);
      } else {
        actor.vy = 0;
        actor.vx *= 0.975;
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
    abilityHint.textContent = `${slamText}  |  ${truckText}`;
    return;
  }

  if (selectedCharacter.id === "hunter" && actor.state === "flying") {
    if (actor.abilityCooldown > 0) {
      abilityHint.textContent = `Rocket recharging: ${actor.abilityCooldown.toFixed(1)}s`;
      return;
    }
    const dir = actor.vy < 0 ? "↑ GOOD — fire now!" : "↓ DANGER — will crash!";
    abilityHint.textContent = `Space: rocket  ${dir}`;
    return;
  }

  if (selectedCharacter.id === "spencer") {
    if (actor.state === "ready") {
      abilityHint.textContent = "Space: jump  |  Double-Space: bomb (kills Janet, slows you)";
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

function getCharacterImageCandidates(character) {
  return [`${character.imageBase}.png`, `${character.imageBase}.jpg`];
}

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#90d9ff");
  grad.addColorStop(1, "#dbf6ff");
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
  ctx.fillText("Faith Christian Campus (Fictional)", 18, 35);

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

  visibleBouncePads.forEach((b) => {
    const y = terrainY(b.x) - b.yOffset;
    const sx = b.x - cameraX;
    ctx.fillStyle = b.color;
    ctx.fillRect(sx, y, b.w, b.h);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Trebuchet MS";
    ctx.fillText("BOUNCE", sx + 10, y + 11);
  });
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
  drawActor();
  drawFishingRod();
  drawBombs();
  drawParticles();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
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
showMenu();
resetActor();
requestAnimationFrame(frame);
