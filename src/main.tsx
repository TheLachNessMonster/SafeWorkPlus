import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './index.css'

// basic service worker rego for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('new content available. reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('app ready to work offline')
  },
})


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)