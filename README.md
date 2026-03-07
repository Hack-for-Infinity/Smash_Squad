# FaceController — Accessible Game Input System

## What It Is
A universal accessible input layer that lets anyone control a game using only their face. Built for people with motor disabilities like Cerebral Palsy who cannot use a keyboard or controller.

---

## System Architecture

### The Three Layers
```
FaceTracker.js  →  InputBus.js  →  sketch.js
reads webcam       shared state     reads state
writes to bus      isLeft           moves player
                   isRight          fires bullets
                   isShooting
```

### InputBus.js
The backbone of the system. A plain shared object with one job — hold current input state. Nothing imports each other directly except through InputBus.

- FaceTracker writes to it
- Game reads from it
- They never talk to each other directly

Swap FaceTracker for voice control, eye tracking, or physical switch input tomorrow — the game never changes a line.

### FaceTracker.js
Single responsibility — translate raw face coordinates into InputBus values.

Two key processing steps:

**Input Smoothing**
```js
smoothX = smoothX * 0.6 + rawX * 0.4
```
Blends 60% previous position with 40% new position every frame. Absorbs camera jitter and micro-tremors without adding noticeable lag.

**Dead Zone**
```js
if (smoothX < 0.5 - deadZone) InputBus.isLeft = true
else if (smoothX > 0.5 + deadZone) InputBus.isRight = true
```
Neutral zone in centre means involuntary head movements don't register as input. Critical for CP users with tremors.

### sketch.js (Game)
Pure p5.js game loop. Zero knowledge that a face tracker exists. Reads three booleans from InputBus every frame.
```js
if (InputBus.isLeft)     player.x -= speed
if (InputBus.isRight)    player.x += speed
if (InputBus.isShooting) maybeShoot()
```
Three lines. That is the entire connection between a human face and a game.

---

## Key Design Decisions

**Dead Zone**
Any nose position within `0.5 ± deadZone` registers as no input. Prevents involuntary tremors from triggering movement — directly addresses CP users who cannot hold perfectly still.

**Input Smoothing**
Raw MediaPipe output fluctuates frame to frame even when the user is still. Smoothing absorbs these micro-fluctuations without adding lag.

**Frame Reset**
Every frame resets all inputs to false before setting new ones. Guarantees mutual exclusivity — isLeft and isRight can never both be true simultaneously.

**Shot Cooldown**
Prevents bullet spam from a held-open mouth. Without this a user whose mouth rests slightly open fires 60 bullets per second. Cooldown makes shooting intentional.

**Calibration**
Press `C` to reset neutral position to your current head position. Accounts for users who naturally hold their head slightly off-centre.

**Primitive Drawing**
Aliens and ships drawn with p5 rect() and vertex() calls instead of PNG files. Zero asset pipeline, zero loading time, zero image processing overhead. Game starts instantly.

**InputBus Pattern**
Decouples input source from game logic entirely. The input method is irrelevant — the game doesn't care how you control it.

---

## Scalability

| Swap this | Change this | Touch this |
|---|---|---|
| Input method | FaceTracker only | Nothing else |
| Game | sketch.js only | Nothing else |
| Add new input source | New writer to InputBus | Nothing else |
| Add new game | New reader of InputBus | Nothing else |

---

## Tech Stack
- React — UI layer
- p5.js — game rendering
- MediaPipe FaceMesh — face landmark detection
- Vite — build tool

Runs entirely on device. No API calls. No data leaves the browser. No internet dependency during gameplay.

---

## How To Run
```bash
npm install
npm run dev
```
Open `localhost:5173`. Allow camera access. Tilt your face to move. Open your mouth to shoot.

Press `C` to recalibrate neutral position to your face.