import React, { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../lib/cn';
import { t } from '../../../lib/i18n';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

export type PopconfirmProps = {
  children: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  icon?: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
};

export function Popconfirm({
  children,
  title,
  description,
  confirmText,
  cancelText,
  variant = 'danger',
  icon,
  align = 'end',
  side = 'bottom',
  sideOffset = 6,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onConfirm,
  onCancel,
  disabled = false,
  className = '',
}: PopconfirmProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    setControlledOpen?.(nextOpen);
    if (!nextOpen) {
      onCancel?.();
    }
  };

  const handleConfirm = async (event?: React.MouseEvent) => {
    event?.stopPropagation();
    try {
      setIsSubmitting(true);
      await onConfirm();
      handleOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    handleOpenChange(false);
  };

  const resolvedConfirmText =
    confirmText ??
    (variant === 'danger' ? t('actionDelete', 'Delete') : t('confirmTitle', 'Confirm'));
  const resolvedCancelText = cancelText ?? t('confirmCancel', 'Cancel');

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn('w-[220px] p-3 text-left', className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-2">
          {icon !== undefined ? (
            icon
          ) : variant === 'danger' ? (
            <AlertCircle
              className="mt-0.5 size-4 shrink-0 text-rose-500 dark:text-rose-400"
              aria-hidden="true"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
              {title}
            </div>
            {description ? (
              <p className="mt-1 mb-0 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-end gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="!h-6.5 !px-2 !text-[11px] font-medium"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {resolvedCancelText}
          </Button>
          <Button
            ref={confirmBtnRef}
            type="button"
            size="sm"
            variant={variant === 'danger' ? 'danger-solid' : 'primary'}
            className="!h-6.5 !px-2.5 !text-[11px] font-medium"
            onClick={handleConfirm}
            disabled={isSubmitting}
            autoFocus
          >
            {resolvedConfirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
