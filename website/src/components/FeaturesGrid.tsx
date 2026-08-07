import React from 'react';
import { Archive, Copy, HardDrive, Keyboard, MousePointer, Search, ShieldCheck, Zap } from 'lucide-react';

type FeaturesGridProps = {
  lang: 'zh' | 'en';
};

export function FeaturesGrid({ lang }: FeaturesGridProps) {
  const isZh = lang === 'zh';

  const features = [
    {
      icon: MousePointer,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      title: isZh ? '右键即刻捕获' : 'Right-Click Capture',
      desc: isZh
        ? '选中文本，或右键任意网页链接/图片，菜单一键存入侧边栏，不打断当前阅读节奏。'
        : 'Select text, links, or images and right-click to store them straight into your side panel without switching tabs.',
    },
    {
      icon: Keyboard,
      iconColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      title: isZh ? 'Alt+S 极速快捷键' : 'Alt+S Instant Shortcut',
      desc: isZh
        ? '无需鼠标右键，按下 Alt+S 瞬间保存当前选区文字，极速提升资料收集效率。'
        : 'Highlight text and press Alt+S to save your selection instantly without right-clicking.',
    },
    {
      icon: Archive,
      iconColor: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      title: isZh ? 'ZIP 批量图片打包导出' : 'Batch Image ZIP Download',
      desc: isZh
        ? '内置高效 fflate 压缩引擎，支持勾选多张灵感图片一键打包导出 ZIP 或单独批量下载。'
        : 'Select multiple collected image assets and download them as a compressed ZIP file with a single click.',
    },
    {
      icon: Copy,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      title: isZh ? '多格式灵动复制' : 'Flexible Copy Formats',
      desc: isZh
        ? '支持纯文本、Markdown 引用与带有来源网址的三种复制格式，随时契合笔记写作。'
        : 'Copy snippets in Plain text, Markdown syntax, or with automatic source URLs for easy note-taking.',
    },
    {
      icon: Search,
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      title: isZh ? '多维度检索与置顶' : 'Smart Search & Pinning',
      desc: isZh
        ? '按类型（文本/链接/图片）、时间范围与域名精确筛选，关键条目随时置顶。'
        : 'Filter your stash by type, creation date, or domain name. Pin important cards to the top of your list.',
    },
    {
      icon: ShieldCheck,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
      title: isZh ? '纯本地高隐性存储' : '100% Local & Private',
      desc: isZh
        ? '所有数据存放在本机的 chrome.storage.local，无账号、无服务器上传、无追逐追踪。'
        : 'Saved items live strictly inside chrome.storage.local on your device. Zero servers, zero tracking.',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            {isZh ? '精心打造，专为高效浏览者设计' : 'Designed for high-efficiency browsing'}
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            {isZh
              ? '摆脱繁重的标签页与笔记软件，用最轻量的方式管理日常浏览中的灵感碎片。'
              : 'Ditch cluttered tabs and bloated note tools. Collect references effortlessly while you read.'}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/90 dark:hover:shadow-xl"
            >
              <div className={`inline-flex rounded-xl border p-3 ${f.bgColor}`}>
                <f.icon className={`size-6 ${f.iconColor}`} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
