import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FilterBar } from '../../../entrypoints/sidepanel/components/FilterBar';
import { ItemList } from '../../../entrypoints/sidepanel/components/ItemList';
import { EmptyState } from '../../../entrypoints/sidepanel/components/EmptyState';
import { StatusToast } from '../../../entrypoints/sidepanel/components/StatusToast';
import { TooltipProvider } from '../../../entrypoints/sidepanel/components/ui/tooltip';
import { getCopyValue, getDomainOptions, getFilteredItems } from '../../../entrypoints/sidepanel/lib/items';
import { MOCK_ITEMS } from '../../../entrypoints/sidepanel/lib/mockData';
import type {
  CopyFormat,
  DateFilter,
  ItemFilter,
  SavedItem,
  ThemeMode,
} from '../../../entrypoints/sidepanel/types';
import { getLocaleLabel, getResolvedLocale } from '../../../lib/i18n';
import { SITE_LOCALES, siteText, type SiteLocale } from '../i18n';

export type SidePanelDemoHandle = {
  addItem: (item: Omit<SavedItem, 'id' | 'createdAt' | 'pinned'> & Partial<Pick<SavedItem, 'id' | 'createdAt' | 'pinned'>>) => void;
  reset: () => void;
  /** Surface extension-style feedback (e.g. empty Alt+S selection). */
  notify: (
    message: string,
    type?: 'success' | 'warning' | 'error' | 'info',
  ) => void;
};

type SidePanelDemoProps = {
  lang: SiteLocale;
  theme: 'dark' | 'light';
  /** Compact height for hero embed */
  compact?: boolean;
  className?: string;
  demoRef?: React.MutableRefObject<SidePanelDemoHandle | null>;
  seedItems?: SavedItem[];
};

