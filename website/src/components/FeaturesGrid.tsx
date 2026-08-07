import React from 'react';
import {
  Archive,
  Copy,
  Filter,
  Keyboard,
  MousePointerClick,
  Pin,
} from 'lucide-react';

type FeaturesGridProps = {
  lang: 'zh' | 'en';
};

export function FeaturesGrid({ lang }: FeaturesGridProps) {
  const isZh = lang === 'zh';

  const features = [
    {
      icon: MousePointerClick,
      title: isZh ? '右键捕获' : 'Right-click capture',
      desc: isZh
        ? '选中文本，或对链接 / 图片右键，直接存进侧边栏。'
        : 'Select text, or right-click links and images into the panel.',
      span: 'md:col-span-2',
    },
    {
      icon: Keyboard,
      title: isZh ? 'Alt+S 快捷键' : 'Alt+S shortcut',
      desc: isZh ? '不用打开菜单，选区即存。' : 'Save the selection without opening a menu.',
      span: '',
    },
    {
      icon: Filter,
      title: isZh ? '类型 / 日期 / 站点筛选' : 'Type, date & site filters',
      desc: isZh
        ? '和插件里同一套 FilterBar：快速收窄到你要找的那几条。'
        : 'The same FilterBar as the extension — narrow the list fast.',
      span: '',
    },
    {
      icon: Copy,
      title: isZh ? '多格式复制' : 'Flexible copy formats',
      desc: isZh
        ? '纯文本、Markdown 引用，或自动附带来源信息。'
        : 'Plain text, Markdown, or with source context attached.',
      span: 'md:col-span-2',
    },
    {
      icon: Pin,
      title: isZh ? '置顶与多选' : 'Pin & multi-select',
      desc: isZh
        ? '重要条目钉在顶部；批量复制、剪切或删除。'
        : 'Pin important cards. Batch copy, cut, or delete.',
      span: '',
    },
    {
      icon: Archive,
      title: isZh ? '图片 ZIP 导出' : 'Image ZIP export',
      desc: isZh
        ? '勾选多张图片，一键打包下载（基于 fflate）。'
        : 'Select images and download as a ZIP with one click.',
      span: '',
    },
  ];

  return (
    <section id="features" className="border-b border-zinc-200/80 py-16 md:py-22 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-lg">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
              {isZh ? '功能' : 'Features'}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 text-balance dark:text-zinc-50 sm:text-4xl">
              {isZh ? '为高频浏览者做的轻量工具。' : 'A light tool for heavy browsers.'}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {isZh
              ? '界面语言与插件一致：石墨结构、克制强调色，不抢戏。'
              : 'Same visual language as the extension: graphite structure, restrained accents.'}
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className={[
                  'rounded-2xl border border-zinc-200/90 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-700',
                  feature.span,
                ].join(' ')}
              >
                <div className="grid size-9 place-items-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {feature.title}
                </h3>
                <p className="mt-1.5 max-w-prose text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {feature.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
