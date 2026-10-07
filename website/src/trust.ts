import type { SiteLocale } from './i18n';

export const TRUST: Record<SiteLocale, { heading: string; about: string; contact: string; privacy: string; developer: string; support: string; questions: { question: string; answer: string }[] }> = {
  en: { heading: 'Questions about Side Stash', about: 'About', contact: 'Contact', privacy: 'Privacy policy', developer: 'Developed by LanrenwenStudio. Explore the studio and the public source repository.', support: 'For support or privacy questions, email support@lanrenwen.com or report a reproducible issue on GitHub.', questions: [
    { question: 'What is Side Stash?', answer: 'Side Stash is a Chrome extension for saving text, links and image URLs in a browser side panel. Search, filter, pin and copy your saved items without leaving your current page.' },
    { question: 'Where is my collection stored?', answer: 'Saved items and preferences are stored on this device in Chrome extension local storage. Side Stash does not provide cloud sync or require an account. Export a backup before clearing browser data or uninstalling.' },
    { question: 'Can I export my saved content?', answer: 'Yes. Export your collection as JSON for backup and import, or as Markdown. Copy items as plain text, Markdown or with their source. Selected images can be downloaded individually or as a ZIP.' },
  ] },
  zh: { heading: '关于 Side Stash 的常见问题', about: '关于', contact: '联系', privacy: '隐私政策', developer: '由 LanrenwenStudio 开发。可查看工作室官网与公开源码仓库。', support: '使用或隐私问题可发送至 support@lanrenwen.com，也可在 GitHub 提交可复现的问题。', questions: [
    { question: 'Side Stash 是什么？', answer: 'Side Stash 是用于收藏网页文本、链接和图片地址的 Chrome 侧边栏扩展。无需离开当前页面，即可搜索、筛选、置顶和复制收藏。' },
    { question: '收藏存在哪里？', answer: '收藏与偏好保存在本机 Chrome 扩展的本地存储中。Side Stash 不提供云同步，也不需要账号。清除浏览器数据或卸载前，请先导出备份。' },
    { question: '可以导出收藏吗？', answer: '可以。支持导出 JSON 用于备份与导入，也可导出 Markdown。条目可复制为纯文本、Markdown 或附带来源；选中的图片可逐张下载或打包为 ZIP。' },
  ] },
  'zh-TW': { heading: '關於 Side Stash 的常見問題', about: '關於', contact: '聯絡', privacy: '隱私政策', developer: '由 LanrenwenStudio 開發。可查看工作室官網與公開原始碼儲存庫。', support: '使用或隱私問題可寄至 support@lanrenwen.com，也可在 GitHub 提交可重現的問題。', questions: [
    { question: 'Side Stash 是什麼？', answer: 'Side Stash 是用來收藏網頁文字、連結和圖片網址的 Chrome 側邊欄擴充功能。不必離開目前頁面，即可搜尋、篩選、釘選和複製收藏。' },
    { question: '收藏儲存在哪裡？', answer: '收藏與偏好儲存在本機 Chrome 擴充功能的本機儲存空間。Side Stash 不提供雲端同步，也不需要帳號。清除瀏覽器資料或解除安裝前，請先匯出備份。' },
    { question: '可以匯出收藏嗎？', answer: '可以。支援匯出 JSON 供備份與匯入，也可匯出 Markdown。項目可複製為純文字、Markdown 或附帶來源；選取的圖片可逐張下載或打包為 ZIP。' },
  ] },
  ja: { heading: 'Side Stash についてのよくある質問', about: '開発者について', contact: 'お問い合わせ', privacy: 'プライバシーポリシー', developer: 'LanrenwenStudio が開発しています。スタジオのサイトと公開ソースコードをご覧いただけます。', support: 'サポートやプライバシーの質問は support@lanrenwen.com へ。再現可能な問題は GitHub でも報告できます。', questions: [
    { question: 'Side Stash とは？', answer: 'Side Stash はテキスト、リンク、画像の URL をサイドパネルに保存する Chrome 拡張機能です。今のページを離れずに検索、絞り込み、ピン留め、コピーができます。' },
    { question: '保存した内容はどこにありますか？', answer: '項目と設定は、この端末の Chrome 拡張機能のローカルストレージに保存されます。クラウド同期やアカウントはありません。ブラウザのデータ消去やアンインストール前にバックアップをエクスポートしてください。' },
    { question: '保存した内容をエクスポートできますか？', answer: 'はい。バックアップとインポート用の JSON、または Markdown でエクスポートできます。項目はプレーンテキスト、Markdown、出典付きでコピーでき、選択した画像は個別または ZIP でダウンロードできます。' },
  ] },
  ko: { heading: 'Side Stash 자주 묻는 질문', about: '개발자 소개', contact: '문의', privacy: '개인정보 처리방침', developer: 'LanrenwenStudio가 개발합니다. 스튜디오 웹사이트와 공개 소스 저장소에서 확인할 수 있습니다.', support: '지원이나 개인정보 관련 문의는 support@lanrenwen.com으로 보내주세요. 재현 가능한 문제는 GitHub에서도 신고할 수 있습니다.', questions: [
    { question: 'Side Stash는 무엇인가요?', answer: 'Side Stash는 텍스트, 링크, 이미지 URL을 사이드 패널에 저장하는 Chrome 확장 프로그램입니다. 현재 페이지를 떠나지 않고 검색, 필터, 고정, 복사할 수 있습니다.' },
    { question: '저장한 내용은 어디에 있나요?', answer: '항목과 설정은 이 기기의 Chrome 확장 프로그램 로컬 저장소에 보관됩니다. 클라우드 동기화나 계정이 필요하지 않습니다. 브라우저 데이터를 지우거나 삭제하기 전에 백업을 내보내세요.' },
    { question: '저장한 내용을 내보낼 수 있나요?', answer: '네. 백업과 가져오기용 JSON 또는 Markdown으로 내보낼 수 있습니다. 항목은 일반 텍스트, Markdown, 출처 포함 형식으로 복사하고 선택한 이미지는 개별 또는 ZIP으로 다운로드할 수 있습니다.' },
  ] },
  es: { heading: 'Preguntas sobre Side Stash', about: 'Acerca de', contact: 'Contacto', privacy: 'Política de privacidad', developer: 'Desarrollado por LanrenwenStudio. Consulta el sitio del estudio y el repositorio público del código.', support: 'Para consultas de soporte o privacidad, escribe a support@lanrenwen.com. También puedes informar de problemas reproducibles en GitHub.', questions: [
    { question: '¿Qué es Side Stash?', answer: 'Side Stash es una extensión de Chrome para guardar texto, enlaces y URL de imágenes en un panel lateral. Busca, filtra, fija y copia tus elementos sin salir de la página actual.' },
    { question: '¿Dónde se guarda mi colección?', answer: 'Los elementos y preferencias se guardan en el almacenamiento local de la extensión en este dispositivo. No hay sincronización en la nube ni cuenta. Exporta una copia antes de borrar los datos del navegador o desinstalar.' },
    { question: '¿Puedo exportar mi colección?', answer: 'Sí. Exporta en JSON para hacer copias e importar, o en Markdown. Copia como texto, Markdown o con la fuente. Descarga las imágenes seleccionadas por separado o en ZIP.' },
  ] },
};
