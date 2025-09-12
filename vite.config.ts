import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Se elimina el plugin `@tailwindcss/vite` para usar la configuración explícita de PostCSS.
// Vite detectará y usará automáticamente el archivo `postcss.config.js` que hemos creado.
export default defineConfig({
  plugins: [react()],
})
