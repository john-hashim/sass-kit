import { Bell, LifeBuoy, Menu, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppName } from '@/feature/layout/AppName'
import { IconButton } from '@/feature/layout/IconButton'

interface OutletHeaderProps {
  pageTitle: string
  isMobile: boolean
  sidebarExpanded: boolean
  onToggleSidebar: () => void
}

/** Full-width top bar with page actions and the shared sidebar toggle. */
export function OutletHeader({
  pageTitle,
  isMobile,
  sidebarExpanded,
  onToggleSidebar,
}: OutletHeaderProps) {
  return (
    <header
      className="p-2"
      style={{
        flexShrink: 0,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        borderBottom: '1px solid var(--color-border-primary)',
        position: 'relative',
        zIndex: 200,
        backgroundColor: 'var(--color-chrome-bg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <IconButton
          type="button"
          aria-label={sidebarExpanded ? 'Close menu' : 'Open menu'}
          data-sidebar-toggle
          aria-expanded={sidebarExpanded}
          aria-controls="studio-sidebar"
          onClick={onToggleSidebar}
        >
          <Menu className="size-5" aria-hidden />
        </IconButton>
        <AppName className={isMobile ? 'text-base' : 'text-xl'} />
        <span
          aria-hidden
          style={{
            width: 1,
            height: 16,
            margin: '0 8px',
            backgroundColor: 'var(--color-border-secondary)',
            flexShrink: 0,
          }}
        />
        <span className="truncate text-sm text-[var(--color-secondary-text)]" title={pageTitle}>
          {pageTitle}
        </span>
      </div>

      <div
        className="outlet-header-actions"
        style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 8, flexShrink: 0 }}
      >
        <IconButton aria-label="Support" type="button">
          <LifeBuoy size={20} />
        </IconButton>
        {!isMobile && (
          <span
            style={{
              width: 1,
              height: 20,
              backgroundColor: 'var(--color-border-secondary)',
              flexShrink: 0,
            }}
          />
        )}
        <IconButton aria-label="Notifications" type="button">
          <Bell size={20} />
        </IconButton>
        {!isMobile && (
          <span
            style={{
              width: 1,
              height: 20,
              backgroundColor: 'var(--color-border-secondary)',
              flexShrink: 0,
            }}
          />
        )}
        <Button
          variant="secondary"
          size={isMobile ? 'icon-lg' : 'xs'}
          aria-label="Upgrade now"
          type="button"
        >
          <Zap size={14} />
          {!isMobile && 'Upgrade now'}
        </Button>
      </div>
    </header>
  )
}
