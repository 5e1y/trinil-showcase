import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  base: '/',
  plugins: [
    react(),
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
      interval: 200,
    },
  },
  resolve: {
    alias: {
      '@': `${dirname(__filename)}/src`,
    },
  },
  optimizeDeps: {
    exclude: ['trinil-react'],
  },
})
