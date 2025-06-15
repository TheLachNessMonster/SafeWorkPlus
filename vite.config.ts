import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'WHS SafeWork App',
        short_name: 'SafeWork',
        description: 'Workplace Health and Safety Application',
        theme_color: '#ffffff',
      }
    })
  ]
})