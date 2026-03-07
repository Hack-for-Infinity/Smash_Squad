/**
 * Alien swarm: grid of aliens, shared movement, boundary bounce + drop.
 * Exposes update(dt), draw(ctx), aliens list for collision.
 */

const DEFAULT_SIZE = 20
const DEFAULT_COLS = 10
const DEFAULT_ROWS = 3
const DEFAULT_SPACING_X = 24
const DEFAULT_SPACING_Y = 24
const DEFAULT_SPEED_X = 80
const DEFAULT_DROP = 10
const DEFAULT_BOUNDARY_MARGIN = 15
const START_Y = 60

export function createAlienSwarm(options = {}) {
  const size = options.size ?? DEFAULT_SIZE
  const cols = options.cols ?? DEFAULT_COLS
  const rows = options.rows ?? DEFAULT_ROWS
  const spacingX = options.spacingX ?? DEFAULT_SPACING_X
  const spacingY = options.spacingY ?? DEFAULT_SPACING_Y
  const speedX = options.speedX ?? DEFAULT_SPEED_X
  const drop = options.drop ?? DEFAULT_DROP
  const boundaryMargin = options.boundaryMargin ?? DEFAULT_BOUNDARY_MARGIN

  let width = options.width ?? 640
  let dir = 1
  const aliens = []

  function setBounds(w) {
    width = w ?? width
  }

  function reset() {
    aliens.length = 0
    const totalW = cols * size + (cols - 1) * spacingX
    const startX = (width - totalW) / 2
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        aliens.push({
          x: startX + col * (size + spacingX),
          y: START_Y + row * (size + spacingY),
          w: size,
          h: size,
          alive: true,
        })
      }
    }
  }

  function update(dt) {
    const boundaryLeft = boundaryMargin
    const boundaryRight = width - boundaryMargin
    const living = aliens.filter((a) => a.alive)
    const moveX = (speedX * dir * dt) / 1000

    for (const a of living) {
      a.x += moveX
    }

    let hitEdge = false
    for (const a of living) {
      if (a.x <= boundaryLeft || a.x + a.w >= boundaryRight) hitEdge = true
    }

    if (hitEdge) {
      dir *= -1
      for (const a of living) {
        a.y += drop
        a.x -= moveX
        a.x = Math.max(boundaryLeft, Math.min(boundaryRight - a.w, a.x))
      }
    }
  }

  function draw(ctx) {
    ctx.fillStyle = options.color ?? '#4361ee'
    for (const a of aliens) {
      if (a.alive) ctx.fillRect(a.x, a.y, a.w, a.h)
    }
  }

  function getAlive() {
    return aliens.filter((a) => a.alive)
  }

  setBounds(options.width)
  reset()

  return {
    get aliens() {
      return aliens
    },
    setBounds,
    reset,
    update,
    draw,
    getAlive,
  }
}
