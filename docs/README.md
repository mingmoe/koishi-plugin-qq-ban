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

## 首次发布

`package.json` 的初始版本是 `0.0.0`，因此首个 `docs/v0.1.0.md` 会按「前进版本」处理：
自动 bump 到 `0.1.0`、发布到 npm 并创建 Release。

## 需要的仓库配置

- Secret `NPM_TOKEN`：npm 官方源的发布令牌（Automation token）。
  缺少它时 `npm publish` 会失败；Release 与 bump 提交仍会正常执行。
- Settings → Actions → General → Workflow permissions 需允许 **Read and write permissions**，
  否则工作流无法把 bump 提交推回 `main`。
