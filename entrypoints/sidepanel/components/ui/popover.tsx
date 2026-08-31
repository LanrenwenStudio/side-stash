import * as PopoverPrimitive from '@radix-ui/react-popover';
import React, { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { cn } from '../../lib/cn';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverPortal = PopoverPrimitive.Portal;
export const PopoverClose = PopoverPrimitive.Close;
export const PopoverArrow = PopoverPrimitive.Arrow;

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent(
  {
    className = '',
    align = 'end',
    side = 'bottom',
    sideOffset = 6,
    collisionPadding = 8,
    children,
    ...props
  },
  ref,
) {
  return (
    <PopoverPortal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'z-[100] rounded-xl border border-zinc-200/90 bg-white/95 p-3 text-zinc-950 shadow-[0_12px_28px_-4px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] backdrop-blur-md outline-none transition-all duration-150',
          'dark:border-zinc-800/90 dark:bg-zinc-900/95 dark:text-zinc-50 dark:shadow-[0_16px_36px_-4px_rgba(0,0,0,0.6),0_4px_12px_-2px_rgba(0,0,0,0.4)]',
          className,
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPortal>
  );
});
