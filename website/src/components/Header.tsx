import React from 'react';
import { ArrowUpRight, Languages, Moon, Sun } from 'lucide-react';
import { ChromeIcon } from './BrandIcons';

type HeaderProps = {
  theme: 'dark' | 'light';
  lang: 'zh' | 'en';
  onToggleTheme: () => void;
  onToggleLang: () => void;
};

export function Header({ theme, lang, onToggleTheme, onToggleLang }: HeaderProps) {
  const isZh = lang === 'zh';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <img src="/icon-128.png" alt="Side Stash" className="size-8 rounded-lg shadow-sm" />
          <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
            Side Stash
          </span>
          <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400">
            v0.1.7
          </span>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-6 md:flex text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <a href="#live-demo" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
            {isZh ? '⚡ 在线试用' : '⚡ Live Demo'}
          </a>
          <a href="#features" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
            {isZh ? '功能特性' : 'Features'}
          </a>
          <a href="#privacy" className="transition-colors hover:text-zinc-900 dark:hover:text-white">
            {isZh ? '本地隐私' : 'Privacy'}
          </a>
          <a
            href="https://github.com/LanrenwenStudio/side-stash"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            GitHub
            <ArrowUpRight className="size-3" />
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 text-xs font-medium text-zinc-700 shadow-2xs transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            title={isZh ? '切换英文' : 'Switch to Chinese'}
          >
            <Languages className="size-3.5 text-zinc-500" />
            <span>{isZh ? '中 / EN' : 'EN / 中'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="grid size-8 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 shadow-2xs transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            title={isZh ? '切换主题' : 'Toggle theme'}
          >
            {theme === 'dark' ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-zinc-600" />}
          </button>

          {/* Add to Chrome Primary Button */}
          <a
            href="https://chromewebstore.google.com/detail/side-stash/khbkjkjokbmldbaelpknjbfoecdkehbk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8.5 items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
          >
            <ChromeIcon className="size-3.5 text-indigo-400 dark:text-indigo-600" />
            <span>{isZh ? '添加至 Chrome' : 'Add to Chrome'}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
