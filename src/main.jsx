import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { bootstrap } from './repositories/bootstrap'
import App from './App.jsx'
import './styles/index.css'

bootstrap()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
