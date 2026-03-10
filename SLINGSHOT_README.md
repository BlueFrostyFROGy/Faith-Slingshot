# Slingshot Mechanic - Phaser Implementation

A modular, drag-and-release slingshot mechanic built with Phaser.js, inspired by the Google Garden Gnome game.

## Features

✅ **Drag-and-Release Controls**: Click and drag the character backward to set power and angle  
✅ **Visual Feedback**: Stretched slingshot bands and predicted trajectory arc while dragging  
✅ **Physics Simulation**: Full Phaser arcade physics with gravity, bounce, and friction  
✅ **Power Clamping**: Maximum drag distance and power limits for balanced gameplay  
✅ **Modular Design**: Reusable `SlingshotMechanic` class for integration into larger games  
✅ **Reset Functionality**: Reset button to try again without refreshing

## How to Run

1. Open a terminal in the project directory
2. Run: `npm start`
3. Open browser to: `http://localhost:5500/slingshot-phaser.html`

## How to Play

1. **Click and drag** the red character backward from the anchor point
2. **Watch the trajectory arc** to predict where it will land
3. **Release** to launch with the calculated velocity
4. **Press Reset** to try again

## Mechanic Details

### Power Calculation
- Drag distance is converted to launch power with a configurable multiplier
- Maximum power is clamped at 1200 units
- Maximum drag distance is 200 pixels

### Trajectory Prediction
- Uses physics equations: `p = p0 + v*t + 0.5*a*t^2`
- Shows 30 dots along the predicted path
- Accounts for gravity and simplified drag

### Physics Properties
- Gravity: 800 units/s²
- Bounce coefficient: 0.6
- Friction: 0.95
- Character radius: 25 pixels

## Integration Guide

To use this mechanic in your own game, use the `SlingshotMechanic` class:

```javascript
// In your Phaser scene's create() method
this.slingshot = new SlingshotMechanic(this, {
    anchorX: 200,
    anchorY: 500,
    maxPower: 1200,
    maxDragDistance: 200,
    characterRadius: 25
});

// In your scene's update() method
this.slingshot.update();

// To reset
this.slingshot.reset();
```

## Configuration Options

```javascript
{
    maxPower: 1200,          // Maximum launch power
    powerScale: 2.5,         // Drag distance to power multiplier
    maxDragDistance: 200,    // Max pixels you can drag
    anchorX: 200,            // Slingshot anchor X position
    anchorY: 500,            // Slingshot anchor Y position
    bandColor: 0x8B4513,     // Slingshot band color
    bandThickness: 4,        // Band line thickness
    trajectoryPoints: 30,    // Number of trajectory dots
    characterRadius: 25      // Character size
}
```

## File Structure

- `slingshot-phaser.html` - Main HTML file with UI overlay
- `slingshot-mechanic.js` - Core mechanic implementation with modular class
- Uses Phaser 3.70.0 from CDN

## Technical Implementation

### Input Handling
1. `pointerdown` - Check if clicking on character
2. `pointermove` - Update character position and calculate launch vector
3. `pointerup` - Apply physics impulse and enable gravity

### Visual Feedback
- **Slingshot Bands**: Two lines connecting anchor to character
- **Trajectory Arc**: 30 white dots showing predicted path
- **UI Overlay**: Real-time power percentage and angle display

### Physics Integration
- Character starts with gravity disabled
- On launch, gravity is enabled and velocity impulse is applied
- Phaser handles collisions, bounce, and friction automatically

## Differences from Original Game

This implementation uses:
- Slider-based controls (see `index.html`)
- Manual physics with procedural terrain

The Phaser version uses:
- Drag-and-release controls
- Phaser's built-in arcade physics
- Simpler flat ground

Both are fully functional and can coexist in the same project!
