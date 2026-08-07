import React from 'react';
import { ArrowDownRight, Keyboard, Shield } from 'lucide-react';
import { ChromeIcon } from './BrandIcons';
import { SidePanelDemo } from './SidePanelDemo';

const CHROME_STORE =
  'https://chromewebstore.google.com/detail/side-stash/khbkjkjokbmldbaelpknjbfoecdkehbk';

type HeroSectionProps = {
  lang: 'zh' | 'en';
  theme: 'dark' | 'light';
};

export function HeroSection({ lang, theme }: HeroSectionProps) {
  const isZh = lang === 'zh';

  return (
    <section
      id="top"
      className="panel-ambient relative overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:gap-14 lg:py-24">
        {/* Copy */}
        <div className="min-w-0 animate-fade-up">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
            {isZh ? '浏览器侧边栏收藏' : 'Browser side-panel collector'}
          </p>

          <h1 className="mt-4 max-w-[12ch] text-[clamp(2.75rem,7vw,4.75rem)] font-semibold leading-[0.95] tracking-tight text-zinc-950 text-balance dark:text-zinc-50">
            {isZh ? (
              <>
                随手存。
                <br />
                立刻找。
              </>
            ) : (
              <>
                Stash it.
                <br />
                Find it.
              </>
            )}
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-zinc-600 text-pretty dark:text-zinc-400">
            {isZh
              ? '右键保存文本、链接或图片到本地侧边栏。搜索、筛选、多选复制——不需要账号，也不上传服务器。'
              : 'Right-click text, links, or images into a private side panel. Search, filter, multi-select, copy — all local, no account.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={CHROME_STORE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <ChromeIcon className="size-4 opacity-80" />
              {isZh ? '免费添加到 Chrome' : 'Add to Chrome — free'}
            </a>
            <a
              href="#demo"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-5 text-sm font-semibold text-zinc-800 transition-all hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              {isZh ? '在网页里试用' : 'Try it here'}
              <ArrowDownRight className="size-4 opacity-60" />
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <li className="inline-flex items-center gap-1.5">
              <Shield className="size-3.5 text-zinc-900 dark:text-zinc-100" />
              {isZh ? '纯本地存储' : 'Local only'}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Keyboard className="size-3.5 text-zinc-900 dark:text-zinc-100" />
              Alt+S
            </li>
            <li className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
              v0.1.7
            </li>
          </ul>
        </div>

        {/* Live product panel — real extension components */}
        <div className="relative animate-fade-up-delay-1 lg:justify-self-end">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-b from-zinc-200/40 to-transparent blur-2xl dark:from-zinc-800/40" />
          <div className="animate-float-soft">
            <SidePanelDemo lang={lang} theme={theme} compact className="w-full max-w-[400px]" />
          </div>
          <p className="mt-3 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
            {isZh
              ? '真实侧边栏组件 · 可搜索、筛选、置顶、复制'
              : 'Real side-panel UI · search, filter, pin, copy'}
          </p>
        </div>
      </div>
    </section>
  );
}
