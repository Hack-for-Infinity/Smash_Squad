/**
 * Bullet entity and manager: list of bullets, per-bullet update/draw.
 * Velocity is in pixels per second; update uses dt so speed is frame-rate independent.
 */

const DEFAULT_SPEED_PX_PER_SEC = -450

export function createBulletManager(options = {}) {
  const bullets = []
  const defaultVy = options.speed ?? DEFAULT_SPEED_PX_PER_SEC

  function add(config) {
    bullets.push({
      x: config.x,
      y: config.y,
      w: config.w ?? 4,
      h: config.h ?? 12,
      vy: config.vy ?? defaultVy,
    })
  }

  function update(dt) {
    for (const b of bullets) {
      b.y += (b.vy * dt) / 1000
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].y < -bullets[i].h) bullets.splice(i, 1)
    }
  }

  function draw(ctx) {
    ctx.fillStyle = options.color ?? '#f4a261'
    for (const b of bullets) {
      ctx.fillRect(b.x, b.y, b.w, b.h)
    }
  }

  return {
    get bullets() {
      return bullets
    },
    add,
    update,
    draw,
  }
}
