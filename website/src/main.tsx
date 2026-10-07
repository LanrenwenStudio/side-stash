import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { setLanguagePreference } from '../../lib/i18n';
import { SITE_LOCALES, type SiteLocale } from './i18n';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Website root container not found.');
}

const code = container.dataset.locale || 'en';
const lang: SiteLocale = Object.hasOwn(SITE_LOCALES, code) ? code as SiteLocale : 'en';
void setLanguagePreference(SITE_LOCALES[lang].extensionLocale).then(() => {
  // Replace the static view once ready: demo timestamps are relative to the visit,
  // so hydrating build-time sample timestamps would produce stale content.
  createRoot(container).render(<StrictMode><App lang={lang} /></StrictMode>);
});
