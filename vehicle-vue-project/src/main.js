import './assets/main.css'
import router from '@/router/Router.js'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import locale from 'element-plus/dist/locale/zh-cn.js'
const app = createApp(App)
const pinia = createPinia();
const persist = createPersistedState()
pinia.use(persist)
app.use(ElementPlus,{locale})
app.use(router)
app.use(pinia)
app.mount('#app')