import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  Check,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Languages,
  Link2,
  Pin,
  Plus,
  Sparkles,
} from 'lucide-react';
import { browser } from 'wxt/browser';
import {
  getLanguageSelectValue,
  getLocaleLabel,
  getResolvedLocale,
  initializeI18n,
  setLanguagePreference,
  subscribeToLanguageChange,
  t,
  type LanguageSelectValue,
} from '../../lib/i18n';
import type { ThemeMode } from '../sidepanel/types';
import { applyTheme, setupThemeListener } from '../sidepanel/lib/theme';
import { getPanelPreferences, subscribeToPreferences } from '../sidepanel/lib/storage';
import '../sidepanel/style.css';

type SidePanelApi = {
  open?: (options: { windowId?: number; tabId?: number }) => Promise<void>;
  setPanelBehavior?: (options: { openPanelOnActionClick: boolean }) => Promise<void>;
};

const STORAGE_KEY = 'items';

const buildId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

async function openSidePanelOnly() {
  try {
    const sidePanel = (browser as typeof browser & { sidePanel?: SidePanelApi }).sidePanel;
    const currentWindow = await browser.windows.getCurrent();

    if (sidePanel?.open && typeof currentWindow.id === 'number') {
      await sidePanel.open({ windowId: currentWindow.id });
    } else {
      await browser.runtime.sendMessage({ type: 'side-stash-open-panel' });
    }
  } catch {
    try {
      await browser.runtime.sendMessage({ type: 'side-stash-open-panel' });
    } catch {
      // ignore
    }
  }
}

async function saveDemoItems(
  demoItems: Array<{
    type: 'text' | 'link' | 'image';
    content: string;
    linkUrl?: string;
    imageUrl?: string;
    imageAlt?: string;
  }>,
) {
  try {
    const stored = await browser.storage.local.get(STORAGE_KEY);
    const existing = Array.isArray(stored[STORAGE_KEY]) ? stored[STORAGE_KEY] : [];
    const newItems = demoItems.map((item) => ({
      id: buildId(),
      type: item.type,
      content: item.content,
      linkUrl: item.linkUrl,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      pageTitle: t('welcomeTitle', 'Welcome to Side Stash'),
      pageUrl: window.location.href,
      createdAt: new Date().toISOString(),
      pinned: false,
    }));
    await browser.storage.local.set({ [STORAGE_KEY]: [...newItems, ...existing] });
  } catch (err) {
    console.error('Failed to save demo items', err);
  }

  await openSidePanelOnly();
}

