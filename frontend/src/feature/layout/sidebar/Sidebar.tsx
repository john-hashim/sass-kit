import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { StudioLogo as Logo } from '../StudioLogo'
import { AccountMenu } from './AccountMenu'
import { MobileTopbar } from './MobileTopbar'
import { DashboardIcon, type NavIconComponent } from './NavIcons'
import { SidebarPinButton } from './SidebarPinButton'
import {
  expandedTextStyle,
  ITEM_GAP,
  NAV_ICON_SIZE,
  NAV_LABEL_GAP,
  TOPBAR_HEIGHT,
} from './sidebar.styles'

const navItems: { icon: NavIconComponent; label: string; path: string }[] = [
  { icon: DashboardIcon, label: 'Dashboard', path: '/dashboard' },
]

interface SidebarProps {
  pinned: boolean
  isMobile: boolean
  onPinnedChange: (v: boolean) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ pinned, isMobile, onPinnedChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const expanded = isMobile ? mobileOpen : pinned

  const activePath = location.pathname
  const isPathActive = (path: string) => activePath === path || activePath.startsWith(`${path}/`)

  const sidebarWidth = isMobile ? (expanded ? '100vw' : 0) : expanded ? 220 : 60

  const handlePinToggle = useCallback(() => onPinnedChange(!pinned), [onPinnedChange, pinned])

  // Stable mobile handlers
  const handleMobileClose = useCallback(() => setMobileOpen(false), [])
  const handleMobileToggle = useCallback(() => setMobileOpen(o => !o), [])

  // Single stable handler for all nav items via data-path attribute
  const handleNavItemClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const path = e.currentTarget.dataset.path
      if (!path) return
      if (location.pathname !== path) navigate(path)
      if (isMobile) setMobileOpen(false)
    },
    [navigate, isMobile, location.pathname]
  )

  const handleNavItemEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setHoveredItem(e.currentTarget.dataset.path ?? null)
  }, [])

  const handleNavItemLeave = useCallback(() => setHoveredItem(null), [])

  const handleMenuNav = useCallback(
    (path: string) => {
      if (isMobile) setMobileOpen(false)
      if (location.pathname !== path) navigate(path)
    },
    [navigate, isMobile, location.pathname]
  )

  return (
    <>
      {isMobile && (
        <MobileTopbar
          menuOpen={mobileOpen}
          onToggleMenu={handleMobileToggle}
          onLogoClick={() => handleMenuNav('/dashboard')}
        />
      )}

      {/* Overlay for mobile when expanded */}
      {isMobile && mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={handleMobileClose}
          style={{
            position: 'fixed',
            top: TOPBAR_HEIGHT,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 99,
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        />
      )}

      <div
        inert={isMobile && !mobileOpen}
        style={{
          width: sidebarWidth,
          transition: 'width 250ms ease-in-out',
          borderRight: isMobile ? 'none' : '1px solid var(--color-border)',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: isMobile ? '#fff' : undefined,
          position: 'absolute',
          zIndex: 100,
          marginTop: isMobile ? TOPBAR_HEIGHT : 0,
          height: isMobile ? `calc(100% - ${TOPBAR_HEIGHT}px)` : '100%',
          boxShadow: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
          {/* Brand — logo chip pinned to the top (desktop only; mobile shows it in the topbar) */}
          <div
            style={{
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center',
              gap: 8,
              height: 64,
              padding: isMobile ? '16px 16px 8px 16px' : '0 9px',
            }}
          >
            <button
              type="button"
              onClick={() => handleMenuNav('/dashboard')}
              aria-label="Go to dashboard"
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 44,
                width: 42,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <Logo withName={false} width={32} />
            </button>
            <span
              style={{
                fontWeight: 800,
                fontSize: 22,
                color: 'var(--color-emphasis-strong)',
                ...expandedTextStyle(expanded),
              }}
            >
              Redaction
            </span>
            {pinned && (
              <SidebarPinButton
                pinned
                onToggle={handlePinToggle}
                style={{ marginLeft: 'auto', padding: 6, ...expandedTextStyle(expanded) }}
              />
            )}
          </div>

          {/* Primary navigation */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: ITEM_GAP,
              flex: 1,
              padding: isMobile ? '16px' : '16px 9px 8px 9px',
            }}
          >
            {navItems.map(item => {
              const isActive = isPathActive(item.path)
              const isHovered = hoveredItem === item.path
              const button = (
                <button
                  type="button"
                  data-path={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={handleNavItemClick}
                  onMouseEnter={handleNavItemEnter}
                  onMouseLeave={handleNavItemLeave}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: NAV_LABEL_GAP,
                    padding: '6px 13px',
                    borderRadius: 8,
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    backgroundColor: isActive
                      ? 'var(--color-surface-selected)'
                      : isHovered
                        ? 'var(--color-background-hover)'
                        : 'transparent',
                    color:
                      isActive || isHovered
                        ? 'var(--color-emphasis-strong)'
                        : 'var(--color-emphasis-muted)',
                    transition: 'background-color 150ms ease, color 150ms ease',
                  }}
                >
                  <item.icon size={NAV_ICON_SIZE} />
                  <span className="text-sm font-normal" style={expandedTextStyle(expanded)}>
                    {item.label}
                  </span>
                </button>
              )

              if (expanded) {
                return <div key={item.path}>{button}</div>
              }

              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>

          {/* Bottom — signed-in user account */}
          <div style={{ padding: isMobile ? '8px 16px 16px 16px' : '8px 9px 12px 9px' }}>
            {!isMobile && !pinned && (
              <SidebarPinButton
                pinned={false}
                onToggle={handlePinToggle}
                style={{
                  width: '100%',
                  height: 28,
                  padding: 0,
                  justifyContent: 'center',
                  marginBottom: 4,
                }}
              />
            )}
            <Separator className="mb-2 bg-[var(--color-border)]" />
            <AccountMenu expanded={expanded} isMobile={isMobile} onNavigate={handleMenuNav} />
          </div>
        </div>
      </div>
    </>
  )
}
