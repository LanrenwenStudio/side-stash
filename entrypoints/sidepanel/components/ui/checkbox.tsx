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
        'grid size-4 shrink-0 place-items-center rounded-md border-[1.5px] border-zinc-400 bg-white text-zinc-900 outline-none transition-colors hover:border-zinc-600 data-[state=checked]:border-2 data-[state=checked]:border-zinc-950 data-[state=checked]:bg-zinc-950 data-[state=checked]:text-white data-[state=indeterminate]:border-2 data-[state=indeterminate]:border-zinc-950 data-[state=indeterminate]:bg-zinc-950 data-[state=indeterminate]:text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-zinc-400 dark:data-[state=checked]:border-2 dark:data-[state=checked]:border-zinc-100 dark:data-[state=checked]:bg-zinc-100 dark:data-[state=checked]:text-zinc-950 dark:data-[state=indeterminate]:border-2 dark:data-[state=indeterminate]:border-zinc-100 dark:data-[state=indeterminate]:bg-zinc-100 dark:data-[state=indeterminate]:text-zinc-950',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center text-current [&_svg]:size-3">
        {isIndeterminate ? (
          <Minus className="stroke-[2.5]" aria-hidden="true" />
        ) : (
          <Check className="stroke-[2.5]" aria-hidden="true" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
