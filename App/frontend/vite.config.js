import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

const target = 'http://backend:8080';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
