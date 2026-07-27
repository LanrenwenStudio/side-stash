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
  '!size-7 shrink-0 p-0 text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white';

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
        'group rounded-lg border bg-white transition-colors dark:bg-zinc-950',
        selected
          ? 'border-zinc-900/15 bg-zinc-50 dark:border-zinc-100/15 dark:bg-zinc-900/70'
          : 'border-zinc-200/90 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700',
        item.pinned && !selected ? 'border-zinc-300 dark:border-zinc-600' : '',
      )}
    >
      {/*
        Fixed 3-column grid: checkbox | content (can shrink) | pin (never squeezed out).
        Works on very narrow side panels (~280px).
      */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)_1.75rem] items-start gap-x-2 p-2">
        <div className="pt-0.5">
          <Checkbox
            checked={selected}
            aria-label={selected ? t('deselectItem', 'Deselect item') : t('selectItem', 'Select item')}
            onCheckedChange={(checked) => onToggle(checked === true)}
          />
        </div>

        <button
          type="button"
          className="min-w-0 max-w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"
          aria-pressed={selected}
          onClick={() => onToggle(!selected)}
          onDoubleClick={() => {
            if (openUrl) {
              onOpen();
            }
          }}
        >
          <div className="flex min-w-0 max-w-full gap-2">
            {item.type === 'image' && item.imageUrl && !imageBroken ? (
              <img
                alt={item.imageAlt || title}
                className="size-10 shrink-0 rounded-md border border-zinc-200 bg-zinc-100 object-cover dark:border-zinc-800 dark:bg-zinc-900"
                loading="lazy"
                src={item.imageUrl}
                onError={() => setImageBroken(true)}
              />
            ) : (
              <span
                className={cn(
                  'mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border',
                  item.type === 'image'
                    ? 'border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300'
                    : item.type === 'link'
                      ? 'border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-300'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400',
                )}
              >
                <TypeIcon className="size-3.5" aria-hidden="true" />
              </span>
            )}

            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="m-0 truncate text-[13px] font-medium leading-snug text-zinc-900 dark:text-zinc-100">
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

              <div className="mt-1 flex min-w-0 items-center gap-1.5 overflow-hidden text-[11px] text-zinc-500 dark:text-zinc-400">
                <span
                  className={cn(
                    'shrink-0 rounded px-1 py-px text-[10px] font-semibold tracking-wide uppercase',
                    item.type === 'image'
                      ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300'
                      : item.type === 'link'
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
                  )}
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
                    <time className="shrink-0" dateTime={item.createdAt}>
                      {formatTime(item.createdAt, getResolvedLocale())}
                    </time>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </button>

        <div className="flex w-7 shrink-0 justify-end self-start">
          <Button
            aria-label={item.pinned ? t('actionUnpin', 'Unpin') : t('actionPin', 'Pin')}
            className={cn(
              '!size-7 shrink-0 p-0',
              item.pinned
                ? // Match filter chips / selected controls: black surface, white icon.
                  '!bg-zinc-950 !text-white hover:!bg-zinc-800 dark:!bg-zinc-100 dark:!text-zinc-950 dark:hover:!bg-white'
                : '!bg-transparent !text-zinc-400 hover:!bg-zinc-100 hover:!text-zinc-700 dark:!text-zinc-500 dark:hover:!bg-zinc-800 dark:hover:!text-zinc-200',
            )}
            size="icon"
            title={item.pinned ? t('actionUnpin', 'Unpin') : t('actionPin', 'Pin')}
            type="button"
            variant="ghost"
            onClick={onTogglePin}
          >
            <Pin
              className={cn('size-3.5', item.pinned && 'fill-current')}
              aria-hidden="true"
            />
          </Button>
        </div>

        {/*
          Secondary actions on a full-width row inside the card.
          Always in-flow (not absolute) so narrow side panels never clip them.
        */}
        <div className="col-span-3 -mx-0.5 mt-0.5 flex flex-wrap items-center justify-end gap-0.5 border-t border-zinc-100 pt-1.5 dark:border-zinc-800/80">
          {openUrl ? (
            <Button
              aria-label={t('actionOpen', 'Open')}
              className={iconBtnClass}
              size="icon"
              title={t('actionOpen', 'Open')}
              type="button"
              variant="ghost"
              onClick={onOpen}
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </Button>
          ) : null}
          {item.type === 'image' && item.imageUrl ? (
            <Button
              aria-label={t('actionDownloadImage', 'Download image')}
              className={iconBtnClass}
              size="icon"
              title={t('actionDownloadImage', 'Download image')}
              type="button"
              variant="ghost"
              onClick={onDownload}
            >
              <Download className="size-3.5" aria-hidden="true" />
            </Button>
          ) : null}
          <Button
            aria-label={copyTitle}
            className={iconBtnClass}
            size="icon"
            title={copyTitle}
            type="button"
            variant="ghost"
            onClick={onCopy}
          >
            <Copy className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            aria-label={t('actionCut', 'Cut')}
            className={iconBtnClass}
            size="icon"
            title={t('actionCut', 'Cut')}
            type="button"
            variant="ghost"
            onClick={onCut}
          >
            <Scissors className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            aria-label={t('actionDelete', 'Delete')}
            className={cn(
              iconBtnClass,
              'hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-200',
            )}
            size="icon"
            title={t('actionDelete', 'Delete')}
            type="button"
            variant="ghost"
            onClick={onDelete}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </li>
  );
}
