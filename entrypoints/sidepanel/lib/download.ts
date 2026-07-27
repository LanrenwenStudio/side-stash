import { browser } from 'wxt/browser';
import type { SavedItem } from '../types';

const DEFAULT_IMAGE_NAME = 'image';

function sanitizeFilename(name: string) {
  const cleaned = name
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\.+/, '')
    .slice(0, 160);
  return cleaned || DEFAULT_IMAGE_NAME;
}

function extensionFromUrl(url: string) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]{2,5})$/);
    if (!match) {
      return '';
    }
    const ext = match[1].toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'bmp', 'ico'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext;
    }
  } catch {
    // ignore
  }
  return '';
}

function extensionFromContentType(contentType: string) {
  const type = contentType.split(';')[0]?.trim().toLowerCase() || '';
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
    'image/bmp': 'bmp',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
  };
  return map[type] || '';
}

function filenameFromUrl(url: string) {
  try {
    const pathname = new URL(url).pathname;
    const last = pathname.split('/').filter(Boolean).pop();
    if (!last) {
      return '';
    }
    return sanitizeFilename(decodeURIComponent(last));
  } catch {
    return '';
  }
}

/** Build a safe download filename for an image item. */
export function getImageDownloadFilename(item: SavedItem, preferredExt = '') {
  const url = (item.imageUrl || '').trim();
  const fromUrl = filenameFromUrl(url);
  const ext = preferredExt || extensionFromUrl(url) || 'jpg';

  if (fromUrl) {
    if (/\.[a-zA-Z0-9]{2,5}$/.test(fromUrl)) {
      return fromUrl;
    }
    return `${fromUrl}.${ext}`;
  }

  const base = sanitizeFilename((item.imageAlt || item.content || DEFAULT_IMAGE_NAME).trim());
  const withoutExt = base.replace(/\.[a-zA-Z0-9]{2,5}$/, '');
  return `${withoutExt || DEFAULT_IMAGE_NAME}.${ext}`;
}

async function downloadViaAnchor(url: string, filename: string) {
  // Prefer fetching through extension host permissions so we can force a filename.
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blob = await response.blob();
    const ext = extensionFromContentType(blob.type) || extensionFromUrl(url) || 'jpg';
    const finalName = filename.includes('.')
      ? filename
      : `${filename.replace(/\.$/, '')}.${ext}`;
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = finalName;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    return true;
  } catch {
    // Last resort: navigate-style download (filename may be ignored cross-origin).
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return true;
  }
}

/**
 * Download a single image item to the user's default downloads folder.
 * Uses chrome.downloads when available; falls back to fetch + anchor.
 */
export async function downloadImageItem(item: SavedItem): Promise<boolean> {
  const url = (item.imageUrl || '').trim();
  if (!url || item.type !== 'image') {
    return false;
  }

  const filename = getImageDownloadFilename(item);

  try {
    if (browser?.downloads?.download) {
      await browser.downloads.download({
        url,
        filename,
        conflictAction: 'uniquify',
        saveAs: false,
      });
      return true;
    }
  } catch {
    // fall through to anchor/fetch path
  }

  return downloadViaAnchor(url, filename);
}

/** Download multiple image items sequentially (avoids flooding the download manager). */
export async function downloadImageItems(items: SavedItem[]): Promise<{ ok: number; failed: number }> {
  const images = items.filter((item) => item.type === 'image' && item.imageUrl);
  let ok = 0;
  let failed = 0;

  for (const item of images) {
    const success = await downloadImageItem(item);
    if (success) {
      ok += 1;
    } else {
      failed += 1;
    }
    // Small gap so Chrome can register each download cleanly.
    await new Promise((resolve) => window.setTimeout(resolve, 120));
  }

  return { ok, failed };
}
