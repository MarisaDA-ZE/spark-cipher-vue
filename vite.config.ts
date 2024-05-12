import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from "path";

export default defineConfig({
    plugins: [vue()],
    server: {
        host: "0.0.0.0",
        port: 443,
        https: false,
        proxy: {
            '/v1': {
                // target: 'https://192.168.10.102:8001/v1', // 后端API的实际地址
                // target: 'https://192.168.2.135:8001/v1', // 后端API的实际地址
                target: 'https://api.kmarisa.icu/v1', // 后端API的实际地址
                // TODO: 禁用SSL验证，因为服务器上的那本证书中的Subject Alternative Names (SANs) 没有包含你正在尝试连接的IP地址，
                //  应该只有一个域名p.kmarisa.icu，打包时要将这个改成true或者注释掉
                secure: false, // 禁用SSL验证
                changeOrigin: true, // 是否改变请求源头
                rewrite: (path) => path.replace(/^\/v1/, ''), // 重写路径，去除前缀
            },
        }
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
