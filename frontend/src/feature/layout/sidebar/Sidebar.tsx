import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { AppName } from '@/feature/layout/AppName'
import { IconButton } from '@/feature/layout/IconButton'
import { AccountMenu } from './AccountMenu'
import {
  ActivityLogIcon,
  DashboardIcon,
  FilesIcon,
  type NavIconComponent,
  SettingsIcon,
} from './NavIcons'
import { ITEM_GAP, NAV_ICON_SIZE, NAV_LABEL_GAP } from './sidebar.styles'

const navItems: { icon: NavIconComponent; label: string; path: string }[] = [
  { icon: FilesIcon, label: 'Files', path: '/files' },
  { icon: DashboardIcon, label: 'Dashboard', path: '/dashboard' },
  { icon: ActivityLogIcon, label: 'Activity Log', path: '/activity-log' },
  { icon: SettingsIcon, label: 'Settings', path: '/account' },
]

interface SidebarProps {
  expanded: boolean
  isMobile: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ expanded, isMobile, onClose }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const transitionDuration = expanded ? 100 : 250
  const transitionEasing = expanded ? 'ease-out' : 'ease-in-out'

  const handleClose = useCallback(() => {
    onClose()
    document.querySelector<HTMLButtonElement>('[data-sidebar-toggle]')?.focus()
  }, [onClose])

  useEffect(() => {
    if (!expanded) return
    closeButtonRef.current?.focus()

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || document.querySelector('[data-sidebar-popup]')) return
      event.preventDefault()
      handleClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [expanded, handleClose])

  const handleMenuNav = useCallback(
    (path: string) => {
      if (location.pathname !== path) navigate(path)
      handleClose()
    },
    [navigate, location.pathname, handleClose]
  )

  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar"
        aria-hidden={!expanded}
        inert={!expanded}
        tabIndex={-1}
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 240,
          border: 'none',
          padding: 0,
          backgroundColor: 'var(--color-overlay)',
          opacity: expanded ? 1 : 0,
          visibility: expanded ? 'visible' : 'hidden',
          pointerEvents: expanded ? 'auto' : 'none',
          transition: `opacity ${transitionDuration}ms ${transitionEasing}, visibility 0s linear ${expanded ? 0 : transitionDuration}ms`,
        }}
      />
      <aside
        id="studio-sidebar"
        aria-label="Workspace navigation"
        aria-hidden={!expanded}
        inert={!expanded}
        style={{
          width: isMobile ? 'min(322px, calc(100vw - 48px))' : 276,
          borderRight: '1px solid var(--color-border-primary)',
          backgroundColor: 'var(--color-chrome-bg)',
          position: 'fixed',
          zIndex: 250,
          top: 0,
          left: 0,
          bottom: 0,
          overflow: 'hidden',
          transform: expanded ? 'translateX(0)' : 'translateX(-100%)',
          opacity: expanded ? 1 : 0,
          visibility: expanded ? 'visible' : 'hidden',
          transition: `transform ${transitionDuration}ms ${transitionEasing}, opacity ${transitionDuration}ms ${transitionEasing}, visibility 0s linear ${expanded ? 0 : transitionDuration}ms`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="flex h-16 shrink-0 items-center justify-between px-5">
            <AppName className="text-xl" />
            <IconButton
              ref={closeButtonRef}
              type="button"
              aria-label="Close sidebar"
              onClick={handleClose}
            >
              <X size={15} aria-hidden />
            </IconButton>
          </div>
          <nav
            aria-label="Main navigation"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: ITEM_GAP,
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: '16px 12px',
            }}
          >
            {navItems.map(item => {
              const isActive =
                location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
              const isHovered = hoveredItem === item.path
              return (
                <button
                  key={item.path}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleMenuNav(item.path)}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: NAV_LABEL_GAP,
                    padding: '8px 13px',
                    borderRadius: 8,
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    backgroundColor: isActive
                      ? 'var(--color-chrome-hover)'
                      : isHovered
                        ? 'var(--color-chrome-hover)'
                        : 'transparent',
                    color:
                      isActive || isHovered
                        ? 'var(--color-primary-text)'
                        : 'var(--color-secondary-text)',
                    transition: 'background-color 150ms ease, color 150ms ease',
                  }}
                >
                  <item.icon size={NAV_ICON_SIZE} />
                  <span className="text-sm font-normal">{item.label}</span>
                </button>
              )
            })}
          </nav>
          <div style={{ padding: '8px 12px 16px', flexShrink: 0 }}>
            <Separator className="mb-2 bg-[var(--color-border-secondary)]" />
            {expanded && <AccountMenu isMobile={isMobile} onNavigate={handleMenuNav} />}
          </div>
        </div>
      </aside>
    </>
  )
}
