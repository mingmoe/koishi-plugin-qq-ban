var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  name: () => name
});
module.exports = __toCommonJS(src_exports);

// src/config.ts
var import_koishi = require("koishi");
var Config = import_koishi.Schema.object({
  minAuthority: import_koishi.Schema.natural().default(3).description("调用 ban / unban 所需的最低权限等级。"),
  maxDuration: import_koishi.Schema.natural().default(2592e3).description("允许的最大禁言时长（秒），QQ 官方限制为 30 天。请求超过该值时按该值禁言。")
}).description("QQ 群禁言插件配置。");

// src/locales/zh-CN.yml
var zh_CN_default = { commands: { ban: { description: "禁言群成员", usage: "禁言指定的群成员。需要机器人已经拥有该群的管理员权限。\n时长支持中英文常见写法与多段累加，例如 600（秒）、10分钟、1小时30分、1d2h、1 day。\n超出平台允许的最长禁言时长时，按最长时长处理。", examples: "ban @某人 10分钟\nban @某人 600\nban @某人 1小时30分\nban @某人 2h\nban @某人 1 day", arguments: { target: "要禁言的成员，可以直接 @ 该成员", duration: "禁言时长，如 600 / 10分钟 / 1h30m / 1 day" } }, unban: { description: "解除群成员禁言", usage: "解除指定群成员的禁言。", examples: "unban @某人", arguments: { target: "要解禁的成员，可以直接 @ 该成员" } } }, "qq-ban": { "language-name": "简体中文", "not-in-group": "该指令只能在群聊中使用。", "need-target": "请 @ 要操作的对象，或直接提供用户 ID。", "cannot-ban-self": "不能对自己执行这个操作。", "cannot-ban-bot": "不能对机器人执行这个操作。", "unsupported-adapter": "当前适配器没有提供禁言接口，请确认已启用支持群禁言的 QQ 官方机器人适配器（如 adapter-qq-crack）。", "missing-duration": "请提供禁言时长，例如 `10分钟`、`1h30m`、`1 day`。", "invalid-duration": "无法识别的时长：{input}。可以写 `600`（秒）、`10分钟`、`1小时30分`、`2h`、`1 day` 这类写法。", "mute-failed": "禁言失败：{reason}", "unmute-failed": "解除禁言失败：{reason}", banned: " 已被禁言，时长 {duration}。", unbanned: " 的禁言已解除。", "duration-day": "{count} 天", "duration-hour": "{count} 小时", "duration-minute": "{count} 分钟", "duration-second": "{count} 秒", "duration-capped": "（超出平台上限，已按最长时长处理）" } };

// src/locales/en-US.yml
var en_US_default = { commands: { ban: { description: "Mute a group member", usage: "Mute the given group member. The bot needs to be an administrator of the group.\nThe duration accepts common English and Chinese forms, and segments add up,\ne.g. 600 (seconds), 10m, 1h30m, 1 hour and 30 minutes, 2 days.\nRequests longer than the platform limit are capped at that limit.", examples: "ban @someone 10m\nban @someone 600\nban @someone 1h30m\nban @someone 1 day", arguments: { target: "The member to mute, you can simply @ them", duration: "Mute duration, e.g. 600 / 10m / 1h30m / 1 day" } }, unban: { description: "Unmute a group member", usage: "Lift the mute of the given group member.", examples: "unban @someone", arguments: { target: "The member to unmute, you can simply @ them" } } }, "qq-ban": { "language-name": "English", "not-in-group": "This command can only be used in a group.", "need-target": "Please @ the member to operate on, or provide a user ID directly.", "cannot-ban-self": "You cannot do this to yourself.", "cannot-ban-bot": "You cannot do this to the bot.", "unsupported-adapter": "The current adapter does not provide a mute interface. Please make sure a QQ official bot adapter with group mute support (e.g. adapter-qq-crack) is enabled.", "missing-duration": "Please provide a duration, e.g. `10m`, `1h30m` or `1 day`.", "invalid-duration": "Unrecognized duration: {input}. Try `600` (seconds), `10m`, `1h30m`, `1 hour and 30 minutes` or `1 day`.", "mute-failed": "Failed to mute: {reason}", "unmute-failed": "Failed to unmute: {reason}", banned: " has been muted for {duration}.", unbanned: " has been unmuted.", "duration-day": "{count} day(s)", "duration-hour": "{count} hour(s)", "duration-minute": "{count} minute(s)", "duration-second": "{count} second(s)", "duration-capped": " (exceeds the platform limit, capped at the maximum)" } };

// src/i18n.ts
var localePacks = {
  "zh-CN": zh_CN_default,
  "en-US": en_US_default
};

// src/commands.ts
var import_koishi2 = require("koishi");

