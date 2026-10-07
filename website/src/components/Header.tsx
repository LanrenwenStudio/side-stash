import React from 'react';
import { ArrowUpRight, Languages, Moon, Sun } from 'lucide-react';
import { Button } from '../../../entrypoints/sidepanel/components/ui/button';
import { ChromeIcon } from './BrandIcons';
import { SITE_LOCALES, siteText, type SiteLocale } from '../i18n';

const CHROME_STORE =
  'https://chromewebstore.google.com/detail/side-stash/khbkjkjokbmldbaelpknjbfoecdkehbk';

type HeaderProps = {
  theme: 'dark' | 'light';
  lang: SiteLocale;
  onToggleTheme: () => void;
};

export function Header({ theme, lang, onToggleTheme }: HeaderProps) {

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
          aria-label={siteText(lang, 'Primary', '主导航', 'メインナビゲーション', '주 메뉴', '主導覽')}
          className="hidden items-center gap-1 md:flex"
        >
          {[
            { href: '#demo', label: siteText(lang, 'Try it', '试用', '試す', '체험', '試用') },
            { href: '#how', label: siteText(lang, 'How it works', '用法', '使い方', '사용법', '用法') },
            { href: '#features', label: siteText(lang, 'Features', '功能', '機能', '기능', '功能') },
            { href: '#privacy', label: siteText(lang, 'Privacy', '隐私', 'プライバシー', '개인정보', '隱私') },
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
          <details className="relative">
            <summary className="inline-flex h-7.5 cursor-pointer list-none items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-zinc-600 hover:bg-zinc-100/80 dark:text-zinc-300 dark:hover:bg-zinc-800/70" aria-label={siteText(lang, 'Language', '语言', '言語', '언어', '語言')}>
              <Languages className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{SITE_LOCALES[lang].label}</span>
            </summary>
            <nav aria-label={siteText(lang, 'Language', '语言', '言語', '언어', '語言')} className="absolute right-0 top-full z-50 mt-2 grid min-w-36 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              {Object.entries(SITE_LOCALES).map(([code, locale]) => <a key={code} href={code === 'en' ? '/' : `/${code}/`} hrefLang={locale.htmlLang} lang={locale.htmlLang} aria-current={code === lang ? 'page' : undefined} className="whitespace-nowrap rounded-lg px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-100 aria-[current=page]:font-semibold dark:text-zinc-200 dark:hover:bg-zinc-800">{locale.label}</a>)}
            </nav>
          </details>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onToggleTheme}
            className="text-zinc-600 dark:text-zinc-300"
            title={siteText(lang, 'Toggle theme', '切换主题', 'テーマを切り替え', '테마 변경', '切換主題')}
            aria-label={siteText(lang, 'Toggle theme', '切换主题', 'テーマを切り替え', '테마 변경', '切換主題')}
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
            <span className="hidden sm:inline">{siteText(lang, 'Install', '安装', 'インストール', '설치', '安裝')}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
