import type { Context } from 'koishi'
import { h } from 'koishi'
import type { Config } from './config'
import { formatDuration, parseDuration } from './utils/duration'

interface MuteCapableBot {
  muteGuildMember(guildId: string, userId: string, duration: number, reason?: string): Promise<void>
}

function resolveTargetId(target?: string): string {
  if (!target || typeof target !== 'string') return ''
  const parts = target.trim().split(':')
  return parts[parts.length - 1] || ''
}

function getMuteMethod(bot: unknown): MuteCapableBot['muteGuildMember'] | undefined {
  const method = (bot as MuteCapableBot | undefined)?.muteGuildMember
  return typeof method === 'function' ? method.bind(bot) : undefined
}

function joinArgs(args: unknown[]): string {
  return args
    .flat()
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ')
}

function describeError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  const message = (error as { message?: unknown } | undefined)?.message
  return typeof message === 'string' && message ? message : String(error)
}

export function registerCommands(ctx: Context, config: Config): void {
  const logger = ctx.logger('qq-ban')

  ctx.command('ban <target:user> <...duration>', { authority: config.minAuthority })
    .action(async ({ session }, target, ...rest) => {
      if (!session) return
      if (!session.guildId) return session.text('qq-ban.not-in-group')

      const targetId = resolveTargetId(target)
      if (!targetId) return session.text('qq-ban.need-target')
      if (targetId === session.userId) return session.text('qq-ban.cannot-ban-self')
      if (targetId === session.bot?.selfId) return session.text('qq-ban.cannot-ban-bot')

      const mute = getMuteMethod(session.bot)
      if (!mute) return session.text('qq-ban.unsupported-adapter')

      const input = joinArgs(rest)
      if (!input) return session.text('qq-ban.missing-duration')

      const parsed = parseDuration(input)
      if (parsed === null) return session.text('qq-ban.invalid-duration', { input })

      const capped = parsed > config.maxDuration
      const seconds = capped ? config.maxDuration : parsed

      try {
        await mute(session.guildId, targetId, seconds * 1000)
      } catch (error) {
        logger.warn('failed to mute %s in %s: %o', targetId, session.guildId, error)
        return session.text('qq-ban.mute-failed', { reason: describeError(error) })
      }

      let duration = formatDuration(session, seconds)
      if (capped) duration += session.text('qq-ban.duration-capped')

      return [h.at(targetId), session.text('qq-ban.banned', { duration })]
    })

  ctx.command('unban <target:user>', { authority: config.minAuthority })
    .action(async ({ session }, target) => {
      if (!session) return
      if (!session.guildId) return session.text('qq-ban.not-in-group')

      const targetId = resolveTargetId(target)
      if (!targetId) return session.text('qq-ban.need-target')

      const mute = getMuteMethod(session.bot)
      if (!mute) return session.text('qq-ban.unsupported-adapter')

      try {
        await mute(session.guildId, targetId, 0)
      } catch (error) {
        logger.warn('failed to unmute %s in %s: %o', targetId, session.guildId, error)
        return session.text('qq-ban.unmute-failed', { reason: describeError(error) })
      }

      return [h.at(targetId), session.text('qq-ban.unbanned')]
    })
}
