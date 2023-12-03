import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import ListView from '@/views/ListView.vue'
import ListsIndex from '@/views/ListsIndex.vue';
import HomeView from "@/views/HomeView.vue";
import WeekView from "@/views/WeekView.vue";
import BillGroupIndex from "@/views/BillGroupIndex.vue";

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
    component: HomeView,
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
        },
        {
            path: "bills",
            name: "BillsGroupIndex",
            component: BillGroupIndex
        },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

console.log(router, routes);
export default router
