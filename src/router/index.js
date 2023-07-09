import { createRouter, createWebHistory } from 'vue-router'
import GeneratorView from "@/views/GeneratorView.vue";
import ArchiveView from "@/views/ArchiveView.vue";
import RedirectView from "@/views/RedirectView.vue";
import SuccessView from "@/views/SuccessView.vue";

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
    },
    {
        path: '/redirect',
        name: 'redirect',
        component: RedirectView
    },
    {
        path: '/success',
        name: 'success',
        component: SuccessView
    }

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router