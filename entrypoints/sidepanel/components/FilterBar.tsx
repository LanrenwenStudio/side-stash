import React from 'react';
import type { RefObject } from 'react';
import {
  ChevronDown,
  Copy,
  Download,
  FileText,
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
import type { CopyFormat, DateFilter, ItemFilter } from '../types';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { SettingsSheet } from './SettingsSheet';

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
  languageSelectValue: LanguageSelectValue;
  resolvedLocaleLabel: string;
  onClearQuery: () => void;
  onFilterChange: (filter: ItemFilter) => void;
  onDateFilterChange: (filter: DateFilter) => void;
  onDomainFilterChange: (domain: string) => void;
  onQueryChange: (value: string) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onCopy: () => void;
  onCut: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onLanguageChange: (value: LanguageSelectValue) => void;
  onCopyFormatChange: (format: CopyFormat) => void;
  onOpenPanelOnSaveChange: (enabled: boolean) => void;
  onExportJson: () => void;
  onExportMarkdown: () => void;
  onImportFile: (file: File) => void;
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
  languageSelectValue,
  resolvedLocaleLabel,
  onClearQuery,
  onFilterChange,
  onDateFilterChange,
  onDomainFilterChange,
  onQueryChange,
  onToggleSelectAll,
  onCopy,
  onCut,
  onDelete,
  onDownload,
  onLanguageChange,
  onCopyFormatChange,
  onOpenPanelOnSaveChange,
  onExportJson,
  onExportMarkdown,
  onImportFile,
}: FilterBarProps) {
  return (
    <section className="grid gap-2">
      <div className="flex items-center gap-2">
        <label className="relative block min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            aria-label={t('searchLabel', 'Search saved items')}
            className="h-9 w-full min-w-0 rounded-lg border border-zinc-200/90 bg-white px-3 py-2.5 pl-8 pr-9 text-[13px] text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            placeholder={t('filterPlaceholder', 'Search snippets...')}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          {query ? (
            <Button
              aria-label={t('filterClear', 'Clear')}
              className="absolute top-1/2 right-1 -translate-y-1/2 size-7"
              size="icon"
              type="button"
              variant="ghost"
              onClick={onClearQuery}
            >
              <X className="size-3.5" aria-hidden="true" />
            </Button>
          ) : null}
        </label>

        <SettingsSheet
          copyFormat={copyFormat}
          openPanelOnSave={openPanelOnSave}
          languageSelectValue={languageSelectValue}
          resolvedLocaleLabel={resolvedLocaleLabel}
          onCopyFormatChange={onCopyFormatChange}
          onOpenPanelOnSaveChange={onOpenPanelOnSaveChange}
          onExportJson={onExportJson}
          onExportMarkdown={onExportMarkdown}
          onImportFile={onImportFile}
          onLanguageChange={onLanguageChange}
        />
      </div>

      <div
        aria-label={t('filterGroupLabel', 'Filter by type')}
        className="grid grid-cols-4 gap-0.5 rounded-lg border border-zinc-200/90 bg-zinc-100/80 p-0.5 dark:border-zinc-800 dark:bg-zinc-900/80"
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

          return (
            <button
              key={filter}
              aria-pressed={activeFilter === filter}
              className={cn(
                'inline-flex h-7 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40',
                activeFilter === filter
                  ? 'bg-white text-zinc-900 shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:bg-zinc-950 dark:text-zinc-50'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
              )}
              type="button"
              onClick={() => onFilterChange(filter)}
            >
              <Icon className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2">
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

            return (
              <button
                key={filter}
                aria-pressed={dateFilter === filter}
                className={cn(
                  'inline-flex h-7 min-w-0 items-center justify-center rounded-md px-1 text-[11px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40',
                  dateFilter === filter
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
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
            className="h-8 w-[124px] appearance-none rounded-lg border border-zinc-200/90 bg-white py-0 pr-7 pl-2 text-[11px] font-medium text-zinc-700 outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
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

      <div
        className={cn(
          'flex min-h-9 items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors',
          selectedCount > 0
            ? 'border-zinc-900/10 bg-zinc-900 text-zinc-100 dark:border-zinc-100/10 dark:bg-zinc-100 dark:text-zinc-900'
            : 'border-zinc-200/90 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400',
        )}
      >
        <label
          className={cn(
            'inline-flex min-w-0 cursor-pointer items-center gap-2 font-medium',
            !hasFilteredItems && 'pointer-events-none opacity-50',
          )}
        >
          <Checkbox
            checked={allFilteredSelected ? true : hasPartialSelection ? 'indeterminate' : false}
            className={
              selectedCount > 0
                ? 'border-zinc-500 bg-transparent data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-zinc-900 data-[state=indeterminate]:border-white data-[state=indeterminate]:bg-white data-[state=indeterminate]:text-zinc-900 dark:border-zinc-400 dark:data-[state=checked]:border-zinc-900 dark:data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:text-white dark:data-[state=indeterminate]:border-zinc-900 dark:data-[state=indeterminate]:bg-zinc-900 dark:data-[state=indeterminate]:text-white'
                : undefined
            }
            disabled={!hasFilteredItems}
            onCheckedChange={(checked) => onToggleSelectAll(checked === true)}
          />
          <span className="truncate">
            {selectedCount > 0
              ? t('selectedCount', '$1 selected', [String(selectedCount)])
              : t('selectAll', 'Select all')}
          </span>
        </label>

        {selectedCount > 0 ? (
          <div className="flex shrink-0 items-center gap-0.5">
            {selectedImageCount > 0 ? (
              <Button
                aria-label={t('downloadSelectedImages', 'Download')}
                className="h-7 gap-1 px-2 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white dark:text-zinc-900 dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900"
                title={t('downloadSelectedImages', 'Download images')}
                type="button"
                variant="ghost"
                onClick={onDownload}
              >
                <Download className="size-3" aria-hidden="true" />
                <span>{t('downloadSelectedImages', 'Download')}</span>
              </Button>
            ) : null}
            <Button
              aria-label={t('copySelected', 'Copy')}
              className="h-7 gap-1 px-2 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white dark:text-zinc-900 dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900"
              title={t('copySelected', 'Copy')}
              type="button"
              variant="ghost"
              onClick={onCopy}
            >
              <Copy className="size-3" aria-hidden="true" />
              <span>{t('copySelected', 'Copy')}</span>
            </Button>
            <Button
              aria-label={t('cutSelected', 'Cut')}
              className="h-7 gap-1 px-2 text-[11px] font-medium text-white hover:bg-white/10 hover:text-white dark:text-zinc-900 dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900"
              title={t('cutSelected', 'Cut')}
              type="button"
              variant="ghost"
              onClick={onCut}
            >
              <Scissors className="size-3" aria-hidden="true" />
              <span>{t('cutSelected', 'Cut')}</span>
            </Button>
            <Button
              aria-label={t('deleteSelected', 'Delete')}
              className="h-7 gap-1 px-2 text-[11px] font-medium text-red-300 hover:bg-red-500/15 hover:text-red-200 dark:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-700"
              title={t('deleteSelected', 'Delete')}
              type="button"
              variant="ghost"
              onClick={onDelete}
            >
              <Trash2 className="size-3" aria-hidden="true" />
              <span>{t('deleteSelected', 'Delete')}</span>
            </Button>
          </div>
        ) : (
          <span className="shrink-0 tabular-nums text-[11px] font-medium">
            {t('shownCount', '$1 shown', [String(filteredCount)])}
          </span>
        )}
      </div>
    </section>
  );
}
