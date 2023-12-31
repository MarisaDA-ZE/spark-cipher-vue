import { createApp } from 'vue';
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import ElementPlus from 'element-plus';
import VueClipboard from 'vue-clipboard2';
import 'element-plus/dist/index.css';
import router from "./router";
import './style.scss';
import App from './App.vue';

import '../src/assets/icons/iconfont.js';
import '../src/assets/icons/iconfont.css';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);   // 持久化层
app.use(pinia);         // pinia
app.use(router);        // 路由
app.use(ElementPlus);   // element UI
app.use(VueClipboard);  // 剪切板工具
app.mount('#app');// 挂载到dom