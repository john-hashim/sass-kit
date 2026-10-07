import type * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Text field styles mirror Mantine TextInput overrides (theme.module.css `.input`):
 * - 1px border using design tokens
 * - hover → border-hover
 * - focus → primary border, no ring/shadow
 */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-[var(--color-border-secondary)] bg-background px-3 py-1 text-sm text-[var(--color-primary-text)] outline-none transition-[border-color] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)] disabled:cursor-not-allowed disabled:opacity-50',
        'hover:border-[var(--color-border-primary)]',
        'focus:border-[var(--color-border-primary)] focus-visible:border-[var(--color-border-primary)] focus-visible:ring-0 focus-visible:shadow-none',
        'aria-invalid:border-[var(--color-error)]',
        className
      )}
      {...props}
    />
  )
}

export { Input }
