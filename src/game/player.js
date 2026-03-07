/**
 * Player entity: movement from input, bounds clamping, shoot request.
 * Exposes update(dt, inputBus), draw(ctx), tryShoot() for the game loop.
 */

const DEFAULT_SIZE = 24
const DEFAULT_SPEED = 3
const MARGIN_BOTTOM = 20
const DEFAULT_MAX_HEALTH = 100

export function createPlayer(options = {}) {
  const size = options.size ?? DEFAULT_SIZE
  const speed = options.speed ?? DEFAULT_SPEED
  const maxHealth = options.maxHealth ?? DEFAULT_MAX_HEALTH
  let width = options.width ?? 640
  let height = options.height ?? 480

  let health = maxHealth

  const state = {
    x: Math.max(0, (width - size) / 2),
    y: height - size - MARGIN_BOTTOM,
    w: size,
    h: size,
  }

  let lastShotTime = 0
  const fireCooldownMs = options.fireCooldownMs ?? 200

  function setBounds(w, h) {
    width = w
    height = h
    state.x = Math.max(0, Math.min(width - state.w, state.x))
    state.y = height - state.h - MARGIN_BOTTOM
  }

  function update(dt, inputBus) {
    if (inputBus.isLeft) state.x -= speed
    if (inputBus.isRight) state.x += speed
    state.x = Math.max(0, Math.min(width - state.w, state.x))
    state.y = height - state.h - MARGIN_BOTTOM
  }

  function draw(ctx) {
    const sprite = options.sprite ?? null
    if (sprite) {
      sprite.draw(ctx, state.x, state.y, state.w, state.h)
      return
    }
    ctx.fillStyle = options.color ?? '#e63946'
    ctx.fillRect(state.x, state.y, state.w, state.h)
  }

  function takeDamage(amount) {
    health = Math.max(0, health - amount)
  }

  function isAlive() {
    return health > 0
  }

  function tryShoot() {
    const now = performance.now()
    if (now - lastShotTime < fireCooldownMs) return null
    lastShotTime = now
    return {
      x: state.x + state.w / 2 - (options.bulletSize ?? 4) / 2,
      y: state.y,
      w: options.bulletSize ?? 4,
      h: (options.bulletSize ?? 4) + 8,
      vy: options.bulletSpeed ?? -450,
    }
  }

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
    tryShoot,
    takeDamage,
    isAlive,
  }
}
