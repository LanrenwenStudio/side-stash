import React from 'react';
import { Check, HardDrive } from 'lucide-react';
import { siteText, type SiteLocale } from '../i18n';

type PrivacyBandProps = {
  lang: SiteLocale;
};

export function PrivacyBand({ lang }: PrivacyBandProps) {
  const points = [
    siteText(lang, 'Saves only on your device, in your browser', '收藏只保存在你自己的电脑 / 浏览器里', '保存先は自分の端末のブラウザだけ', '내 기기의 브라우저에만 저장', '收藏只儲存在你自己的電腦 / 瀏覽器裡'),
    siteText(lang, 'No account, no sign-up', '无需注册，零账号', 'アカウントも登録も不要', '계정도 가입도 필요 없음', '無需註冊，零帳號'),
    siteText(lang, 'No analytics or tracking scripts', '无后台分析、无追踪脚本', '解析やトラッキングのスクリプトなし', '분석 및 추적 스크립트 없음', '無背景分析、無追蹤指令碼'),
    siteText(lang, 'Export everything anytime for backup', '随时可导出全部内容备份', 'いつでも全データを書き出してバックアップ', '언제든 모든 내용을 내보내 백업', '隨時可匯出全部內容備份'),
  ];

  return (
    <section id="privacy" className="border-b border-zinc-200/80 py-16 md:py-22 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl border border-zinc-200/90 bg-white p-8 shadow-2xs md:grid-cols-[1fr_auto] md:p-10 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
              {siteText(lang, 'Privacy', '隐私', 'プライバシー', '개인정보 보호', '隱私')}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 text-balance dark:text-zinc-50 sm:text-4xl">
              {siteText(lang, 'Stays on your device.', '只存在你这边。', 'あなたの端末だけに保存。', '내 기기에만 보관됩니다.', '只存在你這邊。')}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {siteText(lang, 'Nothing is uploaded to a cloud account. Your stash lives in your browser on this device — only you can see it.', '收藏不会上传到任何服务器——我们根本没有云端。所有内容都留在你的浏览器里，只有你自己能看到。', '保存したものがサーバーに送信されることはありません。クラウド自体がないからです。すべてこの端末のブラウザに残り、見られるのはあなただけです。', '저장한 내용은 어떤 서버에도 업로드되지 않습니다. 클라우드 자체가 없으니까요. 모든 내용은 이 기기의 브라우저에 남아 나만 볼 수 있습니다.', '收藏不會上傳到任何伺服器——我們根本沒有雲端。所有內容都留在你的瀏覽器裡，只有你自己能看到。')}
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
