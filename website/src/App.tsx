import React, { useEffect, useState } from 'react';
import { setLanguagePreference } from '../../lib/i18n';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { InteractiveDemoSection } from './components/InteractiveDemoSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { PrivacyBand } from './components/PrivacyBand';
import { Footer } from './components/Footer';

function preferDark() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function preferZh() {
  if (typeof navigator === 'undefined') return false;
  const lang = (navigator.languages?.[0] || navigator.language || '').toLowerCase();
  return lang.startsWith('zh');
}

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (preferDark() ? 'dark' : 'light'));
  const [lang, setLang] = useState<'zh' | 'en'>(() => (preferZh() ? 'zh' : 'en'));
  const [, setI18nTick] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    void setLanguagePreference(lang === 'zh' ? 'zh_CN' : 'en').then(() => {
      setI18nTick((value) => value + 1);
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title =
      lang === 'zh'
        ? 'Side Stash — 本地侧边栏收藏'
        : 'Side Stash — local side-panel collector';
  }, [lang]);

  return (
    <div className="relative min-h-dvh bg-[var(--color-paper)] text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
      <div className="site-grain" aria-hidden="true" />
      <div className="relative z-[1]">
        <Header
          theme={theme}
          lang={lang}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          onToggleLang={() => setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))}
        />

        <main>
          <HeroSection lang={lang} theme={theme} />
          <HowItWorks lang={lang} />
          <InteractiveDemoSection lang={lang} theme={theme} />
          <FeaturesGrid lang={lang} />
          <PrivacyBand lang={lang} />
        </main>

        <Footer lang={lang} />
      </div>
    </div>
  );
}
