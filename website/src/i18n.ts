import type { SupportedLocale } from '../../lib/i18n';
import { SPANISH } from './spanish';

export type SiteLocale = 'en' | 'zh' | 'zh-TW' | 'ja' | 'ko' | 'es';
export const SITE_LOCALES: Record<SiteLocale, { label: string; htmlLang: string; extensionLocale: SupportedLocale; ogLocale: string; title: string; description: string }> = {
  en: { label: 'English', htmlLang: 'en', extensionLocale: 'en', ogLocale: 'en_US', title: 'Side Stash | Private Browser Side-Panel Collector', description: 'Save text, links and images to a private browser side panel. Search, filter, pin and copy your collection. Export Markdown or JSON. Local storage, no account.' },
  zh: { label: '简体中文', htmlLang: 'zh-CN', extensionLocale: 'zh_CN', ogLocale: 'zh_CN', title: 'Side Stash | 本地侧边栏收藏工具', description: '使用 Side Stash 右键保存网页文本、链接和图片，在浏览器侧边栏搜索、筛选、置顶和批量复制。支持 Markdown、JSON 导出，数据仅存本机，无需账号。' },
  'zh-TW': { label: '繁體中文', htmlLang: 'zh-TW', extensionLocale: 'zh_TW', ogLocale: 'zh_TW', title: 'Side Stash | 本機側邊欄收藏工具', description: '使用 Side Stash 按右鍵儲存網頁文字、連結和圖片，在瀏覽器側邊欄搜尋、篩選、釘選和批次複製。支援 Markdown、JSON 匯出，資料只存於本機，無需帳號。' },
  ja: { label: '日本語', htmlLang: 'ja', extensionLocale: 'ja', ogLocale: 'ja_JP', title: 'Side Stash | ブラウザのサイドパネルにローカル保存', description: '右クリックでテキスト、リンク、画像を保存。ブラウザのサイドパネルで検索、絞り込み、ピン留め、一括コピー。Markdown・JSONのエクスポートに対応。データは端末内のみ、アカウント不要。' },
  ko: { label: '한국어', htmlLang: 'ko', extensionLocale: 'ko', ogLocale: 'ko_KR', title: 'Side Stash | 브라우저 사이드 패널 로컬 보관 도구', description: '마우스 오른쪽 클릭으로 텍스트, 링크, 이미지를 저장하세요. 사이드 패널에서 검색, 필터, 고정, 일괄 복사하고 Markdown 또는 JSON으로 내보내세요. 계정 없이 기기에만 저장합니다.' },
  es: { label: 'Español', htmlLang: 'es', extensionLocale: 'es', ogLocale: 'es_ES', title: 'Side Stash | Guarda contenido en un panel lateral privado', description: 'Guarda texto, enlaces e imágenes en un panel lateral privado. Busca, filtra, fija y copia tu colección. Exporta en Markdown o JSON. Todo local, sin cuenta.' },
};

export function siteText(lang: SiteLocale, en: string, zh: string, ja: string, ko: string, traditional: string): string {
  if (lang === 'es') {
    const translated = SPANISH[en];
    if (translated === undefined) throw new Error(`Missing Spanish website translation: ${en}`);
    return translated;
  }
  const values: Record<Exclude<SiteLocale, 'es'>, string> = { en, zh, ja, ko, 'zh-TW': traditional };
  return values[lang];
}
