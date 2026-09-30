import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'CampusFind AI',
        short_name: 'CampusFind',
        description: 'Intelligent, automated Lost and Found platform',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: true, // fail fast instead of silently jumping to 5174
  },
})
