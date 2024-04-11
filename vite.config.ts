import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from "path";

export default defineConfig({
    plugins: [vue()],
    server: {
        host: "0.0.0.0",
        port: 8080,
        https: false
    },
    resolve: {
        alias: {
            process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
            '@': resolve(__dirname, 'src'),
        }
    },
    define: {
        'process.env': {}
    }
});
