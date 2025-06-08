import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/css/index.css'
import '@/assets/css/font.css'
import '@/assets/css/animation.css'
import 'aos/dist/aos.css'
import axios from 'axios'
import { Skeletor } from 'vue-skeletor';
import VueSkeletor from 'vue-skeletor';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';



import {
    BASE_URL,
  } from "@/config";
  
import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueSkeletor, {
  shimmer: false,
})
app.use(VueSweetalert2);

app.mount('#app')

app.component(Skeletor.name, Skeletor );

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["Accept"] = "application/json";
