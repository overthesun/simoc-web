import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import postcssNesting from 'postcss-nesting';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: { 
        alias: { 
            '@': path.resolve(__dirname, '/src') 
        } 
    },
  server: {
        host: true,
        port: 8080,
        proxy: {
            '/*': 'http:nginx:8000'
        },

  },
  css: {
        postcss: {
            plugins: [
                postcssNesting
            ],
        },
    },
});
