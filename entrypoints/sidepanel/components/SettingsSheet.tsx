import React, { useRef } from 'react';
import { ChevronDown, Download, ExternalLink, Languages, Settings, Upload } from 'lucide-react';
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
  onSeedMockData?: () => void;
  onClearAllData?: () => void;
  onOpenWelcomePage?: () => void;
  onResetPinTip?: () => void;
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
  onSeedMockData,
  onClearAllData,
  onOpenWelcomePage,
  onResetPinTip,
}: SettingsSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label={t('settingsTitle', 'Settings')}
          className="size-9 rounded-xl border border-zinc-200/90 bg-white p-0 text-zinc-600 shadow-2xs transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          size="icon"
          type="button"
          variant="ghost"
        >
          <Settings className="size-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{t('settingsTitle', 'Settings')}</DialogTitle>
          <DialogDescription>
            {t('settingsDescription', 'Preferences are saved on this device.')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Language Preference */}
          <div className="grid gap-1.5">
            <label
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100"
              htmlFor="side-stash-language-select"
            >
              <Languages className="size-3.5 text-zinc-500" aria-hidden="true" />
              {t('languageLabel', 'Language')}
            </label>
            <div className="relative">
              <select
                id="side-stash-language-select"
                className="h-9 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3 py-1.5 pr-8 text-xs text-zinc-900 shadow-2xs outline-none transition-colors hover:bg-zinc-50 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus:border-zinc-100"
                value={languageSelectValue}
                onChange={(event) =>
                  onLanguageChange(event.target.value as LanguageSelectValue)
                }
              >
                <option value="auto">
                  {t('languageAuto', 'Follow Browser Default')} ({resolvedLocaleLabel})
                </option>
                <option value="zh_CN">简体中文 (Chinese)</option>
                <option value="zh_TW">繁體中文 (Traditional Chinese)</option>
                <option value="en">English</option>
                <option value="ja">日本語 (Japanese)</option>
                <option value="ko">한국어 (Korean)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
                <option value="es">Español (Spanish)</option>
                <option value="pt_BR">Português (Portuguese)</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>

          {/* Copy Format Setting */}
          <div className="grid gap-1.5">
            <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {t('copyFormatLabel', 'Copy format')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={copyFormat === 'plain' ? 'default' : 'secondary'}
                onClick={() => onCopyFormatChange('plain')}
              >
                {t('copyFormatPlain', 'Plain text')}
              </Button>
              <Button
                type="button"
                variant={copyFormat === 'markdown' ? 'default' : 'secondary'}
                onClick={() => onCopyFormatChange('markdown')}
              >
                {t('copyFormatMarkdown', 'Markdown')}
              </Button>
            </div>
          </div>

          {/* Auto Open Side Panel Setting */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/90 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div>
              <p className="m-0 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {t('openPanelOnSaveLabel', 'Auto-open side panel when saving')}
              </p>
              <p className="mt-0.5 mb-0 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                {t('openPanelOnSaveDescription', 'Opens the panel immediately after you save text, links, or images.')}
              </p>
            </div>
            <input
              aria-label={t('openPanelOnSaveLabel', 'Auto-open side panel when saving')}
              className="size-4 shrink-0 cursor-pointer accent-zinc-900 dark:accent-zinc-100"
              type="checkbox"
              checked={openPanelOnSave}
              onChange={(event) => onOpenPanelOnSaveChange(event.target.checked)}
            />
          </div>

          {/* Export / Import Section */}
          <div className="grid gap-2 border-t border-zinc-200/90 pt-3 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {t('backupHeading', 'Backup & Export')}
            </span>
            <div className="grid grid-cols-3 gap-2">
              <Button type="button" variant="secondary" onClick={onExportJson}>
                <Download className="size-3.5" aria-hidden="true" />
                {t('exportJson', 'JSON')}
              </Button>
              <Button type="button" variant="secondary" onClick={onExportMarkdown}>
                <Download className="size-3.5" aria-hidden="true" />
                {t('exportMarkdown', 'Markdown')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-3.5" aria-hidden="true" />
                {t('importJson', 'JSON')}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              accept=".json"
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

          {onSeedMockData || onClearAllData || onOpenWelcomePage || onResetPinTip ? (
            <div className="grid gap-2 border-t border-zinc-200/90 pt-3 dark:border-zinc-800">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {t('debugToolsHeading', '⚡ Debug & Testing')}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {onSeedMockData ? (
                  <Button type="button" variant="secondary" onClick={onSeedMockData}>
                    {t('debugSeedMockBtn', 'Load Test Data')}
                  </Button>
                ) : null}
                {onOpenWelcomePage ? (
                  <Button type="button" variant="secondary" onClick={onOpenWelcomePage}>
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    {t('debugOpenWelcomeBtn', 'Open Welcome Page')}
                  </Button>
                ) : null}
                {onResetPinTip ? (
                  <Button type="button" variant="secondary" onClick={onResetPinTip}>
                    {t('pinTipReset', 'Reset Pin Tip')}
                  </Button>
                ) : null}
                {onClearAllData ? (
                  <Button type="button" variant="danger" onClick={onClearAllData}>
                    {t('debugClearAllBtn', 'Clear All Data')}
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 text-xs leading-relaxed text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100">
            <p className="m-0 font-semibold text-zinc-900 dark:text-zinc-100">
              {t('privacyHeading', 'Local by design')}
            </p>
            <p className="mt-1 mb-0 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              {t(
                'privacyBody',
                'Items stay in chrome.storage.local on this device. Nothing is uploaded or tracked.',
              )}
            </p>
            <p className="mt-2 mb-0 font-mono text-[10.5px] text-zinc-600 dark:text-zinc-400">
              {t('shortcutHint', 'Shortcut: Alt+S saves the current selection.')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
