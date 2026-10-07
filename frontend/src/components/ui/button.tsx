import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { Slot } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Button variants mirror the previous Mantine theme (theme.module.css):
 * - default: black fill, white text
 * - primary: cool charcoal (#2A2F3A)
 * - secondary: transparent + border
 * - secondary-filled: soft gray fill
 * - app-special: warm highlight (#ecbd85)
 * - destructive: red fill (delete actions)
 * - ghost / subtle: icon-style no fill
 */
const buttonVariants = cva(
  [
    'inline-flex w-fit shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-md font-normal whitespace-nowrap',
    'transition-[background-color,border-color,color,opacity] outline-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)]',
    'disabled:cursor-not-allowed disabled:opacity-60',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    "[&_svg:not([class*='size-'])]:size-3.5",
    'active:transform-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border border-black bg-black text-white hover:border-[#333] hover:bg-[#333]',
        primary:
          'border-0 bg-[var(--color-action-primary)] text-white hover:bg-[var(--color-emphasis-strong)]',
        secondary:
          'border border-[var(--color-border)] bg-transparent text-[var(--color-primary-text)] hover:border-[var(--color-border-hover)] hover:bg-transparent',
        /** Alias for secondary — used by shadcn dialog defaults */
        outline:
          'border border-[var(--color-border)] bg-transparent text-[var(--color-primary-text)] hover:border-[var(--color-border-hover)] hover:bg-transparent',
        'secondary-filled':
          'border-0 bg-[var(--color-surface-selected)] text-[var(--color-emphasis-strong)] hover:bg-[#e0e3e9]',
        'app-special':
          'border-0 bg-[#ecbd85] text-[var(--color-primary-text)] hover:bg-[color-mix(in_srgb,#ecbd85_88%,black)]',
        destructive: 'border-0 bg-[var(--color-error)] text-white hover:bg-[#a51b21]',
        ghost:
          'border-0 bg-transparent text-[var(--color-secondary-text)] hover:bg-[var(--color-background-hover)] hover:text-[var(--color-primary-text)]',
        subtle:
          'border-0 bg-transparent text-[var(--color-secondary-text)] hover:bg-[var(--color-background-hover)] hover:text-[var(--color-primary-text)]',
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
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'default',
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
