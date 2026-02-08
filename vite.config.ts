import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow connections from any host
    port: 5173,
    allowedHosts: [
      'emily-crypto-web.dbwfzc.easypanel.host',
      '.easypanel.host',
      'localhost',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
