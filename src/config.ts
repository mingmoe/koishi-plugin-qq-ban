import { Schema } from 'koishi'

export interface Config {
  // 所需最低权限等级
  minAuthority: number
  // 允许的最大禁言时长 单位秒  QQ 官方限制为 30 天。
  maxDuration: number
}

export const Config: Schema<Config> = Schema.object({
  minAuthority: Schema.natural().default(3).description('调用 ban / unban 所需的最低权限等级。'),
  maxDuration: Schema.natural().default(2592000).description('允许的最大禁言时长（秒），QQ 官方限制为 30 天。请求超过该值时按该值禁言。'),
}).description('QQ 群禁言插件配置。') as Schema<Config>
