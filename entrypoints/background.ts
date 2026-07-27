import { browser } from 'wxt/browser';
import {
  getLanguagePreferenceKey,
  initializeI18n,
  t,
} from '../lib/i18n';

/**
 * Two items only:
 * - text: when there is a selection
 * - target: one shared item for link OR image (never both — Chrome would show a submenu)
 *
 * Note: Chrome nests 2+ extension items under the extension name; true dual
 * top-level items are not supported by the platform.
 */
const MENU_TEXT_ID = 'side-stash-save-text';
const MENU_TARGET_ID = 'side-stash-save-target';
const MENU_IDS = new Set([MENU_TEXT_ID, MENU_TARGET_ID]);
const STORAGE_KEY = 'items';
const PREFERENCES_KEY = 'panelPreferences';
const SAVE_SELECTION_COMMAND = 'save-selection';
const BADGE_CLEAR_MS = 2200;
// High-contrast red so the count stays readable on our dark tray icon.
const COUNT_BADGE_COLOR = '#e11d48';
const COUNT_BADGE_TEXT_COLOR = '#ffffff';
/** Chrome badges are tiny; keep text short (e.g. "99+"). */
const BADGE_COUNT_CAP = 99;

let badgeRestoreTimer: ReturnType<typeof setTimeout> | null = null;
/** Cached so we can open the panel without awaiting storage (keeps the user gesture). */
let openPanelOnSaveCached = true;
/** Last focused window — used to open the panel from keyboard shortcuts without an await. */
let lastWindowId: number | undefined;

type SidePanelApi = {
  setPanelBehavior?: (options: { openPanelOnActionClick: boolean }) => Promise<void>;
  open?: (options: { windowId?: number; tabId?: number }) => Promise<void>;
};

const getSidePanelApi = (): SidePanelApi | undefined =>
  (browser as typeof browser & { sidePanel?: SidePanelApi }).sidePanel;

type ContextData = {
  pageTitle: string;
  linkText: string;
  linkUrl: string;
  imageAlt: string;
  imageUrl: string;
  selectionText?: string;
};

type FeedbackKind = 'success' | 'duplicate' | 'empty';

const createMenus = () => {
  browser.contextMenus.create({
    id: MENU_TEXT_ID,
    title: t('menuSaveText', 'Save text to side panel'),
    contexts: ['selection'],
  });

  // ONE item for both link and image — an <img> inside <a> will never offer two choices.
  browser.contextMenus.create({
    id: MENU_TARGET_ID,
    title: t('menuSaveLink', 'Save link to side panel'),
    contexts: ['link', 'image'],
  });
};

/**
 * Polish labels / hide target when the user already has a selection.
 * Image vs link is never two items — they share MENU_TARGET_ID.
 */
const syncMenuForContext = async (info: {
  mediaType?: string;
  srcUrl?: string;
  selectionText?: string;
  linkUrl?: string;
}) => {
  const hasSelection = Boolean((info.selectionText || '').trim());
  const onImage = info.mediaType === 'image' || Boolean(info.srcUrl);

  try {
    if (hasSelection) {
      await browser.contextMenus.update(MENU_TEXT_ID, { visible: true });
      await browser.contextMenus.update(MENU_TARGET_ID, { visible: false });
    } else {
      await browser.contextMenus.update(MENU_TEXT_ID, { visible: true });
      await browser.contextMenus.update(MENU_TARGET_ID, {
        visible: true,
        title: onImage
          ? t('menuSaveImage', 'Save image to side panel')
          : t('menuSaveLink', 'Save link to side panel'),
      });
    }

    const menus = browser.contextMenus as typeof browser.contextMenus & {
      refresh?: () => Promise<void>;
    };
    await menus.refresh?.();
  } catch {
    // ignore — onShown/refresh not available in every build
  }
};

const refreshMenus = async () => {
  try {
    await browser.contextMenus.removeAll();
  } catch {
    // ignore
  }
  createMenus();
};

