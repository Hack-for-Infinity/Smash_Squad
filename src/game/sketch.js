/**
 * Retro Alien Shooter – gameplay loop
 * Uses InputBus from face/inputBus.jsx: isLeft, isRight (movement), isShooting (fire)
 * Player = red square, Aliens = blue squares
 */

import { InputBus } from '../face/inputBus.jsx'

const PLAYER_SIZE = 24
const PLAYER_SPEED = 5
const ALIEN_SIZE = 20
const ALIEN_COLS = 10
const ALIEN_ROWS = 3
const spacingX = 24
const spacingY = 24
const ALIEN_SPEED_X = 80// pixels per second
const ALIEN_DROP = 10
const BOUNDARY_MARGIN = 15
const BULLET_SPEED = -8
const BULLET_SIZE = 4
const FIRE_COOLDOWN_MS = 200

export function initGame(canvas) {
  if (!canvas || !canvas.getContext) return

  const ctx = canvas.getContext('2d')
  let width = canvas.width
  let height = canvas.height
  let animationId = null

  // Player (red square) at bottom center
  const player = {
    x: (width - PLAYER_SIZE) / 2,
    y: height - PLAYER_SIZE - 20,
    w: PLAYER_SIZE,
    h: PLAYER_SIZE,
  }

  // Aliens (blue squares) in a grid
  function createAliens() {
    const aliens = []
    const totalW = ALIEN_COLS * ALIEN_SIZE + (ALIEN_COLS - 1) * spacingX
    const startX = (width - totalW) / 2
    const startY = 60

    for (let row = 0; row < ALIEN_ROWS; row++) {
      for (let col = 0; col < ALIEN_COLS; col++) {
        aliens.push({
          x: startX + col * (ALIEN_SIZE + spacingX),
          y: startY + row * (ALIEN_SIZE + spacingY),
          w: ALIEN_SIZE,
          h: ALIEN_SIZE,
          alive: true,
        })
      }
    }
    return aliens
  }

  let aliens = createAliens()
  let alienDir = 1

  let bullets = []
  let lastShotTime = 0

  function resize() {
    width = canvas.width
    height = canvas.height
    player.x = Math.max(0, Math.min(width - PLAYER_SIZE, player.x))
    player.y = height - PLAYER_SIZE - 20
  }

  function shoot() {
    const now = performance.now()
    if (now - lastShotTime < FIRE_COOLDOWN_MS) return
    lastShotTime = now
    bullets.push({
      x: player.x + player.w / 2 - BULLET_SIZE / 2,
      y: player.y,
      w: BULLET_SIZE,
      h: BULLET_SIZE + 8,
      vy: BULLET_SPEED,
    })
  }

  function update(dt) {
    // Player movement from InputBus
    if (InputBus.isLeft) player.x -= PLAYER_SPEED
    if (InputBus.isRight) player.x += PLAYER_SPEED
    player.x = Math.max(0, Math.min(width - player.w, player.x))

    if (InputBus.isShooting) shoot()

    // Bullets
    bullets = bullets.filter((b) => {
      b.y += b.vy
      return b.y > -b.h
    })

    // Alien movement: smooth time-based (millis/dt), reverse and drop when hitting boundary
    const boundaryLeft = BOUNDARY_MARGIN
    const boundaryRight = width - BOUNDARY_MARGIN
    const living = aliens.filter((a) => a.alive)
    const moveX = (ALIEN_SPEED_X * alienDir * dt) / 1000
    for (const a of living) {
      a.x += moveX
    }
    let hitEdge = false
    for (const a of living) {
      if (a.x <= boundaryLeft || a.x + a.w >= boundaryRight) hitEdge = true
    }
    if (hitEdge) {
      alienDir *= -1
      for (const a of living) {
        a.y += ALIEN_DROP
        a.x -= moveX
        a.x = Math.max(boundaryLeft, Math.min(boundaryRight - a.w, a.x))
      }
    }

    // Bullet–alien collision
    for (const b of bullets) {
      for (const a of aliens) {
        if (!a.alive) continue
        if (
          b.x + b.w > a.x &&
          b.x < a.x + a.w &&
          b.y < a.y + a.h &&
          b.y + b.h > a.y
        ) {
          a.alive = false
          b.y = -999
          break
        }
      }
    }
    bullets = bullets.filter((b) => b.y > -100)
  }

  function draw() {
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(0, 0, width, height)

    // Player – red square
    ctx.fillStyle = '#e63946'
    ctx.fillRect(player.x, player.y, player.w, player.h)

    // Aliens – blue squares
    ctx.fillStyle = '#4361ee'
    for (const a of aliens) {
      if (a.alive) ctx.fillRect(a.x, a.y, a.w, a.h)
    }

    // Bullets
    ctx.fillStyle = '#f4a261'
    for (const b of bullets) {
      ctx.fillRect(b.x, b.y, b.w, b.h)
    }
  }

  let lastTime = performance.now()
  function loop(now) {
    const dt = now - lastTime
    lastTime = now
    resize()
    update(dt)
    draw()
    animationId = requestAnimationFrame(loop)
  }

  function start() {
    lastTime = performance.now()
    animationId = requestAnimationFrame(loop)
  }

  function stop() {
    if (animationId != null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  start()
  return { start, stop, resize }
}
