import './assets/main.css'

import { createApp } from 'vue'
import Toast from "vue-toastification";
import App from './App.vue'
import router from './router'
import pinia from './store'
import "vue-toastification/dist/index.css";

const app = createApp(App)

app.use(pinia) // pinia should be first to get as middlware
app.use(router)
app.use(Toast);

app.mount('#app')
