import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n} from "@/i18n.js";

import App from './App.vue'
import router from './router'
import Pusher from 'pusher-js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/element-override.css'

const app = createApp(App)

app.config.globalProperties.$root = {
    messages: ['']
};

const pusher = new Pusher('e0d70b6c38a0128a82e0', {
    cluster: 'eu'
});

const channel = pusher.subscribe('reports');
channel.bind('report.generated', function(data) {
    if (localStorage.getItem('pdfPath')) {
        localStorage.removeItem('pdfPath');
        localStorage.setItem('pdfPath', data.pdfPath);
    }
});
app.use(createPinia())
app.use(i18n)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
