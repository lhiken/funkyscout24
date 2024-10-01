import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false,
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{tsx,ts,js,css,html,ico,png,svg}'],
        navigateFallback: "/index.html"
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5174
  }
})
