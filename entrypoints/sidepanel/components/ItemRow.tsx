import React, { useState } from 'react';
import {
  Copy,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Link2,
  Pin,
  Scissors,
  Trash2,
  Type,
} from 'lucide-react';
import { formatTime } from '../lib/format';
import { cn } from '../lib/cn';
import { getResolvedLocale, t } from '../../../lib/i18n';
import { getItemSubtitle, getItemTitle, getOpenUrl, getSourceDomain } from '../lib/items';
import type { SavedItem } from '../types';
import { Button } from './ui/button';
import { ActionTooltip } from './ui/tooltip';
import { Checkbox } from './ui/checkbox';

type ItemRowProps = {
  item: SavedItem;
  selected: boolean;
  onCopy: () => void;
  onCut: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onOpen: () => void;
  onToggle: (checked: boolean) => void;
  onTogglePin: () => void;
};

const iconBtnClass =
  '!size-6.5 shrink-0 p-0 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-all';

export function ItemRow({
  item,
  selected,
  onCopy,
  onCut,
  onDelete,
  onDownload,
  onOpen,
  onToggle,
  onTogglePin,
}: ItemRowProps) {
  const [imageBroken, setImageBroken] = useState(false);
  const sourceDomain = getSourceDomain(item);
  const openUrl = getOpenUrl(item);
  const title = getItemTitle(item);
  const subtitle = getItemSubtitle(item);
  const showSubtitle = Boolean(subtitle) && subtitle !== title;

  const TypeIcon = item.type === 'link' ? Link2 : item.type === 'image' ? ImageIcon : Type;
  const typeLabel =
    item.type === 'link'
      ? t('badgeLink', 'Link')
      : item.type === 'image'
        ? t('badgeImage', 'Image')
        : t('badgeText', 'Text');

  const copyTitle =
    item.type === 'image'
      ? t('actionCopyImageUrl', 'Copy image URL')
      : item.type === 'link'
        ? t('actionCopyLinkUrl', 'Copy link URL')
        : t('actionCopy', 'Copy');

  return (
    <li
      className={cn(
        'group relative rounded-xl border bg-white transition-all duration-200 dark:bg-zinc-900/90',
        item.pinned && 'border-l-[3.5px] border-l-zinc-950 dark:border-l-zinc-100',
        selected
          ? 'border-zinc-950 ring-1 ring-zinc-950/20 bg-zinc-100/80 dark:border-zinc-100 dark:ring-zinc-100/20 dark:bg-zinc-800 shadow-2xs'
          : item.pinned
            ? 'border-zinc-300 bg-zinc-50/40 dark:border-zinc-700 dark:bg-zinc-900/90 shadow-2xs'
            : 'border-zinc-200/90 hover:border-zinc-300 hover:shadow-2xs dark:border-zinc-800/90 dark:hover:border-zinc-700',
      )}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_1.75rem] items-start gap-x-2.5 p-2.5">
        <div className="pt-0.5">
          <Checkbox
            checked={selected}
            aria-label={selected ? t('deselectItem', 'Deselect item') : t('selectItem', 'Select item')}
            onCheckedChange={(checked) => onToggle(checked === true)}
          />
        </div>

        <button
          type="button"
          className="min-w-0 max-w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-100/40 dark:focus-visible:ring-offset-zinc-950"
          aria-pressed={selected}
          onClick={() => onToggle(!selected)}
          onDoubleClick={() => {
            if (openUrl) {
              onOpen();
            }
          }}
        >
          <div className="flex min-w-0 max-w-full gap-2.5">
            {item.type === 'image' && item.imageUrl && !imageBroken ? (
              <img
                alt={item.imageAlt || title}
                className="size-11 shrink-0 rounded-lg border border-zinc-200/90 bg-zinc-100 object-cover shadow-2xs transition-transform duration-200 group-hover:scale-102 dark:border-zinc-800 dark:bg-zinc-900"
                loading="lazy"
                src={item.imageUrl}
                onError={() => setImageBroken(true)}
              />
            ) : (
              <span
                className="mt-0.5 grid size-7.5 shrink-0 place-items-center rounded-lg border border-zinc-200 bg-zinc-100/80 text-zinc-700 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <TypeIcon className="size-3.5" aria-hidden="true" />
              </span>
            )}

            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="m-0 truncate text-[12.5px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
                {title}
              </p>

              {showSubtitle ? (
                <p
                  className="m-0 mt-0.5 truncate font-mono text-[11px] leading-4 text-zinc-400 dark:text-zinc-500"
                  title={subtitle}
                >
                  {subtitle}
                </p>
              ) : null}

              <div className="mt-1 flex min-w-0 items-center gap-1.5 overflow-hidden text-[10.5px] text-zinc-500 dark:text-zinc-400">
                <span
                  className="shrink-0 rounded px-1.5 py-px text-[9.5px] font-semibold tracking-wider uppercase border border-zinc-200/80 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {typeLabel}
                </span>
                {sourceDomain ? (
                  <>
                    <span aria-hidden="true" className="shrink-0 text-zinc-300 dark:text-zinc-600">
                      ·
                    </span>
                    <span className="min-w-0 truncate" title={sourceDomain}>
                      {sourceDomain}
                    </span>
                  </>
                ) : null}
                {item.createdAt ? (
                  <>
                    <span aria-hidden="true" className="shrink-0 text-zinc-300 dark:text-zinc-600">
                      ·
                    </span>
                    <time className="shrink-0 font-mono text-[10px]" dateTime={item.createdAt}>
                      {formatTime(item.createdAt, getResolvedLocale())}
                    </time>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </button>

        <div className="flex w-7 shrink-0 justify-end self-start">
          <ActionTooltip content={item.pinned ? t('actionUnpin', '取消置顶') : t('actionPin', '置顶此项')}>
            <Button
              aria-label={item.pinned ? t('actionUnpin', 'Unpin') : t('actionPin', 'Pin')}
              className={cn(
                '!size-7 shrink-0 rounded-lg p-0 transition-all',
                item.pinned
                  ? '!bg-zinc-950 !text-white hover:!bg-zinc-800 dark:!bg-zinc-100 dark:!text-zinc-950 dark:hover:!bg-zinc-200 shadow-2xs'
                  : '!bg-transparent !text-zinc-400 hover:!bg-zinc-100 hover:!text-zinc-700 dark:!text-zinc-500 dark:hover:!bg-zinc-800 dark:hover:!text-zinc-200',
              )}
              size="icon"
              type="button"
              variant="ghost"
              onClick={onTogglePin}
            >
              <Pin
                className={cn('size-3.5', item.pinned && 'fill-current')}
                aria-hidden="true"
              />
            </Button>
          </ActionTooltip>
        </div>

        {/* Secondary actions toolbar inside card */}
        <div className="col-span-3 -mx-0.5 mt-1 flex flex-wrap items-center justify-end gap-0.5 border-t border-zinc-100/80 pt-1.5 dark:border-zinc-800/60">
          {openUrl ? (
            <ActionTooltip content={t('actionOpen', '打开链接')}>
              <Button
                aria-label={t('actionOpen', 'Open')}
                className={iconBtnClass}
                size="icon"
                type="button"
                variant="ghost"
                onClick={onOpen}
              >
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </Button>
            </ActionTooltip>
          ) : null}
          {item.type === 'image' && item.imageUrl ? (
            <ActionTooltip content={t('actionDownloadImage', '下载此原图')}>
              <Button
                aria-label={t('actionDownloadImage', 'Download image')}
                className={iconBtnClass}
                size="icon"
                type="button"
                variant="ghost"
                onClick={onDownload}
              >
                <Download className="size-3.5" aria-hidden="true" />
              </Button>
            </ActionTooltip>
          ) : null}
          <ActionTooltip content={copyTitle}>
            <Button
              aria-label={copyTitle}
              className={iconBtnClass}
              size="icon"
              type="button"
              variant="ghost"
              onClick={onCopy}
            >
              <Copy className="size-3.5" aria-hidden="true" />
            </Button>
          </ActionTooltip>
          <ActionTooltip content={t('actionCut', '剪切此项')}>
            <Button
              aria-label={t('actionCut', 'Cut')}
              className={iconBtnClass}
              size="icon"
              type="button"
              variant="ghost"
              onClick={onCut}
            >
              <Scissors className="size-3.5" aria-hidden="true" />
            </Button>
          </ActionTooltip>
          <ActionTooltip content={t('actionDelete', '删除此项')}>
            <Button
              aria-label={t('actionDelete', 'Delete')}
              className={cn(
                iconBtnClass,
                'hover:!bg-rose-50 hover:!text-rose-600 dark:hover:!bg-rose-950/50 dark:hover:!text-rose-300',
              )}
              size="icon"
              type="button"
              variant="ghost"
              onClick={onDelete}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </Button>
          </ActionTooltip>
        </div>
      </div>
    </li>
  );
}
