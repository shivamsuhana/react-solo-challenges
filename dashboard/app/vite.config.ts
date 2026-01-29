import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: false,
    hmr: true,
    proxy: {
      '/api': { target: 'http://localhost:7700', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
  },
});
