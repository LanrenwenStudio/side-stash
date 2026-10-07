import React, { useEffect, useRef, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '../../../entrypoints/sidepanel/components/ui/button';
import { t } from '../../../lib/i18n';
import { SidePanelDemo, type SidePanelDemoHandle } from './SidePanelDemo';
import { siteText, type SiteLocale } from '../i18n';

type InteractiveDemoSectionProps = {
  lang: SiteLocale;
  theme: 'dark' | 'light';
};

/**
 * Mirrors extension background menus:
 * - selection → menuSaveText only
 * - image (no selection) → menuSaveImage
 * - link (no selection) → menuSaveLink
 * Never both text + target at once.
 */
type StashMenuKind = 'text' | 'link' | 'image';

type DemoContextMenu = {
  x: number;
  y: number;
  kind: StashMenuKind;
  /** Selected / captured payload for the single menu action */
  payload: string;
};

const PAGE_TITLE = 'Demo article';
const PAGE_URL = 'https://sidestash.lanrenwen.com/demo';

export function InteractiveDemoSection({ lang, theme }: InteractiveDemoSectionProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<SidePanelDemoHandle | null>(null);
  const [contextMenu, setContextMenu] = useState<DemoContextMenu | null>(null);

  const sampleText = siteText(lang,
    'Side Stash keeps page fragments in a local side panel — text, links, and images, ready to search and copy.',
    'Side Stash 把网页上的灵感碎片收进本地侧边栏：文本、链接、图片，搜索与复制都在同一处。',
    'Side Stash はテキスト、リンク、画像をローカルのサイドパネルに保存し、同じ場所で検索やコピーができます。',
    'Side Stash는 텍스트, 링크, 이미지를 로컬 사이드 패널에 모아 한곳에서 검색하고 복사할 수 있게 합니다.',
    'Side Stash 把網頁上的靈感片段收進本機側邊欄：文字、連結、圖片，搜尋與複製都在同一處。');

  const sampleImage = {
    alt: siteText(lang, 'Minimal architectural space', '极简建筑空间', 'ミニマルな建築空間', '미니멀 건축 공간', '極簡建築空間'),
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  };

  const sampleLink = {
    title: 'LanrenwenStudio / side-stash',
    url: 'https://github.com/LanrenwenStudio/side-stash',
  };

  const pageTitle = siteText(lang, PAGE_TITLE, '演示文章', 'デモ記事', '데모 글', '示範文章');

  // Dismiss menu on Escape / scroll outside (closer to real browser chrome)
  useEffect(() => {
    if (!contextMenu) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setContextMenu(null);
    };
    const onScroll = () => setContextMenu(null);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [contextMenu]);

  /** Read live selection if it belongs to the demo page. */
  const getSelectionInPage = () => {
    const selection = window.getSelection();
    const text = (selection?.toString() || '').trim();
    if (!text || !selection || selection.rangeCount === 0) return '';
    const anchor = selection.anchorNode;
    if (!anchor || !pageRef.current?.contains(anchor)) return '';
    return text;
  };

  const saveText = (text: string) => {
    const content = text.trim();
    if (!content) return;
    panelRef.current?.addItem({
      type: 'text',
      content,
      pageTitle,
      pageUrl: PAGE_URL,
    });
  };

  /**
   * Extension command `save-selection` (manifest Alt+S):
   * save current selection as text, or toast when empty.
   */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Chrome command: Alt+S (Option+S on macOS). Ignore when using Cmd/Ctrl chords.
      const isAltS =
        event.altKey &&
        !event.metaKey &&
        !event.ctrlKey &&
        (event.key === 's' || event.key === 'S' || event.code === 'KeyS');
      if (!isAltS) return;

      // Only handle while the playground is on screen (avoid surprising distant shortcuts).
      const section = document.getElementById('demo');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const visible = rect.bottom > 80 && rect.top < window.innerHeight - 40;
      if (!visible) return;

      event.preventDefault();
      setContextMenu(null);

      const selectionText = getSelectionInPage();
      if (selectionText) {
        panelRef.current?.addItem({
          type: 'text',
          content: selectionText,
          pageTitle,
          pageUrl: PAGE_URL,
        });
        return;
      }

      // Same copy as background `notifySaveFeedback('empty')`.
      panelRef.current?.notify(
        t(
          'saveEmptySelection',
          siteText(lang, 'Select text first, then press the shortcut.', '请先选中文本，再按快捷键。', 'テキストを選択してからショートカットを押してください。', '텍스트를 먼저 선택한 뒤 단축키를 누르세요.', '請先選取文字，再按快捷鍵。'),
        ),
        'info',
      );
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lang, pageTitle]);

  const saveLink = (title: string, url: string) => {
    panelRef.current?.addItem({
      type: 'link',
      content: title || url,
      linkUrl: url,
      pageTitle,
      pageUrl: PAGE_URL,
    });
  };

  const saveImage = (alt: string, url: string) => {
    panelRef.current?.addItem({
      type: 'image',
      content: alt,
      imageAlt: alt,
      imageUrl: url,
      pageTitle,
      pageUrl: PAGE_URL,
    });
  };

  /**
   * Resolve menu like background `createMenus` + `syncMenuForContext`:
   * - text menu: contexts `selection` only
   * - target menu: contexts `link` | `image` (one shared item)
   * - if there is a selection, target menu is hidden → text only
   */
  const openStashContextMenu = (
    event: React.MouseEvent,
    target: StashMenuKind,
    fallbackPayload: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const selectionText = getSelectionInPage();

    // No selection + plain text area → extension has no menu entry (selection context only).
    if (target === 'text' && !selectionText) {
      setContextMenu(null);
      return;
    }

    // Selection always wins over link/image (extension hides MENU_TARGET_ID).
    const kind: StashMenuKind = selectionText ? 'text' : target;
    const payload = selectionText || fallbackPayload;

    const rect = pageRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Native-ish menu size (decorative rows + stash row)
    const menuW = 260;
    const menuH = 168;
    setContextMenu({
      kind,
      payload,
      x: Math.min(Math.max(8, event.clientX - rect.left), rect.width - menuW - 8),
      y: Math.min(Math.max(8, event.clientY - rect.top), rect.height - menuH - 8),
    });
  };

  const runStashAction = () => {
    if (!contextMenu) return;
    if (contextMenu.kind === 'text') saveText(contextMenu.payload);
    else if (contextMenu.kind === 'link') saveLink(sampleLink.title, contextMenu.payload);
    else saveImage(sampleImage.alt, contextMenu.payload);
    setContextMenu(null);
  };

  const stashMenuLabel =
    contextMenu?.kind === 'text'
      ? t('menuSaveText', 'Save text to side panel')
      : contextMenu?.kind === 'link'
        ? t('menuSaveLink', 'Save link to side panel')
        : t('menuSaveImage', 'Save image to side panel');

  return (
    <section
      id="demo"
      className="border-b border-zinc-200/80 bg-zinc-100/50 py-16 md:py-22 dark:border-zinc-800/80 dark:bg-zinc-900/30"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
              {siteText(lang, 'Live playground', '交互试用', '操作を試す', '직접 체험', '互動試用')}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 text-balance dark:text-zinc-50 sm:text-4xl">
              {siteText(lang, 'No install needed — try the real panel UI.', '不用安装，先在网页里点一遍。', 'インストール不要。サイドパネルを試せます。', '설치 없이 실제 패널을 체험하세요.', '不用安裝，先在網頁裡試一試。')}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {siteText(lang, 'Left: a mock page — select text then right-click or press Alt+S; right-click images/links too. Right: the real side-panel UI.', '左侧模拟真实网页：选中文字后右键或按 Alt+S，也可右键图片 / 链接。右侧是同一套侧边栏组件。', '左のページでテキストを選択し、右クリックまたは Alt+S で保存。画像やリンクも右クリックで保存できます。右側は実際のサイドパネルです。', '왼쪽에서 텍스트를 선택한 후 오른쪽 클릭 또는 Alt+S로 저장하세요. 이미지와 링크도 오른쪽 클릭으로 저장할 수 있습니다. 오른쪽은 실제 패널입니다.', '左側模擬網頁：選取文字後按右鍵或 Alt+S，也可對圖片、連結按右鍵。右側是同一套側邊欄元件。')}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="shrink-0 gap-1.5 self-start sm:self-auto"
            onClick={() => panelRef.current?.reset()}
          >
            <RotateCcw className="size-3.5" />
            {siteText(lang, 'Reset demo', '重置演示', 'デモをリセット', '데모 초기화', '重設示範')}
          </Button>
        </div>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,380px)]">
          {/* Simulated browser page */}
          <div
            ref={pageRef}
            className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            onClick={() => contextMenu && setContextMenu(null)}
            onContextMenu={(event) => {
              // Empty chrome / gaps: no Side Stash entry (same as no selection & no target).
              event.preventDefault();
              setContextMenu(null);
            }}
          >
            <div className="flex items-center gap-3 border-b border-zinc-200/90 px-4 py-3 dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <div className="min-w-0 flex-1 truncate rounded-lg bg-zinc-100 px-3 py-1.5 text-center font-mono text-[11px] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                article-demo.com / notes
              </div>
            </div>

            <div className="space-y-4 p-5">
              <p className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                {siteText(lang, 'Select text, then right-click or press ', '选中文字后右键或按 ', 'テキストを選択し、右クリックまたは ', '텍스트를 선택하고 오른쪽 클릭 또는 ', '選取文字後按右鍵或 ')}
                <kbd className="rounded border border-zinc-300 bg-white px-1 py-0.5 font-mono text-[10px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">Alt+S</kbd>
                {siteText(lang, ' · or right-click image / link', ' · 也可右键图片 / 链接', ' · 画像やリンクも右クリック', ' · 이미지와 링크도 오른쪽 클릭', ' · 也可對圖片、連結按右鍵')}
              </p>

              {/* Text — contexts: selection */}
              <article
                className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-4 select-text dark:border-zinc-800 dark:bg-zinc-900/50"
                onContextMenu={(event) => openStashContextMenu(event, 'text', sampleText)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {siteText(lang, 'Text snippet', '文本片段', 'テキスト', '텍스트 조각', '文字片段')}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="gap-1"
                    onClick={() => saveText(sampleText)}
                  >
                    <Plus className="size-3.5" />
                    {siteText(lang, 'Save', '保存', '保存', '저장', '儲存')}
                  </Button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {sampleText}
                </p>
              </article>

              {/* Image — contexts: image */}
              <article className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {siteText(lang, 'Image', '图片', '画像', '이미지', '圖片')}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="gap-1"
                    onClick={() => saveImage(sampleImage.alt, sampleImage.url)}
                  >
                    <Plus className="size-3.5" />
                    {siteText(lang, 'Save', '保存', '保存', '저장', '儲存')}
                  </Button>
                </div>
                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <img
                    src={sampleImage.url}
                    alt={sampleImage.alt}
                    className="h-40 w-full cursor-context-menu object-cover"
                    draggable={false}
                    onContextMenu={(event) =>
                      openStashContextMenu(event, 'image', sampleImage.url)
                    }
                  />
                </div>
              </article>

              {/* Link — contexts: link */}
              <article className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {siteText(lang, 'Link', '链接', 'リンク', '링크', '連結')}
                    </div>
                    <a
                      href={sampleLink.url}
                      className="mt-1.5 block truncate text-sm font-medium text-sky-700 underline-offset-2 hover:underline dark:text-sky-400"
                      onClick={(event) => event.preventDefault()}
                      onContextMenu={(event) =>
                        openStashContextMenu(event, 'link', sampleLink.url)
                      }
                    >
                      {sampleLink.title}
                    </a>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                      {sampleLink.url}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="shrink-0 gap-1"
                    onClick={() => saveLink(sampleLink.title, sampleLink.url)}
                  >
                    <Plus className="size-3.5" />
                    {siteText(lang, 'Save', '保存', '保存', '저장', '儲存')}
                  </Button>
                </div>
              </article>
            </div>

            {/* Simulated native browser context menu */}
            {contextMenu ? (
              <div
                role="menu"
                aria-label="Context menu"
                className="absolute z-30 w-[260px] overflow-hidden rounded-[10px] border border-black/10 bg-[rgba(246,246,246,0.92)] py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.18),0_0_0_0.5px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(40,40,42,0.94)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                style={{ top: contextMenu.y, left: contextMenu.x }}
                onClick={(event) => event.stopPropagation()}
                onContextMenu={(event) => event.preventDefault()}
              >
                {/* Decorative browser chrome rows — non-interactive, for realism */}
                <div className="pointer-events-none select-none px-1 opacity-45" aria-hidden="true">
                  <FakeMenuRow>
                    {siteText(lang, 'Copy', '复制', 'コピー', '복사', '複製')}
                  </FakeMenuRow>
                  <FakeMenuRow>
                    {siteText(lang, 'Look Up “selection”', '查阅“选中内容”', '選択した内容を調べる', '선택한 내용 조회', '查詢「選取內容」')}
                  </FakeMenuRow>
                  <div className="mx-2.5 my-1.5 h-px bg-black/10 dark:bg-white/10" />
                </div>

                {/* Real Side Stash action — matches extension contextMenus entry */}
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 px-3 py-[7px] text-left text-[13px] leading-none text-zinc-900 transition-colors hover:bg-[#0a7aff] hover:text-white dark:text-zinc-100 dark:hover:bg-[#0a84ff] dark:hover:text-white"
                  onClick={runStashAction}
                >
                  <img
                    src="/icon-16.png"
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 shrink-0 rounded-[3px]"
                    draggable={false}
                  />
                  <span className="min-w-0 truncate font-normal">{stashMenuLabel}</span>
                </button>

                <div className="pointer-events-none select-none px-1 opacity-45" aria-hidden="true">
                  <div className="mx-2.5 my-1.5 h-px bg-black/10 dark:bg-white/10" />
                  <FakeMenuRow>{siteText(lang, 'Inspect', '检查', '検証', '검사', '檢查')}</FakeMenuRow>
                </div>
              </div>
            ) : null}
          </div>

          {/* Live panel */}
          <div className="lg:sticky lg:top-20">
            <SidePanelDemo
              lang={lang}
              theme={theme}
              demoRef={panelRef}
              seedItems={[]}
              className="w-full"
            />
            <p className="mt-3 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
              {siteText(lang, 'Starts empty · Alt+S or right-click saves land here', '初始为空 · 选中后 Alt+S / 右键保存会出现在这里', '最初は空です · Alt+S または右クリックで保存した項目が表示されます', '처음에는 비어 있습니다 · Alt+S 또는 오른쪽 클릭으로 저장하면 여기에 표시됩니다', '初始為空 · Alt+S 或右鍵儲存的內容會出現在這裡')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FakeMenuRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-[7px] text-[13px] leading-none text-zinc-800 dark:text-zinc-200">
      {children}
    </div>
  );
}
