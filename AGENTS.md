# Side Stash — agent notes

This repository inherits `../AGENTS.md`. These notes may add stricter release
steps but must not weaken the workspace build or GitHub Actions limits.

## Release / 发版

When the user asks to release / ship / 发版 / publish:

1. **Commit** all intended product changes (never commit secrets; skip unrelated local assets unless asked).
2. **Push** to the remote tracking branch.
3. **Package** for Chrome:
   ```bash
   npm run zip
   ```
   (Also `npm run zip:firefox` only if the user asks for Firefox.)
4. After a successful zip, **always open the zip output directory** in Finder:
   ```bash
   open .output
   ```
5. Do **not** open the repository root. Only open `.output/` (where `side-stash-*-chrome.zip` lives).

## Packaging only

When the user asks only to package / zip / 打包 (no release wording):

1. Do not run `npm run zip` or any packaging build.
2. Explain that packaging is reserved for an explicitly authorized release,
   deployment, or shipping task under the workspace policy.

## Development / 开发

- Hot reload / HMR is functional in dev mode (`npm run dev`).
- Modifications to files are auto-reloaded by WXT/Vite. You do not need to restart `npm run dev` after every code change.
