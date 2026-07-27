import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'icon' | 'sm';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

export function Button({
  children,
  className = '',
  size = 'default',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 [&_svg]:size-4 active:scale-[0.97]',
        size === 'default' && 'h-9 px-3.5 text-xs',
        size === 'sm' && 'h-7.5 px-2.5 text-[11px]',
        size === 'icon' && 'size-8 p-0',
        variant === 'primary' &&
          'bg-zinc-900 text-zinc-50 shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white',
        variant === 'secondary' &&
          'border border-zinc-200/90 bg-white/90 text-zinc-700 shadow-2xs hover:bg-zinc-100/80 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white',
        variant === 'ghost' &&
          'bg-transparent text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100',
        variant === 'danger' &&
          'border border-rose-200/80 bg-rose-50/80 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
