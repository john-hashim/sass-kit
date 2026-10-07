import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/** Shared card surface matches fitness-companion's account cards. */
function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('rounded-xl border border-border-week bg-white shadow-xs', className)}
      {...props}
    />
  )
}

export { Card }
