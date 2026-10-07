import { ShieldCheck } from 'lucide-react'
import { AppName } from './AppName'

export function StudioLogo({
  withName = true,
  width = 32,
  height,
}: {
  withName?: boolean
  width?: number
  height?: number
}) {
  return (
    <span className="inline-flex items-center gap-2 font-semibold text-[var(--color-secondary-text)]">
      <ShieldCheck size={height ?? width} strokeWidth={1.5} aria-hidden />
      {withName && <AppName />}
    </span>
  )
}
