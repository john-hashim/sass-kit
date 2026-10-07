import { Avatar as AvatarPrimitive } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Avatar — size props match prior Mantine usage (size 30 / 40).
 * Fallback uses brand charcoal tint (Mantine `color="brand"`).
 */
function Avatar({
  className,
  size = 'default',
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'default' | 'sm' | 'md' | 'lg' | number
}) {
  const sizeClass =
    typeof size === 'number'
      ? undefined
      : size === 'lg'
        ? 'size-10'
        : size === 'md'
          ? 'size-7.5'
          : size === 'sm'
            ? 'size-6'
            : 'size-8'

  const resolvedStyle: React.CSSProperties | undefined =
    typeof size === 'number' ? { width: size, height: size, ...style } : style

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full select-none',
        sizeClass,
        className
      )}
      style={resolvedStyle}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-[var(--color-chrome-hover)] text-xs font-medium text-[var(--color-primary-text)]',
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
