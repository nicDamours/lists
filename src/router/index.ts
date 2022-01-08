import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import ListView from '@/views/ListView.vue'
import ListsIndex from '@/views/ListsIndex.vue';
import Home from "@/views/Home.vue";
import WeekView from "@/views/WeekView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/lists'
  },
  {
    path: "/lists",
    redirect: "/tabs/lists"
  },
  {
    path: "/tabs",
    component: Home,
    children: [
      {
        path: '',
        redirect: '/tabs/lists'
      },
      {
        path: 'lists',
        name: 'ListIndex',
        component: ListsIndex
      },
      {
        path: "lists/:id",
        name: "ListView",
        component: ListView
      },
      {
        path: "week",
        name: "WeekView",
        component: WeekView
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
