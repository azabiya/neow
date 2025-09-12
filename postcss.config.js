// Este archivo de configuración explícita para PostCSS
// asegura que TailwindCSS y Autoprefixer se ejecuten correctamente.
export default {
  plugins: {
    // Se cambia 'tailwindcss' por '@tailwindcss/postcss' según la nueva especificación de Tailwind CSS v4.
    // Asegúrate de haber instalado el paquete: npm install -D @tailwindcss/postcss
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
  },
}

