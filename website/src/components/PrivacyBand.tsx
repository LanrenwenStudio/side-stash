import React from 'react';
import { CheckCircle2, Lock, ServerOff, ShieldCheck } from 'lucide-react';

type PrivacyBandProps = {
  lang: 'zh' | 'en';
};

export function PrivacyBand({ lang }: PrivacyBandProps) {
  const isZh = lang === 'zh';

  return (
    <section id="privacy" className="py-16 bg-gradient-to-b from-zinc-950 via-indigo-950/20 to-zinc-950 border-t border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-indigo-500/20 bg-zinc-900/80 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="size-3.5" />
                <span>{isZh ? '100% 隐私无忧承诺' : '100% Local Privacy Guarantee'}</span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                {isZh ? 'Local by Design. 纯本地存储' : 'Local by design. Never leaves your device.'}
              </h2>
              <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
                {isZh
                  ? 'Side Stash 绝不收集、上传或跟踪任何您的个人收藏与浏览记录。所有文字片段、网址与图片链接均存放在本地 Chrome storage 中。'
                  : 'All your saved snippets stay inside Chrome storage on your device. There is no account, no backend, and no analytics pipeline.'}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-medium text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>{isZh ? '基于 chrome.storage.local 本地存储' : 'Saved with chrome.storage.local'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>{isZh ? '无需注册，零账号开箱即用' : 'No account creation needed'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>{isZh ? '无任何后台数据抓取与分析脚本' : 'Zero background tracking or analytics'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>{isZh ? '随时支持一键 JSON / MD 全量导出' : 'One-click full JSON & Markdown export'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative flex size-44 items-center justify-center rounded-full border border-indigo-500/30 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 p-4 shadow-inner">
                <Lock className="size-20 text-indigo-400" />
                <ServerOff className="absolute bottom-2 right-2 size-8 text-emerald-400 bg-zinc-900 rounded-full p-1 border border-emerald-500/40" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
