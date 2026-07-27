import React from 'react';
import { t } from '../../../lib/i18n';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

type ConfirmDialogProps = {
  description: string;
  open: boolean;
  title: string;
  value: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmDialog({
  description,
  open,
  title,
  value,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <p className="m-0 break-words rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-3 text-xs leading-relaxed font-mono text-zinc-700 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-300">
          {value}
        </p>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {t('confirmCancel', 'Cancel')}
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            {t('actionDelete', 'Delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