// src/utils/duration.ts
var UNIT_SECONDS = {
  s: 1,
  sec: 1,
  secs: 1,
  second: 1,
  seconds: 1,
  秒: 1,
  秒钟: 1,
  m: 60,
  min: 60,
  mins: 60,
  minute: 60,
  minutes: 60,
  分: 60,
  分钟: 60,
  h: 3600,
  hr: 3600,
  hrs: 3600,
  hour: 3600,
  hours: 3600,
  时: 3600,
  小时: 3600,
  个小时: 3600,
  d: 86400,
  day: 86400,
  days: 86400,
  天: 86400,
  日: 86400,
  w: 604800,
  week: 604800,
  weeks: 604800,
  周: 604800,
  星期: 604800,
  礼拜: 604800,
  mo: 2592e3,
  month: 2592e3,
  months: 2592e3,
  月: 2592e3,
  个月: 2592e3,
  y: 31536e3,
  yr: 31536e3,
  yrs: 31536e3,
  year: 31536e3,
  years: 31536e3,
  年: 31536e3
};
var SEGMENT = /(\d+(?:\.\d+)?)\s*([a-z]+|[\u4e00-\u9fff]+)/gi;
var SEPARATOR = /^[\s,，、/·+]*$/;
var CN_DIGITS = {
  一: 1,
  两: 2,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10
};
function normalizeText(text) {
  return text.replace(/\band\b/g, " ").replace(/([一两二三四五六七八九十])\s*(?=[a-z]|[\u4e00-\u9fff])/g, (_, char) => String(CN_DIGITS[char])).replace(/半\s*(?=[a-z]|[\u4e00-\u9fff])/g, "0.5").replace(/零/g, "").replace(/\s+/g, " ").trim();
}
__name(normalizeText, "normalizeText");
function toSeconds(value) {
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value);
}
__name(toSeconds, "toSeconds");
function parseDuration(input) {
  const text = normalizeText(String(input ?? "").trim().toLowerCase());
  if (!text) return null;
  if (/^\d+(?:\.\d+)?$/.test(text)) return toSeconds(Number(text));
  let total = 0;
  let cursor = 0;
  let matched = false;
  SEGMENT.lastIndex = 0;
  let segment;
  while (segment = SEGMENT.exec(text)) {
    if (!SEPARATOR.test(text.slice(cursor, segment.index))) return null;
    const scale = UNIT_SECONDS[segment[2]];
    if (scale === void 0) return null;
    total += Number(segment[1]) * scale;
    cursor = SEGMENT.lastIndex;
    matched = true;
  }
  if (!matched || !SEPARATOR.test(text.slice(cursor))) return null;
  return toSeconds(total);
}
__name(parseDuration, "parseDuration");
var DURATION_UNITS = [
  [86400, "day"],
  [3600, "hour"],
  [60, "minute"],
  [1, "second"]
];
function formatDuration(session, seconds) {
  for (const [size, unit] of DURATION_UNITS) {
    if (seconds >= size && seconds % size === 0) {
      return session.text(`qq-ban.duration-${unit}`, { count: seconds / size });
    }
  }
  return session.text("qq-ban.duration-second", { count: seconds });
}
__name(formatDuration, "formatDuration");

// src/commands.ts
function resolveTargetId(target) {
  if (!target || typeof target !== "string") return "";
  const parts = target.trim().split(":");
  return parts[parts.length - 1] || "";
}
__name(resolveTargetId, "resolveTargetId");
function getMuteMethod(bot) {
  const method = bot?.muteGuildMember;
  return typeof method === "function" ? method.bind(bot) : void 0;
}
__name(getMuteMethod, "getMuteMethod");
function joinArgs(args) {
  return args.flat().filter((value) => typeof value === "string" && value.length > 0).join(" ");
}
__name(joinArgs, "joinArgs");
function describeError(error) {
  if (error instanceof Error && error.message) return error.message;
  const message = error?.message;
  return typeof message === "string" && message ? message : String(error);
}
__name(describeError, "describeError");
function registerCommands(ctx, config) {
  const logger = ctx.logger("qq-ban");
  ctx.command("ban <target:user> <...duration>", { authority: config.minAuthority }).action(async ({ session }, target, ...rest) => {
    if (!session) return;
    if (!session.guildId) return session.text("qq-ban.not-in-group");
    const targetId = resolveTargetId(target);
    if (!targetId) return session.text("qq-ban.need-target");
    if (targetId === session.userId) return session.text("qq-ban.cannot-ban-self");
    if (targetId === session.bot?.selfId) return session.text("qq-ban.cannot-ban-bot");
    const mute = getMuteMethod(session.bot);
    if (!mute) return session.text("qq-ban.unsupported-adapter");
    const input = joinArgs(rest);
    if (!input) return session.text("qq-ban.missing-duration");
    const parsed = parseDuration(input);
    if (parsed === null) return session.text("qq-ban.invalid-duration", { input });
    const capped = parsed > config.maxDuration;
    const seconds = capped ? config.maxDuration : parsed;
    try {
      await mute(session.guildId, targetId, seconds * 1e3);
    } catch (error) {
      logger.warn("failed to mute %s in %s: %o", targetId, session.guildId, error);
      return session.text("qq-ban.mute-failed", { reason: describeError(error) });
    }
    let duration = formatDuration(session, seconds);
    if (capped) duration += session.text("qq-ban.duration-capped");
    return [import_koishi2.h.at(targetId), session.text("qq-ban.banned", { duration })];
  });
  ctx.command("unban <target:user>", { authority: config.minAuthority }).action(async ({ session }, target) => {
    if (!session) return;
    if (!session.guildId) return session.text("qq-ban.not-in-group");
    const targetId = resolveTargetId(target);
    if (!targetId) return session.text("qq-ban.need-target");
    const mute = getMuteMethod(session.bot);
    if (!mute) return session.text("qq-ban.unsupported-adapter");
    try {
      await mute(session.guildId, targetId, 0);
    } catch (error) {
      logger.warn("failed to unmute %s in %s: %o", targetId, session.guildId, error);
      return session.text("qq-ban.unmute-failed", { reason: describeError(error) });
    }
    return [import_koishi2.h.at(targetId), session.text("qq-ban.unbanned")];
  });
}
__name(registerCommands, "registerCommands");

// src/index.ts
var name = "qq-ban";
function apply(ctx, config) {
  for (const [locale, pack] of Object.entries(localePacks)) {
    ctx.i18n.define(locale, pack);
  }
  registerCommands(ctx.platform("qq"), config);
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  name
});
