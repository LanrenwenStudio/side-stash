import React from 'react';
import type { RefObject } from 'react';
import {
  ChevronDown,
  Copy,
  Download,
  FileText,
  FolderDown,
  Image as ImageIcon,
  Link2,
  ListFilter,
  Scissors,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from '../lib/cn';
import { t } from '../../../lib/i18n';
import type { LanguageSelectValue } from '../../../lib/i18n';
import type { CopyFormat, DateFilter, ItemFilter, ThemeMode } from '../types';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Popconfirm } from './Popconfirm';
import { SettingsSheet } from './SettingsSheet';
import { ActionTooltip } from './ui/tooltip';

type DomainOption = {
  domain: string;
  count: number;
};

type FilterBarProps = {
  activeFilter: ItemFilter;
  dateFilter: DateFilter;
  domainFilter: string;
  domainOptions: DomainOption[];
  allFilteredSelected: boolean;
  filteredCount: number;
  hasFilteredItems: boolean;
  hasPartialSelection: boolean;
  query: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  selectedCount: number;
  selectedImageCount: number;
  copyFormat: CopyFormat;
  openPanelOnSave: boolean;
  themeMode: ThemeMode;
  languageSelectValue: LanguageSelectValue;
  resolvedLocaleLabel: string;
  isDeleteConfirmOpen?: boolean;
  onDeleteConfirmOpenChange?: (open: boolean) => void;
  onClearQuery: () => void;
  onFilterChange: (filter: ItemFilter) => void;
  onDateFilterChange: (filter: DateFilter) => void;
  onDomainFilterChange: (domain: string) => void;
  onQueryChange: (value: string) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onCopy: () => void;
  onCut: () => void;
  onDelete: () => void;
  onDownloadZip: () => void;
  onDownloadIndividual: () => void;
  onLanguageChange: (value: LanguageSelectValue) => void;
  onCopyFormatChange: (format: CopyFormat) => void;
  onOpenPanelOnSaveChange: (enabled: boolean) => void;
  onThemeModeChange: (mode: ThemeMode) => void;
  onExportJson: () => void;
  onExportMarkdown: () => void;
  onImportFile: (file: File) => void;
  onSeedMockData?: () => void;
  onClearAllData?: () => void;
  onOpenWelcomePage?: () => void;
  onResetPinTip?: () => void;
};

const FILTERS: ItemFilter[] = ['all', 'text', 'link', 'image'];
const DATE_FILTERS: DateFilter[] = ['all', 'today', 'yesterday', 'week'];

