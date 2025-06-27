import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ubah jika di-deploy di subpath (misalnya, '/subfolder/')
  assetsInclude: ['**/*.glb'],
})
