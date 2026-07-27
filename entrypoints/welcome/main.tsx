import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ChevronDown, Languages } from 'lucide-react';
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
import '../sidepanel/style.css';

type SidePanelApi = {
  open?: (options: { windowId?: number; tabId?: number }) => Promise<void>;
  setPanelBehavior?: (options: { openPanelOnActionClick: boolean }) => Promise<void>;
};

async function openSidePanelThenClose() {
  try {
    const sidePanel = (browser as typeof browser & { sidePanel?: SidePanelApi }).sidePanel;
    const currentWindow = await browser.windows.getCurrent();

    if (sidePanel?.open && typeof currentWindow.id === 'number') {
      await sidePanel.open({ windowId: currentWindow.id });
    } else {
      // Fallback for environments without sidePanel.open in this context.
      await browser.runtime.sendMessage({ type: 'side-stash-open-panel' });
    }
  } catch {
    try {
      await browser.runtime.sendMessage({ type: 'side-stash-open-panel' });
    } catch {
      // ignore — user can still open via toolbar icon
    }
  }

  // Small delay so the panel open call isn't cut off by tab close on some Chrome builds.
  window.setTimeout(() => {
    window.close();
  }, 120);
}

function WelcomeApp() {
  const [, setLanguageVersion] = useState(0);
  const languageSelectValue = getLanguageSelectValue();
  const resolvedLocale = getResolvedLocale();

  useEffect(() => {
    return subscribeToLanguageChange(() => {
      setLanguageVersion((value) => value + 1);
    });
  }, []);

  useEffect(() => {
    document.title = t('welcomeTitle', 'Welcome to Side Stash');
  }, [languageSelectValue, resolvedLocale]);

  useEffect(() => {
    // Attempt to automatically trigger side panel opening on installation welcome page
    void openSidePanelThenClose().catch(() => undefined);
  }, []);

  const steps = [
    {
      n: '1',
      title: t('welcomeStep1Title', 'Right-click on any page'),
      body: t(
        'welcomeStep1Body',
        'Save selected text, a link, or an image with the context menu.',
      ),
    },
    {
      n: '2',
      title: t('welcomeStep2Title', 'Open the side panel'),
      body: t(
        'welcomeStep2Body',
        'Click the Side Stash toolbar icon to review, filter, and copy your stash.',
      ),
    },
    {
      n: '3',
      title: t('welcomeStep3Title', 'Everything stays local'),
      body: t(
        'welcomeStep3Body',
        'Data is stored only on this device. No account, no upload, no tracking.',
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
                'A lightweight side panel for text, links, and images — private by default.',
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

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="m-0 text-sm font-semibold">
            {t('welcomePermissionsTitle', 'Why these permissions?')}
          </h2>
          <ul className="mt-3 mb-0 grid list-disc gap-2 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <li>
              {t(
                'welcomePermContext',
                'Context menus: add “Save to side panel” when you right-click.',
              )}
            </li>
            <li>
              {t(
                'welcomePermStorage',
                'Storage: keep your stash on this device only.',
              )}
            </li>
            <li>
              {t(
                'welcomePermTabs',
                'Tabs & host access: read page title/URL so each item has source context. Content is never uploaded.',
              )}
            </li>
          </ul>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            type="button"
            onClick={() => {
              void openSidePanelThenClose();
            }}
          >
            {t('welcomeCta', 'Open side panel')}
          </button>
          <p className="m-0 text-xs text-zinc-500 dark:text-zinc-400">
            {t(
              'welcomeHint',
              'Tip: pin Side Stash to the toolbar for one-click access.',
            )}
          </p>
        </div>
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
