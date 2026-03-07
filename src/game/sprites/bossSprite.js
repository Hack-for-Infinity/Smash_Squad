import { createPixelSprite } from './pixelSprite.js'

// A larger "mothership" boss.
export function createBossSprite() {
  return createPixelSprite(
    [
      '....PPPPPPPPPP.....',
      '..PPPPPPPPPPPPPP...',
      '.PPPPPPPPPPPPPPPP..',
      'PPPPPPPPPPPPPPPPPP.',
      'PPP..RR....RR..PPP.',
      'PP...RR....RR...PP.',
      'PPPP............PPP',
      'PPPP..PPPPPPPP..PPP',
      'PPPP.PPPPPPPPPP.PPP',
      'PPPP.PP..PP..PP.PPP',
      'PPPP.PP..PP..PP.PPP',
      'PPPP.PPPPPPPPPP.PPP',
      'PPPP..PPPPPPPP..PPP',
      'PPPP............PPP',
      'PPPPPPPPPPPPPPPPPPP',
      '.PPPPPPPPPPPPPPPPPP',
      '..PPPPPPPPPPPPPP...',
      '....PPPPPPPPPP.....',
    ],
    { P: '#a855f7', R: '#ef4444' },
  )
}

