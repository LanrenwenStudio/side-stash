import React from 'react';
import { ArrowDownRight, Keyboard, Shield } from 'lucide-react';
import { ChromeIcon } from './BrandIcons';
import { SidePanelDemo } from './SidePanelDemo';
import { siteText, type SiteLocale } from '../i18n';

const CHROME_STORE =
  'https://chromewebstore.google.com/detail/side-stash/khbkjkjokbmldbaelpknjbfoecdkehbk';

type HeroSectionProps = {
  lang: SiteLocale;
  theme: 'dark' | 'light';
};

export function HeroSection({ lang, theme }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="panel-ambient relative overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:gap-14 lg:py-24">
        {/* Copy */}
        <div className="min-w-0 animate-fade-up">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
            {siteText(lang, 'Browser side-panel collector', '浏览器侧边栏收藏', 'ブラウザのサイドパネルに保存', '브라우저 사이드 패널 수집 도구', '瀏覽器側邊欄收藏')}
          </p>

          <h1 className="mt-4 max-w-[12ch] text-[clamp(2.75rem,7vw,4.75rem)] font-semibold leading-[0.95] tracking-tight text-zinc-950 text-balance dark:text-zinc-50">
            <>
              {siteText(lang, 'Stash it.', '随手存。', 'さっと保存。', '바로 저장.', '隨手存。')}
              <br />
              {siteText(lang, 'Find it.', '立刻找。', 'すぐ見つかる。', '금방 찾기.', '立刻找。')}
            </>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-zinc-600 text-pretty dark:text-zinc-400">
            {siteText(lang, 'Right-click text, links, or images into a private side panel. Search, filter, multi-select, copy — all local, no account.', '右键保存文本、链接或图片到本地侧边栏。搜索、筛选、多选复制——不需要账号，也不上传服务器。', 'テキスト、リンク、画像を右クリックでローカルのサイドパネルに保存。検索、絞り込み、複数選択、コピーまで、アカウント不要でサーバーへの送信もありません。', '텍스트, 링크, 이미지를 오른쪽 클릭으로 로컬 사이드 패널에 저장하세요. 검색, 필터, 다중 선택, 복사까지 — 계정 없이, 서버 업로드 없이.', '右鍵儲存文字、連結或圖片到本機側邊欄。搜尋、篩選、多選複製——不需要帳號，也不上傳伺服器。')}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={CHROME_STORE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <ChromeIcon className="size-4 opacity-80" />
              {siteText(lang, 'Add to Chrome — free', '免费添加到 Chrome', 'Chrome に追加 — 無料', 'Chrome에 추가 — 무료', '免費新增至 Chrome')}
            </a>
            <a
              href="#demo"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-5 text-sm font-semibold text-zinc-800 transition-all hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              {siteText(lang, 'Try it here', '在网页里试用', 'ここで試す', '여기서 체험하기', '在網頁裡試用')}
              <ArrowDownRight className="size-4 opacity-60" />
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <li className="inline-flex items-center gap-1.5">
              <Shield className="size-3.5 text-zinc-900 dark:text-zinc-100" />
              {siteText(lang, 'Local only', '纯本地存储', 'ローカル保存のみ', '로컬 저장만', '純本機儲存')}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Keyboard className="size-3.5 text-zinc-900 dark:text-zinc-100" />
              Alt+S
            </li>
            <li className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
              v0.1.10
            </li>
          </ul>
        </div>

        {/* Live product panel — real extension components */}
        <div className="relative animate-fade-up-delay-1 lg:justify-self-end">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-b from-zinc-200/40 to-transparent blur-2xl dark:from-zinc-800/40" />
          <div className="animate-float-soft">
            <SidePanelDemo lang={lang} theme={theme} compact className="w-full max-w-[400px]" />
          </div>
          <p className="mt-3 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
            {siteText(lang, 'Real side-panel UI · search, filter, pin, copy', '真实侧边栏组件 · 可搜索、筛选、置顶、复制', '実際のサイドパネル UI · 検索、絞り込み、ピン留め、コピー', '실제 사이드 패널 UI · 검색, 필터, 고정, 복사', '真實側邊欄元件 · 可搜尋、篩選、置頂、複製')}
          </p>
        </div>
      </div>
    </section>
  );
}
