import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { opdsParser } from './services/opdsParser'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Start fetching immediately, even before React mounts
opdsParser.init().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
