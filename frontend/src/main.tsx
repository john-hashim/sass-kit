import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'
import { TooltipProvider } from '@/components/ui/tooltip'
import { applyTheme, readTheme } from '@/feature/theme/theme'
import '@/styles/global.css'

applyTheme(readTheme())

const root = document.getElementById('root')
if (!root) throw new Error('Missing root element')
createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider delayDuration={150}>
        <App />
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>
)
