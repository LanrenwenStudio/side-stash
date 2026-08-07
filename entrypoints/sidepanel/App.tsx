import React, { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { browser } from 'wxt/browser';
import { Pin, X } from 'lucide-react';
import { ConfirmDialog } from './components/ConfirmDialog';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { ItemList } from './components/ItemList';
import { StatusToast } from './components/StatusToast';
import { copyTextToClipboard } from './lib/clipboard';
import {
  getLanguageSelectValue,
  getLocaleLabel,
  getResolvedLocale,
  setLanguagePreference,
  subscribeToLanguageChange,
  t,
} from '../../lib/i18n';
import {
  getCopyValue,
  getDomainOptions,
  getFilteredItems,
  getOpenUrl,
  itemsToJson,
  itemsToMarkdown,
  parseImportPayload,
} from './lib/items';
import {
  clearAllItems,
  getItems,
  getPanelPreferences,
  mergeImportedItems,
  removeItems,
  saveItems,
  seedMockItems,
  setPanelPreferences,
  subscribeToItems,
  subscribeToPreferences,
  updateItem,
} from './lib/storage';
import {
  downloadImageItem,
  downloadImageItemsSequentially,
  downloadImagesZip,
} from './lib/download';
import { downloadTextFile, readTextFile } from './lib/transfer';
import type { CopyFormat, DateFilter, ItemFilter, SavedItem, ThemeMode } from './types';
import { applyTheme, setupThemeListener } from './lib/theme';
import { TooltipProvider } from './components/ui/tooltip';

type DeleteState =
  | { ids: string[]; itemLabel: string; message: string }
  | null;

const isDev = import.meta.env.DEV;

export function App() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [, setLanguageVersion] = useState(0);
  const [items, setItems] = useState<SavedItem[]>([]);
  const [pinTipDismissed, setPinTipDismissed] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<ItemFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [domainFilter, setDomainFilter] = useState('');
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copyFormat, setCopyFormat] = useState<CopyFormat>('plain');
  const [openPanelOnSave, setOpenPanelOnSave] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'warning' | 'error' | 'info';
    action?: {
      label: string;
      onClick: () => void;
    };
  } | null>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>(null);

  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filteredItems = useMemo(
    () => getFilteredItems(items, activeFilter, deferredQuery, dateFilter, domainFilter),
    [activeFilter, dateFilter, deferredQuery, domainFilter, items],
  );
  const domainOptions = useMemo(() => getDomainOptions(items), [items]);
  const selectedItems = useMemo(
    () => filteredItems.filter((item) => selectedIds.has(item.id)),
    [filteredItems, selectedIds],
  );
  const selectedCount = selectedItems.length;
  const selectedImageCount = useMemo(
    () => selectedItems.filter((item) => item.type === 'image' && item.imageUrl).length,
    [selectedItems],
  );
  const hasActiveFilters =
    activeFilter !== 'all' ||
    dateFilter !== 'all' ||
    domainFilter.length > 0 ||
    query.trim().length > 0;
  const languageSelectValue = getLanguageSelectValue();
  const resolvedLocale = getResolvedLocale();
  const allFilteredSelected =
    filteredItems.length > 0 && filteredItems.every((item) => selectedIds.has(item.id));
  const someFilteredSelected = filteredItems.some((item) => selectedIds.has(item.id));

  useEffect(() => {
    void browser.storage.local.get('pinTipDismissed').then((res) => {
      setPinTipDismissed(Boolean(res.pinTipDismissed));
    });
  }, []);

  const handleDismissPinTip = () => {
    setPinTipDismissed(true);
    void browser.storage.local.set({ pinTipDismissed: true });
  };

  const handleResetPinTip = () => {
    setPinTipDismissed(false);
    void browser.storage.local.set({ pinTipDismissed: false });
    setToast({
      message: t('pinTipReset', 'Reset Pin Tip'),
      type: 'info',
    });
  };

  useEffect(() => {
    return subscribeToLanguageChange(() => {
      setLanguageVersion((value) => value + 1);
    });
  }, []);

  useEffect(() => {
    document.title = t('panelTitle', 'Side Stash');
  }, [languageSelectValue, resolvedLocale]);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message && message.type === 'side-stash-toast') {
        setToast({
          message: message.message,
          type: message.toastType || 'warning',
        });
      }
    };

    browser.runtime.onMessage.addListener(handleMessage);
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    let active = true;

    void getItems().then((nextItems) => {
      if (!active) {
        return;
      }
      startTransition(() => setItems(nextItems));
    });

    const unsubscribe = subscribeToItems((nextItems) => {
      startTransition(() => setItems(nextItems));
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    void getPanelPreferences().then((prefs) => {
      if (!active) {
        return;
      }
      setCopyFormat(prefs.copyFormat);
      setOpenPanelOnSave(prefs.openPanelOnSave);
      setThemeMode(prefs.themeMode);
      applyTheme(prefs.themeMode);
    });

    const unsubscribe = subscribeToPreferences((prefs) => {
      setCopyFormat(prefs.copyFormat);
      setOpenPanelOnSave(prefs.openPanelOnSave);
      setThemeMode(prefs.themeMode);
      applyTheme(prefs.themeMode);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    applyTheme(themeMode);
    return setupThemeListener(() => themeMode);
  }, [themeMode]);

  useEffect(() => {
    setSelectedIds((previous) => {
      const availableIds = new Set(filteredItems.map((item) => item.id));
      const nextSelected = new Set<string>();

      previous.forEach((id) => {
        if (availableIds.has(id)) {
          nextSelected.add(id);
        }
      });

      return nextSelected;
    });
  }, [filteredItems]);

  useEffect(() => {
    if (domainFilter && !domainOptions.some((option) => option.domain === domainFilter)) {
      setDomainFilter('');
    }
  }, [domainFilter, domainOptions]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const duration = toast.action
      ? 4500
      : toast.type === 'warning' || toast.type === 'error'
        ? 4200
        : 2200;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleToggleItem = (id: string, checked: boolean) => {
    setSelectedIds((previous) => {
      const nextSelected = new Set(previous);
      if (checked) {
        nextSelected.add(id);
      } else {
        nextSelected.delete(id);
      }
      return nextSelected;
    });
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (!filteredItems.length) {
      return;
    }

    setSelectedIds((previous) => {
      const nextSelected = new Set(previous);
      filteredItems.forEach((item) => {
        if (checked) {
          nextSelected.add(item.id);
        } else {
          nextSelected.delete(item.id);
        }
      });
      return nextSelected;
    });
  };

  const handleUndoItems = async (itemsToRestore: SavedItem[], indicesToRestore: number[]) => {
    const currentItems = await getItems();
    const nextItems = [...currentItems];

    const pairs = itemsToRestore.map((item, i) => ({
      item,
      index: indicesToRestore[i],
    }));

    pairs.sort((a, b) => a.index - b.index);

    pairs.forEach(({ item, index }) => {
      const targetIndex = Math.min(Math.max(0, index), nextItems.length);
      nextItems.splice(targetIndex, 0, item);
    });

    await saveItems(nextItems);
    setToast(null);
  };

  const handleDeleteSingle = async (item: SavedItem) => {
    const index = items.findIndex((i) => i.id === item.id);
    const indices = index !== -1 ? [index] : [];

    await removeItems([item.id]);

    setSelectedIds((previous) => {
      const nextSelected = new Set(previous);
      nextSelected.delete(item.id);
      return nextSelected;
    });

    setToast({
      message: t('deleteSuccess', 'Item deleted.'),
      type: 'success',
      action: {
        label: t('actionUndo', 'Undo'),
        onClick: () => {
          void handleUndoItems([item], indices);
        },
      },
    });
  };

  const handleCopyItems = async (targetItems: SavedItem[], successMessage: string) => {
    if (!targetItems.length) {
      setToast({
        message: t('copyNoneSelected', 'No items selected.'),
        type: 'warning',
      });
      return;
    }

    const lines = targetItems.map((item) => getCopyValue(item, copyFormat)).filter(Boolean);
    if (!lines.length) {
      setToast({
        message: t('copyEmpty', 'No items to copy.'),
        type: 'warning',
      });
      return;
    }

    const success = await copyTextToClipboard(lines.join('\n'));
    setToast({
      message: success ? successMessage : t('copyFailed', 'Copy failed.'),
      type: success ? 'success' : 'error',
    });
  };

  const handleCutItems = async (targetItems: SavedItem[], successMessage: string) => {
    if (!targetItems.length) {
      setToast({
        message: t('copyNoneSelected', 'No items selected.'),
        type: 'warning',
      });
      return;
    }

    const lines = targetItems.map((item) => getCopyValue(item, copyFormat)).filter(Boolean);
    if (!lines.length) {
      setToast({
        message: t('copyEmpty', 'No items to copy.'),
        type: 'warning',
      });
      return;
    }

    const success = await copyTextToClipboard(lines.join('\n'));
    if (!success) {
      setToast({
        message: t('copyFailed', 'Copy failed.'),
        type: 'error',
      });
      return;
    }

    const idsToDelete = targetItems.map((item) => item.id);
    const deletedItems: SavedItem[] = [];
    const deletedIndices: number[] = [];
    items.forEach((item, index) => {
      if (idsToDelete.includes(item.id)) {
        deletedItems.push(item);
        deletedIndices.push(index);
      }
    });

    await removeItems(idsToDelete);
    setSelectedIds((previous) => {
      const nextSelected = new Set(previous);
      idsToDelete.forEach((id) => nextSelected.delete(id));
      return nextSelected;
    });

    setToast({
      message: successMessage,
      type: 'success',
      action: {
        label: t('actionUndo', 'Undo'),
        onClick: () => {
          void handleUndoItems(deletedItems, deletedIndices);
        },
      },
    });
  };

  const handleCopySingle = async (item: SavedItem) => {
    const text = getCopyValue(item, copyFormat);
    if (!text) {
      setToast({
        message: t('copyFailed', 'Copy failed.'),
        type: 'error',
      });
      return;
    }

    const success = await copyTextToClipboard(text);
    setToast({
      message: success ? t('copySingleSuccess', 'Copied.') : t('copyFailed', 'Copy failed.'),
      type: success ? 'success' : 'error',
    });
  };

  const handleCutSingle = async (item: SavedItem) => {
    await handleCutItems([item], t('cutSingleSuccess', 'Cut.'));
  };

  const handleOpenItem = (item: SavedItem) => {
    const url = getOpenUrl(item);
    if (!url) {
      setToast({
        message: t('openUnavailable', 'No URL to open.'),
        type: 'warning',
      });
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadSingle = async (item: SavedItem) => {
    if (item.type !== 'image' || !item.imageUrl) {
      setToast({
        message: t('downloadImageUnavailable', 'No image to download.'),
        type: 'warning',
      });
      return;
    }

    const success = await downloadImageItem(item);
    setToast({
      message: success
        ? t('downloadImageSuccess', 'Image download started.')
        : t('downloadImageFailed', 'Could not download image.'),
      type: success ? 'success' : 'error',
    });
  };

  const handleDownloadSelectedZip = async () => {
    const images = selectedItems.filter((item) => item.type === 'image' && item.imageUrl);
    if (!images.length) {
      setToast({
        message: t('downloadImageNoneSelected', 'No images selected.'),
        type: 'warning',
      });
      return;
    }

    setToast({
      message: t('toastZippingImages', 'Zipping images...'),
      type: 'info',
    });

    const result = await downloadImagesZip(images);
    if (result.ok > 0 && result.failed === 0) {
      setToast({
        message: t('toastZippedZipSuccess', 'Zipped and downloading $1 images (.zip)', [String(result.ok)]),
        type: 'success',
      });
      return;
    }
    if (result.ok > 0) {
      setToast({
        message: t('toastZippedZipPartial', 'Zipped $1 images (.zip), $2 failed', [String(result.ok), String(result.failed)]),
        type: 'warning',
      });
      return;
    }
    setToast({
      message: t('downloadImageFailed', 'Could not download image.'),
      type: 'error',
    });
  };

  const handleDownloadSelectedIndividual = async () => {
    const images = selectedItems.filter((item) => item.type === 'image' && item.imageUrl);
    if (!images.length) {
      setToast({
        message: t('downloadImageNoneSelected', 'No images selected.'),
        type: 'warning',
      });
      return;
    }

    setToast({
      message: t('toastDownloadingIndividual', 'Downloading $1 images individually...', [String(images.length)]),
      type: 'info',
    });

    const result = await downloadImageItemsSequentially(images);
    if (result.ok > 0 && result.failed === 0) {
      setToast({
        message: t('toastDownloadedIndividualSuccess', 'Downloaded $1 images successfully', [String(result.ok)]),
        type: 'success',
      });
      return;
    }
    if (result.ok > 0) {
      setToast({
        message: t('toastDownloadedIndividualPartial', 'Downloaded $1 images ($2 failed)', [String(result.ok), String(result.failed)]),
        type: 'warning',
      });
      return;
    }
    setToast({
      message: t('downloadImageFailed', 'Could not download image.'),
      type: 'error',
    });
  };

  const handleTogglePin = async (item: SavedItem) => {
    await updateItem(item.id, { pinned: !item.pinned });
    setToast({
      message: item.pinned
        ? t('unpinSuccess', 'Unpinned.')
        : t('pinSuccess', 'Pinned.'),
      type: 'success',
    });
  };

  const handleCopySelected = async () => {
    await handleCopyItems(
      selectedItems,
      t('copySuccess', `Copied ${selectedItems.length} items.`, [String(selectedItems.length)]),
    );
  };

  const handleCutSelected = async () => {
    await handleCutItems(
      selectedItems,
      t('cutSuccess', `Cut ${selectedItems.length} items.`, [String(selectedItems.length)]),
    );
  };

  const openDeleteDialog = (targetItems: SavedItem[]) => {
    if (!targetItems.length) {
      setToast({
        message: t('deleteNoneSelected', 'No items selected.'),
        type: 'warning',
      });
      return;
    }

    if (targetItems.length === 1) {
      void handleDeleteSingle(targetItems[0]);
      return;
    }

    setDeleteState({
      ids: targetItems.map((item) => item.id),
      itemLabel: t('selectedCount', '$1 selected', [String(targetItems.length)]),
      message: t('confirmDeleteMultiple', 'Delete $1 items?', [String(targetItems.length)]),
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteState?.ids.length) {
      setDeleteState(null);
      return;
    }

    const idsToDelete = [...deleteState.ids];
    const deletedItems: SavedItem[] = [];
    const deletedIndices: number[] = [];
    items.forEach((item, index) => {
      if (idsToDelete.includes(item.id)) {
        deletedItems.push(item);
        deletedIndices.push(index);
      }
    });

    await removeItems(idsToDelete);

    setSelectedIds((previous) => {
      const nextSelected = new Set(previous);
      idsToDelete.forEach((id) => nextSelected.delete(id));
      return nextSelected;
    });

    setDeleteState(null);

    setToast({
      message: idsToDelete.length === 1
        ? t('deleteSuccess', 'Item deleted.')
        : t('deleteMultipleSuccess', `Deleted ${idsToDelete.length} items.`, [String(idsToDelete.length)]),
      type: 'success',
      action: {
        label: t('actionUndo', 'Undo'),
        onClick: () => {
          void handleUndoItems(deletedItems, deletedIndices);
        },
      },
    });
  };

  const handleResetFilters = () => {
    setActiveFilter('all');
    setDateFilter('all');
    setDomainFilter('');
    setQuery('');
  };

  const handleCopyFormatChange = (format: CopyFormat) => {
    setCopyFormat(format);
    void setPanelPreferences({ copyFormat: format });
  };

  const handleOpenPanelOnSaveChange = (enabled: boolean) => {
    setOpenPanelOnSave(enabled);
    void setPanelPreferences({ openPanelOnSave: enabled });
  };

  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    applyTheme(mode);
    void setPanelPreferences({ themeMode: mode });
  };

  const handleExportJson = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(`side-stash-${stamp}.json`, itemsToJson(items), 'application/json');
    setToast({
      message: t('exportSuccess', 'Exported.'),
      type: 'success',
    });
  };

  const handleExportMarkdown = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(`side-stash-${stamp}.md`, itemsToMarkdown(items), 'text/markdown');
    setToast({
      message: t('exportSuccess', 'Exported.'),
      type: 'success',
    });
  };

  const handleImportFile = async (file: File) => {
    try {
      const raw = await readTextFile(file);
      const incoming = parseImportPayload(raw);
      if (!incoming.length) {
        setToast({
          message: t('importEmpty', 'No valid items in file.'),
          type: 'warning',
        });
        return;
      }

      const result = await mergeImportedItems(incoming);
      setToast({
        message: t('importSuccess', 'Imported $1 items.', [String(result.added)]),
        type: 'success',
      });
    } catch {
      setToast({
        message: t('importFailed', 'Import failed. Use a Side Stash JSON export.'),
        type: 'error',
      });
    }
  };

  const handleSeedMockData = async () => {
    const nextItems = await seedMockItems();
    setItems(nextItems);
    setToast({
      message: t('toastSeededMockData', 'Loaded 7 test items'),
      type: 'success',
    });
  };

  const handleClearAllData = async () => {
    const nextItems = await clearAllItems();
    setItems(nextItems);
    setSelectedIds(new Set());
    setToast({
      message: t('toastClearedAllData', 'Cleared all items'),
      type: 'info',
    });
  };

  const handleOpenWelcomePage = () => {
    void browser.tabs.create({
      url: browser.runtime.getURL('/welcome.html'),
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (event.key === 'Escape' && selectedIds.size > 0 && deleteState === null) {
        setSelectedIds(new Set());
        return;
      }

      if (event.key === '/' && !isTypingTarget && deleteState === null) {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a' && !isTypingTarget) {
        if (!filteredItems.length) {
          return;
        }

        event.preventDefault();
        setSelectedIds(new Set(filteredItems.map((item) => item.id)));
      }

      if (event.key === 'Enter' && selectedIds.size > 0 && !isTypingTarget && deleteState === null) {
        event.preventDefault();
        void handleCopySelected();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'x' && selectedItems.length > 0 && !isTypingTarget && deleteState === null) {
        event.preventDefault();
        void handleCutSelected();
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedItems.length > 0 && !isTypingTarget && deleteState === null) {
        event.preventDefault();
        openDeleteDialog(selectedItems);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [copyFormat, deleteState, filteredItems, selectedIds.size, selectedItems]);

  return (
    <TooltipProvider delayDuration={120}>
      <div className="relative flex h-full min-h-0 flex-col bg-transparent text-zinc-950 dark:text-zinc-50">
        {/* Floating Pin Tip Banner - full width container so pointing emoji stays 40px from right edge regardless of sidepanel resizing */}
        {!pinTipDismissed ? (
          <div className="relative z-30 shrink-0 border-b border-amber-300/80 bg-amber-50/95 px-3 pt-4 pb-2.5 text-amber-950 shadow-2xs backdrop-blur-sm dark:border-amber-800/80 dark:bg-amber-950/95 dark:text-amber-100">
            {/* Pointing up hand emoji aligned directly underneath Chrome's native Pin icon (~40px from right edge, inside visible iframe top) */}
            <div className="pointer-events-none absolute top-0.5 right-[40px] select-none text-base animate-bounce">
              👆
            </div>

            <div className="mx-auto flex max-w-[460px] items-center justify-between gap-2.5">
              <div className="flex min-w-0 flex-1 items-center gap-2 text-amber-950 dark:text-amber-100">
                <Pin className="size-3.5 shrink-0 text-amber-700 dark:text-amber-300" />
                <p className="m-0 text-[11px] font-medium leading-snug text-amber-900 dark:text-amber-200">
                  {t(
                    'pinTipBodyShort',
                    'Click the top-right Pin icon (📌) to pin Side Stash',
                  )}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  className="inline-flex h-6.5 items-center justify-center rounded-lg bg-amber-900 px-2.5 text-[10.5px] font-semibold text-white shadow-2xs transition-colors hover:bg-amber-950 dark:bg-amber-100 dark:text-amber-950 dark:hover:bg-white"
                  onClick={handleDismissPinTip}
                >
                  {t('pinTipGotIt', 'Got it')}
                </button>
                <button
                  type="button"
                  aria-label={t('pinTipGotIt', 'Got it')}
                  className="shrink-0 text-amber-700 hover:text-amber-950 dark:text-amber-400 dark:hover:text-amber-100"
                  onClick={handleDismissPinTip}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mx-auto flex h-full min-h-0 w-full max-w-[460px] flex-col px-2.5 py-2.5 sm:px-3 sm:py-3">
          <div className="shrink-0">

            <FilterBar
              activeFilter={activeFilter}
              dateFilter={dateFilter}
              domainFilter={domainFilter}
              domainOptions={domainOptions}
              allFilteredSelected={allFilteredSelected}
              filteredCount={filteredItems.length}
              hasFilteredItems={filteredItems.length > 0}
              hasPartialSelection={someFilteredSelected}
              query={query}
              searchInputRef={searchInputRef}
              selectedCount={selectedCount}
              selectedImageCount={selectedImageCount}
              copyFormat={copyFormat}
              openPanelOnSave={openPanelOnSave}
              themeMode={themeMode}
              languageSelectValue={languageSelectValue}
              resolvedLocaleLabel={getLocaleLabel(resolvedLocale)}
              onClearQuery={() => setQuery('')}
              onFilterChange={setActiveFilter}
              onDateFilterChange={setDateFilter}
              onDomainFilterChange={setDomainFilter}
              onQueryChange={setQuery}
              onToggleSelectAll={handleToggleSelectAll}
              onCopy={handleCopySelected}
              onCut={handleCutSelected}
              onDelete={() => openDeleteDialog(selectedItems)}
              onDownloadZip={() => {
                void handleDownloadSelectedZip();
              }}
              onDownloadIndividual={() => {
                void handleDownloadSelectedIndividual();
              }}
              onLanguageChange={(value) => {
                void setLanguagePreference(value);
              }}
              onCopyFormatChange={handleCopyFormatChange}
              onOpenPanelOnSaveChange={handleOpenPanelOnSaveChange}
              onThemeModeChange={handleThemeModeChange}
              onExportJson={handleExportJson}
              onExportMarkdown={handleExportMarkdown}
              onImportFile={(file) => {
                void handleImportFile(file);
              }}
              onSeedMockData={isDev ? handleSeedMockData : undefined}
              onClearAllData={isDev ? handleClearAllData : undefined}
              onOpenWelcomePage={isDev ? handleOpenWelcomePage : undefined}
              onResetPinTip={isDev ? handleResetPinTip : undefined}
            />
          </div>

          <main className="mt-2.5 min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-14">
            {filteredItems.length === 0 ? (
              <EmptyState
                hasActiveFilters={hasActiveFilters}
                hasItems={items.length > 0}
                onResetFilters={handleResetFilters}
                onLoadMockData={isDev ? handleSeedMockData : undefined}
              />
            ) : (
              <ItemList
                items={filteredItems}
                selectedIds={selectedIds}
                onCopyItem={handleCopySingle}
                onCutItem={handleCutSingle}
                onDeleteItem={handleDeleteSingle}
                onDownloadItem={(item) => {
                  void handleDownloadSingle(item);
                }}
                onOpenItem={handleOpenItem}
                onToggleItem={handleToggleItem}
                onTogglePin={(item) => {
                  void handleTogglePin(item);
                }}
              />
            )}
          </main>
        </div>

        <StatusToast message={toast?.message ?? ''} type={toast?.type} action={toast?.action} />

        <ConfirmDialog
          description={deleteState?.message ?? t('confirmDelete', 'Delete this item?')}
          open={deleteState !== null}
          title={t('confirmTitle', 'Delete item')}
          value={deleteState?.itemLabel ?? ''}
          onConfirm={handleConfirmDelete}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteState(null);
            }
          }}
        />
      </div>
    </TooltipProvider>
  );
}
