import React from 'react';
import { ArrowRight, Download, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { ChromeIcon } from './BrandIcons';

type HeroSectionProps = {
  lang: 'zh' | 'en';
};

export function HeroSection({ lang }: HeroSectionProps) {
  const isZh = lang === 'zh';

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background Subtle Gradient Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-rose-500/10 blur-[120px]" />

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Top Tag Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300">
          <Sparkles className="size-3.5 animate-pulse text-indigo-500" />
          <span>{isZh ? '全新 Side Stash v0.1.7 上线 — 现已支持浅色/深色外观' : 'Side Stash v0.1.7 is Live — Light & Dark Themes Added'}</span>
        </div>

        {/* Hero Title */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-white leading-[1.15]">
          {isZh ? (
            <>
              随手保存，<span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">即刻寻找</span>。
            </>
          ) : (
            <>
              Stash it. <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">Find it.</span>
            </>
          )}
        </h1>

        {/* Hero Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400 leading-relaxed font-normal">
          {isZh
            ? '浏览网页时右键选中文本、链接或图片，即可瞬间存入专注于你的侧边栏面板。全本地持久化，支持关键字检索、多格式一键复制与批量 ZIP 导出。'
            : 'Right-click selected text, links, or images to keep them local, searchable, and ready to copy in a clean side panel UI. No account required.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <a
            href="https://chromewebstore.google.com/detail/side-stash/khbkjkjokbmldbaelpknjbfoecdkehbk"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800 active:scale-[0.98] sm:w-auto dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
          >
            <ChromeIcon className="size-4 text-indigo-400 dark:text-indigo-600" />
            <span>{isZh ? '免费添加至 Chrome' : 'Add to Chrome — Free'}</span>
          </a>

          <a
            href="#live-demo"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white/80 px-6 text-sm font-semibold text-zinc-800 shadow-2xs backdrop-blur-xs transition-all hover:bg-zinc-50 hover:text-zinc-950 active:scale-[0.98] sm:w-auto dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <Zap className="size-4 text-amber-500" />
            <span>{isZh ? '⚡ 在线亲身体验效果' : '⚡ Try Interactive Demo'}</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>

        {/* Trust & Key Features Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-500" />
            {isZh ? '数据纯本地存储' : '100% Local Storage'}
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="size-4 text-amber-500" />
            {isZh ? 'Alt+S 一键快捷保存' : 'Alt+S Quick Shortcut'}
          </span>
          <span className="flex items-center gap-1.5">
            <Download className="size-4 text-indigo-500" />
            {isZh ? 'ZIP 图片批量打包下载' : 'ZIP Image Batch Download'}
          </span>
        </div>
      </div>
    </section>
  );
}
