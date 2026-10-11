import type { Session } from 'koishi'

// 解析表
const UNIT_SECONDS: Record<string, number> = {
  s: 1, sec: 1, secs: 1, second: 1, seconds: 1,
  秒: 1, 秒钟: 1,

  m: 60, min: 60, mins: 60, minute: 60, minutes: 60,
  分: 60, 分钟: 60,

  h: 3600, hr: 3600, hrs: 3600, hour: 3600, hours: 3600,
  时: 3600, 小时: 3600, 个小时: 3600,

  d: 86400, day: 86400, days: 86400,
  天: 86400, 日: 86400,

  w: 604800, week: 604800, weeks: 604800,
  周: 604800, 星期: 604800, 礼拜: 604800,

  mo: 2592000, month: 2592000, months: 2592000,
  月: 2592000, 个月: 2592000,

  y: 31536000, yr: 31536000, yrs: 31536000, year: 31536000, years: 31536000,
  年: 31536000,
}

// 一个时间片段
const SEGMENT = /(\d+(?:\.\d+)?)\s*([a-z]+|[\u4e00-\u9fff]+)/gi

const SEPARATOR = /^[\s,，、/·+]*$/

// 中文数字映射表
const CN_DIGITS: Record<string, number> = {
  一: 1, 两: 2, 二: 2, 三: 3, 四: 4, 五: 5,
  六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
}

function normalizeText(text: string): string {
  return text
    // "1 hour and 30 minutes"
    .replace(/\band\b/g, ' ')
    // "十分钟" -> "10分钟"、"两小时" -> "2小时"
    .replace(/([一两二三四五六七八九十])\s*(?=[a-z]|[\u4e00-\u9fff])/g, (_, char: string) => String(CN_DIGITS[char]))
    // "半小时" -> "0.5小时"
    .replace(/半\s*(?=[a-z]|[\u4e00-\u9fff])/g, '0.5')
    // "1小时零30分" -> "1小时30分"
    .replace(/零/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function toSeconds(value: number): number | null {
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.round(value)
}

// 解析人类可读的时长，返回秒数；无法识别时返回 `null`
export function parseDuration(input: string): number | null {
  const text = normalizeText(String(input ?? '').trim().toLowerCase())
  if (!text) return null

  // 不带单位时按秒处理
  if (/^\d+(?:\.\d+)?$/.test(text)) return toSeconds(Number(text))

  let total = 0
  let cursor = 0
  let matched = false
  SEGMENT.lastIndex = 0
  let segment: RegExpExecArray | null
  while ((segment = SEGMENT.exec(text))) {
    // 两个片段之间只能是分隔符，否则说明混进了无法识别的内容
    if (!SEPARATOR.test(text.slice(cursor, segment.index))) return null
    const scale = UNIT_SECONDS[segment[2]]
    if (scale === undefined) return null
    total += Number(segment[1]) * scale
    cursor = SEGMENT.lastIndex
    matched = true
  }
  if (!matched || !SEPARATOR.test(text.slice(cursor))) return null
  return toSeconds(total)
}

const DURATION_UNITS: Array<[number, string]> = [
  [86400, 'day'],
  [3600, 'hour'],
  [60, 'minute'],
  [1, 'second'],
]

// 把秒数换成最大可整除的单位来展示
export function formatDuration(session: Session, seconds: number): string {
  for (const [size, unit] of DURATION_UNITS) {
    if (seconds >= size && seconds % size === 0) {
      return session.text(`qq-ban.duration-${unit}`, { count: seconds / size })
    }
  }
  return session.text('qq-ban.duration-second', { count: seconds })
}
