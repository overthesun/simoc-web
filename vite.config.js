import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import postcssNesting from 'postcss-nesting';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    assetsInclude: ['**/*.glb'],
    resolve: { 
        alias: { 
            '@': path.resolve(__dirname, '/src') 
        } 
    },
    server: {
        proxy: {
            '/*': {
                target: 'http://nginx:8000',
                changeOrigin: true,
                secure: false,
                }
        }
    },
    build: {
        assetsDir: 'static',
    },
    css: {
        postcss: {
            plugins: [
                postcssNesting
            ],
        },
    },
});
