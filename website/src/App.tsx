import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { InteractiveDemoSection } from './components/InteractiveDemoSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { PrivacyBand } from './components/PrivacyBand';
import { Footer } from './components/Footer';

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const toggleLang = () => setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100 light:bg-zinc-50 light:text-zinc-900">
      <Header
        theme={theme}
        lang={lang}
        onToggleTheme={toggleTheme}
        onToggleLang={toggleLang}
      />

      <main>
        <HeroSection lang={lang} />
        <InteractiveDemoSection lang={lang} />
        <FeaturesGrid lang={lang} />
        <PrivacyBand lang={lang} />
      </main>

      <Footer lang={lang} />
    </div>
  );
}
