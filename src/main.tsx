import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles/global.scss';

import { AppRoutes } from './routes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
)