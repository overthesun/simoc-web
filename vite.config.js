import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import postcssNesting from 'postcss-nesting';
import path from 'path';


// This regex lists the paths that should NOT go to nginx, including
//   $: i.e. empty location, or simply localhost:8080/
//   @: some vite-related paths starts with @
//   src: the frontend files in src/
//   node_modules: self explanatory
//   favicon.ico: self explanatory
//   *: the rest are the routers defined in router.js
// These paths should go to vite, everything else will go to nginx.
const nginx_paths = ('^/(?!$|@|src|node_modules|favicon\.ico|' +
                     'entry|menu|menuconfig|configuration|dashboard|simdata)')

// https://vitejs.dev/config/
export default defineConfig({
    assetsInclude: ['**/*.glb'],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '/src')
        }
    },
    server: {
        proxy: {
            [nginx_paths]: {
                target: 'http://nginx:8000',
                changeOrigin: true,
                secure: false,
            },
        },
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
    plugins: [
        vue(),
        vuetify({
            autoImport: true,
            styles: {
                configFile: 'src/sass/components/_variables.scss',
            }
        }),
    ],
});
