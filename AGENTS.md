# Side Stash — agent notes

This repository inherits `../AGENTS.md`. These notes may add stricter release
steps but must not weaken the workspace build or GitHub Actions limits.

## Release / 发版

When the user asks to release / ship / 发版 / publish:

1. **Commit** all intended product changes (never commit secrets; skip unrelated local assets unless asked).
2. **Push** to the remote tracking branch.
3. **Package, upload, and submit for Chrome Web Store review through the configured API workflow**:
   ```bash
   npm run release:chrome
   ```
   This command creates the Chrome ZIP, uploads it with the configured service account, and submits it for review.
4. Do **not** open `.output/`, Finder, or the Chrome Web Store dashboard after packaging. Report the API result directly. Only use an interactive browser if the user explicitly requests it.
5. Package Firefox with `npm run zip:firefox` only when the user explicitly asks for Firefox; there is no automatic Firefox upload in this workflow.

## Packaging only

When the user asks only to package / zip / 打包 (no release wording):

1. Do not run `npm run zip` or any packaging build.
2. Explain that packaging is reserved for an explicitly authorized release,
   deployment, or shipping task under the workspace policy.

## Development / 开发

- Hot reload / HMR is functional in dev mode (`npm run dev`).
- Modifications to files are auto-reloaded by WXT/Vite. You do not need to restart `npm run dev` after every code change.
