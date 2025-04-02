// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_SERVER || 'http://localhost:3000',
        changeOrigin: true,
      },
      '/users': {
        target: process.env.VITE_API_SERVER || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/',
  appType: 'spa',
});