function WelcomeApp() {
  const [, setLanguageVersion] = useState(0);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const languageSelectValue = getLanguageSelectValue();
  const resolvedLocale = getResolvedLocale();

  useEffect(() => {
    let active = true;

    void getPanelPreferences().then((prefs) => {
      if (!active) {
        return;
      }
      setThemeMode(prefs.themeMode);
      applyTheme(prefs.themeMode);
    });

    const unsubscribe = subscribeToPreferences((prefs) => {
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
    return subscribeToLanguageChange(() => {
      setLanguageVersion((value) => value + 1);
    });
  }, []);

  useEffect(() => {
    document.title = t('welcomeTitle', 'Welcome to Side Stash');
  }, [languageSelectValue, resolvedLocale]);

  const triggerFeedback = (key: string) => {
    setActiveFeedback(key);
    window.setTimeout(() => {
      setActiveFeedback((current) => (current === key ? null : current));
    }, 2000);
  };

  const steps = [
    {
      n: '1',
      title: t('welcomeStep1Title', 'Right-click to save'),
      body: t(
        'welcomeStep1Body',
        'Select text, or right-click any link or image and choose “Save to side panel”.',
      ),
    },
    {
      n: '2',
      title: t('welcomeStep2Title', 'Keyboard shortcut'),
      body: t(
        'welcomeStep2Body',
        'Select text and press Alt+S to save your selection instantly without right-clicking.',
      ),
    },
    {
      n: '3',
      title: t('welcomeStep3Title', 'One-click toolbar access'),
      body: t(
        'welcomeStep3Body',
        'Click the toolbar icon anytime to open the side panel, search, filter, or copy.',
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="m-0 text-xs font-semibold tracking-wide text-sky-600 uppercase dark:text-sky-400">
              Side Stash
            </p>
            <h1 className="m-0 mt-1 text-2xl font-semibold tracking-tight">
              {t('welcomeTitle', 'Welcome to Side Stash')}
            </h1>
            <p className="mt-2 mb-0 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {t(
                'welcomeSubtitle',
                'Quickly save text, links, and images — private by default.',
              )}
            </p>
          </div>
          <label className="relative block shrink-0">
            <span className="sr-only">{t('languageLabel', 'Language')}</span>
            <Languages
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
            />
            <select
              aria-label={t('languageLabel', 'Language')}
              className="h-9 min-w-[10.5rem] cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-white py-0 pr-8 pl-8 text-xs font-medium text-zinc-700 outline-none transition-colors hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              title={getLocaleLabel(resolvedLocale)}
              value={languageSelectValue}
              onChange={(event) => {
                void setLanguagePreference(event.target.value as LanguageSelectValue);
              }}
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
              className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-zinc-400"
            />
          </label>
        </header>

        {/* Interactive Playground Section */}
        <section className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-sky-600 dark:text-sky-400" />
            <h2 className="m-0 text-sm font-semibold text-sky-950 dark:text-sky-200">
              {t('welcomeTryTitle', 'Quick Try')}
            </h2>
          </div>
          <p className="mt-1 mb-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {t(
              'welcomeTrySubtitle',
              'Click any sample below to save it and see it live in the side panel:',
            )}
          </p>

          <div className="grid gap-3">
            {/* Text Sample */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-start gap-3 min-w-0">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-500 uppercase dark:text-zinc-400">
                    {t('welcomeTryTextTitle', 'Sample Text')}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-800 dark:text-zinc-200 truncate">
                    {t(
                      'welcomeTryTextContent',
                      'Side Stash is a privacy-first side panel for text, links, and images.',
                    )}
                  </div>
                </div>
              </div>
              <button
                className={`inline-flex shrink-0 h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors ${
                  activeFeedback === 'text'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 text-zinc-800 hover:bg-sky-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-sky-500 dark:hover:text-white'
                }`}
                type="button"
                onClick={() => {
                  triggerFeedback('text');
                  void saveDemoItems([
                    {
                      type: 'text',
                      content: t(
                        'welcomeTryTextContent',
                        'Side Stash is a privacy-first side panel for text, links, and images.',
                      ),
                    },
                  ]);
                }}
              >
                {activeFeedback === 'text' ? (
                  <>
                    <Check className="size-3.5" />
                    {t('welcomeTryStashed', 'Saved')}
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" />
                    {t('welcomeTryTextBtn', '+ Stash text')}
                  </>
                )}
              </button>
            </div>

            {/* Link Sample */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-start gap-3 min-w-0">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Link2 className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-500 uppercase dark:text-zinc-400">
                    {t('welcomeTryLinkTitle', 'Sample Link')}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-800 dark:text-zinc-200 truncate">
                    {t('welcomeTryLinkContent', 'Side Stash GitHub Repository')}
                  </div>
                  <div className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                    https://github.com/LanrenwenStudio/side-stash
                  </div>
                </div>
              </div>
              <button
                className={`inline-flex shrink-0 h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors ${
                  activeFeedback === 'link'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 text-zinc-800 hover:bg-sky-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-sky-500 dark:hover:text-white'
                }`}
                type="button"
                onClick={() => {
                  triggerFeedback('link');
                  void saveDemoItems([
                    {
                      type: 'link',
                      content: t('welcomeTryLinkContent', 'Side Stash GitHub Repository'),
                      linkUrl: 'https://github.com/LanrenwenStudio/side-stash',
                    },
                  ]);
                }}
              >
                {activeFeedback === 'link' ? (
                  <>
                    <Check className="size-3.5" />
                    {t('welcomeTryStashed', 'Saved')}
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" />
                    {t('welcomeTryLinkBtn', '+ Stash link')}
                  </>
                )}
              </button>
            </div>

            {/* Image Sample */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-start gap-3 min-w-0">
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                  <ImageIcon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-500 uppercase dark:text-zinc-400">
                    {t('welcomeTryImageTitle', 'Sample Image')}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <img
                      src={browser.runtime.getURL('/icon-48.png')}
                      alt="Side Stash Logo"
                      className="size-5 rounded"
                    />
                    <span className="text-xs text-zinc-800 dark:text-zinc-200 truncate">
                      {t('welcomeTryImageAlt', 'Side Stash Logo')}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className={`inline-flex shrink-0 h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors ${
                  activeFeedback === 'image'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 text-zinc-800 hover:bg-sky-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-sky-500 dark:hover:text-white'
                }`}
                type="button"
                onClick={() => {
                  triggerFeedback('image');
                  void saveDemoItems([
                    {
                      type: 'image',
                      content: t('welcomeTryImageAlt', 'Side Stash Logo'),
                      imageUrl: browser.runtime.getURL('/icon-128.png'),
                      imageAlt: t('welcomeTryImageAlt', 'Side Stash Logo'),
                    },
                  ]);
                }}
              >
                {activeFeedback === 'image' ? (
                  <>
                    <Check className="size-3.5" />
                    {t('welcomeTryStashed', 'Saved')}
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" />
                    {t('welcomeTryImageBtn', '+ Stash image')}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-sky-200/60 dark:border-sky-900/40">
            <button
              className={`inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold text-white shadow-xs transition-colors ${
                activeFeedback === 'all'
                  ? 'bg-emerald-600'
                  : 'bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400'
              }`}
              type="button"
              onClick={() => {
                triggerFeedback('all');
                void saveDemoItems([
                  {
                    type: 'text',
                    content: t(
                      'welcomeTryTextContent',
                      'Side Stash is a privacy-first side panel for text, links, and images.',
                    ),
                  },
                  {
                    type: 'link',
                    content: t('welcomeTryLinkContent', 'Side Stash GitHub Repository'),
                    linkUrl: 'https://github.com/LanrenwenStudio/side-stash',
                  },
                  {
                    type: 'image',
                    content: t('welcomeTryImageAlt', 'Side Stash Logo'),
                    imageUrl: browser.runtime.getURL('/icon-128.png'),
                    imageAlt: t('welcomeTryImageAlt', 'Side Stash Logo'),
                  },
                ]);
              }}
            >
              {activeFeedback === 'all' ? (
                <>
                  <Check className="size-3.5" />
                  {t('welcomeTryAllStashed', 'All items saved to side panel')}
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  {t('welcomeTryAddAllBtn', 'Stash all samples')}
                </>
              )}
            </button>
          </div>
        </section>

        <section className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {steps.map((step) => (
            <article key={step.n} className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sky-50 text-sm font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                {step.n}
              </span>
              <div>
                <h2 className="m-0 text-sm font-semibold">{step.title}</h2>
                <p className="mt-1 mb-0 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {step.body}
                </p>
              </div>
            </article>
          ))}
        </section>

        {/* Pin to Toolbar Guide Section */}
        <section className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
          <div className="flex items-center gap-2">
            <Pin className="size-4 text-amber-600 dark:text-amber-400" />
            <h2 className="m-0 text-sm font-semibold text-amber-950 dark:text-amber-200">
              {t('welcomePinTitle', '📌 Pin to Toolbar')}
            </h2>
          </div>
          <p className="mt-1 mb-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {t(
              'welcomePinSubtitle',
              'Pin Side Stash to open your side panel anytime in one click:',
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="flex flex-col gap-2 rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  1
                </span>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {t('welcomePinStep1Title', 'Click Extension Icon')}
                </span>
              </div>
              <p className="m-0 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {t(
                  'welcomePinStep1Body',
                  'Click the puzzle icon (🧩) in the top-right Chrome toolbar',
                )}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-2 rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  2
                </span>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {t('welcomePinStep2Title', 'Locate Side Stash')}
                </span>
              </div>
              <p className="m-0 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {t(
                  'welcomePinStep2Body',
                  'Find Side Stash in your list of extensions',
                )}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-2 rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  3
                </span>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {t('welcomePinStep3Title', 'Click Pin Icon')}
                </span>
              </div>
              <p className="m-0 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {t(
                  'welcomePinStep3Body',
                  'Click the pin icon (📌) to pin it to your toolbar',
                )}
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <p className="m-0">
            🔒 {t('welcomePermStorage', 'Local storage: saved strictly on this device. No account, no upload, zero tracking.')}
          </p>
        </footer>
      </div>
    </div>
  );
}

const container = document.getElementById('app');
if (!container) {
  throw new Error('Welcome root element not found.');
}

type ContainerWithRoot = HTMLElement & { _reactRoot?: Root };
const rootContainer = container as ContainerWithRoot;

if (!rootContainer._reactRoot) {
  rootContainer._reactRoot = createRoot(rootContainer);
}

const root = rootContainer._reactRoot;

void initializeI18n().then(() => {
  root.render(
    <StrictMode>
      <WelcomeApp />
    </StrictMode>,
  );
});

// Keep browser import used for extension runtime context.
void browser.runtime?.id;
