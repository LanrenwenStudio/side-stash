import React from 'react';
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
    <div className="grid gap-3" aria-live="polite">
      {pinned.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="m-0 px-0.5 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            {t('sectionPinned', 'Pinned')}
          </h2>
          <ul className="m-0 grid list-none content-start gap-2 p-0">{renderItems(pinned)}</ul>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section className="grid gap-2">
          {pinned.length > 0 ? (
            <h2 className="m-0 px-0.5 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              {t('sectionRecent', 'Recent')}
            </h2>
          ) : null}
          <ul className="m-0 grid list-none content-start gap-2 p-0">{renderItems(rest)}</ul>
        </section>
      ) : null}
    </div>
  );
}
