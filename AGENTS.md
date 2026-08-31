# Side Stash — agent notes

This repository inherits `../AGENTS.md`. These notes may add stricter release
steps but must not weaken the workspace build or GitHub Actions limits.

## Release / 发版

When the user asks to release / ship / 发版 / publish:

1. **Bump version** in `package.json` (e.g. `v0.1.10`), and synchronize any version strings in website components if needed.
2. **Commit and push** to `main`:
   ```bash
   git commit -am "chore: bump version to v0.1.10"
   git push origin main
   ```
3. **Tag and push** to trigger the automated GitHub Actions CI/CD release pipeline:
   ```bash
   git tag v0.1.10
   git push origin v0.1.10
   ```
4. GitHub Actions will build the zip package, upload to the Chrome Web Store via service account API, submit for review, and create the GitHub Release asset automatically.
5. (Optional manual fallback only if CI fails or user explicitly asks for local upload: `npm run release:chrome`).
6. Package Firefox with `npm run zip:firefox` only when the user explicitly asks for Firefox; there is no automatic Firefox upload in this workflow.

## Packaging only

When the user asks only to package / zip / 打包 (no release wording):

1. Do not run `npm run zip` or any packaging build.
2. Explain that packaging is reserved for an explicitly authorized release,
   deployment, or shipping task under the workspace policy.

## Development / 开发

- Hot reload / HMR is functional in dev mode (`npm run dev`).
- Modifications to files are auto-reloaded by WXT/Vite. You do not need to restart `npm run dev` after every code change.
