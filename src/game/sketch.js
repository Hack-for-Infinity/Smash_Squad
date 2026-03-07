/**
 * Game loop: wires player, bullets, aliens; runs separate update loops and draw.
 * Collision and resize stay in sketch for orchestration; entities are modular.
 */

import { InputBus } from '../face/inputBus.jsx'
import { createPlayer } from './player.js'
import { createBulletManager } from './bullet.js'
import { createAlienSwarm } from './alien.js'
import { createBoss } from './boss.js'
import { createSprites } from './sprites/index.js'
import { drawHud } from './drawHud.js'
import { drawScoreCard } from './scoreCard.js'
import { drawDefeatCard } from './defeatCard.js'
import { drawCongratulationsCard } from './congratulationsCard.js'

const BACKGROUND = '#0a0a12'
const SCORE_PER_ALIEN = 1
const BOSS_INCOMING_DURATION_MS = 3000
const BOSS_DAMAGE_PER_HIT = 10
const PLAYER_BULLET_DAMAGE_TO_BOSS = 10

function hitTest(b, a) {
  return b.x + b.w > a.x && b.x < a.x + a.w && b.y < a.y + a.h && b.y + b.h > a.y
}

export function initGame(canvas) {
  if (!canvas || !canvas.getContext) return

  const ctx = canvas.getContext('2d')
  if (ctx) ctx.imageSmoothingEnabled = false
  let width = canvas.width
  let height = canvas.height
  let animationId = null

  const sprites = createSprites()
  const player = createPlayer({ width, height, sprite: sprites.player })
  const bullets = createBulletManager()
  const aliens = createAlienSwarm({ width, sprite: sprites.alien })

  let phase = 'aliens'
  let bossIncomingStart = 0
  let boss = null
  let score = 0

  function resize() {
    width = canvas.width
    height = canvas.height
    player.setBounds(width, height)
    aliens.setBounds(width)
    if (boss) boss.setBounds(width)
  }

  function updateBossBulletsVsPlayer() {
    if (!boss || !player.isAlive()) return
    const bossBullets = boss.getBullets()
    for (let i = bossBullets.length - 1; i >= 0; i--) {
      const b = bossBullets[i]
      if (hitTest(b, player.state)) {
        player.takeDamage(BOSS_DAMAGE_PER_HIT)
        bossBullets.splice(i, 1)
      }
    }
  }

  function updatePlayerBulletsVsBoss() {
    if (!boss || !boss.isAlive()) return
    for (const b of bullets.bullets) {
      if (hitTest(b, boss.state)) {
        boss.takeDamage(PLAYER_BULLET_DAMAGE_TO_BOSS)
        b.y = -999
        break
      }
    }
  }

  function updateCollision() {
    for (const b of bullets.bullets) {
      for (const a of aliens.aliens) {
        if (!a.alive) continue
        if (hitTest(b, a)) {
          a.alive = false
          score += SCORE_PER_ALIEN
          b.y = -999
          break
        }
      }
    }
  }

  function aliensReachedPlayer() {
    const playerY = player.state.y
    for (const a of aliens.getAlive()) {
      if (a.y + a.h >= playerY) return true
    }
    return false
  }

  function update(dt) {
    if (phase === 'defeat' || phase === 'victory') return
    if (!player.isAlive() && phase === 'boss') {
      phase = 'defeat'
      return
    }
    if (phase === 'aliens') {
      player.update(dt, InputBus)
      if (InputBus.isShooting) {
        const config = player.tryShoot()
        if (config) bullets.add(config)
      }
      bullets.update(dt)
      aliens.update(dt)
      updateCollision()
      if (aliensReachedPlayer()) {
        phase = 'defeat'
        return
      }
      if (aliens.getAlive().length === 0) {
        phase = 'boss_incoming'
        bossIncomingStart = performance.now()
      }
    } else if (phase === 'boss_incoming') {
      if (performance.now() - bossIncomingStart >= BOSS_INCOMING_DURATION_MS) {
        phase = 'boss'
        boss = createBoss({ width, sprite: sprites.boss })
        bullets.bullets.splice(0, bullets.bullets.length)
      }
      player.update(dt, InputBus)
    } else if (phase === 'boss') {
      player.update(dt, InputBus)
      if (InputBus.isShooting) {
        const config = player.tryShoot()
        if (config) bullets.add(config)
      }
      bullets.update(dt)
      if (boss.isAlive()) {
        boss.update(dt, player.state.x, player.state.y)
        updateBossBulletsVsPlayer()
      }
      updatePlayerBulletsVsBoss()
      if (!player.isAlive()) phase = 'defeat'
      else if (!boss.isAlive()) phase = 'victory'
    }
  }

  function drawBossIncomingMessage() {
    const elapsed = performance.now() - bossIncomingStart
    const sec = Math.ceil((BOSS_INCOMING_DURATION_MS - elapsed) / 1000)
    ctx.save()
    ctx.font = 'bold 42px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#e74c3c'
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 4
    ctx.strokeText('BOSS INCOMING!', width / 2, height / 2 - 20)
    ctx.fillText('BOSS INCOMING!', width / 2, height / 2 - 20)
    ctx.font = '28px sans-serif'
    ctx.fillStyle = '#fff'
    ctx.fillText(sec > 0 ? `${sec}...` : '!', width / 2, height / 2 + 30)
    ctx.restore()
  }

  function draw() {
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, width, height)
    player.draw(ctx)
    aliens.draw(ctx)
    bullets.draw(ctx)
    if (phase === 'boss_incoming') drawBossIncomingMessage()
    else if (phase === 'boss' && boss && boss.isAlive()) boss.draw(ctx)
    drawHud(ctx, player, width, boss)
    drawScoreCard(ctx, width, score)
    if (phase === 'defeat') drawDefeatCard(ctx, width, height)
    if (phase === 'victory') drawCongratulationsCard(ctx, width, height)
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
