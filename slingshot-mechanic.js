/**
 * Slingshot Mechanic - Modular Phaser Implementation
 * Drag-and-release slingshot with trajectory prediction
 */

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Slingshot configuration
const SLINGSHOT_CONFIG = {
    maxPower: 1200,        // Maximum launch power
    powerScale: 2.5,       // Multiplier for drag distance to power
    maxDragDistance: 200,  // Maximum pixels you can drag back
    anchorX: 200,          // Slingshot anchor position X
    anchorY: 500,          // Slingshot anchor position Y
    bandColor: 0x8B4513,   // Slingshot band color
    bandThickness: 4,      // Band line thickness
    trajectoryPoints: 30,  // Number of dots in trajectory arc
    characterRadius: 25    // Character size
};

// Game state
let gameState = {
    character: null,
    isDragging: false,
    dragStart: null,
    anchor: null,
    launchVector: null,
    isLaunched: false,
    graphics: null,
    trajectoryDots: [],
    ground: null,
    walls: []
};

function preload() {
    // No assets to preload - using graphics primitives
}

function create() {
    const scene = this;

    // Create ground
    gameState.ground = scene.add.rectangle(640, 680, 1280, 80, 0x8B7355);
    scene.physics.add.existing(gameState.ground, true); // Static body

    // Create walls
    const leftWall = scene.add.rectangle(0, 360, 20, 720, 0x666666);
    const rightWall = scene.add.rectangle(1280, 360, 20, 720, 0x666666);
    scene.physics.add.existing(leftWall, true);
    scene.physics.add.existing(rightWall, true);
    gameState.walls = [leftWall, rightWall];

    // Create slingshot anchor (visual reference point)
    gameState.anchor = scene.add.circle(
        SLINGSHOT_CONFIG.anchorX,
        SLINGSHOT_CONFIG.anchorY,
        8,
        0x654321
    );

    // Create character (projectile)
    gameState.character = scene.add.circle(
        SLINGSHOT_CONFIG.anchorX,
        SLINGSHOT_CONFIG.anchorY,
        SLINGSHOT_CONFIG.characterRadius,
        0xFF6B6B
    );
    scene.physics.add.existing(gameState.character);
    gameState.character.body.setCircle(SLINGSHOT_CONFIG.characterRadius);
    gameState.character.body.setBounce(0.6, 0.6);
    gameState.character.body.setFriction(0.95, 0.95);
    gameState.character.body.setCollideWorldBounds(true);
    
    // Disable gravity until launched
    gameState.character.body.setAllowGravity(false);

    // Add collisions
    scene.physics.add.collider(gameState.character, gameState.ground);
    scene.physics.add.collider(gameState.character, gameState.walls);

    // Create graphics object for visual feedback
    gameState.graphics = scene.add.graphics();

    // Create trajectory dots
    for (let i = 0; i < SLINGSHOT_CONFIG.trajectoryPoints; i++) {
        const dot = scene.add.circle(0, 0, 3, 0xFFFFFF, 0.6);
        dot.setVisible(false);
        gameState.trajectoryDots.push(dot);
    }

    // Input handling
    scene.input.on('pointerdown', (pointer) => {
        if (gameState.isLaunched) return;

        const distance = Phaser.Math.Distance.Between(
            pointer.x, pointer.y,
            gameState.character.x, gameState.character.y
        );

        // Check if clicking on character
        if (distance < SLINGSHOT_CONFIG.characterRadius + 10) {
            gameState.isDragging = true;
            gameState.dragStart = { x: pointer.x, y: pointer.y };
        }
    });

    scene.input.on('pointermove', (pointer) => {
        if (!gameState.isDragging) return;

        const dx = pointer.x - SLINGSHOT_CONFIG.anchorX;
        const dy = pointer.y - SLINGSHOT_CONFIG.anchorY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Clamp drag distance
        const clampedDistance = Math.min(distance, SLINGSHOT_CONFIG.maxDragDistance);
        const angle = Math.atan2(dy, dx);

        // Position character at clamped distance
        gameState.character.x = SLINGSHOT_CONFIG.anchorX + Math.cos(angle) * clampedDistance;
        gameState.character.y = SLINGSHOT_CONFIG.anchorY + Math.sin(angle) * clampedDistance;

        // Calculate launch vector (opposite direction)
        const launchAngle = angle + Math.PI;
        const power = (clampedDistance / SLINGSHOT_CONFIG.maxDragDistance) * SLINGSHOT_CONFIG.maxPower;
        
        gameState.launchVector = {
            x: Math.cos(launchAngle) * power,
            y: Math.sin(launchAngle) * power,
            angle: launchAngle * (180 / Math.PI),
            power: (clampedDistance / SLINGSHOT_CONFIG.maxDragDistance) * 100
        };

        // Update UI
        updateUI(gameState.launchVector);

        // Draw trajectory prediction
        drawTrajectory(scene);
    });

    scene.input.on('pointerup', () => {
        if (!gameState.isDragging) return;

        gameState.isDragging = false;

        if (gameState.launchVector) {
            // Launch character
            launchCharacter(scene);
        }
    });

    // Reset button handler
    document.getElementById('reset-btn').addEventListener('click', () => {
        resetSlingshot(scene);
    });

    // Initial UI update
    updateUI({ angle: 0, power: 0 });
}

