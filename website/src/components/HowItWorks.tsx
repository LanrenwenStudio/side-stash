import React from 'react';
import { Keyboard, MousePointerClick, PanelRight, Search } from 'lucide-react';

type HowItWorksProps = {
  lang: 'zh' | 'en';
};

const steps = (isZh: boolean) => [
  {
    icon: MousePointerClick,
    kicker: isZh ? '01 · 捕获' : '01 · Capture',
    title: isZh ? '右键，或按 Alt+S' : 'Right-click, or press Alt+S',
    body: isZh
      ? '选中文本，或对着链接 / 图片右键，一键存入侧边栏。不打断当前阅读。'
      : 'Select text, or right-click a link or image. Save without leaving the page.',
  },
  {
    icon: PanelRight,
    kicker: isZh ? '02 · 整理' : '02 · Review',
    title: isZh ? '在侧边栏集中查看' : 'Open the focused side panel',
    body: isZh
      ? '文本、链接、图片分类型展示，带来源域名与时间，重要条目可置顶。'
      : 'Text, links, and images stay grouped with source context. Pin what matters.',
  },
  {
    icon: Search,
    kicker: isZh ? '03 · 复用' : '03 · Reuse',
    title: isZh ? '搜索、多选、一键复制' : 'Search, multi-select, copy',
    body: isZh
      ? '按类型 / 日期 / 站点筛选，支持纯文本、Markdown 或带来源的复制格式。'
      : 'Filter by type, date, or site. Copy as plain text, Markdown, or with source.',
  },
];

export function HowItWorks({ lang }: HowItWorksProps) {
  const isZh = lang === 'zh';
  const list = steps(isZh);

  return (
    <section id="how" className="border-b border-zinc-200/80 py-16 md:py-22 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
            {isZh ? '工作流' : 'Workflow'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 text-balance dark:text-zinc-50 sm:text-4xl">
            {isZh ? '一小圈捕获循环，不挡路。' : 'A small capture loop that stays out of the way.'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {isZh
              ? '为阅读、调研、收集参考时那些「不想丢」的碎片而设计。'
              : 'Built for the tiny things you do not want to lose while reading or researching.'}
          </p>
        </div>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {list.map((step) => {
            const Icon = step.icon;
            return (
              <li
                key={step.kicker}
                className="group relative flex flex-col rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-2xs transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-9 place-items-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
                    {step.kicker}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100/80 px-3 py-2 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <Keyboard className="size-3.5 shrink-0 text-zinc-900 dark:text-zinc-100" />
          <span>
            {isZh ? (
              <>
                快捷键：选中文本后按{' '}
                <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
                  Alt+S
                </kbd>{' '}
                即可保存
              </>
            ) : (
              <>
                Shortcut:{' '}
                <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
                  Alt+S
                </kbd>{' '}
                saves the current selection
              </>
            )}
          </span>
        </div>
      </div>
    </section>
  );
}
