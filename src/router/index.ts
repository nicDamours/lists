import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue'
import ListView from '../views/ListView.vue'
import Camera from '../views/Camera.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/lists'
  },
  {
    path: '/lists',
    name: 'Home',
    component: Home
  },
  {
    path: "/lists/:id",
    name: "ListView",
    component: ListView
  },
  {
    path: "/camera",
    name: "Camera",
    component: Camera
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
