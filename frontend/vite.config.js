import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Импортируем плагин

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Добавляем его в список
  ],
})