# 发布说明（Release Notes）

本目录下的每个 `vX.Y.Z.md` 文件对应一次版本发布。文件名中的版本号即为发布版本，
GitHub Release 的描述内容取自对应文件，不使用自动生成的文字。

## 发布流程

1. 在 `docs/` 下新建 `vX.Y.Z.md`（版本号必须**大于**当前 `package.json` 里的 `version`）。
2. 在文件中写明本次更新说明。
3. 合并到 `main` 分支后，CI（`.github/workflows/release.yml`）会自动：
   - 将 `package.json` 的 `version` 更新为该文件名中的版本号；
   - 发布到 npm 官方源（`registry.npmjs.org`）；
   - 创建同名 GitHub Release，描述内容使用本文件；
   - 以 `chore(release): bump to vX.Y.Z` 提交这次 version 变更并推回 `main`。
4. 修改已有 `docs/vX.Y.Z.md` 并推送，只会同步更新对应的 GitHub Release 描述，
   不会重新发布、也不会重复 bump。

**本工作流只负责发版，不做任何服务器部署。**

## 发布认证：npm 可信发布（Trusted Publishing）

发布**不使用任何 npm token**。工作流通过 GitHub Actions 的 OIDC 身份令牌向 npm 证明
「是 `mingmoe/koishi-plugin-qq-ban` 的 `release.yml` 在运行」，npm 核对可信发布配置后放行。
不需要在仓库里配置 `NPM_TOKEN` secret。

工作流侧的必要条件（已在 `release.yml` 里配好，改动时别破坏）：

- `permissions: id-token: write` —— 否则拿不到 OIDC 令牌；
- Node.js **24**（自带 npm ≥ 11.5.1，可信发布的最低版本要求）；
- **不要设置 `NODE_AUTH_TOKEN`** —— 只要该变量存在（哪怕是空字符串），npm 就会走 token 认证
  而不会回落到 OIDC；
- **不要给 `actions/setup-node` 设 `registry-url`** —— 它会写入含 `${NODE_AUTH_TOKEN}` 的
  `.npmrc`，同样会让 OIDC 失效。

npm 侧的配置：包设置页 → **Trusted Publisher** → GitHub Actions，填

| 字段 | 值 |
| --- | --- |
| Organization or user | `mingmoe` |
| Repository | `koishi-plugin-qq-ban` |
| Workflow filename | `release.yml`（只写文件名，且必须带 `.yml`） |
| Environment name | 留空 |
| Allowed actions | 必须勾选允许直接 `npm publish`。只允许 stage publish 的话，CI 无法直接发布（那条路需要人工审批） |

也可以不走网页，用 CLI 一条命令建（需要交互完成 2FA）：

```bash
npx npm@latest trust github koishi-plugin-qq-ban \
  --repo mingmoe/koishi-plugin-qq-ban \
  --file release.yml \
  --allow-publish \
  --registry=https://registry.npmjs.org
```

查看已配置的关系（同样需要 2FA）：

```bash
npx npm@latest trust list koishi-plugin-qq-ban --registry=https://registry.npmjs.org
```

⚠️ **配置有 48 小时验证窗口**：新建的可信发布配置必须在 48 小时内成功发布一次，
否则会被判为未验证而失效，需要删除后重建。所以配好后尽快发一个版本验证。
另外，提供方与仓库/工作流字段一旦创建就固定，改动只能删掉重建。

⚠️ `Workflow filename` 必须**只写文件名**。填成 `.github/workflows/release.yml` 是最常见的错法，
看上去配好了但永远匹配不上，CI 发布时报 `ENEEDAUTH`。

## 首次发布（bootstrap）

npm 只允许给**已存在**的包配置可信发布，所以第一个版本必须先手工发一次：

```bash
cd <本仓库目录>
npm login --registry=https://registry.npmjs.org
npm publish --registry=https://registry.npmjs.org
```

`npm login` 会走你账号的 2FA，这是官方推荐的 bootstrap 方式。发布确认后，
用 `npm view koishi-plugin-qq-ban version --registry=https://registry.npmjs.org` 检查。
注意新包在注册表上会先出现一个占位版本 `0.0.0-stage`（npm 为分阶段发布建的，
描述为 "Temporary package placeholder for staged publishing"），真实版本稍后才会生效；
`latest` 指向真实版本后即可安装。
