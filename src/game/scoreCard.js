/**
 * Score card: draws the current score in the center-top of the game canvas.
 */

const PADDING = 16
const FONT = 'bold 18px sans-serif'
const TEXT_COLOR = '#fff'
const LABEL = 'SCORE: '

export function drawScoreCard(ctx, width, score) {
  ctx.save()
  ctx.font = FONT
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillStyle = TEXT_COLOR
  ctx.fillText(LABEL + score, width / 2, PADDING)
  ctx.restore()
}
