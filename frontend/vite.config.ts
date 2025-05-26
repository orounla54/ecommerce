import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5004',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, _res) => {
            console.error('Proxy Error:', {
              error: err.message,
              url: req.url,
              method: req.method,
              headers: req.headers
            });
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Outgoing Request:', {
              method: req.method,
              url: req.url,
              headers: proxyReq.getHeaders(),
              body: req.body
            });
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Incoming Response:', {
              statusCode: proxyRes.statusCode,
              url: req.url,
              headers: proxyRes.headers,
              method: req.method
            });
          });
        },
      },
      '/uploads': {
        target: 'http://localhost:5004',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, _res) => {
            console.error('Uploads Proxy Error:', err.message, req.url);
          });
        },
      },
      '/images': {
        target: 'http://localhost:5004',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, _res) => {
            console.error('Images Proxy Error:', err.message, req.url);
          });
        },
      }
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});