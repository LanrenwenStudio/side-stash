# Agent Work Claim: Chrome Web Store Publishing

Status: completed
Owner: codex
Start: 2026-08-03 10:46 Asia/Shanghai
Task: Add the local Chrome Web Store service-account publishing flow used by EnglishCC.
Planned files/directories: package.json; scripts/publish-chrome.mjs; .env.submit.example; README.md; local .env.submit configuration.
Shared interfaces/schemas/generated outputs: Chrome Web Store publisher ID, Side Stash extension ID, service-account key path, and release command names.

Actual files touched: package.json; README.md; .env.submit.example; scripts/publish-chrome.mjs; local .env.submit; this claim file. Existing AGENTS.md changes were preserved.
Verification: `node --check scripts/publish-chrome.mjs`; package.json parse; `git diff --check`; and `npm run publish:chrome:dry-run` passed.
