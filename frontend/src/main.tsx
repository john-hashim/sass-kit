import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { applyTheme } from '@/feature/theme/theme'
import { useStore } from '@/store'
import '@/styles/global.css'

applyTheme(useStore.getState().user?.theme ?? 'dark')
useStore.subscribe((state, previous) => {
  const theme = state.user?.theme ?? 'dark'
  if (theme !== (previous.user?.theme ?? 'dark')) applyTheme(theme)
})

const root = document.getElementById('root')
if (!root) throw new Error('Missing root element')
createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider delayDuration={150}>
        <App />
        <Toaster />
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>
)