function cloneMockItems(): SavedItem[] {
  return MOCK_ITEMS.map((item, index) => ({
    ...item,
    id: `demo-${item.id}`,
    createdAt: new Date(Date.now() - index * 45 * 60 * 1000).toISOString(),
  }));
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function SidePanelDemo({
  lang,
  theme,
  compact = false,
  className = '',
  demoRef,
  seedItems,
}: SidePanelDemoProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  // `undefined` seed → start with mock data (hero). Explicit `[]` → empty playground.
  const [items, setItems] = useState<SavedItem[]>(() =>
    seedItems === undefined ? cloneMockItems() : seedItems.map((item) => ({ ...item })),
  );
  const [activeFilter, setActiveFilter] = useState<ItemFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [domainFilter, setDomainFilter] = useState('');
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copyFormat, setCopyFormat] = useState<CopyFormat>('plain');
  const [openPanelOnSave, setOpenPanelOnSave] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>(theme);
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'warning' | 'error' | 'info';
    action?: { label: string; onClick: () => void };
  } | null>(null);

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const duration = toast.action ? 4500 : toast.type === 'warning' || toast.type === 'error' ? 4200 : 2200;
    const timeout = window.setTimeout(() => setToast(null), duration);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredItems = useMemo(
    () => getFilteredItems(items, activeFilter, query.trim().toLowerCase(), dateFilter, domainFilter),
    [items, activeFilter, query, dateFilter, domainFilter],
  );
  const domainOptions = useMemo(() => getDomainOptions(items), [items]);
  const selectedItems = useMemo(
    () => filteredItems.filter((item) => selectedIds.has(item.id)),
    [filteredItems, selectedIds],
  );
  const selectedCount = selectedItems.length;
  const selectedImageCount = selectedItems.filter((item) => item.type === 'image' && item.imageUrl).length;
  const allFilteredSelected =
    filteredItems.length > 0 && filteredItems.every((item) => selectedIds.has(item.id));
  const hasPartialSelection = filteredItems.some((item) => selectedIds.has(item.id));
  const hasActiveFilters =
    activeFilter !== 'all' || dateFilter !== 'all' || domainFilter.length > 0 || query.trim().length > 0;

  useEffect(() => {
    setSelectedIds((previous) => {
      const available = new Set(filteredItems.map((item) => item.id));
      const next = new Set<string>();
      previous.forEach((id) => {
        if (available.has(id)) next.add(id);
      });
      return next;
    });
  }, [filteredItems]);

  useEffect(() => {
    if (domainFilter && !domainOptions.some((option) => option.domain === domainFilter)) {
      setDomainFilter('');
    }
  }, [domainFilter, domainOptions]);

  const showToast = (
    message: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'success',
    action?: { label: string; onClick: () => void },
  ) => {
    setToast({ message, type, action });
  };

  const addItem: SidePanelDemoHandle['addItem'] = (partial) => {
    const newItem: SavedItem = {
      id: partial.id || `saved-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: partial.type,
      content: partial.content,
      linkUrl: partial.linkUrl,
      imageUrl: partial.imageUrl,
      imageAlt: partial.imageAlt,
      pageTitle: partial.pageTitle || (siteText(lang, 'Demo page', '演示页面', 'デモページ', '데모 페이지', '示範頁面')),
      pageUrl: partial.pageUrl || 'https://sidestash.lanrenwen.com',
      createdAt: partial.createdAt || new Date().toISOString(),
      pinned: partial.pinned ?? false,
    };
    setItems((prev) => [newItem, ...prev]);
    showToast(
      newItem.type === 'image'
        ? siteText(lang, 'Image saved', '已保存图片', '画像を保存しました', '이미지 저장됨', '已儲存圖片')
        : newItem.type === 'link'
          ? siteText(lang, 'Link saved', '已保存链接', 'リンクを保存しました', '링크 저장됨', '已儲存連結')
          : siteText(lang, 'Text saved', '已保存文本', 'テキストを保存しました', '텍스트 저장됨', '已儲存文字'),
    );
  };

  const loadMocks = () => {
    setItems(cloneMockItems());
    setActiveFilter('all');
    setDateFilter('all');
    setDomainFilter('');
    setQuery('');
    setSelectedIds(new Set());
  };

  const reset = () => {
    if (seedItems === undefined) {
      loadMocks();
    } else {
      setItems(seedItems.map((item) => ({ ...item })));
      setActiveFilter('all');
      setDateFilter('all');
      setDomainFilter('');
      setQuery('');
      setSelectedIds(new Set());
    }
    showToast(siteText(lang, 'Demo data reset', '已重置演示数据', 'デモをリセットしました', '데모 데이터 초기화됨', '已重設示範資料'), 'info');
  };

  useEffect(() => {
    if (!demoRef) return;
    demoRef.current = {
      addItem,
      reset,
      notify: (message, type = 'info') => showToast(message, type),
    };
    return () => {
      demoRef.current = null;
    };
  });

  const handleToggleItem = (id: string, checked: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (!filteredItems.length) return;
    setSelectedIds((previous) => {
      const next = new Set(previous);
      filteredItems.forEach((item) => {
        if (checked) next.add(item.id);
        else next.delete(item.id);
      });
      return next;
    });
  };

  const handleCopyItems = async (targetItems: SavedItem[]) => {
    if (!targetItems.length) {
      showToast(siteText(lang, 'Select items first', '请先选择条目', '項目を選択してください', '항목을 먼저 선택하세요', '請先選取項目'), 'warning');
      return;
    }
    const lines = targetItems.map((item) => getCopyValue(item, copyFormat)).filter(Boolean);
    if (!lines.length) {
      showToast(siteText(lang, 'Nothing to copy', '没有可复制的内容', 'コピーする内容がありません', '복사할 내용이 없습니다', '沒有可複製的內容'), 'warning');
      return;
    }
    const ok = await copyToClipboard(lines.join('\n'));
    showToast(
      ok ? siteText(lang, 'Copied to clipboard', '已复制到剪贴板', 'クリップボードにコピーしました', '클립보드에 복사됨', '已複製到剪貼簿') : siteText(lang, 'Copy failed', '复制失败', 'コピーできませんでした', '복사 실패', '複製失敗'),
      ok ? 'success' : 'error',
    );
  };

  const handleDeleteItems = (targetItems: SavedItem[]) => {
    if (!targetItems.length) {
      showToast(siteText(lang, 'Select items first', '请先选择条目', '項目を選択してください', '항목을 먼저 선택하세요', '請先選取項目'), 'warning');
      return;
    }
    const ids = new Set(targetItems.map((item) => item.id));
    const snapshot = targetItems.map((item) => ({ ...item }));
    setItems((prev) => prev.filter((item) => !ids.has(item.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    showToast(siteText(lang, 'Deleted', '已删除', '削除しました', '삭제됨', '已刪除'), 'success', {
      label: siteText(lang, 'Undo', '撤销', '元に戻す', '실행 취소', '復原'),
      onClick: () => {
        setItems((prev) => [...snapshot, ...prev]);
        setToast(null);
      },
    });
  };

  const handleCutItems = async (targetItems: SavedItem[]) => {
    if (!targetItems.length) {
      showToast(siteText(lang, 'Select items first', '请先选择条目', '項目を選択してください', '항목을 먼저 선택하세요', '請先選取項目'), 'warning');
      return;
    }
    await handleCopyItems(targetItems);
    handleDeleteItems(targetItems);
  };

  const handleTogglePin = (item: SavedItem) => {
    setItems((prev) =>
      prev.map((entry) => (entry.id === item.id ? { ...entry, pinned: !entry.pinned } : entry)),
    );
  };

  const resolvedLocale = getResolvedLocale();

  // Fixed shell height so filter switches (text / link / image) never reflow the page.
  const shellHeight = compact ? 'h-[620px]' : 'h-[680px]';
  const listHeight = compact ? 'h-[400px]' : 'h-[460px]';

  return (
    <TooltipProvider>
      <div
        className={[
          'relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-[var(--color-paper)] shadow-[0_24px_80px_rgba(9,9,11,0.12)] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)]',
          shellHeight,
          className,
        ].join(' ')}
      >
        {/* Side panel chrome */}
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200/90 px-3.5 py-2.5 dark:border-zinc-800">
          <div className="flex min-w-0 items-center gap-2">
            <img src="/icon-32.png" alt="" className="size-5 rounded-md" />
            <span className="truncate text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Side Stash
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              {items.length}
            </span>
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-3">
          <FilterBar
            activeFilter={activeFilter}
            dateFilter={dateFilter}
            domainFilter={domainFilter}
            domainOptions={domainOptions}
            allFilteredSelected={allFilteredSelected}
            filteredCount={filteredItems.length}
            hasFilteredItems={filteredItems.length > 0}
            hasPartialSelection={hasPartialSelection}
            query={query}
            searchInputRef={searchInputRef}
            selectedCount={selectedCount}
            selectedImageCount={selectedImageCount}
            copyFormat={copyFormat}
            openPanelOnSave={openPanelOnSave}
            themeMode={themeMode}
            languageSelectValue={SITE_LOCALES[lang].extensionLocale}
            resolvedLocaleLabel={getLocaleLabel(resolvedLocale)}
            onClearQuery={() => setQuery('')}
            onFilterChange={setActiveFilter}
            onDateFilterChange={setDateFilter}
            onDomainFilterChange={setDomainFilter}
            onQueryChange={setQuery}
            onToggleSelectAll={handleToggleSelectAll}
            onCopy={() => void handleCopyItems(selectedItems)}
            onCut={() => void handleCutItems(selectedItems)}
            onDelete={() => handleDeleteItems(selectedItems)}
            onDownloadZip={() =>
              showToast(siteText(lang, 'Demo: ZIP download', '演示模式：ZIP 打包', 'デモ：ZIP ダウンロード', '데모: ZIP 다운로드', '示範：ZIP 下載'), 'info')
            }
            onDownloadIndividual={() =>
              showToast(siteText(lang, 'Demo: download images', '演示模式：逐张下载', 'デモ：画像を個別にダウンロード', '데모: 이미지 개별 다운로드', '示範：逐張下載'), 'info')
            }
            onLanguageChange={() => undefined}
            onCopyFormatChange={setCopyFormat}
            onOpenPanelOnSaveChange={setOpenPanelOnSave}
            onThemeModeChange={setThemeMode}
            onExportJson={() => showToast(siteText(lang, 'Demo: export JSON', '演示模式：导出 JSON', 'デモ：JSON エクスポート', '데모: JSON 내보내기', '示範：匯出 JSON'), 'info')}
            onExportMarkdown={() =>
              showToast(siteText(lang, 'Demo: export Markdown', '演示模式：导出 Markdown', 'デモ：Markdown エクスポート', '데모: Markdown 내보내기', '示範：匯出 Markdown'), 'info')
            }
            onImportFile={() => undefined}
            onSeedMockData={() => {
              loadMocks();
              showToast(siteText(lang, 'Loaded sample items', '已载入示例数据', 'サンプルを読み込みました', '샘플 데이터 불러옴', '已載入範例資料'), 'info');
            }}
            onClearAllData={() => {
              setItems([]);
              setSelectedIds(new Set());
              showToast(siteText(lang, 'Demo cleared', '已清空演示数据', 'デモを消去しました', '데모 데이터 지움', '已清空示範資料'), 'info');
            }}
          />

          <div className={['min-h-0 flex-1 overflow-y-auto pr-0.5', listHeight].join(' ')}>
            {filteredItems.length > 0 ? (
              <ItemList
                items={filteredItems}
                selectedIds={selectedIds}
                onCopyItem={(item) => void handleCopyItems([item])}
                onCutItem={(item) => void handleCutItems([item])}
                onDeleteItem={(item) => handleDeleteItems([item])}
                onDownloadItem={() =>
                  showToast(siteText(lang, 'Demo: download image', '演示模式：下载图片', 'デモ：画像ダウンロード', '데모: 이미지 다운로드', '示範：下載圖片'), 'info')
                }
                onOpenItem={(item) => {
                  const url =
                    item.type === 'link'
                      ? item.linkUrl || item.pageUrl
                      : item.type === 'image'
                        ? item.imageUrl || item.pageUrl
                        : item.pageUrl;
                  if (url) window.open(url, '_blank', 'noopener,noreferrer');
                }}
                onToggleItem={handleToggleItem}
                onTogglePin={handleTogglePin}
              />
            ) : (
              <EmptyState
                hasActiveFilters={hasActiveFilters}
                hasItems={items.length > 0}
                onResetFilters={() => {
                  setActiveFilter('all');
                  setDateFilter('all');
                  setDomainFilter('');
                  setQuery('');
                }}
                onLoadMockData={() => {
                  loadMocks();
                  showToast(siteText(lang, 'Loaded sample items', '已载入示例数据', 'サンプルを読み込みました', '샘플 데이터 불러옴', '已載入範例資料'), 'info');
                }}
              />
            )}
          </div>
        </div>

        {/* Toast sits inside the panel frame for the marketing page */}
        {toast ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3">
            <div className="pointer-events-auto [&>div]:static [&>div]:inset-auto [&>div]:mx-0 [&>div]:w-full [&>div]:max-w-none">
              <StatusToast message={toast.message} type={toast.type} action={toast.action} />
            </div>
          </div>
        ) : null}
      </div>
    </TooltipProvider>
  );
}
