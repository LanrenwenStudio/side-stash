import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { setLanguagePreference } from '../../lib/i18n';
import { SITE_LOCALES, type SiteLocale } from './i18n';

// Shared extension translations are module-scoped, so locale renders must not overlap.
let queue: Promise<unknown> = Promise.resolve();
export function renderPage(lang: SiteLocale): Promise<string> {
  const rendered = queue.then(async () => {
    await setLanguagePreference(SITE_LOCALES[lang].extensionLocale);
    return renderToString(<App lang={lang} />);
  });
  queue = rendered.catch(() => undefined);
  return rendered;
}
