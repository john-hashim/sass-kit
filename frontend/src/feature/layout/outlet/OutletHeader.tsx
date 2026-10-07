import { Bell, LifeBuoy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const OUTLET_HEADER_HEIGHT = 64

/**
 * Top section of the outlet wrapper. Left holds the page title; the right holds
 * the action cluster — support + notifications (placeholders, not wired up) and
 * an app-special "Upgrade now" button.
 */
export function OutletHeader({ title }: { title: string }) {
  return (
    <header
      style={{
        height: OUTLET_HEADER_HEIGHT,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      <p
        className="font-medium"
        style={{
          fontSize: 20,
          letterSpacing: '-0.01em',
          color: 'var(--color-primary-text)',
          margin: 0,
        }}
      >
        {title}
      </p>

      <div
        className="outlet-header-actions"
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <Button variant="subtle" size="icon-lg" aria-label="Support" type="button">
          <LifeBuoy size={20} />
        </Button>
        <span
          style={{ width: 1, height: 20, backgroundColor: 'var(--color-border)', flexShrink: 0 }}
        />
        <Button variant="subtle" size="icon-lg" aria-label="Notifications" type="button">
          <Bell size={20} />
        </Button>
        <span
          style={{ width: 1, height: 20, backgroundColor: 'var(--color-border)', flexShrink: 0 }}
        />
        <Button variant="app-special" size="xs" type="button">
          <Zap size={14} />
          Upgrade now
        </Button>
      </div>
    </header>
  )
}
