import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { APP_NAME } from './branding'
import { OutletHeader } from './outlet/OutletHeader'
import { Sidebar } from './sidebar/Sidebar'

export function StudioLayout() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const handleToggleSidebar = () => setSidebarExpanded(open => !open)
  const handleCloseSidebar = useCallback(() => setSidebarExpanded(false), [])
  const location = useLocation()
  const title =
    location.pathname === '/account'
      ? 'Account Settings'
      : location.pathname === '/files'
        ? 'Files'
        : location.pathname === '/activity-log'
          ? 'Activity Log'
          : 'Dashboard'
  useEffect(() => {
    document.title = `${title} · ${APP_NAME}`
  }, [title])
  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return (
    <div
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'var(--color-chrome-bg)',
      }}
    >
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[500] focus:rounded-md focus:bg-background focus:p-3"
        href="#page-content"
      >
        Skip to content
      </a>
      <OutletHeader
        pageTitle={location.pathname === '/account' ? 'Settings' : title}
        isMobile={isMobile}
        sidebarExpanded={sidebarExpanded}
        onToggleSidebar={handleToggleSidebar}
      />
      <Sidebar expanded={sidebarExpanded} isMobile={isMobile} onClose={handleCloseSidebar} />
      <main
        id="page-content"
        tabIndex={-1}
        className="flex-1"
        style={{
          minWidth: 0,
          minHeight: 0,
          overflow: 'auto',
          backgroundColor: 'var(--color-outlet-bg)',
          padding: isMobile ? '16px' : '24px 28px',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
