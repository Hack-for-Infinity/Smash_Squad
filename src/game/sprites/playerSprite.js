import { createPixelSprite } from './pixelSprite.js'

// Retro cannon / ship.
export function createPlayerSprite() {
  return createPixelSprite(
    [
      '.....WW.....',
      '....WWWW....',
      '...WWWWWW...',
      '..WWW..WWW..',
      '.WWWWWWWWWW.',
      'WWWWWWWWWWWW',
      'WWWWWWWWWWWW',
      'WWW.WWWW.WWW',
      '..W..WW..W..',
      '....WWWW....',
      '...WW..WW...',
      '..WW....WW..',
    ],
    { W: '#e5e7eb', G: '#38bdf8' },
  )
}

