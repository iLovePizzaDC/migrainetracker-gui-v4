import { Route, Routes } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './app/LandingPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
    <LandingPage />
  </StrictMode>,
)
