import { LogOut, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { useUserStore } from '@/store'
import { expandedTextStyle } from './sidebar.styles'

interface AccountMenuProps {
  expanded: boolean
  isMobile: boolean
  /** Navigate to a path and close the mobile sidebar if open. */
  onNavigate: (path: string) => void
}

/**
 * Signed-in user button at the bottom of the sidebar.
 * Opens an anchored popover on desktop and a bottom sheet on mobile.
 */
export const AccountMenu: React.FC<AccountMenuProps> = ({ expanded, isMobile, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { logout, user, loggingOut: busy, logoutError: error } = useUserStore()
  const compact = !isMobile && !expanded

  const handleMenuNav = useCallback(
    (path: string) => {
      setMenuOpen(false)
      onNavigate(path)
    },
    [onNavigate]
  )

  const onLogout = useCallback(async () => {
    try {
      await logout()
    } catch {
      // The store exposes the sign-out error in the menu.
    }
  }, [logout])

  const initials = useMemo(() => {
    if (!user?.name) return '?'
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [user?.name])

  // Trigger — avatar + name row. Click handling comes from PopoverTrigger /
  // explicit mobile handler so we don't double-toggle open state.
  const accountTrigger = (
    <button
      type="button"
      aria-label="Account menu"
      aria-expanded={menuOpen}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: compact ? 'center' : 'flex-start',
        gap: compact ? 0 : 10,
        width: '100%',
        height: 38,
        padding: compact ? '4px 0' : '4px 6px',
        borderRadius: 8,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'background-color 200ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-background-hover)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <Avatar size={30} style={{ flexShrink: 0 }}>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div
        style={{
          display: compact ? 'none' : 'block',
          minWidth: 0,
          flex: 1,
          textAlign: 'left',
          ...expandedTextStyle(expanded),
        }}
      >
        <p className="m-0 truncate text-sm font-semibold leading-[1.15]">{user?.name}</p>
        <p className="m-0 truncate text-xs leading-[1.15] text-[var(--color-secondary-text)]">
          {user?.email}
        </p>
      </div>
    </button>
  )

  // Menu items — shared between the desktop popover and the mobile bottom sheet
  const accountMenuItems = (
    <>
      <div className="flex flex-col gap-0.5">
        <button type="button" className="menu-btn" onClick={() => handleMenuNav('/account')}>
          Account Settings
        </button>
      </div>

      <Separator className="my-2" />

      <button
        type="button"
        className="menu-btn menu-btn-danger"
        disabled={busy}
        onClick={() => void onLogout()}
      >
        <LogOut className="h-3.5 w-3.5 shrink-0" />
        {busy ? 'Signing out…' : 'Sign out'}
      </button>
      {error && (
        <p role="alert" className="px-2 pt-2 text-xs text-error">
          {error}
        </p>
      )}
    </>
  )

  // On mobile: bottom sheet. On desktop: anchored popover.
  if (isMobile) {
    return (
      <>
        <button
          type="button"
          aria-label="Account menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 10,
            width: '100%',
            height: 38,
            padding: '4px 6px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'background-color 200ms ease',
          }}
        >
          <Avatar size={30} style={{ flexShrink: 0 }}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div style={{ minWidth: 0, flex: 1, textAlign: 'left', ...expandedTextStyle(expanded) }}>
            <p className="m-0 truncate text-sm font-semibold leading-[1.15]">{user?.name}</p>
            <p className="m-0 truncate text-xs leading-[1.15] text-[var(--color-secondary-text)]">
              {user?.email}
            </p>
          </div>
        </button>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent
            side="bottom"
            showCloseButton={false}
            className="z-[300] max-h-[80vh] gap-0 overflow-y-auto rounded-t-[20px] border-t border-[var(--color-border)] bg-white p-0 shadow-[0_-8px_30px_-8px_#00000033]"
            overlayClassName="z-[300] bg-black/40"
          >
            <SheetTitle className="sr-only">Account menu</SheetTitle>
            <SheetDescription className="sr-only">Account settings and sign out</SheetDescription>
            <div style={{ padding: 'calc(16px + env(safe-area-inset-bottom)) 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Avatar size={40} style={{ flexShrink: 0 }}>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p className="m-0 truncate text-sm font-semibold">{user?.name}</p>
                  <p className="m-0 truncate text-xs text-[var(--color-secondary-text)]">
                    {user?.email}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    color: '#495057',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <Separator className="mb-2" />

              {accountMenuItems}
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger asChild>{accountTrigger}</PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="z-[200] w-55 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white px-2 py-3 shadow-md"
      >
        <div className="px-2 pb-1">
          <p className="m-0 text-[12px] font-semibold leading-[1.3] text-text-primary">
            {user?.name}
          </p>
          <p className="m-0 mt-0.5 truncate text-[12px] text-text-weak">{user?.email}</p>
        </div>

        <Separator className="my-2" />

        {accountMenuItems}
      </PopoverContent>
    </Popover>
  )
}
