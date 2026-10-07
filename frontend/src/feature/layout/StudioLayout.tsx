import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { OutletHeader } from './outlet/OutletHeader'
import { Sidebar } from './sidebar/Sidebar'

export function StudioLayout() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches)
  const [sidebarPinned, setSidebarPinned] = useState(true)
  const location = useLocation()
  const title = location.pathname === '/account' ? 'Account Settings' : 'Dashboard'
  const gutter = isMobile ? 12 : 24
  useEffect(() => {
    document.title = `${title} · Redaction Studio`
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
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'var(--color-primary-bg)',
      }}
    >
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[500] focus:rounded-md focus:bg-white focus:p-3"
        href="#page-content"
      >
        Skip to content
      </a>
      <Sidebar pinned={sidebarPinned} isMobile={isMobile} onPinnedChange={setSidebarPinned} />
      <div
        className="flex-1"
        style={{
          marginLeft: isMobile ? 0 : sidebarPinned ? 220 : 60,
          marginTop: isMobile ? 56 : 0,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'margin-left 250ms ease-in-out',
        }}
      >
        <OutletHeader title={title} />
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            paddingRight: gutter,
            paddingBottom: gutter,
          }}
        >
          <div style={{ width: gutter, flexShrink: 0 }} />
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <main
              id="page-content"
              tabIndex={-1}
              style={{
                flex: 1,
                minHeight: 0,
                overflow: 'auto',
                padding: isMobile ? '16px' : '24px 28px',
              }}
            >
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
