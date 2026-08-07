import React from 'react';
import { ArrowUpRight, Languages, Moon, Sun } from 'lucide-react';
import { Button } from '../../../entrypoints/sidepanel/components/ui/button';
import { ChromeIcon } from './BrandIcons';

const CHROME_STORE =
  'https://chromewebstore.google.com/detail/side-stash/khbkjkjokbmldbaelpknjbfoecdkehbk';

type HeaderProps = {
  theme: 'dark' | 'light';
  lang: 'zh' | 'en';
  onToggleTheme: () => void;
  onToggleLang: () => void;
};

export function Header({ theme, lang, onToggleTheme, onToggleLang }: HeaderProps) {
  const isZh = lang === 'zh';

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-[color-mix(in_srgb,var(--color-paper)_88%,transparent)] backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <img src="/icon-32.png" alt="" className="size-7 rounded-lg shadow-sm" />
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Side Stash
          </span>
        </a>

        <nav
          aria-label={isZh ? '主导航' : 'Primary'}
          className="hidden items-center gap-1 md:flex"
        >
          {[
            { href: '#demo', label: isZh ? '试用' : 'Try it' },
            { href: '#how', label: isZh ? '用法' : 'How it works' },
            { href: '#features', label: isZh ? '功能' : 'Features' },
            { href: '#privacy', label: isZh ? '隐私' : 'Privacy' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://github.com/LanrenwenStudio/side-stash"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            GitHub
            <ArrowUpRight className="size-3 opacity-60" />
          </a>
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onToggleLang}
            className="gap-1.5 text-zinc-600 dark:text-zinc-300"
            title={isZh ? 'Switch to English' : '切换中文'}
          >
            <Languages className="size-3.5" />
            <span className="hidden sm:inline">{isZh ? 'EN' : '中文'}</span>
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onToggleTheme}
            className="text-zinc-600 dark:text-zinc-300"
            title={isZh ? '切换主题' : 'Toggle theme'}
            aria-label={isZh ? '切换主题' : 'Toggle theme'}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <a
            href={CHROME_STORE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <ChromeIcon className="size-3.5 opacity-80" />
            <span className="hidden sm:inline">{isZh ? '安装' : 'Install'}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
