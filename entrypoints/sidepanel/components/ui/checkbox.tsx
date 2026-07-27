import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';

type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

export function Checkbox({ className = '', ...props }: CheckboxProps) {
  const isIndeterminate = props.checked === 'indeterminate';

  return (
    <CheckboxPrimitive.Root
      className={cn(
        'grid size-4 shrink-0 place-items-center rounded border border-zinc-300 bg-white text-white outline-none transition-colors hover:border-zinc-500 data-[state=checked]:border-2 data-[state=checked]:border-zinc-900 data-[state=checked]:bg-zinc-900 data-[state=indeterminate]:border-2 data-[state=indeterminate]:border-zinc-900 data-[state=indeterminate]:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-zinc-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-400 dark:data-[state=checked]:border-zinc-100 dark:data-[state=checked]:bg-zinc-100 dark:data-[state=checked]:text-zinc-900 dark:data-[state=indeterminate]:border-zinc-100 dark:data-[state=indeterminate]:bg-zinc-100 dark:data-[state=indeterminate]:text-zinc-900 dark:focus-visible:ring-offset-zinc-950',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center [&_svg]:size-3">
        {isIndeterminate ? <Minus aria-hidden="true" /> : <Check aria-hidden="true" />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
