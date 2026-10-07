# Side Stash — agent notes

This repository inherits `../AGENTS.md`. These notes may add stricter release
steps but must not weaken the workspace build or GitHub Actions limits.

## Release / 本地发版规范

Only after explicit release authorization:

1. Update `package.json` and any corresponding website version display.
2. Build, zip, upload and submit Chrome Web Store review locally with the existing `npm run release:chrome` entry point. Keep credentials outside Git.
3. Never trigger, rerun or re-enable GitHub Actions. GitHub stores source and Release assets only.
4. Commit and push require separate explicit authorization.
5. Package Firefox with `npm run zip:firefox` only when explicitly requested.

## Website deployment / 官网部署

- Build and deploy locally only after explicit deployment authorization.
- Use project-local `cf` exclusively; Wrangler is only cf's internal bundler dependency. The website build produces parent `dist-website`; deploy with the existing script, which builds first then runs `cd website/cloudflare && cf deploy` from the project root.
- The authorized static hosting migration targets Worker `sidestash-site` with the existing `sidestash.lanrenwen.com` domain. `website/cloudflare/cloudflare.config.ts` points `assetsDirectory` to parent `dist-website`; `wrangler.config.ts` is internal bundler configuration. Old Pages remain for rollback only and must not receive new deployments. Do not claim a cutover without deployment/domain evidence; unrelated DNS or binding changes still need authorization.
- Do not download temporary CLIs with `npx`. Deployment does not authorize Git commits, pushes, or GitHub Actions.

## Packaging only

When the user asks only to package / zip / 打包 (no release wording):

1. Do not run `npm run zip` or any packaging build.
2. Explain that packaging is reserved for an explicitly authorized release, deployment, or shipping task under the workspace policy.

## Development / 开发

- Hot reload / HMR is functional in dev mode (`npm run dev`).
- WXT/Vite auto-reloads file modifications; do not restart after every code change.
