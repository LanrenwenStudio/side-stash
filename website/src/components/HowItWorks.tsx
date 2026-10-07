import React from 'react';
import { Keyboard, MousePointerClick, PanelRight, Search } from 'lucide-react';
import { siteText, type SiteLocale } from '../i18n';

type HowItWorksProps = {
  lang: SiteLocale;
};

export function HowItWorks({ lang }: HowItWorksProps) {
  const list = [
  {
    icon: MousePointerClick,
    kicker: siteText(lang, '01 · Capture', '01 · 捕获', '01 · 保存', '01 · 수집', '01 · 擷取'),
    title: siteText(lang, 'Right-click, or press Alt+S', '右键，或按 Alt+S', '右クリック、または Alt+S', '오른쪽 클릭 또는 Alt+S', '右鍵，或按 Alt+S'),
    body: siteText(lang, 'Select text, or right-click a link or image. Save without leaving the page.', '选中文本，或对着链接 / 图片右键，一键存入侧边栏。不打断当前阅读。', 'テキストを選択するか、リンクや画像を右クリック。ページを離れずにサイドパネルへ保存できます。', '텍스트를 선택하거나 링크와 이미지를 오른쪽 클릭하세요. 페이지를 벗어나지 않고 저장할 수 있습니다.', '選取文字，或對著連結 / 圖片按右鍵，一鍵存入側邊欄。不打斷目前閱讀。'),
  },
  {
    icon: PanelRight,
    kicker: siteText(lang, '02 · Review', '02 · 整理', '02 · 整理', '02 · 정리', '02 · 整理'),
    title: siteText(lang, 'Open the focused side panel', '在侧边栏集中查看', 'サイドパネルでまとめて確認', '사이드 패널에서 한눈에 보기', '在側邊欄集中查看'),
    body: siteText(lang, 'Text, links, and images stay grouped with source context. Pin what matters.', '文本、链接、图片分类型展示，带来源域名与时间，重要条目可置顶。', 'テキスト、リンク、画像を種類別に表示。出典のドメインと日時も確認でき、重要な項目はピン留めできます。', '텍스트, 링크, 이미지를 유형별로 모아 출처 도메인과 시간을 함께 표시합니다. 중요한 항목은 고정하세요.', '文字、連結、圖片依類型顯示，附來源網域與時間，重要項目可置頂。'),
  },
  {
    icon: Search,
    kicker: siteText(lang, '03 · Reuse', '03 · 复用', '03 · 活用', '03 · 재사용', '03 · 重用'),
    title: siteText(lang, 'Search, multi-select, copy', '搜索、多选、一键复制', '検索、複数選択、まとめてコピー', '검색, 다중 선택, 한 번에 복사', '搜尋、多選、一鍵複製'),
    body: siteText(lang, 'Filter by type, date, or site. Copy as plain text, Markdown, or with source.', '按类型 / 日期 / 站点筛选，支持纯文本、Markdown 或带来源的复制格式。', '種類、日付、サイトで絞り込み。プレーンテキスト、Markdown、出典付きの形式でコピーできます。', '유형, 날짜, 사이트별로 필터링하세요. 일반 텍스트, Markdown, 출처 포함 형식으로 복사할 수 있습니다.', '依類型 / 日期 / 網站篩選，支援純文字、Markdown 或附來源的複製格式。'),
  },
];

  return (
    <section id="how" className="border-b border-zinc-200/80 py-16 md:py-22 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
            {siteText(lang, 'Workflow', '工作流', '使い方', '작업 흐름', '工作流程')}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 text-balance dark:text-zinc-50 sm:text-4xl">
            {siteText(lang, 'A small capture loop that stays out of the way.', '一小圈捕获循环，不挡路。', '閲覧を邪魔しない、小さな保存の流れ。', '방해 없이 이어지는 작은 수집 흐름.', '一小圈擷取循環，不擋路。')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {siteText(lang, 'Built for the tiny things you do not want to lose while reading or researching.', '为阅读、调研、收集参考时那些「不想丢」的碎片而设计。', '読書や調査、参考資料集めで「なくしたくない」小さな情報のために。', '읽고, 조사하고, 참고 자료를 모을 때 놓치고 싶지 않은 작은 조각들을 위해 만들었습니다.', '為閱讀、調研、收集參考時那些「不想丟」的片段而設計。')}
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
            <>
              {siteText(lang, 'Shortcut:', '快捷键：选中文本后按', 'ショートカット：テキストを選択して', '단축키: 텍스트를 선택한 뒤', '快捷鍵：選取文字後按')}{' '}
              <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
                Alt+S
              </kbd>{' '}
              {siteText(lang, 'saves the current selection', '即可保存', 'で保存できます', '를 누르면 저장됩니다', '即可儲存')}
            </>
          </span>
        </div>
      </div>
    </section>
  );
}
