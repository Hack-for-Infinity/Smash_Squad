import { createAlienSprite } from './alienSprite.js'
import { createPlayerSprite } from './playerSprite.js'
import { createBossSprite } from './bossSprite.js'

export function createSprites() {
  return {
    alien: createAlienSprite(),
    player: createPlayerSprite(),
    boss: createBossSprite(),
  }
}

