import React from 'react';
import type { SiteLocale } from '../i18n';
import { TRUST } from '../trust';

export function TrustSection({ lang }: { lang: SiteLocale }) {
  const copy = TRUST[lang];
  const updated: Record<SiteLocale, string> = { en: 'Content updated', zh: '内容更新', 'zh-TW': '內容更新', ja: '内容更新日', ko: '내용 업데이트', es: 'Contenido actualizado' };
  return <section id="faq" className="border-b border-zinc-200/80 py-16 dark:border-zinc-800/80">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{copy.heading}</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">{copy.questions.map(({ question, answer }) => <article key={question}>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{question}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{answer}</p>
      </article>)}</div>
      <div className="mt-10 grid gap-6 border-t border-zinc-200 pt-6 sm:grid-cols-2 dark:border-zinc-800">
        <div id="about"><h2 className="text-base font-semibold">{copy.about}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{copy.developer}</p><a href="https://lanrenwen.com/" className="mt-2 inline-block text-sm underline underline-offset-4">LanrenwenStudio</a></div>
        <div id="contact"><h2 className="text-base font-semibold">{copy.contact}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{copy.support}</p><div className="mt-2 flex flex-wrap gap-4 text-sm"><a href="mailto:support@lanrenwen.com" className="underline underline-offset-4">support@lanrenwen.com</a><a href="https://github.com/LanrenwenStudio/side-stash/issues" className="underline underline-offset-4">GitHub Issues</a></div></div>
      </div>
      <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">{updated[lang]}: <time dateTime="2026-10-06">2026-10-06</time></p>
    </div>
  </section>;
}
