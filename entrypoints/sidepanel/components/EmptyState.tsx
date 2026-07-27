import React from 'react';
import { Image as ImageIcon, Link2, MousePointerClick, PanelRight, SearchX, Sparkles, Type } from 'lucide-react';
import { t } from '../../../lib/i18n';
import { Button } from './ui/button';

type EmptyStateProps = {
  hasActiveFilters: boolean;
  hasItems: boolean;
  onResetFilters: () => void;
  onLoadMockData?: () => void;
};

export function EmptyState({
  hasActiveFilters,
  hasItems,
  onResetFilters,
  onLoadMockData,
}: EmptyStateProps) {
  if (hasItems || hasActiveFilters) {
    return (
      <div className="grid min-h-[240px] place-content-center justify-items-center gap-3.5 px-4 py-12 text-center">
        <div className="relative grid size-12 place-items-center rounded-2xl border border-zinc-200/90 bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-400 shadow-2xs dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950 dark:text-zinc-500">
          <SearchX className="size-5" aria-hidden="true" />
        </div>
        <div className="grid gap-1">
          <h2 className="m-0 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {t('emptyFilteredTitle', 'No matches found')}
          </h2>
          <p className="m-0 max-w-[240px] text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {t('emptyFilteredHint', 'Try a different keyword or switch filters.')}
          </p>
        </div>
        {hasActiveFilters ? (
          <Button size="sm" type="button" variant="secondary" onClick={onResetFilters}>
            {t('resetFilters', 'Reset')}
          </Button>
        ) : null}
      </div>
    );
  }

  const steps = [
    {
      icon: MousePointerClick,
      title: t('onboardingStep1Title', 'Right-click to save'),
      body: t(
        'onboardingStep1Body',
        'Select text, or right-click a link or image, then choose Save to side panel. Shortcut: Alt+S.',
      ),
    },
    {
      icon: PanelRight,
      title: t('onboardingStep2Title', 'Open this side panel'),
      body: t(
        'onboardingStep2Body',
        'Click the Side Stash icon in the toolbar anytime to review your stash.',
      ),
    },
    {
      icon: Type,
      title: t('onboardingStep3Title', 'Search, copy, reuse'),
      body: t(
        'onboardingStep3Body',
        'Filter by type, multi-select, then copy or cut. Everything stays on this device.',
      ),
    },
  ];

  return (
    <div className="grid min-h-[300px] place-content-center justify-items-stretch gap-5 px-3 py-8">
      <div className="grid justify-items-center gap-2.5 text-center">
        <div className="relative flex size-13 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-900 text-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-100 dark:text-zinc-950">
          <MousePointerClick className="size-6" aria-hidden="true" />
        </div>
        <div className="grid justify-items-center gap-1.5">
          <p className="m-0 text-[10px] font-bold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
            {t('onboardingKicker', 'Quick start')}
          </p>
          <h2 className="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {t('emptyTitle', 'Nothing saved yet')}
          </h2>
          <p className="m-0 max-w-[280px] text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {t(
              'emptyHint',
              'Right-click on a page to save text, links, or images. Or press Alt+S on a selection.',
            )}
          </p>
          {onLoadMockData ? (
            <Button
              className="mt-1.5 gap-1.5 font-medium shadow-2xs"
              size="sm"
              type="button"
              variant="secondary"
              onClick={onLoadMockData}
            >
              <Sparkles className="size-3.5 text-zinc-900 dark:text-zinc-100" aria-hidden="true" />
              <span>{t('loadMockDataBtn', 'Load test items (7)')}</span>
            </Button>
          ) : null}
        </div>
      </div>

      <ol className="m-0 mx-auto grid w-full max-w-[320px] list-none gap-2 p-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="flex gap-3 rounded-xl border border-zinc-200/90 bg-white p-3 shadow-2xs transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="m-0 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  <span className="mr-1 text-zinc-400 font-mono">{index + 1}.</span>
                  {step.title}
                </p>
                <p className="mt-1 mb-0 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 px-2 py-1 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
          <Type className="size-3" aria-hidden="true" />
          {t('filterText', 'Text')}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 px-2 py-1 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
          <Link2 className="size-3" aria-hidden="true" />
          {t('filterLink', 'Link')}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 px-2 py-1 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
          <ImageIcon className="size-3" aria-hidden="true" />
          {t('filterImage', 'Image')}
        </span>
      </div>
    </div>
  );
}
