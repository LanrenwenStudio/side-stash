# Side Stash — agent notes

This repository inherits `../AGENTS.md`. These notes may add stricter release
steps but must not weaken the workspace build or GitHub Actions limits.

## Release / 发版规范 (GitHub Actions 优先)

When the user asks to release / ship / 发版 / publish:

1. **统一优先使用 GitHub Actions 云端流水线**进行构建、打包、Chrome Web Store 上传与审核提交。
2. **标准发版流程**：
   - 更新 `package.json` 中的版本号（如 `v0.1.11`），并同步更新官网相关组件的版本号；
   - 提交主分支：`git commit -am "chore: bump version to v0.1.11" && git push origin main`；
   - 推送 Tag 触发 Actions：`git tag v0.1.11 && git push origin v0.1.11`。
3. **本地打包限制**：日常发版**严禁在本地执行 `npm run release:chrome`**，以避免本地与 GitHub Actions 触发双重提交冲突（Google API 400 错误）。
4. **特殊情况例外**：仅当 GitHub Actions 云端凭据失效、CI 服务故障且经用户明确指定“本地打包提交”时，才使用本地 `npm run release:chrome` 作为应急兜底。
5. Package Firefox with `npm run zip:firefox` only when the user explicitly asks for Firefox; there is no automatic Firefox upload in this workflow.

## Packaging only

When the user asks only to package / zip / 打包 (no release wording):

1. Do not run `npm run zip` or any packaging build.
2. Explain that packaging is reserved for an explicitly authorized release,
   deployment, or shipping task under the workspace policy.

## Development / 开发

- Hot reload / HMR is functional in dev mode (`npm run dev`).
- Modifications to files are auto-reloaded by WXT/Vite. You do not need to restart `npm run dev` after every code change.
