import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BannerProvider } from './Components/Banner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BannerProvider>
      <App />
    </BannerProvider>
  </StrictMode>,
)
