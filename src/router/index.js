import { createRouter, createWebHistory } from 'vue-router'
import GeneratorView from "@/views/GeneratorView.vue";
import ArchiveView from "@/views/ArchiveView.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: GeneratorView
    },
    {
        path: '/archive',
        name: 'archive',
        component: ArchiveView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router