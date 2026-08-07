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