function update() {
    // Clear graphics each frame
    gameState.graphics.clear();

    if (gameState.isDragging) {
        // Draw slingshot bands
        drawSlingshotBands();
    }

    // Check if character has stopped moving after launch
    if (gameState.isLaunched && gameState.character.body) {
        const velocity = gameState.character.body.velocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        
        if (speed < 5) {
            document.getElementById('status-display').textContent = 'Stopped! Click Reset to try again.';
        }
    }
}

/**
 * Draw slingshot bands connecting anchor to character
 */
function drawSlingshotBands() {
    gameState.graphics.lineStyle(SLINGSHOT_CONFIG.bandThickness, SLINGSHOT_CONFIG.bandColor);
    
    // Left band
    gameState.graphics.beginPath();
    gameState.graphics.moveTo(SLINGSHOT_CONFIG.anchorX - 15, SLINGSHOT_CONFIG.anchorY - 20);
    gameState.graphics.lineTo(gameState.character.x, gameState.character.y);
    gameState.graphics.strokePath();

    // Right band
    gameState.graphics.beginPath();
    gameState.graphics.moveTo(SLINGSHOT_CONFIG.anchorX + 15, SLINGSHOT_CONFIG.anchorY - 20);
    gameState.graphics.lineTo(gameState.character.x, gameState.character.y);
    gameState.graphics.strokePath();
}

/**
 * Draw predicted trajectory arc
 */
function drawTrajectory(scene) {
    if (!gameState.launchVector) return;

    const startX = gameState.character.x;
    const startY = gameState.character.y;
    const velocityX = gameState.launchVector.x;
    const velocityY = gameState.launchVector.y;
    const gravity = scene.physics.world.gravity.y;
    const timestep = 0.05;

    for (let i = 0; i < SLINGSHOT_CONFIG.trajectoryPoints; i++) {
        const t = i * timestep;
        
        // Physics prediction: p = p0 + v*t + 0.5*a*t^2
        const x = startX + velocityX * t;
        const y = startY + velocityY * t + 0.5 * gravity * t * t;

        // Apply drag approximation (simplified)
        const dragFactor = Math.pow(0.99, i);
        
        const dot = gameState.trajectoryDots[i];
        dot.setPosition(x * dragFactor, y);
        dot.setVisible(true);

        // Hide dots that go off screen
        if (y > 680 || x < 0 || x > 1280) {
            dot.setVisible(false);
        }
    }
}

/**
 * Launch the character with calculated velocity
 */
function launchCharacter(scene) {
    gameState.isLaunched = true;
    
    // Enable physics
    gameState.character.body.setAllowGravity(true);
    
    // Apply velocity impulse
    gameState.character.body.setVelocity(
        gameState.launchVector.x,
        gameState.launchVector.y
    );

    // Hide trajectory dots
    gameState.trajectoryDots.forEach(dot => dot.setVisible(false));

    // Update UI
    document.getElementById('status-display').textContent = 'Launched!';
    
    // Reset launch vector
    gameState.launchVector = null;
}

/**
 * Reset the slingshot to initial state
 */
function resetSlingshot(scene) {
    // Reset character position
    gameState.character.x = SLINGSHOT_CONFIG.anchorX;
    gameState.character.y = SLINGSHOT_CONFIG.anchorY;
    
    // Reset physics
    gameState.character.body.setVelocity(0, 0);
    gameState.character.body.setAllowGravity(false);
    
    // Reset state
    gameState.isLaunched = false;
    gameState.isDragging = false;
    gameState.launchVector = null;
    
    // Hide trajectory dots
    gameState.trajectoryDots.forEach(dot => dot.setVisible(false));
    
    // Clear graphics
    gameState.graphics.clear();
    
    // Reset UI
    updateUI({ angle: 0, power: 0 });
    document.getElementById('status-display').textContent = 'Click and drag the character!';
}

/**
 * Update UI display elements
 */
function updateUI(vector) {
    const powerPercent = Math.round(vector.power || 0);
    const angle = Math.round(vector.angle || 0);
    
    document.getElementById('power-display').textContent = `Power: ${powerPercent}%`;
    document.getElementById('angle-display').textContent = `Angle: ${angle}°`;
    
    if (vector.power > 0) {
        document.getElementById('status-display').textContent = 'Release to launch!';
    }
}

