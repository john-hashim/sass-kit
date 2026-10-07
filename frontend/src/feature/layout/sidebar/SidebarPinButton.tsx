import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface SidebarPinButtonProps {
  pinned: boolean
  onToggle: () => void
  /** Extra styles from the caller — controls placement inside the sidebar. */
  style?: React.CSSProperties
}

/** Pin toggle — desktop only, lives inside the sidebar. */
export const SidebarPinButton: React.FC<SidebarPinButtonProps> = ({ pinned, onToggle, style }) => {
  const [hovered, setHovered] = useState(false)
  const handleEnter = useCallback(() => setHovered(true), [])
  const handleLeave = useCallback(() => setHovered(false), [])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onToggle}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          aria-label={pinned ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            border: 'none',
            cursor: 'pointer',
            borderRadius: 6,
            backgroundColor: hovered ? 'var(--color-background-hover)' : 'transparent',
            color: hovered ? 'var(--color-emphasis-strong)' : 'var(--color-emphasis-muted)',
            transition: 'background-color 200ms ease, color 200ms ease',
            ...style,
          }}
        >
          {pinned ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {pinned ? 'Collapse' : 'Expand'}
      </TooltipContent>
    </Tooltip>
  )
}
