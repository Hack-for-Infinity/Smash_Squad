/**
 * Defeat card: overlay shown when the player loses (aliens reach player or HP zero in boss fight).
 */

const OVERLAY = 'rgba(0,0,0,0.7)'
const TITLE = 'DEFEAT'
const SUBTITLE = 'GAME OVER'
const FONT_TITLE = 'bold 56px sans-serif'
const FONT_SUB = '24px sans-serif'
const TITLE_COLOR = '#e74c3c'
const TEXT_COLOR = '#fff'

export function drawDefeatCard(ctx, width, height) {
  ctx.save()
  ctx.fillStyle = OVERLAY
  ctx.fillRect(0, 0, width, height)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = TITLE_COLOR
  ctx.font = FONT_TITLE
  ctx.fillText(TITLE, width / 2, height / 2 - 30)
  ctx.fillStyle = TEXT_COLOR
  ctx.font = FONT_SUB
  ctx.fillText(SUBTITLE, width / 2, height / 2 + 20)
  ctx.restore()
}
