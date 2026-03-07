import { createPixelSprite } from './pixelSprite.js'

// Retro "space invader" style alien.
export function createAlienSprite() {
  return createPixelSprite(
    [
      '..GG..GG..',
      '.GGGGGGGG.',
      'GG.GGGG.GG',
      'GGGGGGGGGG',
      '.G.G..G.G.',
      '..G....G..',
      '.G..GG..G.',
      'G........G',
    ],
    { G: '#34d399' },
  )
}

