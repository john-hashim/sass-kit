import { StudioLogo as Logo } from '../StudioLogo'
import { MenuToggleIcon } from './MenuToggleIcon'
import { TOPBAR_HEIGHT } from './sidebar.styles'

interface MobileTopbarProps {
  menuOpen: boolean
  onToggleMenu: () => void
  onLogoClick: () => void
}

/** Mobile topbar — fixed to viewport, logo left, menu toggle right. */
export const MobileTopbar: React.FC<MobileTopbarProps> = ({
  menuOpen,
  onToggleMenu,
  onLogoClick,
}) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: TOPBAR_HEIGHT,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 12px',
      borderBottom: '1px solid var(--color-border-week)',
    }}
  >
    <button
      type="button"
      onClick={onLogoClick}
      aria-label="Go to dashboard"
      style={{
        display: 'flex',
        alignItems: 'center',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <Logo height={28} />
    </button>
    <button
      type="button"
      onClick={onToggleMenu}
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      style={{
        padding: '6px 8px',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      <MenuToggleIcon open={menuOpen} />
    </button>
  </div>
)
