import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
          },
        },
      },
      preview: {
        allowedHosts: true,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      assetsInclude: ['**/*.webp'],
      build: {
        // Optimize chunk size
        chunkSizeWarningLimit: 500,
        rollupOptions: {
          output: {
            // Manual chunk splitting for better caching
            manualChunks: (id) => {
              // Vendor chunks
              if (id.includes('node_modules')) {
                if (id.includes('react-dom') || id.includes('react/')) {
                  return 'vendor-react';
                }
                if (id.includes('lucide-react')) {
                  return 'ui-icons';
                }
                if (id.includes('@google/genai')) {
                  return 'vendor-genai';
                }
                // Other node_modules go to vendor
                return 'vendor';
              }
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && assetInfo.name.endsWith('.webp')) {
                return 'assets/images/[name]-[hash][extname]';
              }
              return 'assets/[name]-[hash][extname]';
            }
          }
        }
      }
    };
});
