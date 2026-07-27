import React, { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../lib/cn';

type ToastType = 'success' | 'warning' | 'error' | 'info';

type StatusToastProps = {
  message: string;
  type?: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function StatusToast({ message, type = 'success', action }: StatusToastProps) {
  const duration = action ? 4500 : type === 'warning' || type === 'error' ? 4200 : 2200;
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(duration / 1000));

  useEffect(() => {
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setSecondsLeft(Math.max(0, Math.ceil((duration - (Date.now() - startedAt)) / 1000)));
    }, 100);
    return () => window.clearInterval(interval);
  }, [duration, message]);

  if (!message) {
    return null;
  }

  const iconMap = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  const styleMap = {
    success:
      'border-zinc-200/90 bg-white/95 text-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-50',
    warning:
      'border-amber-200/90 bg-amber-50/95 text-amber-950 shadow-[0_8px_30px_rgba(245,158,11,0.15)] dark:border-amber-900/60 dark:bg-zinc-900/95 dark:text-amber-200',
    error:
      'border-rose-200/90 bg-rose-50/95 text-rose-950 shadow-[0_8px_30px_rgba(244,63,94,0.15)] dark:border-rose-900/60 dark:bg-zinc-900/95 dark:text-rose-200',
    info:
      'border-zinc-200/90 bg-white/95 text-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-50',
  };

  const iconColorMap = {
    success: 'text-emerald-500 dark:text-emerald-400',
    warning: 'text-amber-500 dark:text-amber-400',
    error: 'text-rose-500 dark:text-rose-400',
    info: 'text-zinc-900 dark:text-zinc-100',
  };

  const IconComponent = iconMap[type] || CheckCircle2;

  return (
    <div
      aria-live="polite"
      className={cn(
        'pointer-events-auto fixed inset-x-3 bottom-3 z-50 mx-auto flex w-[min(420px,calc(100vw-1.5rem))] items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-medium backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-200',
        styleMap[type] || styleMap.success,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <IconComponent className={cn('size-4 shrink-0', iconColorMap[type])} aria-hidden="true" />
        <span className="min-w-0 truncate">{message}</span>
      </div>
      {action ? (
        <button
          className="ml-1 shrink-0 cursor-pointer rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          type="button"
          onClick={action.onClick}
        >
          {action.label} <span className="ml-1 tabular-nums opacity-70">{secondsLeft}s</span>
        </button>
      ) : null}
    </div>
  );
}
