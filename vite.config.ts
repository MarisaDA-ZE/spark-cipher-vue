import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    // root: "/spark-cipher/",
    server: {
        host: "0.0.0.0",
        port: 8080,
        https: false
    },
    resolve:{
        alias:{
            process: 'rollup-plugin-node-polyfills/polyfills/process-es6'
        }
    },
    define:{
        'process.env': {}
    }
});