const setPanelBehavior = () => {
  const sidePanel = getSidePanelApi();
  if (sidePanel?.setPanelBehavior) {
    sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => undefined);
  }
};

const readOpenPanelOnSave = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') {
    return true;
  }
  const prefs = value as { openPanelOnSave?: unknown };
  return prefs.openPanelOnSave !== false;
};

const hydrateOpenPanelOnSavePref = async () => {
  try {
    const stored = await browser.storage.local.get(PREFERENCES_KEY);
    openPanelOnSaveCached = readOpenPanelOnSave(stored[PREFERENCES_KEY]);
  } catch {
    openPanelOnSaveCached = true;
  }
};

const rememberWindowId = (windowId?: number) => {
  if (typeof windowId === 'number' && windowId >= 0) {
    lastWindowId = windowId;
  }
};

/**
 * Chrome only allows sidePanel.open() while the user gesture is still valid.
 * Call this synchronously from click/command handlers — never after await.
 */
const openSidePanelFromUserGesture = (options?: {
  windowId?: number;
  tabId?: number;
}) => {
  if (!openPanelOnSaveCached) {
    return;
  }

  const sidePanel = getSidePanelApi();
  if (!sidePanel?.open) {
    return;
  }

  const windowId =
    typeof options?.windowId === 'number' ? options.windowId : lastWindowId;
  const tabId = options?.tabId;

  try {
    if (typeof windowId === 'number') {
      void sidePanel.open({ windowId });
      return;
    }
    if (typeof tabId === 'number') {
      void sidePanel.open({ tabId });
    }
  } catch {
    // ignore — gesture may still be rejected on some builds
  }
};

/** Async path for welcome page / messages (no user-gesture requirement there). */
const openSidePanel = async (tab?: browser.Tabs.Tab) => {
  const sidePanel = getSidePanelApi();
  if (!sidePanel?.open) {
    return;
  }

  try {
    if (typeof tab?.windowId === 'number') {
      await sidePanel.open({ windowId: tab.windowId });
      return;
    }

    if (typeof tab?.id === 'number') {
      await sidePanel.open({ tabId: tab.id });
      return;
    }

    if (typeof lastWindowId === 'number') {
      await sidePanel.open({ windowId: lastWindowId });
      return;
    }

    const currentWindow = await browser.windows.getCurrent();
    if (typeof currentWindow.id === 'number') {
      await sidePanel.open({ windowId: currentWindow.id });
    }
  } catch {
    // ignore
  }
};

const menuClickLooksSavable = (info: browser.Menus.OnClickData): boolean => {
  if (info.menuItemId === MENU_TEXT_ID) {
    return Boolean((info.selectionText || '').trim());
  }
  if (info.menuItemId === MENU_TARGET_ID) {
    return Boolean(info.srcUrl || info.linkUrl);
  }
  return false;
};

