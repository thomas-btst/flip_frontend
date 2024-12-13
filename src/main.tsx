import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './assets/styles/index.css'
import { throwError } from './utils/throw.ts'

createRoot(document.getElementById('root') ?? throwError("Error: HTML tag root not found.")).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
