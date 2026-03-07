/**
 * HUD overlay: draws on top of the game (player health top right, boss health top left).
 */

const BAR_WIDTH = 160
const BAR_HEIGHT = 18
const PADDING = 16
const HEALTH_GREEN = '#2ecc71'
const HEALTH_RED = '#e74c3c'
const BG_FILL = '#333'
const TEXT_COLOR = '#fff'

export function drawHud(ctx, player, width, boss = null) {
  ctx.save()

  const health = player.health
  const maxHealth = player.maxHealth
  const x = width - BAR_WIDTH - PADDING
  const y = PADDING

  ctx.fillStyle = BG_FILL
  ctx.fillRect(x, y, BAR_WIDTH, BAR_HEIGHT)

  const fillW = maxHealth > 0 ? (BAR_WIDTH * health) / maxHealth : 0
  ctx.fillStyle = health > 30 ? HEALTH_GREEN : HEALTH_RED
  ctx.fillRect(x, y, fillW, BAR_HEIGHT)

  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, BAR_WIDTH, BAR_HEIGHT)

  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = TEXT_COLOR
  ctx.fillText(`${Math.max(0, Math.floor(health))} / ${maxHealth}`, x + BAR_WIDTH - 6, y + BAR_HEIGHT / 2)

  if (boss && boss.isAlive()) {
    const bossHealth = boss.health
    const bossMaxHealth = boss.maxHealth
    const bossX = PADDING
    const bossY = PADDING

    ctx.fillStyle = BG_FILL
    ctx.fillRect(bossX, bossY, BAR_WIDTH, BAR_HEIGHT)

    const bossFillW = bossMaxHealth > 0 ? (BAR_WIDTH * bossHealth) / bossMaxHealth : 0
    ctx.fillStyle = HEALTH_RED
    ctx.fillRect(bossX, bossY, bossFillW, BAR_HEIGHT)

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.strokeRect(bossX, bossY, BAR_WIDTH, BAR_HEIGHT)

    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = TEXT_COLOR
    ctx.fillText(`Boss: ${Math.max(0, Math.floor(bossHealth))} / ${bossMaxHealth}`, bossX + 6, bossY + BAR_HEIGHT / 2)
  }

  ctx.restore()
}
