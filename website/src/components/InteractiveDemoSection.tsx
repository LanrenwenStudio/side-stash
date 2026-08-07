import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Image as ImageIcon,
  Link2,
  MousePointerClick,
  Pin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type { CopyFormat, DateFilter, ItemFilter, SavedItem, ThemeMode } from '../../../entrypoints/sidepanel/types';
import { getFilteredItems } from '../../../entrypoints/sidepanel/lib/items';
import { ItemList } from '../../../entrypoints/sidepanel/components/ItemList';
import { FilterBar } from '../../../entrypoints/sidepanel/components/FilterBar';
import { TooltipProvider } from '../../../entrypoints/sidepanel/components/ui/tooltip';

type InteractiveDemoSectionProps = {
  lang: 'zh' | 'en';
  theme: 'dark' | 'light';
};

const SAMPLE_DEMO_ITEMS: SavedItem[] = [
  {
    id: 'demo-1',
    type: 'text',
    content: 'Tailwind CSS v4 introduces @variant dark (&:where(.dark, .dark *)) for ultra-fast selector-based dark mode.',
    pageTitle: 'Tailwind CSS v4 Release Notes',
    pageUrl: 'https://tailwindcss.com/blog/tailwindcss-v4',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    pinned: true,
  },
  {
    id: 'demo-2',
    type: 'link',
    content: 'WXT Framework — Next-gen Web Extension Development Framework',
    linkUrl: 'https://wxt.dev/',
    pageTitle: 'WXT Documentation',
    pageUrl: 'https://wxt.dev/',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    pinned: false,
  },
  {
    id: 'demo-3',
    type: 'image',
    content: 'Abstract Vibrant Glassmorphism UI Artwork',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Vibrant Art',
    pageTitle: 'Unsplash Design Showcase',
    pageUrl: 'https://unsplash.com/photos/abstract-art',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    pinned: false,
  },
];

