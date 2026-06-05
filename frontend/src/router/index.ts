import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    //@ts-ignore
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
        },
    ],
})

export default router
