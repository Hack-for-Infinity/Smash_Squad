/**
 * Congratulations card: overlay shown when the player defeats the boss.
 */

const OVERLAY = 'rgba(0,0,0,0.6)'
const TITLE = 'CONGRATULATIONS!'
const SUBTITLE = 'YOU DEFEATED THE BOSS'
const FONT_TITLE = 'bold 42px sans-serif'
const FONT_SUB = '22px sans-serif'
const TITLE_COLOR = '#2ecc71'
const TEXT_COLOR = '#fff'

export function drawCongratulationsCard(ctx, width, height) {
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
