import React from 'react';
import { ChromeIcon, GithubIcon } from './BrandIcons';
import { siteText, type SiteLocale } from '../i18n';
import { TRUST } from '../trust';

const CHROME_STORE =
  'https://chromewebstore.google.com/detail/side-stash/khbkjkjokbmldbaelpknjbfoecdkehbk';

type FooterProps = {
  lang: SiteLocale;
};

export function Footer({ lang }: FooterProps) {
  return (
    <footer className="py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6">
        {/* Final CTA strip */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-900 px-6 py-6 text-zinc-50 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">
          <div>
            <p className="text-sm font-semibold tracking-tight">
              {siteText(lang, 'Ready to stash as you browse?', '准备好把碎片收进侧边栏了吗？', '閲覧しながら、サイドパネルに保存しませんか？', '탐색 중 발견한 조각들을 사이드 패널에 모아 볼까요?', '準備好把片段收進側邊欄了嗎？')}
            </p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              {siteText(lang, 'Chrome extension · free · MIT', 'Chrome 扩展 · 免费 · MIT', 'Chrome 拡張機能 · 無料 · MIT', 'Chrome 확장 프로그램 · 무료 · MIT', 'Chrome 擴充功能 · 免費 · MIT')}
            </p>
          </div>
          <a
            href={CHROME_STORE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-zinc-900 transition-all hover:bg-zinc-100 active:scale-[0.98] dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            <ChromeIcon className="size-3.5 opacity-80" />
            {siteText(lang, 'Add to Chrome', '添加到 Chrome', 'Chrome に追加', 'Chrome에 추가', '新增至 Chrome')}
          </a>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <img src="/icon-32.png" alt="" className="size-6 rounded-md" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Side Stash</span>
            <span className="font-mono text-[11px] text-zinc-400">v0.1.10</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <a
              href={CHROME_STORE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <ChromeIcon className="size-3.5" />
              {siteText(lang, 'Chrome Web Store', 'Chrome Web Store', 'Chrome ウェブストア', 'Chrome 웹 스토어', 'Chrome 線上應用程式商店')}
            </a>
            <a
              href="https://github.com/LanrenwenStudio/side-stash"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <GithubIcon className="size-3.5" />
              GitHub
            </a>
            <a href="#about" className="hover:underline">{TRUST[lang].about}</a>
            <a href="#contact" className="hover:underline">{TRUST[lang].contact}</a>
            <a href="/privacy-policy.html" hrefLang="en" className="hover:underline">{TRUST[lang].privacy}</a>
          </div>

          <p className="text-center text-[11px] text-zinc-400 sm:text-right">
            © {new Date().getFullYear()} LanrenwenStudio · MIT
          </p>
        </div>
      </div>
    </footer>
  );
}
