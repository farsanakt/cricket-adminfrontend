import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": { target: "http://168.144.149.133:5000", changeOrigin: true },
    },
  },
  preview: {
    proxy: {
      "/api": { target: "http://168.144.149.133:5000", changeOrigin: true },
    },
  },
})