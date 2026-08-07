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
    },
    {
      icon: Keyboard,
      title: isZh ? 'Alt+S 快捷键' : 'Alt+S shortcut',
      desc: isZh
        ? '不用打开菜单，选中文字后按 Alt+S 即可保存。'
        : 'Highlight text and press Alt+S to save without opening a menu.',
    },
    {
      icon: Filter,
      title: isZh ? '类型 / 日期 / 站点筛选' : 'Type, date & site filters',
      desc: isZh
        ? '按类型、时间或网站筛选，快速找到你要的那几条。'
        : 'Filter by type, time range, or site to find items fast.',
    },
    {
      icon: Copy,
      title: isZh ? '多格式复制' : 'Flexible copy formats',
      desc: isZh
        ? '纯文本、Markdown 引用，或自动附带来源信息。'
        : 'Plain text, Markdown, or with source context attached.',
    },
    {
      icon: Pin,
      title: isZh ? '置顶与多选' : 'Pin & multi-select',
      desc: isZh
        ? '重要条目钉在顶部；可批量复制、剪切或删除。'
        : 'Pin important cards. Batch copy, cut, or delete.',
    },
    {
      icon: Archive,
      title: isZh ? '图片打包下载' : 'Image ZIP download',
      desc: isZh
        ? '勾选多张图片，一键打包成压缩包下载。'
        : 'Select images and download them as a single ZIP.',
    },
  ];

  return (
    <section id="features" className="border-b border-zinc-200/80 py-16 md:py-22 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
            {isZh ? '功能' : 'Features'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 text-balance dark:text-zinc-50 sm:text-4xl">
            {isZh ? '为高频浏览者做的轻量工具。' : 'A light tool for heavy browsers.'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {isZh
              ? '界面风格与插件一致：干净、克制，不抢你的阅读节奏。'
              : 'Same quiet UI as the extension — clean, restrained, out of the way.'}
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="flex h-full flex-col rounded-2xl border border-zinc-200/90 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-700"
              >
                <div className="grid size-9 place-items-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
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