export function FilterBar({
  activeFilter,
  dateFilter,
  domainFilter,
  domainOptions,
  allFilteredSelected,
  filteredCount,
  hasFilteredItems,
  hasPartialSelection,
  query,
  searchInputRef,
  selectedCount,
  selectedImageCount,
  copyFormat,
  openPanelOnSave,
  themeMode,
  languageSelectValue,
  resolvedLocaleLabel,
  isDeleteConfirmOpen,
  onDeleteConfirmOpenChange,
  onClearQuery,
  onFilterChange,
  onDateFilterChange,
  onDomainFilterChange,
  onQueryChange,
  onToggleSelectAll,
  onCopy,
  onCut,
  onDelete,
  onDownloadZip,
  onDownloadIndividual,
  onLanguageChange,
  onCopyFormatChange,
  onOpenPanelOnSaveChange,
  onThemeModeChange,
  onExportJson,
  onExportMarkdown,
  onImportFile,
  onSeedMockData,
  onClearAllData,
  onOpenWelcomePage,
  onResetPinTip,
}: FilterBarProps) {
  return (
    <section className="grid gap-2.5">
      {/* Search and Settings Header */}
      <div className="flex items-center gap-2">
        <label className="relative block min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-zinc-400 transition-colors dark:text-zinc-500"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            aria-label={t('searchLabel', 'Search saved items')}
            className="h-9 w-full min-w-0 rounded-xl border border-zinc-200 bg-white py-2 pr-10 pl-9 text-xs text-zinc-900 shadow-2xs outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10"
            placeholder={t('filterPlaceholder', 'Search snippets...')}
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          {query ? (
            <div className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center">
              <button
                aria-label={t('filterClear', 'Clear')}
                className="flex size-5.5 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                type="button"
                onClick={onClearQuery}
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </label>

        <SettingsSheet
          copyFormat={copyFormat}
          openPanelOnSave={openPanelOnSave}
          themeMode={themeMode}
          languageSelectValue={languageSelectValue}
          resolvedLocaleLabel={resolvedLocaleLabel}
          onCopyFormatChange={onCopyFormatChange}
          onOpenPanelOnSaveChange={onOpenPanelOnSaveChange}
          onThemeModeChange={onThemeModeChange}
          onExportJson={onExportJson}
          onExportMarkdown={onExportMarkdown}
          onImportFile={onImportFile}
          onLanguageChange={onLanguageChange}
          onSeedMockData={onSeedMockData}
          onClearAllData={onClearAllData}
          onOpenWelcomePage={onOpenWelcomePage}
          onResetPinTip={onResetPinTip}
        />
      </div>

      {/* Main Category Filter Segmented Control */}
      <div
        aria-label={t('filterGroupLabel', 'Filter by type')}
        className="grid grid-cols-4 gap-1 rounded-xl border border-zinc-200/90 bg-zinc-100/80 p-1 dark:border-zinc-800/90 dark:bg-zinc-900/80"
        role="group"
      >
        {FILTERS.map((filter) => {
          const label =
            filter === 'all'
              ? t('filterAll', 'All')
              : filter === 'text'
                ? t('filterText', 'Text')
                : filter === 'link'
                  ? t('filterLink', 'Link')
                  : t('filterImage', 'Image');
          const Icon =
            filter === 'all'
              ? ListFilter
              : filter === 'text'
                ? FileText
                : filter === 'link'
                  ? Link2
                  : ImageIcon;

          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              aria-pressed={isActive}
              className={cn(
                'inline-flex h-7.5 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1.5 text-[11px] font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/40 dark:focus-visible:ring-zinc-100/40',
                isActive
                  ? 'bg-zinc-950 text-white shadow-2xs font-semibold dark:bg-zinc-100 dark:text-zinc-950'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
              )}
              type="button"
              onClick={() => onFilterChange(filter)}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Date & Site Filter Row */}
      <div className="grid grid-cols-[1fr_auto] gap-1.5">
        <div
          aria-label={t('dateFilterGroupLabel', 'Filter by date')}
          className="grid grid-cols-4 gap-0.5 rounded-lg border border-zinc-200/90 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-950"
          role="group"
        >
          {DATE_FILTERS.map((filter) => {
            const label =
              filter === 'all'
                ? t('dateAll', 'All')
                : filter === 'today'
                  ? t('dateToday', 'Today')
                  : filter === 'yesterday'
                    ? t('dateYesterday', 'Yesterday')
                    : t('dateWeek', '7 days');

            const isActive = dateFilter === filter;

            return (
              <button
                key={filter}
                aria-pressed={isActive}
                className={cn(
                  'inline-flex h-6.5 min-w-0 items-center justify-center rounded-md px-0.5 text-[10.5px] font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/40 dark:focus-visible:ring-zinc-100/40',
                  isActive
                    ? 'bg-zinc-900 text-white shadow-2xs dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
                )}
                type="button"
                onClick={() => onDateFilterChange(filter)}
              >
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>

        <label className="relative min-w-0">
          <span className="sr-only">{t('domainFilterLabel', 'Filter by site')}</span>
          <select
            aria-label={t('domainFilterLabel', 'Filter by site')}
            className="h-7.5 w-[105px] min-[360px]:w-[124px] appearance-none rounded-lg border border-zinc-200/90 bg-white py-0 pr-6 pl-2 text-[10.5px] font-medium text-zinc-700 outline-none transition-colors hover:bg-zinc-50 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:focus:border-zinc-100"
            value={domainFilter}
            onChange={(event) => onDomainFilterChange(event.target.value)}
          >
            <option value="">{t('domainFilterAll', 'All sites')}</option>
            {domainOptions.map((option) => (
              <option key={option.domain} value={option.domain}>
                {option.domain} ({option.count})
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-zinc-400"
          />
        </label>
      </div>

      {/* Select All / Batch Actions Banner */}
      <div
        className={cn(
          'flex min-h-8.5 items-center justify-between gap-1.5 rounded-xl border px-2 py-0.5 text-xs transition-all duration-200',
          selectedCount > 0
            ? 'border-zinc-900 bg-zinc-900 text-zinc-50 shadow-md dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
            : 'border-zinc-200/90 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400',
        )}
      >
        <label
          className={cn(
            'flex min-w-0 flex-1 cursor-pointer items-center gap-2 py-1 px-1 text-[11px] font-medium select-none',
            !hasFilteredItems && 'pointer-events-none opacity-50',
          )}
        >
          <Checkbox
            checked={allFilteredSelected ? true : hasPartialSelection ? 'indeterminate' : false}
            className={cn(
              selectedCount > 0 &&
                'border-2 border-white/70 bg-transparent text-white hover:border-white data-[state=checked]:border-2 data-[state=checked]:border-white data-[state=checked]:bg-white/25 data-[state=checked]:text-white data-[state=indeterminate]:border-2 data-[state=indeterminate]:border-white data-[state=indeterminate]:bg-white/25 data-[state=indeterminate]:text-white dark:border-2 dark:border-zinc-500 dark:bg-transparent dark:text-zinc-900 dark:hover:border-zinc-950 dark:data-[state=checked]:border-2 dark:data-[state=checked]:border-zinc-950 dark:data-[state=checked]:bg-zinc-950 dark:data-[state=checked]:text-white dark:data-[state=indeterminate]:border-2 dark:data-[state=indeterminate]:border-zinc-950 dark:data-[state=indeterminate]:bg-zinc-950 dark:data-[state=indeterminate]:text-white',
            )}
            disabled={!hasFilteredItems}
            onCheckedChange={(checked) => onToggleSelectAll(checked === true)}
          />
          <span className="whitespace-nowrap font-medium">
            {selectedCount > 0
              ? t('selectedCount', '$1 selected', [String(selectedCount)])
              : t('selectAll', 'Select all')}
          </span>
        </label>

        {selectedCount > 0 ? (
          <div className="flex shrink-0 items-center gap-1">
            {selectedImageCount > 0 ? (
              <>
                <ActionTooltip content={t('tooltipDownloadZip', 'Download as ZIP (.zip)')}>
                  <button
                    type="button"
                    aria-label={t('downloadZipTooltip', 'Package selected images as ZIP')}
                    onClick={onDownloadZip}
                    className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-zinc-100 outline-none transition-colors hover:bg-white/20 dark:text-zinc-900 dark:hover:bg-zinc-900/20"
                  >
                    <FolderDown className="size-4 shrink-0 stroke-[2.25]" aria-hidden="true" />
                  </button>
                </ActionTooltip>

                <ActionTooltip content={t('tooltipDownloadIndividual', 'Download individually')}>
                  <button
                    type="button"
                    aria-label={t('downloadIndividualTooltip', 'Download selected images individually')}
                    onClick={onDownloadIndividual}
                    className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-zinc-100 outline-none transition-colors hover:bg-white/20 dark:text-zinc-900 dark:hover:bg-zinc-900/20"
                  >
                    <Download className="size-4 shrink-0 stroke-[2.25]" aria-hidden="true" />
                  </button>
                </ActionTooltip>
              </>
            ) : null}

            <ActionTooltip content={t('tooltipCopySelected', 'Copy selected')}>
              <button
                type="button"
                aria-label={t('copySelectedTooltip', 'Copy all text and links')}
                onClick={onCopy}
                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-zinc-100 outline-none transition-colors hover:bg-white/20 dark:text-zinc-900 dark:hover:bg-zinc-900/20"
              >
                <Copy className="size-4 shrink-0 stroke-[2.25]" aria-hidden="true" />
              </button>
            </ActionTooltip>

            <ActionTooltip content={t('tooltipCutSelected', 'Cut selected')}>
              <button
                type="button"
                aria-label={t('cutSelectedTooltip', 'Cut selected items')}
                onClick={onCut}
                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-zinc-100 outline-none transition-colors hover:bg-white/20 dark:text-zinc-900 dark:hover:bg-zinc-900/20"
              >
                <Scissors className="size-4 shrink-0 stroke-[2.25]" aria-hidden="true" />
              </button>
            </ActionTooltip>

            <Popconfirm
              title={
                selectedCount > 1
                  ? t('confirmDeleteMultiple', 'Delete $1 items?', [String(selectedCount)])
                  : t('confirmDelete', 'Delete this item?')
              }
              confirmText={t('actionDelete', 'Delete')}
              cancelText={t('confirmCancel', 'Cancel')}
              variant="danger"
              align="end"
              side="bottom"
              open={isDeleteConfirmOpen}
              onOpenChange={onDeleteConfirmOpenChange}
              onConfirm={onDelete}
            >
              <button
                type="button"
                title={t('tooltipDeleteSelected', 'Delete selected')}
                aria-label={t('deleteSelectedTooltip', 'Delete selected items')}
                className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-rose-400 outline-none transition-colors hover:bg-rose-500/25 hover:text-rose-200 dark:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-700"
              >
                <Trash2 className="size-4 shrink-0 stroke-[2.25]" aria-hidden="true" />
              </button>
            </Popconfirm>
          </div>
        ) : (
          <span className="shrink-0 font-mono text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            {t('shownCount', '$1 shown', [String(filteredCount)])}
          </span>
        )}
      </div>
    </section>
  );
}
