import {createRouter, createWebHistory} from "@ionic/vue-router";
import {routes} from "@/router";

export default function getMockRouterPlugin() {
    const router = createRouter({
        history: createWebHistory(),
        routes: routes,
    })

    return router;
}
