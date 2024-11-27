import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "./css/index.css";
import MainPage from './pages';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainPage />
  </StrictMode>,
)
