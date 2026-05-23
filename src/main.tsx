import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import emailjs from '@emailjs/browser'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { initTheme } from './theme/colorScheme'
import './index.css'
import App from './App.tsx'

initTheme()

emailjs.init({ publicKey: 'S590pep4moIqEJb8m' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
