import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { Slot } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/lib/utils'

/** Three action styles: primary, secondary, and destructive (delete). */
const buttonVariants = cva(
  [
    'inline-flex w-fit shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-md font-normal whitespace-nowrap',
    'transition-[background-color,border-color,color,opacity] outline-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-primary)]',
    'disabled:cursor-not-allowed disabled:opacity-60',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    "[&_svg:not([class*='size-'])]:size-3.5",
    'active:transform-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'border-0 bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-text)] hover:bg-[var(--color-button-primary-hover)]',
        secondary:
          'border-0 bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-text)] hover:bg-[var(--color-button-secondary-hover)]',
        destructive:
          'border-0 bg-[var(--color-red-dark)] text-[var(--color-button-delete-text)] hover:bg-[var(--color-button-delete-hover)]',
      },
      size: {
        // Mantine 8.3.7 Button sizes used by the app: sm/default 36×18px
        // horizontal padding, xs 30×14px. The theme forced labels to 13px.
        default: 'h-9 px-4.5 text-[13px]',
        sm: 'h-9 px-4.5 text-[13px]',
        xs: 'h-7.5 px-3.5 text-[13px]',
        lg: 'h-12.5 px-6.5 text-[13px]',
        // Mantine ActionIcon sizes: md 28px, sm 22px, lg 34px.
        icon: 'size-7',
        'icon-sm': 'size-5.5',
        'icon-lg': 'size-8.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'primary',
  size = 'default',
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'
  const isDisabled = disabled || loading

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 className="mr-1 size-3.5 animate-spin" aria-hidden />}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : children}
    </Comp>
  )
}

export { Button, buttonVariants }
