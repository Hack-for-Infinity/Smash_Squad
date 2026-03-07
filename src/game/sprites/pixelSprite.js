export function createPixelSprite(pixels, palette) {
  const h = pixels.length
  const w = Math.max(0, ...pixels.map((row) => row.length))
  const normalized = pixels.map((row) => (row.length === w ? row : row.padEnd(w, '.')))

  return {
    width: w,
    height: h,
    draw(ctx, x, y, drawW, drawH) {
      if (!ctx) return

      // Integer scale keeps crisp "pixels" even under CSS scaling.
      const scale = Math.max(1, Math.floor(Math.min(drawW / w, drawH / h)))
      const outW = w * scale
      const outH = h * scale
      const ox = Math.floor(x + (drawW - outW) / 2)
      const oy = Math.floor(y + (drawH - outH) / 2)

      for (let py = 0; py < h; py++) {
        const row = normalized[py]
        for (let px = 0; px < w; px++) {
          const key = row[px]
          if (key === '.' || key === ' ') continue
          const color = palette[key]
          if (!color) continue
          ctx.fillStyle = color
          ctx.fillRect(ox + px * scale, oy + py * scale, scale, scale)
        }
      }
    },
  }
}

