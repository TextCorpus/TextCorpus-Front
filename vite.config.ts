import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Adicione esta linha e ajuste conforme necessário
  plugins: [react()],
})