/** True when a URL clearly points at an image asset (path or data URL). */
const isImageUrl = (raw: string): boolean => {
  const value = raw.trim();
  if (!value) {
    return false;
  }
  if (/^data:image\//i.test(value)) {
    return true;
  }
  if (/^blob:/i.test(value)) {
    return true;
  }

  try {
    const url = new URL(value);
    // Strip query/hash so `photo.jpg?w=800` still counts.
    const path = url.pathname.toLowerCase();
    return /\.(avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i.test(path);
  } catch {
    return /\.(avif|bmp|gif|ico|jpe?g|png|svg|webp)(?:$|[?#])/i.test(value);
  }
};

const buildImageItem = (options: {
  imageUrl: string;
  imageAlt?: string;
  pageTitle: string;
  pageUrl: string;
  createdAt: string;
}) => {
  const imageAlt = (options.imageAlt || '').trim();
  return {
    id: buildId(),
    type: 'image' as const,
    content: getImageLabel(options.imageUrl, imageAlt),
    imageUrl: options.imageUrl,
    imageAlt,
    pageTitle: options.pageTitle,
    pageUrl: options.pageUrl,
    createdAt: options.createdAt,
    pinned: false,
  };
};

const getContextData = async (tabId?: number): Promise<ContextData | null> => {
  if (typeof tabId !== 'number') {
    return null;
  }

  try {
    const data = await browser.tabs.sendMessage(tabId, {
      type: 'side-stash-get-context',
    });
    return (data as ContextData) ?? null;
  } catch {
    return null;
  }
};

const buildId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeText = (value: string) =>
  value.trim().replace(/\s+/g, ' ');

const normalizeUrl = (value: string) => {
  const raw = value.trim();
  if (!raw) {
    return '';
  }

  try {
    const url = new URL(raw);
    url.hash = '';
    const hostname = url.hostname.toLowerCase();
    const protocol = url.protocol.toLowerCase();
    const pathname =
      url.pathname.length > 1 && url.pathname.endsWith('/')
        ? url.pathname.slice(0, -1)
        : url.pathname;
    return `${protocol}//${hostname}${pathname}${url.search}`;
  } catch {
    return raw;
  }
};

const buildDedupKey = (item: Record<string, unknown>) => {
  const type = String(item.type || '');
  if (type === 'text') {
    return `text:${normalizeText(String(item.content || ''))}`;
  }
  if (type === 'link') {
    return `link:${normalizeUrl(String(item.linkUrl || item.content || ''))}`;
  }
  if (type === 'image') {
    return `image:${normalizeUrl(String(item.imageUrl || item.content || ''))}`;
  }
  return '';
};

const getImageLabel = (imageUrl: string, imageAlt: string) => {
  if (imageAlt) {
    return imageAlt;
  }
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/').filter(Boolean);
    const filename = parts[parts.length - 1];
    if (filename) {
      return decodeURIComponent(filename);
    }
  } catch {
    // ignore invalid url
  }
  return imageUrl;
};

const addItem = async (item: Record<string, unknown>): Promise<'success' | 'duplicate'> => {
  const stored = await browser.storage.local.get(STORAGE_KEY);
  const items = Array.isArray(stored[STORAGE_KEY]) ? stored[STORAGE_KEY] : [];
  const nextKey = buildDedupKey(item);
  if (nextKey) {
    const exists = items.some((storedItem: Record<string, unknown>) => {
      return buildDedupKey(storedItem) === nextKey;
    });
    if (exists) {
      return 'duplicate';
    }
  }
  items.unshift(item);
  await browser.storage.local.set({ [STORAGE_KEY]: items });
  return 'success';
};

const formatBadgeCount = (count: number): string => {
  if (count <= 0) {
    return '';
  }
  if (count > BADGE_COUNT_CAP) {
    return `${BADGE_COUNT_CAP}+`;
  }
  return String(count);
};

const getStoredItemCount = async (): Promise<number> => {
  try {
    const stored = await browser.storage.local.get(STORAGE_KEY);
    return Array.isArray(stored[STORAGE_KEY]) ? stored[STORAGE_KEY].length : 0;
  } catch {
    return 0;
  }
};

const applyCountBadge = async (count?: number) => {
  try {
    const nextCount = typeof count === 'number' ? count : await getStoredItemCount();
    const text = formatBadgeCount(nextCount);

    // Set text first so the badge appears even if a color call fails.
    await browser.action.setBadgeText({ text });
    await browser.action.setBadgeBackgroundColor({ color: COUNT_BADGE_COLOR });
    try {
      // Supported in recent Chromium; safe to skip on older builds.
      await (browser.action as typeof browser.action & {
        setBadgeTextColor?: (details: { color: string }) => Promise<void>;
      }).setBadgeTextColor?.({ color: COUNT_BADGE_TEXT_COLOR });
    } catch {
      // ignore
    }
  } catch {
    // ignore when action API is unavailable
  }
};

const scheduleCountBadgeRestore = () => {
  if (badgeRestoreTimer) {
    clearTimeout(badgeRestoreTimer);
  }
  badgeRestoreTimer = setTimeout(() => {
    badgeRestoreTimer = null;
    void applyCountBadge();
  }, BADGE_CLEAR_MS);
};

const flashBadge = async (kind: FeedbackKind) => {
  try {
    const color =
      kind === 'success' ? '#22c55e' : kind === 'duplicate' ? '#d97706' : '#71717a';
    await browser.action.setBadgeText({
      text: kind === 'success' ? 'OK' : kind === 'duplicate' ? '!' : '·',
    });
    await browser.action.setBadgeBackgroundColor({ color });
    try {
      await (browser.action as typeof browser.action & {
        setBadgeTextColor?: (details: { color: string }) => Promise<void>;
      }).setBadgeTextColor?.({ color: '#ffffff' });
    } catch {
      // ignore
    }
    // After brief feedback, restore the item-count badge.
    scheduleCountBadgeRestore();
  } catch {
    // ignore when action API is unavailable
  }
};

const notifySaveFeedback = async (kind: FeedbackKind, tabId?: number) => {
  const message =
    kind === 'success'
      ? t('saveSuccess', 'Saved to Side Stash.')
      : kind === 'duplicate'
        ? t('duplicateNotice', 'Item already saved.')
        : t('saveEmptySelection', 'Select text first, then press the shortcut.');
  const toastType =
    kind === 'success' ? 'success' : kind === 'duplicate' ? 'warning' : 'info';

  void flashBadge(kind);

  try {
    await browser.runtime.sendMessage({
      type: 'side-stash-toast',
      toastType,
      message,
    });
  } catch {
    // side panel may be closed
  }

  if (typeof tabId === 'number') {
    try {
      await browser.tabs.sendMessage(tabId, {
        type: 'side-stash-page-toast',
        toastType,
        message,
      });
    } catch {
      // content script may be unavailable on restricted pages
    }
  }
};

const openWelcomePage = async () => {
  try {
    await browser.tabs.create({
      url: browser.runtime.getURL('/welcome.html'),
    });
  } catch {
    // ignore
  }
};

const saveSelectionFromTab = async (tab?: browser.Tabs.Tab) => {
  rememberWindowId(tab?.windowId);
  const tabId = tab?.id;
  const contextData = await getContextData(tabId);
  const selectedText = (contextData?.selectionText || '').trim();
  if (!selectedText) {
    await notifySaveFeedback('empty', tabId);
    return;
  }

  const result = await addItem({
    id: buildId(),
    type: 'text',
    content: selectedText,
    pageTitle: contextData?.pageTitle || tab?.title || '',
    pageUrl: tab?.url || '',
    createdAt: new Date().toISOString(),
    pinned: false,
  });
  await notifySaveFeedback(result, tabId);
};

const handleContextMenuSave = async (
  info: browser.Menus.OnClickData,
  tab?: browser.Tabs.Tab,
) => {
  if (!MENU_IDS.has(String(info.menuItemId))) {
    return;
  }

  rememberWindowId(tab?.windowId);
  const contextData = await getContextData(tab?.id);
  const pageTitle = contextData?.pageTitle || '';
  const pageUrl = info.pageUrl || tab?.url || '';
  const createdAt = new Date().toISOString();
  let newItem: Record<string, unknown> | null = null;

  if (info.menuItemId === MENU_TEXT_ID) {
    // Selection always saves as text (even if the string looks like a URL).
    const selectedText = (info.selectionText || contextData?.selectionText || '').trim();
    if (selectedText) {
      newItem = {
        id: buildId(),
        type: 'text',
        content: selectedText,
        pageTitle,
        pageUrl,
        createdAt,
        pinned: false,
      };
    }
  } else if (info.menuItemId === MENU_TARGET_ID) {
    // Prefer real image target; else image-looking link URL; else plain link.
    const imageUrl = info.srcUrl || contextData?.imageUrl || '';
    const linkUrl = info.linkUrl || contextData?.linkUrl || '';

    if (imageUrl) {
      const imageAlt = (contextData?.imageAlt || '').trim();
      newItem = buildImageItem({
        imageUrl,
        imageAlt,
        pageTitle,
        pageUrl,
        createdAt,
      });
    } else if (linkUrl && isImageUrl(linkUrl)) {
      const imageAlt =
        (contextData?.imageAlt || '').trim() ||
        (contextData?.linkText || '').trim() ||
        '';
      newItem = buildImageItem({
        imageUrl: linkUrl,
        imageAlt,
        pageTitle,
        pageUrl,
        createdAt,
      });
    } else if (linkUrl) {
      const linkText =
        (contextData?.linkText || '').trim() || info.selectionText || linkUrl;
      newItem = {
        id: buildId(),
        type: 'link',
        content: linkText,
        linkUrl,
        pageTitle,
        pageUrl,
        createdAt,
        pinned: false,
      };
    }
  }

  if (newItem) {
    const result = await addItem(newItem);
    await notifySaveFeedback(result, tab?.id);
  }
};

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener((details) => {
    void initializeI18n().then(() => refreshMenus());
    setPanelBehavior();
    void applyCountBadge();
    void hydrateOpenPanelOnSavePref();

    if (details.reason === 'install') {
      void openWelcomePage();
    }
  });

  browser.runtime.onStartup.addListener(() => {
    void initializeI18n().then(() => refreshMenus());
    setPanelBehavior();
    void applyCountBadge();
    void hydrateOpenPanelOnSavePref();
  });

  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') {
      return;
    }

    if (changes[getLanguagePreferenceKey()]) {
      void initializeI18n().then(() => refreshMenus());
    }

    if (changes[PREFERENCES_KEY]) {
      openPanelOnSaveCached = readOpenPanelOnSave(changes[PREFERENCES_KEY].newValue);
    }

    if (changes[STORAGE_KEY]) {
      const nextItems = changes[STORAGE_KEY].newValue;
      const count = Array.isArray(nextItems) ? nextItems.length : 0;
      // Don't clobber a brief OK / ! flash; restore timer will pick up the new count.
      if (!badgeRestoreTimer) {
        void applyCountBadge(count);
      }
    }
  });

  browser.windows?.onFocusChanged?.addListener((windowId) => {
    if (windowId !== browser.windows.WINDOW_ID_NONE) {
      rememberWindowId(windowId);
    }
  });

  browser.tabs?.onActivated?.addListener((activeInfo) => {
    rememberWindowId(activeInfo.windowId);
  });

  void initializeI18n().then(() => refreshMenus());
  setPanelBehavior();
  void applyCountBadge();
  void hydrateOpenPanelOnSavePref();
  void browser.windows.getCurrent().then((win) => rememberWindowId(win.id));

  browser.runtime.onMessage.addListener((message, sender) => {
    if (message?.type !== 'side-stash-open-panel') {
      return undefined;
    }

    void openSidePanel(sender.tab);
    return true;
  });

  browser.commands?.onCommand.addListener((command) => {
    if (command !== SAVE_SELECTION_COMMAND) {
      return;
    }

    // Open first, synchronously, before any await — required by Chrome.
    openSidePanelFromUserGesture(
      typeof lastWindowId === 'number' ? { windowId: lastWindowId } : undefined,
    );

    void browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      rememberWindowId(tabs[0]?.windowId);
      void saveSelectionFromTab(tabs[0]);
    });
  });

  // Update labels / hide target when selection is active (best-effort).
  const menusWithShown = browser.contextMenus as typeof browser.contextMenus & {
    onShown?: {
      addListener: (
        cb: (info: {
          mediaType?: string;
          srcUrl?: string;
          selectionText?: string;
          linkUrl?: string;
        }) => void,
      ) => void;
    };
  };
  menusWithShown.onShown?.addListener((info) => {
    void syncMenuForContext(info);
  });

  // Non-async listener so sidePanel.open runs in the same turn as the click.
  browser.contextMenus.onClicked.addListener((info, tab) => {
    rememberWindowId(tab?.windowId);

    if (menuClickLooksSavable(info)) {
      openSidePanelFromUserGesture({
        windowId: tab?.windowId,
        tabId: tab?.id,
      });
    }

    void handleContextMenuSave(info, tab);
  });
});
