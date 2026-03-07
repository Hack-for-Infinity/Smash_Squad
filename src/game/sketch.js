/**
 * Game loop: wires player, bullets, aliens; runs separate update loops and draw.
 * Collision and resize stay in sketch for orchestration; entities are modular.
 */

import { InputBus } from '../face/inputBus.jsx'
import { createPlayer } from './player.js'
import { createBulletManager } from './bullet.js'
import { createAlienSwarm } from './alien.js'

const BACKGROUND = '#0a0a12'

function hitTest(b, a) {
  return b.x + b.w > a.x && b.x < a.x + a.w && b.y < a.y + a.h && b.y + b.h > a.y
}

export function initGame(canvas) {
  if (!canvas || !canvas.getContext) return

  const ctx = canvas.getContext('2d')
  let width = canvas.width
  let height = canvas.height
  let animationId = null

  const player = createPlayer({ width, height })
  const bullets = createBulletManager()
  const aliens = createAlienSwarm({ width })

  function resize() {
    width = canvas.width
    height = canvas.height
    player.setBounds(width, height)
    aliens.setBounds(width)
  }

  function updateCollision() {
    for (const b of bullets.bullets) {
      for (const a of aliens.aliens) {
        if (!a.alive) continue
        if (hitTest(b, a)) {
          a.alive = false
          b.y = -999
          break
        }
      }
    }
  }

  function update(dt) {
    player.update(dt, InputBus)
    if (InputBus.isShooting) {
      const config = player.tryShoot()
      if (config) bullets.add(config)
    }
    bullets.update(dt)
    aliens.update(dt)
    updateCollision()
  }

  function draw() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, width, height)
    player.draw(ctx)
    aliens.draw(ctx)
    bullets.draw(ctx)
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
