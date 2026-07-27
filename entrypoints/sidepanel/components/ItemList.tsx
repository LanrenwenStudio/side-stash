import React from 'react';
import { Clock, Pin } from 'lucide-react';
import { t } from '../../../lib/i18n';
import type { SavedItem } from '../types';
import { ItemRow } from './ItemRow';

type ItemListProps = {
  items: SavedItem[];
  selectedIds: Set<string>;
  onCopyItem: (item: SavedItem) => void;
  onCutItem: (item: SavedItem) => void;
  onDeleteItem: (item: SavedItem) => void;
  onDownloadItem: (item: SavedItem) => void;
  onOpenItem: (item: SavedItem) => void;
  onToggleItem: (id: string, checked: boolean) => void;
  onTogglePin: (item: SavedItem) => void;
};

export function ItemList({
  items,
  selectedIds,
  onCopyItem,
  onCutItem,
  onDeleteItem,
  onDownloadItem,
  onOpenItem,
  onToggleItem,
  onTogglePin,
}: ItemListProps) {
  const pinned = items.filter((item) => item.pinned);
  const rest = items.filter((item) => !item.pinned);

  const renderItems = (list: SavedItem[]) =>
    list.map((item) => (
      <ItemRow
        key={item.id}
        item={item}
        selected={selectedIds.has(item.id)}
        onCopy={() => onCopyItem(item)}
        onCut={() => onCutItem(item)}
        onDelete={() => onDeleteItem(item)}
        onDownload={() => onDownloadItem(item)}
        onOpen={() => onOpenItem(item)}
        onToggle={(checked) => onToggleItem(item.id, checked)}
        onTogglePin={() => onTogglePin(item)}
      />
    ));

  return (
    <div className="grid gap-3.5" aria-live="polite">
      {pinned.length > 0 ? (
        <section className="grid gap-2">
          <div className="flex items-center gap-1.5 px-1 text-[11px] font-semibold tracking-wider text-zinc-900 uppercase dark:text-zinc-100">
            <Pin className="size-3 fill-current" aria-hidden="true" />
            <span>{t('sectionPinned', 'Pinned')}</span>
            <span className="ml-0.5 rounded-full bg-zinc-900 px-1.5 py-0.2 font-mono text-[10px] text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold">
              {pinned.length}
            </span>
          </div>
          <ul className="m-0 grid list-none content-start gap-2 p-0">{renderItems(pinned)}</ul>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section className="grid gap-2">
          {pinned.length > 0 ? (
            <div className="flex items-center gap-1.5 px-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              <Clock className="size-3" aria-hidden="true" />
              <span>{t('sectionRecent', 'Recent')}</span>
            </div>
          ) : null}
          <ul className="m-0 grid list-none content-start gap-2 p-0">{renderItems(rest)}</ul>
        </section>
      ) : null}
    </div>
  );
}
