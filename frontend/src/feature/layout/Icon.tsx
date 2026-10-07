import { ChevronRight, ShieldCheck } from 'lucide-react'
import type { CSSProperties } from 'react'

const icons = { shield: ShieldCheck, chevron: ChevronRight }
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: keyof typeof icons
  size?: number
  style?: CSSProperties
}) {
  const Component = icons[name]
  return <Component size={size} strokeWidth={1.5} aria-hidden focusable={false} style={style} />
}
export function initials(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  )
}
