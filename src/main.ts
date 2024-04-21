import { createApp } from 'vue';
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import ElementPlus from 'element-plus';
import VueClipboard from 'vue-clipboard2';
import router from "./router";
import './style.scss';
import App from './App.vue';

import '@/assets/icons/iconfont.js';
import '@/assets/icons/iconfont.css';
import 'element-plus/dist/index.css';

VueClipboard.config.autoSetContainer = true // 自动设置到容器
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);   // pinia持久化层

const app = createApp(App);
app.use(pinia);         // pinia
app.use(router);        // 路由
app.use(VueClipboard);  // 剪切板工具
app.use(ElementPlus);   // ElementUI
app.mount('#app');// 挂载到dom
