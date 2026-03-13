# Faith Flight Frenzy

A colorful browser-based 2D physics launcher game inspired by catapult distance games.

## Features

- Catapult launch with adjustable angle + power
- Character select menu
- Required account login using account name + password only
- Unlockable characters based on best distance
- Different character physics + one special ability each
- Fictional campus-themed map with obstacles, bounce pads, and distance markers
- Particle effects and procedural sound effects (Web Audio)
- Distance counter and restart run button
- Ranked head-to-head with account-bound progression and rank floors

## Accounts

- Players must create or sign into an account before they can play
- Login uses only an account name and password in the UI
- Ranked progress is bound to the signed-in account, not whatever name is typed into a field

## Ranked Ladder

From lowest to highest, ranked now uses this ladder:

- Airman Basic (AB/E-1)
- Airman (Amn/E-2)
- Airman First Class (A1C/E-3)
- Senior Airman (SrA/E-4)
- Staff Sergeant (SSgt/E-5)
- Technical Sergeant (TSgt/E-6)
- Master Sergeant (MSgt/E-7)
- Senior Master Sergeant (SMSgt/E-8)
- Chief Master Sergeant (CMSgt/E-9)
- Command Chief Master Sergeant (CCM/E-9S)
- Chief Master Sergeant of the Air Force (CMSAF/E-9S)

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
