/**
 * Boss entity: moves horizontally, has health, fires 3 bullets at the player.
 * Bullets move toward player position at fire time; update/draw and expose list for collision.
 */

const DEFAULT_SIZE = 48
const BULLET_SIZE = 8
const BULLET_SPEED_PX_PER_SEC = 280
const FIRE_INTERVAL_MS = 2000
const MARGIN_TOP = 40
const DEFAULT_MAX_HEALTH = 200
const MOVE_SPEED_PX_PER_SEC = 120

export function createBoss(options = {}) {
  const size = options.size ?? DEFAULT_SIZE
  const bulletSpeed = options.bulletSpeed ?? BULLET_SPEED_PX_PER_SEC
  const fireIntervalMs = options.fireIntervalMs ?? FIRE_INTERVAL_MS
  const maxHealth = options.maxHealth ?? DEFAULT_MAX_HEALTH
  const moveSpeed = options.moveSpeed ?? MOVE_SPEED_PX_PER_SEC
  let width = options.width ?? 640

  let health = maxHealth
  let dir = 1

  const state = {
    x: (width - size) / 2,
    y: MARGIN_TOP,
    w: size,
    h: size,
  }

  const bossBullets = []
  let lastFireTime = 0

  function setBounds(w) {
    width = w ?? width
    state.x = Math.max(0, Math.min(width - state.w, state.x))
  }

  function takeDamage(amount) {
    health = Math.max(0, health - amount)
  }

  function isAlive() {
    return health > 0
  }

  function aimAt(playerX, playerY) {
    const cx = state.x + state.w / 2
    const cy = state.y + state.h
    const dx = playerX + 12 - cx
    const dy = playerY - cy
    const len = Math.hypot(dx, dy) || 1
    const vx = (dx / len) * bulletSpeed
    const vy = (dy / len) * bulletSpeed
    return { vx, vy }
  }

  function fireAt(playerX, playerY) {
    const { vx, vy } = aimAt(playerX, playerY)
    const bx = state.x + state.w / 2 - BULLET_SIZE / 2
    const by = state.y + state.h
    bossBullets.push({
      x: bx,
      y: by,
      w: BULLET_SIZE,
      h: BULLET_SIZE,
      vx,
      vy,
    })
  }

  function update(dt, playerX, playerY) {
    const moveX = (moveSpeed * dir * dt) / 1000
    state.x += moveX
    if (state.x <= 0 || state.x + state.w >= width) {
      dir *= -1
      state.x = Math.max(0, Math.min(width - state.w, state.x))
    }
    const now = performance.now()
    if (now - lastFireTime >= fireIntervalMs) {
      lastFireTime = now
      fireAt(playerX, playerY)
      fireAt(playerX + 15, playerY)
      fireAt(playerX - 15, playerY)
    }
    for (const b of bossBullets) {
      b.x += (b.vx * dt) / 1000
      b.y += (b.vy * dt) / 1000
    }
    for (let i = bossBullets.length - 1; i >= 0; i--) {
      const b = bossBullets[i]
      if (b.y > 600 || b.y < -50 || b.x < -50 || b.x > width + 50) {
        bossBullets.splice(i, 1)
      }
    }
  }

  function draw(ctx) {
    const sprite = options.sprite ?? null
    if (sprite) {
      sprite.draw(ctx, state.x, state.y, state.w, state.h)
    } else {
      ctx.fillStyle = options.color ?? '#9b59b6'
      ctx.fillRect(state.x, state.y, state.w, state.h)
    }
    ctx.fillStyle = options.bulletColor ?? '#e74c3c'
    for (const b of bossBullets) {
      ctx.fillRect(b.x, b.y, b.w, b.h)
    }
  }

  function getBullets() {
    return bossBullets
  }

  setBounds(options.width)

  return {
    get state() {
      return state
    },
    get health() {
      return health
    },
    get maxHealth() {
      return maxHealth
    },
    setBounds,
    update,
    draw,
    getBullets,
    takeDamage,
    isAlive,
  }
}
