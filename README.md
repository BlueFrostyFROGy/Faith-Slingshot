# Faith Flight Frenzy

A colorful browser-based 2D physics launcher game inspired by catapult distance games.

## Features

- Catapult launch with adjustable angle + power
- Character select menu
- Unlockable characters based on best distance
- Different character physics + one special ability each
- Fictional campus-themed map with obstacles, bounce pads, and distance markers
- Particle effects and procedural sound effects (Web Audio)
- Distance counter and restart run button

## Characters

- Manning — balanced, speed burst
- Hunter — lighter, spin boost
- Anthony — heavier, slam ability
- Nate — chaos blink

## Notes on character images

The game now prefers PNG character files (with JPG fallback). It loads local files from:

- assets/images/manning.png
- assets/images/hunter.png
- assets/images/anthony.png
- assets/images/nate.png

If those files are missing or invalid, the game automatically falls back to colorful initials.

## Run locally

1. Start a local server:
   - `npm start`
2. Open:
   - http://localhost:5500

## Controls

- Set angle and power with sliders
- Click Launch
- Press Space once mid-run to trigger the selected character’s special ability
- Click Restart Run to relaunch
