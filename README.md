# Side Stash

Side Stash is a lightweight browser side‑panel collector. Right‑click any webpage to save text, links, or images, then review, filter, copy, and delete items from a clean side panel UI. All data stays on your device — no account, no upload, no tracking.

---

## Screenshot

![Side Stash screenshot](./1.jpeg)

---

## Features

- Right‑click save: text, links, images
- Keyboard shortcut: `Alt+S` saves the current selection
- Side panel list with local persistence
- Filters by type, date, site, and keyword/URL
- Pin important items (with independent left accent line & selection state coexistence)
- Copy formats: plain, Markdown, with source
- Multi‑select copy / cut / delete
- Dual image download modes: batch ZIP archive packaging (`fflate`), or individual batch downloads
- High-performance Radix UI custom tooltips (`@radix-ui/react-tooltip` with 120ms fast hover response)
- Debug mode with 1-click 7-item mock data seeding for developer testing
- Export / import JSON; export Markdown
- Source display (domain)

---

## How It Works

1. Select text (or press `Alt+S`), or right‑click a link/image
2. Choose “Save to side panel” when using the menu
3. Open the side panel to view, filter, pin, copy, or export

---

## Permissions

- `contextMenus`: add right‑click menu items
- `storage`: persist saved items locally
- `tabs`: read page title/URL for context
- `host_permissions: <all_urls>`: enable saving on any site
- `sidePanel`: render the side panel UI

---

## Privacy

- All data is stored locally in `chrome.storage.local`
- No data is sent to any server
- No tracking or analytics

---

## Development

```bash
npm install
npm run dev
```

The product website preserves its existing React UI and interactive demos.
Preview it with `npm run dev:website -- --host 0.0.0.0 --port 8088 --strictPort`
after checking that the port is free.

Website SEO uses `/` (English), `/zh/`, `/zh-TW/`, `/ja/`, `/ko/`, and `/es/`, with fixed language, localized initial HTML,
metadata, self-canonical URLs, reciprocal hreflang and SoftwareApplication
structured data. English is self-canonical at `/`; `/en`, `/en/` and `/en/index.html` permanently redirect to `/` on Pages.
Language switching uses a six-language menu with crawlable links; `robots.txt` advertises the multilingual
sitemap. Vite prerenders the same React page components for each HTML entry,
including during authorized production builds. The client mounts the existing
interactive UI after locale initialization; build-time demo timestamps are not
hydrated as if they were current. Website and WXT use separate dependency caches.
Marketing copy, navigation, demo instructions and feedback are localized in all
six website languages; shared panel controls use the corresponding extension
dictionary. Existing layout, theme controls and sample interactions are retained.
Each HTML entry loads CSS directly in its head (`style.css?direct` in Vite dev),
not through the client JavaScript import, so prerendered content is styled before
first paint when navigating between languages.
The six-language FAQ exposes product definitions, storage boundaries and export
behavior. Visible developer/contact sections and publisher schema identify
LanrenwenStudio and the existing support@lanrenwen.com address. FAQ schema is
generated from the same visible answers; it does not promise rich results.
The existing privacy policy is served at `/privacy-policy.html` without changing
its legal text. Terms are not invented: the repository currently has conflicting
MIT/ISC license declarations and no LICENSE file; resolve these before adding
license-based terms or claims.
`/llms.txt` lists verified product facts and official sources. WebPage and FAQPage
schema carry the visible content-update date (`2026-10-06`), not an invented
initial publication date. Update this date when the corresponding content changes.

Production builds, packaging and deployment require explicit release/deployment
authorization. Ordinary SEO work uses development mode and lightweight checks.

Website hosting migrates under explicit authorization to Worker `sidestash-site`, keeping the official domain unchanged. The project deploy script runs the original website build into parent `dist-website`, then enters `website/cloudflare` for `cf deploy`. That directory contains cf/Wrangler dependencies, `cloudflare.config.ts` with `assetsDirectory` pointing to prebuilt output, and internal bundler `wrangler.config.ts`. Use cf exclusively; no direct Wrangler, Actions, or automatic commit/push. Old Pages remain for rollback only and are not redeployed. Report actual deployment/domain verification, not configuration-only success.

Build the production bundle:

```bash
npm run build
```

Package for Chrome Web Store:

```bash
npm run zip
```

## Publish to Chrome Web Store

Configure the service-account settings once in `.env.submit` (copy
`.env.submit.example` first). The JSON key can be shared by the Chrome
extensions under the same Publisher account.

Check authentication and Publisher access without uploading:

```bash
npm run publish:chrome:dry-run
```

Build, upload, and submit the current Chrome package:

```bash
npm run release:chrome
```

---

## Project Structure

```
entrypoints/
  background.ts
  content.content.ts
  sidepanel/
    index.html
    main.ts
    style.css
public/
  icon-16.png
  icon-24.png
  icon-32.png
  icon-48.png
  icon-128.png
wxt.config.ts
```

---

## License

MIT
