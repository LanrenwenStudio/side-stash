import React, { useRef } from 'react';
import { ChevronDown, Download, Languages, Settings, Upload } from 'lucide-react';
import { t } from '../../../lib/i18n';
import type { LanguageSelectValue } from '../../../lib/i18n';
import type { CopyFormat } from '../types';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

type SettingsSheetProps = {
  languageSelectValue: LanguageSelectValue;
  resolvedLocaleLabel: string;
  copyFormat: CopyFormat;
  openPanelOnSave: boolean;
  onLanguageChange: (value: LanguageSelectValue) => void;
  onCopyFormatChange: (format: CopyFormat) => void;
  onOpenPanelOnSaveChange: (enabled: boolean) => void;
  onExportJson: () => void;
  onExportMarkdown: () => void;
  onImportFile: (file: File) => void;
};

export function SettingsSheet({
  languageSelectValue,
  resolvedLocaleLabel,
  copyFormat,
  openPanelOnSave,
  onLanguageChange,
  onCopyFormatChange,
  onOpenPanelOnSaveChange,
  onExportJson,
  onExportMarkdown,
  onImportFile,
}: SettingsSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label={t('settingsTitle', 'Settings')}
          className="size-9 shrink-0 text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
          size="icon"
          title={t('settingsTitle', 'Settings')}
          type="button"
          variant="secondary"
        >
          <Settings className="size-3.5" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[min(360px,calc(100vw-1.5rem))]">
        <DialogHeader>
          <DialogTitle>{t('settingsTitle', 'Settings')}</DialogTitle>
          <DialogDescription>
            {t('settingsSubtitle', 'Language, panel behavior, copy format, and local backup.')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-1">
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {t('languageLabel', 'Language')}
            </span>
            <div className="relative">
              <Languages
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
              />
              <select
                aria-label={t('languageLabel', 'Language')}
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-white py-0 pr-9 pl-9 text-left text-sm font-medium text-zinc-800 outline-none transition-colors hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                title={resolvedLocaleLabel}
                value={languageSelectValue}
                onChange={(event) => onLanguageChange(event.target.value as LanguageSelectValue)}
              >
                <option value="auto">{t('languageAuto', 'Auto (browser)')}</option>
                <option value="en">English</option>
                <option value="zh_CN">简体中文</option>
                <option value="zh_TW">繁體中文</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
                <option value="pt_BR">Português</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </label>

          <div className="grid gap-1.5">
            <div className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="min-w-0 flex-1">
                <p className="m-0 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {t('openPanelOnSaveLabel', 'Open panel when saving')}
                </p>
                <p className="mt-1 mb-0 text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
                  {t(
                    'openPanelOnSaveHint',
                    'Automatically expand the side panel after you save text, a link, or an image.',
                  )}
                </p>
              </div>
              <button
                aria-checked={openPanelOnSave}
                aria-label={t('openPanelOnSaveLabel', 'Open panel when saving')}
                className={`relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 ${
                  openPanelOnSave
                    ? 'bg-zinc-900 dark:bg-zinc-100'
                    : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
                role="switch"
                type="button"
                onClick={() => onOpenPanelOnSaveChange(!openPanelOnSave)}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform dark:bg-zinc-900 ${
                    openPanelOnSave ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {t('copyFormatLabel', 'Copy format')}
            </span>
            <div className="relative">
              <select
                aria-label={t('copyFormatLabel', 'Copy format')}
                className="h-10 w-full appearance-none rounded-lg border border-zinc-200 bg-white py-0 pr-9 pl-3 text-left text-sm font-medium text-zinc-800 outline-none transition-colors focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                value={copyFormat}
                onChange={(event) => onCopyFormatChange(event.target.value as CopyFormat)}
              >
                <option value="plain">{t('copyFormatPlain', 'Plain text')}</option>
                <option value="markdown">{t('copyFormatMarkdown', 'Markdown')}</option>
                <option value="source">{t('copyFormatSource', 'With source')}</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-zinc-400"
              />
            </div>
            <span className="text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
              {t('copyFormatHint', 'Used for single and bulk copy/cut.')}
            </span>
          </label>

          <div className="grid gap-2">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {t('backupLabel', 'Backup')}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" onClick={onExportJson}>
                <Download className="size-3.5" aria-hidden="true" />
                {t('exportJson', 'Export JSON')}
              </Button>
              <Button type="button" variant="secondary" onClick={onExportMarkdown}>
                <Download className="size-3.5" aria-hidden="true" />
                {t('exportMarkdown', 'Export MD')}
              </Button>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-3.5" aria-hidden="true" />
              {t('importJson', 'Import JSON')}
            </Button>
            <input
              ref={fileInputRef}
              accept="application/json,.json"
              className="hidden"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onImportFile(file);
                }
                event.currentTarget.value = '';
              }}
            />
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs leading-5 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <p className="m-0 font-semibold text-zinc-800 dark:text-zinc-200">
              {t('privacyHeading', 'Local by design')}
            </p>
            <p className="mt-1 mb-0">
              {t(
                'privacyBody',
                'Items stay in chrome.storage.local on this device. Nothing is uploaded or tracked.',
              )}
            </p>
            <p className="mt-2 mb-0 text-[11px] text-zinc-500 dark:text-zinc-500">
              {t('shortcutHint', 'Shortcut: Alt+S saves the current selection.')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
