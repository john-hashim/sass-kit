import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function IconButton({ className, type = 'button', ...props }: ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-[var(--color-secondary-text)] transition-colors hover:bg-[var(--color-chrome-hover)] hover:text-[var(--color-primary-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-primary)] disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    />
  )
}
