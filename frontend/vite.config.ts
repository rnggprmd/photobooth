import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Dibutuhkan agar container bisa diakses dari host
      port: 5173,
      watch: {
        usePolling: true, // Memastikan HMR bekerja lancar di Docker (terutama Windows/WSL2)
      },
      proxy: {
        '/api': {
          // Docker: gunakan VITE_API_TARGET=http://backend:8000
          // Local : fallback ke http://localhost:8000
          target: env.VITE_API_TARGET || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
        '/storage': {
          target: env.VITE_API_TARGET || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
