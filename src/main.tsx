import './fonts.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initTheme } from './theme/colorScheme'
import App from './App.tsx'
import './index.css'

initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
