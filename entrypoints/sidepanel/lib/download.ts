import { zipSync } from 'fflate';
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

function dataUrlToUint8Array(dataUrl: string): { bytes: Uint8Array; ext: string } | null {
  try {
    const parts = dataUrl.split(',');
    const header = parts[0];
    const base64 = parts[1];
    if (!header || !base64) {
      return null;
    }
    const mimeMatch = header.match(/data:(image\/[a-zA-Z0-9+-]+);/);
    const ext = mimeMatch ? extensionFromContentType(mimeMatch[1]) : '';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return { bytes, ext };
  } catch {
    return null;
  }
}

export async function fetchImageBytes(url: string): Promise<{ bytes: Uint8Array; ext: string } | null> {
  if (url.startsWith('data:')) {
    return dataUrlToUint8Array(url);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const ext = extensionFromContentType(blob.type) || extensionFromUrl(url) || 'jpg';
    return { bytes: new Uint8Array(arrayBuffer), ext };
  } catch {
    return null;
  }
}

/**
 * Download a single image item to the user's default downloads folder.
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
    // fall through
  }

  return downloadViaAnchor(url, filename);
}

/**
 * Package multiple image items into a single .zip file and trigger download.
 */
export async function downloadImagesZip(
  items: SavedItem[],
  zipFilename?: string,
): Promise<{ ok: number; failed: number }> {
  const images = items.filter((item) => item.type === 'image' && item.imageUrl);
  if (!images.length) {
    return { ok: 0, failed: 0 };
  }

  const zipData: Record<string, Uint8Array> = {};
  const usedNames = new Set<string>();
  let ok = 0;
  let failed = 0;

  for (let index = 0; index < images.length; index++) {
    const item = images[index];
    const url = (item.imageUrl || '').trim();
    const fetched = await fetchImageBytes(url);

    if (!fetched || !fetched.bytes.length) {
      failed += 1;
      continue;
    }

    let filename = getImageDownloadFilename(item, fetched.ext);

    if (usedNames.has(filename)) {
      const parts = filename.lastIndexOf('.');
      if (parts !== -1) {
        const name = filename.slice(0, parts);
        const ext = filename.slice(parts);
        filename = `${name}_${index + 1}${ext}`;
      } else {
        filename = `${filename}_${index + 1}`;
      }
    }

    usedNames.add(filename);
    zipData[filename] = fetched.bytes;
    ok += 1;
  }

  if (ok === 0) {
    return { ok: 0, failed };
  }

  const zipped = zipSync(zipData);
  const blob = new Blob([zipped.buffer], { type: 'application/zip' });
  const stamp = new Date().toISOString().slice(0, 10);
  const finalZipName = zipFilename || `side-stash-images-${stamp}.zip`;
  const objectUrl = URL.createObjectURL(blob);

  try {
    if (browser?.downloads?.download) {
      await browser.downloads.download({
        url: objectUrl,
        filename: finalZipName,
        saveAs: false,
      });
    } else {
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = finalZipName;
      anchor.click();
      anchor.remove();
    }
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
  }

  return { ok, failed };
}

/**
 * Download multiple image items sequentially as individual image files (one by one).
 */
export async function downloadImageItemsSequentially(
  items: SavedItem[],
): Promise<{ ok: number; failed: number }> {
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
    await new Promise((resolve) => window.setTimeout(resolve, 150));
  }

  return { ok, failed };
}

/** Default batch download helper (falls back to ZIP for 2+ images). */
export async function downloadImageItems(items: SavedItem[]): Promise<{ ok: number; failed: number }> {
  const images = items.filter((item) => item.type === 'image' && item.imageUrl);
  if (images.length <= 1) {
    return downloadImageItemsSequentially(images);
  }

  return downloadImagesZip(images);
}