/**
 * MODULAR EXPORT - SlingshotMechanic Class
 * Use this class to integrate the slingshot mechanic into other games
 */
class SlingshotMechanic {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.config = { ...SLINGSHOT_CONFIG, ...config };
        this.state = {
            isDragging: false,
            isLaunched: false,
            launchVector: null
        };
        this.graphics = scene.add.graphics();
        this.trajectoryDots = [];
        
        this.setupCharacter();
        this.setupInput();
    }

    setupCharacter() {
        this.character = this.scene.add.circle(
            this.config.anchorX,
            this.config.anchorY,
            this.config.characterRadius,
            0xFF6B6B
        );
        this.scene.physics.add.existing(this.character);
        this.character.body.setCircle(this.config.characterRadius);
        this.character.body.setBounce(0.6, 0.6);
        this.character.body.setCollideWorldBounds(true);
        this.character.body.setAllowGravity(false);

        // Create trajectory dots
        for (let i = 0; i < this.config.trajectoryPoints; i++) {
            const dot = this.scene.add.circle(0, 0, 3, 0xFFFFFF, 0.6);
            dot.setVisible(false);
            this.trajectoryDots.push(dot);
        }
    }

    setupInput() {
        this.scene.input.on('pointerdown', (pointer) => this.onPointerDown(pointer));
        this.scene.input.on('pointermove', (pointer) => this.onPointerMove(pointer));
        this.scene.input.on('pointerup', () => this.onPointerUp());
    }

    onPointerDown(pointer) {
        if (this.state.isLaunched) return;

        const distance = Phaser.Math.Distance.Between(
            pointer.x, pointer.y,
            this.character.x, this.character.y
        );

        if (distance < this.config.characterRadius + 10) {
            this.state.isDragging = true;
        }
    }

    onPointerMove(pointer) {
        if (!this.state.isDragging) return;

        const dx = pointer.x - this.config.anchorX;
        const dy = pointer.y - this.config.anchorY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const clampedDistance = Math.min(distance, this.config.maxDragDistance);
        const angle = Math.atan2(dy, dx);

        this.character.x = this.config.anchorX + Math.cos(angle) * clampedDistance;
        this.character.y = this.config.anchorY + Math.sin(angle) * clampedDistance;

        const launchAngle = angle + Math.PI;
        const power = (clampedDistance / this.config.maxDragDistance) * this.config.maxPower;
        
        this.state.launchVector = {
            x: Math.cos(launchAngle) * power,
            y: Math.sin(launchAngle) * power
        };

        this.updateTrajectory();
    }

    onPointerUp() {
        if (!this.state.isDragging) return;
        this.state.isDragging = false;

        if (this.state.launchVector) {
            this.launch();
        }
    }

    launch() {
        this.state.isLaunched = true;
        this.character.body.setAllowGravity(true);
        this.character.body.setVelocity(
            this.state.launchVector.x,
            this.state.launchVector.y
        );
        this.trajectoryDots.forEach(dot => dot.setVisible(false));
    }

    updateTrajectory() {
        if (!this.state.launchVector) return;

        const startX = this.character.x;
        const startY = this.character.y;
        const velocityX = this.state.launchVector.x;
        const velocityY = this.state.launchVector.y;
        const gravity = this.scene.physics.world.gravity.y;
        const timestep = 0.05;

        for (let i = 0; i < this.config.trajectoryPoints; i++) {
            const t = i * timestep;
            const x = startX + velocityX * t;
            const y = startY + velocityY * t + 0.5 * gravity * t * t;

            const dot = this.trajectoryDots[i];
            dot.setPosition(x, y);
            dot.setVisible(y < 680 && x > 0 && x < 1280);
        }
    }

    drawBands() {
        if (!this.state.isDragging) return;

        this.graphics.clear();
        this.graphics.lineStyle(this.config.bandThickness, this.config.bandColor);
        
        this.graphics.beginPath();
        this.graphics.moveTo(this.config.anchorX - 15, this.config.anchorY - 20);
        this.graphics.lineTo(this.character.x, this.character.y);
        this.graphics.strokePath();

        this.graphics.beginPath();
        this.graphics.moveTo(this.config.anchorX + 15, this.config.anchorY - 20);
        this.graphics.lineTo(this.character.x, this.character.y);
        this.graphics.strokePath();
    }

    reset() {
        this.character.x = this.config.anchorX;
        this.character.y = this.config.anchorY;
        this.character.body.setVelocity(0, 0);
        this.character.body.setAllowGravity(false);
        this.state.isLaunched = false;
        this.state.isDragging = false;
        this.state.launchVector = null;
        this.trajectoryDots.forEach(dot => dot.setVisible(false));
        this.graphics.clear();
    }

    update() {
        this.drawBands();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SlingshotMechanic, SLINGSHOT_CONFIG };
}