export function InteractiveDemoSection({ lang, theme }: InteractiveDemoSectionProps) {
  const isZh = lang === 'zh';
  const [items, setItems] = useState<SavedItem[]>(SAMPLE_DEMO_ITEMS);
  const [activeFilter, setActiveFilter] = useState<ItemFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [domainFilter, setDomainFilter] = useState('');
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copyFormat, setCopyFormat] = useState<CopyFormat>('plain');
  const [openPanelOnSave, setOpenPanelOnSave] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>(theme);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme parameter with internal themeMode state
  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  // Context Menu simulator state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; text?: string; linkUrl?: string; imageUrl?: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveText = (text: string) => {
    const newItem: SavedItem = {
      id: `saved-${Date.now()}`,
      type: 'text',
      content: text,
      pageTitle: isZh ? '交互试用页面' : 'Interactive Demo Page',
      pageUrl: 'https://sidestash.lanrenwen.com',
      createdAt: new Date().toISOString(),
      pinned: false,
    };
    setItems((prev) => [newItem, ...prev]);
    showToast(isZh ? '⚡ 成功保存文本到 Side Stash！' : '⚡ Saved text to Side Stash!');
  };

  const handleSaveLink = (title: string, url: string) => {
    const newItem: SavedItem = {
      id: `saved-${Date.now()}`,
      type: 'link',
      content: title,
      linkUrl: url,
      pageTitle: isZh ? '交互试用页面' : 'Interactive Demo Page',
      pageUrl: 'https://sidestash.lanrenwen.com',
      createdAt: new Date().toISOString(),
      pinned: false,
    };
    setItems((prev) => [newItem, ...prev]);
    showToast(isZh ? '🔗 成功保存链接到 Side Stash！' : '🔗 Saved link to Side Stash!');
  };

  const handleSaveImage = (alt: string, url: string) => {
    const newItem: SavedItem = {
      id: `saved-${Date.now()}`,
      type: 'image',
      content: alt,
      imageUrl: url,
      imageAlt: alt,
      pageTitle: isZh ? '交互试用页面' : 'Interactive Demo Page',
      pageUrl: 'https://sidestash.lanrenwen.com',
      createdAt: new Date().toISOString(),
      pinned: false,
    };
    setItems((prev) => [newItem, ...prev]);
    showToast(isZh ? '🖼️ 成功保存图片到 Side Stash！' : '🖼️ Saved image to Side Stash!');
  };

  const handleTogglePin = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item)),
    );
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredItems.map((item) => item.id);
      setSelectedIds(new Set(allIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleDeleteItems = (ids: string[]) => {
    const idSet = new Set(ids);
    setItems((prev) => prev.filter((item) => !idSet.has(item.id)));
    setSelectedIds(new Set());
    showToast(isZh ? '已删除选中的内容' : 'Deleted selected items');
  };

  const filteredItems = getFilteredItems(items, activeFilter, query.trim().toLowerCase(), dateFilter, domainFilter);

  return (
    <TooltipProvider>
      <section id="live-demo" className="py-16 md:py-24 bg-zinc-100/70 border-y border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800/80 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <MousePointerClick className="size-3.5" />
              <span>{isZh ? '⚡ 网页实时互动试用' : '⚡ Interactive Live Playground'}</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              {isZh ? '无需安装，在网页中直接试用功能' : 'Try Side Stash right here in your browser'}
            </h2>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              {isZh
                ? '点击左侧模拟网页中的【保存文本】、【保存链接】或【保存图片】按钮，右侧的侧边栏组件将实时为您呈现捕获与管理效果！'
                : 'Click any "Save" action on the left simulated article canvas. Watch saved snippets land directly into the live side panel on the right!'}
            </p>
          </div>

          {/* Interactive Demo Grid */}
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            
            {/* Left Canvas: Simulated Web Article (7 Cols) */}
            <div
              className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950/90 dark:shadow-2xl relative transition-colors"
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({
                  x: Math.min(e.nativeEvent.offsetX, 220),
                  y: Math.min(e.nativeEvent.offsetY, 260),
                  text: 'Side Stash 让灵感与资料整理变得触手可及。',
                  linkUrl: 'https://github.com/LanrenwenStudio/side-stash',
                  imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
                });
              }}
              onClick={() => contextMenu && setContextMenu(null)}
            >
              {/* Browser Bar Mockup */}
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-rose-500/80" />
                  <div className="size-3 rounded-full bg-amber-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-400 font-mono w-64 justify-center">
                  <span>https://article-demo.com/design-notes</span>
                </div>
                <div className="text-[11px] font-semibold text-indigo-600 bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded">
                  {isZh ? '右键可触发模拟菜单' : 'Right-click for Menu'}
                </div>
              </div>

              {/* Simulated Content Block 1: Text */}
              <div className="group relative rounded-xl border border-zinc-200/90 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-900/50 p-4 transition-all hover:border-indigo-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {isZh ? '📝 文本选区示例' : '📝 Text Snippet'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveText(
                        isZh
                          ? 'Side Stash 是一款专注于高效率本地收藏的浏览器侧边栏扩展程序。'
                          : 'Side Stash is a focused browser side panel extension for local snippet collection.',
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 cursor-pointer active:scale-95"
                  >
                    <Plus className="size-3.5" />
                    <span>{isZh ? '保存此段文本' : 'Save Text'}</span>
                  </button>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-800 dark:text-zinc-300 font-serif italic">
                  “{isZh ? 'Side Stash 是一款专注于高效率本地收藏的浏览器侧边栏扩展程序。右键即可瞬时将文字保存进个人侧边栏。' : 'Side Stash is a focused browser side panel extension for local snippet collection. Right-click saves snippets instantly.'}”
                </p>
              </div>

              {/* Simulated Content Block 2: Image */}
              <div className="group relative mt-4 rounded-xl border border-zinc-200/90 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-900/50 p-4 transition-all hover:border-amber-500/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {isZh ? '🖼️ 图片保存示例' : '🖼️ Image Card'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveImage(
                        isZh ? '现代极简艺术设计插画' : 'Modern Minimalist Art Illustration',
                        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:bg-amber-500 cursor-pointer active:scale-95"
                  >
                    <Plus className="size-3.5" />
                    <span>{isZh ? '保存此张图片' : 'Save Image'}</span>
                  </button>
                </div>
                <div className="relative h-44 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <img
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
                    alt="Art Illustration"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-xs font-medium text-white">
                      {isZh ? '现代极简艺术灵感插画' : 'Modern Art Design Asset'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Simulated Content Block 3: Link */}
              <div className="group relative mt-4 rounded-xl border border-zinc-200/90 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-900/50 p-4 transition-all hover:border-emerald-500/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                      GitHub Repo: LanrenwenStudio/side-stash
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveLink(
                        'Side Stash Open Source GitHub Repository',
                        'https://github.com/LanrenwenStudio/side-stash',
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-500 cursor-pointer active:scale-95"
                  >
                    <Plus className="size-3.5" />
                    <span>{isZh ? '保存此链接' : 'Save Link'}</span>
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  https://github.com/LanrenwenStudio/side-stash
                </p>
              </div>

              {/* Context Menu Overlay Simulator */}
              {contextMenu ? (
                <div
                  className="absolute z-30 w-52 rounded-xl border border-zinc-200 bg-white/95 dark:border-zinc-700 dark:bg-zinc-900/95 py-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
                  style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                  <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Side Stash {isZh ? '右键快捷菜单' : 'Menu'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveText(contextMenu.text || '选中文本示例');
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-indigo-600 hover:text-white"
                  >
                    <FileText className="size-3.5" />
                    <span>{isZh ? '保存文本到 Side Stash' : 'Save text to side panel'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveLink('Side Stash GitHub Repo', contextMenu.linkUrl || 'https://github.com');
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-indigo-600 hover:text-white"
                  >
                    <Link2 className="size-3.5" />
                    <span>{isZh ? '保存链接到 Side Stash' : 'Save link to side panel'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveImage('艺术插画', contextMenu.imageUrl || '');
                      setContextMenu(null);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-indigo-600 hover:text-white"
                  >
                    <ImageIcon className="size-3.5" />
                    <span>{isZh ? '保存图片到 Side Stash' : 'Save image to side panel'}</span>
                  </button>
                </div>
              ) : null}
            </div>

            {/* Right Side: Live SidePanel Component Preview (5 Cols) */}
            <div className="lg:col-span-5 relative">
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <span>{isZh ? 'Side Panel 实时预览组件' : 'Live Side Panel Component'}</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-500">
                  {items.length} {isZh ? '个收藏项' : 'items'}
                </span>
              </div>

              {/* Toast Message Alert */}
              {toastMessage ? (
                <div className="absolute top-12 left-1/2 z-40 -translate-x-1/2 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-top-2">
                  {toastMessage}
                </div>
              ) : null}

              {/* The Actual Side Panel Container */}
              <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-3.5 shadow-xl dark:shadow-2xl min-h-[580px] max-h-[640px] flex flex-col justify-between overflow-hidden transition-colors">
                <FilterBar
                  activeFilter={activeFilter}
                  dateFilter={dateFilter}
                  domainFilter={domainFilter}
                  domainOptions={[]}
                  allFilteredSelected={filteredItems.length > 0 && filteredItems.every((i) => selectedIds.has(i.id))}
                  filteredCount={filteredItems.length}
                  hasFilteredItems={filteredItems.length > 0}
                  hasPartialSelection={filteredItems.some((i) => selectedIds.has(i.id))}
                  query={query}
                  searchInputRef={{ current: null }}
                  selectedCount={selectedIds.size}
                  selectedImageCount={filteredItems.filter((i) => selectedIds.has(i.id) && i.type === 'image').length}
                  copyFormat={copyFormat}
                  openPanelOnSave={openPanelOnSave}
                  themeMode={themeMode}
                  languageSelectValue={isZh ? 'zh_CN' : 'en'}
                  resolvedLocaleLabel={isZh ? '简体中文' : 'English'}
                  onClearQuery={() => setQuery('')}
                  onFilterChange={setActiveFilter}
                  onDateFilterChange={setDateFilter}
                  onDomainFilterChange={setDomainFilter}
                  onQueryChange={setQuery}
                  onToggleSelectAll={handleToggleSelectAll}
                  onCopy={() => showToast(isZh ? '已复制选中的文本' : 'Copied selected')}
                  onCut={() => handleDeleteItems(Array.from(selectedIds))}
                  onDelete={() => handleDeleteItems(Array.from(selectedIds))}
                  onDownloadZip={() => showToast(isZh ? '打包下载 ZIP 导出中...' : 'Downloading ZIP...')}
                  onDownloadIndividual={() => showToast(isZh ? '逐张下载中...' : 'Downloading...')}
                  onLanguageChange={() => undefined}
                  onCopyFormatChange={setCopyFormat}
                  onOpenPanelOnSaveChange={setOpenPanelOnSave}
                  onThemeModeChange={setThemeMode}
                  onExportJson={() => showToast(isZh ? '已导出 JSON' : 'Exported JSON')}
                  onExportMarkdown={() => showToast(isZh ? '已导出 Markdown' : 'Exported Markdown')}
                  onImportFile={() => undefined}
                />

                {/* Item List Container */}
                <div className="mt-3 flex-1 overflow-y-auto pr-1">
                  <ItemList
                    copyFormat={copyFormat}
                    items={filteredItems}
                    selectedIds={selectedIds}
                    onCopyItem={(item) => showToast(isZh ? '已复制此内容' : 'Copied item')}
                    onDeleteItem={(id) => handleDeleteItems([id])}
                    onOpenItem={() => undefined}
                    onTogglePin={handleTogglePin}
                    onToggleSelect={handleToggleSelect}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
