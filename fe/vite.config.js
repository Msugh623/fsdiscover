import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import taiwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),taiwindcss()],
})
