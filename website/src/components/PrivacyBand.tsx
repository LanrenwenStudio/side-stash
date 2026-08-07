import React from 'react';
import { Check, HardDrive } from 'lucide-react';

type PrivacyBandProps = {
  lang: 'zh' | 'en';
};

export function PrivacyBand({ lang }: PrivacyBandProps) {
  const isZh = lang === 'zh';

  const points = isZh
    ? [
        '收藏只保存在你自己的电脑 / 浏览器里',
        '无需注册，零账号',
        '无后台分析、无追踪脚本',
        '随时可导出全部内容备份',
      ]
    : [
        'Saves only on your device, in your browser',
        'No account, no sign-up',
        'No analytics or tracking scripts',
        'Export everything anytime for backup',
      ];

  return (
    <section id="privacy" className="border-b border-zinc-200/80 py-16 md:py-22 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl border border-zinc-200/90 bg-white p-8 shadow-2xs md:grid-cols-[1fr_auto] md:p-10 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
              {isZh ? '隐私' : 'Privacy'}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 text-balance dark:text-zinc-50 sm:text-4xl">
              {isZh ? '只存在你这边。' : 'Stays on your device.'}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {isZh
                ? '收藏不会上传到任何服务器——我们根本没有云端。所有内容都留在你的浏览器里，只有你自己能看到。'
                : 'Nothing is uploaded to a cloud account. Your stash lives in your browser on this device — only you can see it.'}
            </p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                    <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="grid size-28 place-items-center rounded-3xl border border-zinc-200 bg-zinc-50 text-zinc-900 shadow-inner dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
              <HardDrive className="size-10" strokeWidth={1.5} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
