import type { Context } from 'koishi'
import { Config } from './config'
import { localePacks } from './i18n'
import { registerCommands } from './commands'

export const name = 'qq-ban'

export { Config }

export function apply(ctx: Context, config: Config): void {
  for (const [locale, pack] of Object.entries(localePacks)) {
    ctx.i18n.define(locale, pack)
  }

  // 只处理 QQ 官方机器人
  registerCommands(ctx.platform('qq'), config)
}
