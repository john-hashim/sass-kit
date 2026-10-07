import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** Shared card surface matches fitness-companion's account cards. */
function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'rounded-xl border border-[var(--color-border-secondary)] bg-background',
        className
      )}
      {...props}
    />
  )
}

export { Card }
