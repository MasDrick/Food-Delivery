import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Доступ с любого IP
    port: 5173,
    strictPort: true, // Не менять порт автоматически
    hmr: {
      clientPort: 5173, // Важно для работы через VPN
    },
  }
})