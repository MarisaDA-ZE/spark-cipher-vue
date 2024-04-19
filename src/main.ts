import { createApp } from 'vue';
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import VueClipboard from 'vue-clipboard2';
import router from "./router";
import './style.scss';
import App from './App.vue';

import '@/assets/icons/iconfont.js';
import '@/assets/icons/iconfont.css';

VueClipboard.config.autoSetContainer = true // 自动设置到容器
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);   // 持久化层
app.use(pinia);         // pinia
app.use(router);        // 路由
app.use(VueClipboard);  // 剪切板工具
app.mount('#app');// 挂载到dom
