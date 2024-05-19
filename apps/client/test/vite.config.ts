import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/comment': {
        target: 'http://localhost:8787/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/comment/, ''),
      },
    },
  },
});
