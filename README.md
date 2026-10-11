# koishi-plugin-qq-ban

Koishi — QQ 官方机器人群成员指令禁言插件。

![AI-Crap](https://img.shields.io/badge/💩-AI_crap_code-5C4033?style=flat-square)

## 功能

- `ban @某人 <时长>` 禁言群成员，时长支持中英文常见写法与多段累加
- `unban @某人` 解除禁言
- i18n

## 前置条件

1. 已启用支持群禁言的 QQ 官方机器人适配器（如 [`koishi-plugin-adapter-qq-crack`](https://github.com/koishi-shangxue-plugins/koishi-plugin-adapter-qq-crack)）。
2. 机器人已被添加为该群的管理员。
3. 已启用 `commands` 插件。

## 安装

```bash
npm i koishi-plugin-qq-ban
```

或：

```bash
yarn add koishi-plugin-qq-ban
```

## Koishi 配置

```yml
plugins:
  group:basic:
    commands: {}
    qq-ban:
      minAuthority: 3
      maxDuration: 2592000
```

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `minAuthority` | number | `3` | 调用指令所需的最低权限等级 |
| `maxDuration` | number | `2592000` | 允许的最大禁言时长（秒），QQ 官方限制为 30 天；超出按此值处理 |

## 使用

```
ban @某人 10分钟      # 时长支持中文
ban @某人 600         # 纯数字按秒
ban @某人 1小时30分    # 多段累加
ban @某人 2h          # 英文缩写
ban @某人 1 day       # 英文全称
unban @某人           # 解除禁言
```

### 时长写法

| 单位 | 可写 | 折算 |
| --- | --- | --- |
| 年 | `年` `y` `yr` `year(s)` | 365 天 |
| 月 | `月` `个月` `mo` `month(s)` | 30 天 |
| 周 | `周` `星期` `礼拜` `w` `week(s)` | 7 天 |
| 天 | `天` `日` `d` `day(s)` | 24 小时 |
| 小时 | `时` `小时` `个小时` `h` `hr(s)` `hour(s)` | 60 分钟 |
| 分钟 | `分` `分钟` `m` `min(s)` `minute(s)` | 60 秒 |
| 秒 | `秒` `秒钟` `s` `sec(s)` `second(s)` | 1 秒 |

补充规则：

- 不带单位时按秒处理（`600` 即 600 秒）
- 多段会累加，可用空格或 `,,/` 分隔：`1d2h30m`、`1小时30分`、`1 hour and 30 minutes`
- 支持中文数字与「半」：`五分钟`、`两小时`、`半小时`、`半天`
- 大小写不敏感

## 注意事项

本插件仅封装机器人的群管理能力，使用请遵守所在群规与当地法律法规。
