import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactLenis } from 'lenis/react'
import './index.css'
import Archive from './Archive.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReactLenis root>
      <Archive />
    </ReactLenis>
  </StrictMode>,
)
