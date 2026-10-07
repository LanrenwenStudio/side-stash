import React from 'react';
import {
  Archive,
  Copy,
  Filter,
  Keyboard,
  MousePointerClick,
  Pin,
} from 'lucide-react';
import { siteText, type SiteLocale } from '../i18n';

type FeaturesGridProps = {
  lang: SiteLocale;
};

export function FeaturesGrid({ lang }: FeaturesGridProps) {
  const features = [
    {
      icon: MousePointerClick,
      title: siteText(lang, 'Right-click capture', '右键捕获', '右クリックで保存', '오른쪽 클릭으로 수집', '右鍵擷取'),
      desc: siteText(lang, 'Select text, or right-click links and images into the panel.', '选中文本，或对链接 / 图片右键，直接存进侧边栏。', 'テキストを選択するか、リンクや画像を右クリックしてサイドパネルに保存。', '텍스트를 선택하거나 링크와 이미지를 오른쪽 클릭해 패널에 바로 저장하세요.', '選取文字，或對連結 / 圖片按右鍵，直接存進側邊欄。'),
    },
    {
      icon: Keyboard,
      title: siteText(lang, 'Alt+S shortcut', 'Alt+S 快捷键', 'Alt+S ショートカット', 'Alt+S 단축키', 'Alt+S 快捷鍵'),
      desc: siteText(lang, 'Highlight text and press Alt+S to save without opening a menu.', '不用打开菜单，选中文字后按 Alt+S 即可保存。', 'メニューを開かずに、テキストを選択して Alt+S で保存。', '메뉴를 열 필요 없이 텍스트를 선택하고 Alt+S를 눌러 저장하세요.', '不用開啟選單，選取文字後按 Alt+S 即可儲存。'),
    },
    {
      icon: Filter,
      title: siteText(lang, 'Type, date & site filters', '类型 / 日期 / 站点筛选', '種類・日付・サイトで絞り込み', '유형, 날짜, 사이트 필터', '類型 / 日期 / 網站篩選'),
      desc: siteText(lang, 'Filter by type, time range, or site to find items fast.', '按类型、时间或网站筛选，快速找到你要的那几条。', '種類、期間、サイトで絞り込み、必要な項目をすばやく見つけられます。', '유형, 기간, 사이트별로 필터링해 원하는 항목을 빠르게 찾으세요.', '依類型、時間或網站篩選，快速找到你要的那幾筆。'),
    },
    {
      icon: Copy,
      title: siteText(lang, 'Flexible copy formats', '多格式复制', '選べるコピー形式', '다양한 복사 형식', '多格式複製'),
      desc: siteText(lang, 'Plain text, Markdown, or with source context attached.', '纯文本、Markdown 引用，或自动附带来源信息。', 'プレーンテキスト、Markdown 引用、出典情報付きでコピー。', '일반 텍스트, Markdown 인용 또는 출처 정보를 포함해 복사하세요.', '純文字、Markdown 引用，或自動附帶來源資訊。'),
    },
    {
      icon: Pin,
      title: siteText(lang, 'Pin & multi-select', '置顶与多选', 'ピン留めと複数選択', '고정 및 다중 선택', '置頂與多選'),
      desc: siteText(lang, 'Pin important cards. Batch copy, cut, or delete.', '重要条目钉在顶部；可批量复制、剪切或删除。', '重要な項目を上部にピン留め。まとめてコピー、切り取り、削除できます。', '중요한 항목은 맨 위에 고정하고 여러 항목을 한 번에 복사, 잘라내기, 삭제하세요.', '重要項目釘在頂部；可批次複製、剪下或刪除。'),
    },
    {
      icon: Archive,
      title: siteText(lang, 'Image ZIP download', '图片打包下载', '画像を ZIP でダウンロード', '이미지 ZIP 다운로드', '圖片打包下載'),
      desc: siteText(lang, 'Select images and download them as a single ZIP.', '勾选多张图片，一键打包成压缩包下载。', '複数の画像を選択し、ひとつの ZIP にまとめてダウンロード。', '여러 이미지를 선택해 하나의 ZIP 파일로 다운로드하세요.', '勾選多張圖片，一鍵打包成壓縮檔下載。'),
    },
  ];

  return (
    <section id="features" className="border-b border-zinc-200/80 py-16 md:py-22 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
            {siteText(lang, 'Features', '功能', '機能', '기능', '功能')}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 text-balance dark:text-zinc-50 sm:text-4xl">
            {siteText(lang, 'A light tool for heavy browsers.', '为高频浏览者做的轻量工具。', 'たくさん閲覧する人のための、軽量ツール。', '자주 탐색하는 사람을 위한 가벼운 도구.', '為高頻瀏覽者打造的輕量工具。')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {siteText(lang, 'Same quiet UI as the extension — clean, restrained, out of the way.', '界面风格与插件一致：干净、克制，不抢你的阅读节奏。', '拡張機能と同じ、すっきり控えめな UI。読むリズムを邪魔しません。', '확장 프로그램과 같은 차분한 UI — 깔끔하고 절제된 디자인으로 읽는 흐름을 방해하지 않습니다.', '介面風格與擴充功能一致：乾淨、克制，不搶你的閱讀節奏。')}
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
