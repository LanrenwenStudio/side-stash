import { browser } from 'wxt/browser';
import type { CopyFormat, PanelPreferences, SavedItem } from '../types';

import { MOCK_ITEMS } from './mockData';

const STORAGE_KEY = 'items';
const INITIALIZED_KEY = 'debug_initialized';
const PREFERENCES_KEY = 'panelPreferences';

const DEFAULT_PREFERENCES: PanelPreferences = {
  copyFormat: 'plain',
  openPanelOnSave: true,
};

export async function getItems(): Promise<SavedItem[]> {
  if (!browser?.storage?.local) {
    return MOCK_ITEMS;
  }

  const stored = await browser.storage.local.get([STORAGE_KEY, INITIALIZED_KEY]);

  if (Array.isArray(stored[STORAGE_KEY])) {
    return stored[STORAGE_KEY] as SavedItem[];
  }

  // First run seed with default mock items for testing
  if (!stored[INITIALIZED_KEY]) {
    await browser.storage.local.set({
      [STORAGE_KEY]: MOCK_ITEMS,
      [INITIALIZED_KEY]: true,
    });
    return MOCK_ITEMS;
  }

  return [];
}

export async function saveItems(items: SavedItem[]) {
  if (!browser?.storage?.local) {
    return;
  }

  await browser.storage.local.set({ [STORAGE_KEY]: items, [INITIALIZED_KEY]: true });
}

export async function seedMockItems(): Promise<SavedItem[]> {
  await saveItems(MOCK_ITEMS);
  return MOCK_ITEMS;
}

export async function clearAllItems(): Promise<SavedItem[]> {
  await saveItems([]);
  return [];
}

export async function removeItems(ids: string[]) {
  if (!ids.length) {
    return;
  }

  const currentItems = await getItems();
  const idSet = new Set(ids);
  await saveItems(currentItems.filter((item) => !idSet.has(item.id)));
}

export async function updateItem(id: string, patch: Partial<SavedItem>) {
  const currentItems = await getItems();
  const nextItems = currentItems.map((item) => (item.id === id ? { ...item, ...patch } : item));
  await saveItems(nextItems);
  return nextItems;
}

export async function mergeImportedItems(incoming: SavedItem[]) {
  if (!incoming.length) {
    return { added: 0, total: (await getItems()).length };
  }

  const currentItems = await getItems();
  const existingIds = new Set(currentItems.map((item) => item.id));
  const nextItems = [...currentItems];
  let added = 0;

  incoming.forEach((item) => {
    if (existingIds.has(item.id)) {
      return;
    }
    existingIds.add(item.id);
    nextItems.unshift(item);
    added += 1;
  });

  await saveItems(nextItems);
  return { added, total: nextItems.length };
}

export function subscribeToItems(listener: (items: SavedItem[]) => void) {
  if (!browser?.storage?.onChanged) {
    return () => undefined;
  }

  const handleChange = (
    changes: Record<string, browser.Storage.StorageChange>,
    areaName: string,
  ) => {
    if (areaName !== 'local' || !changes[STORAGE_KEY]) {
      return;
    }

    listener(Array.isArray(changes[STORAGE_KEY].newValue) ? changes[STORAGE_KEY].newValue : []);
  };

  browser.storage.onChanged.addListener(handleChange);

  return () => {
    browser.storage.onChanged.removeListener(handleChange);
  };
}

function sanitizePreferences(value: unknown): PanelPreferences {
  if (!value || typeof value !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const candidate = value as Partial<PanelPreferences>;
  const copyFormat: CopyFormat =
    candidate.copyFormat === 'markdown' || candidate.copyFormat === 'source'
      ? candidate.copyFormat
      : 'plain';
  const openPanelOnSave =
    typeof candidate.openPanelOnSave === 'boolean'
      ? candidate.openPanelOnSave
      : DEFAULT_PREFERENCES.openPanelOnSave;

  return { copyFormat, openPanelOnSave };
}

export async function getPanelPreferences(): Promise<PanelPreferences> {
  if (!browser?.storage?.local) {
    return DEFAULT_PREFERENCES;
  }

  const stored = await browser.storage.local.get(PREFERENCES_KEY);
  return sanitizePreferences(stored[PREFERENCES_KEY]);
}

export async function setPanelPreferences(next: Partial<PanelPreferences>) {
  const current = await getPanelPreferences();
  const merged = sanitizePreferences({ ...current, ...next });
  if (!browser?.storage?.local) {
    return merged;
  }
  await browser.storage.local.set({ [PREFERENCES_KEY]: merged });
  return merged;
}

export function subscribeToPreferences(listener: (prefs: PanelPreferences) => void) {
  if (!browser?.storage?.onChanged) {
    return () => undefined;
  }

  const handleChange = (
    changes: Record<string, browser.Storage.StorageChange>,
    areaName: string,
  ) => {
    if (areaName !== 'local' || !changes[PREFERENCES_KEY]) {
      return;
    }
    listener(sanitizePreferences(changes[PREFERENCES_KEY].newValue));
  };

  browser.storage.onChanged.addListener(handleChange);
  return () => browser.storage.onChanged.removeListener(handleChange);
}
