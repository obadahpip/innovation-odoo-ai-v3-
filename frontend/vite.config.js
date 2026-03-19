import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // NOTE: Vite dev server already serves index.html for all unknown routes by default.
  // historyApiFallback is a webpack-dev-server option and is NOT valid here.
  // Removing it fixes potential warnings. No replacement needed.
})