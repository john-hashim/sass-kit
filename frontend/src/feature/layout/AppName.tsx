import { cn } from '@/lib/utils'
import { APP_NAME } from './branding'

const [name, descriptor] = APP_NAME.split(' ')

/** Shared wordmark; uses primary text color and inherits its size. */
export function AppName({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'whitespace-nowrap font-sans tracking-[-0.035em] text-[var(--color-primary-text)]',
        className
      )}
    >
      <span className="font-semibold">{name}</span>{' '}
      <span className="font-normal">{descriptor}</span>
    </span>
  )
}
