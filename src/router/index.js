import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DataCompression from '../views/DataCompression.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/data-compression',
      name: 'DataCompression',
      component: DataCompression
    },


  ],
  

})

export default router
