import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { InteractiveDemoSection } from './components/InteractiveDemoSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { PrivacyBand } from './components/PrivacyBand';
import { Footer } from './components/Footer';
import type { SiteLocale } from './i18n';
import { TrustSection } from './components/TrustSection';

function preferDark() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}


export function App({ lang }: { lang: SiteLocale }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => { setTheme(preferDark() ? 'dark' : 'light'); }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    root.style.colorScheme = theme;
  }, [theme]);


  return (
    <div className="relative min-h-dvh bg-[var(--color-paper)] text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
      <div className="site-grain" aria-hidden="true" />
      <div className="relative z-[1]">
        <Header
          theme={theme}
          lang={lang}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        />

        <main>
          <HeroSection lang={lang} theme={theme} />
          <HowItWorks lang={lang} />
          <InteractiveDemoSection lang={lang} theme={theme} />
          <FeaturesGrid lang={lang} />
          <PrivacyBand lang={lang} />
          <TrustSection lang={lang} />
        </main>

        <Footer lang={lang} />
      </div>
    </div>
  );
}
