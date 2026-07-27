# Side Stash — agent notes

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

1. Run `npm run zip` (and Firefox zip if requested).
2. Open `.output/` as above — never the repo root.

## Development / 开发

- Do not rely on Hot Module Replacement (HMR) for this Chrome extension.
- Every time code changes are made, re-run the build/dev process (`npm run build` / `npm run dev`) so that the extension is cleanly re-compiled and re-executed.
