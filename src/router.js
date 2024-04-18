import {createRouter, createWebHistory} from 'vue-router'

import EntryView from '@/views/EntryView.vue'

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: EntryView,
            children: [
                {
                    path: '',
                    name: 'initial',
                    component: () => import('@/components/entry/Welcome.vue'),
                },
                {
                    path: 'entry',
                    name: 'entry',
                    component: () => import('@/components/entry/Login.vue'),
                },
                {
                    path: 'menu',
                    name: 'menu',
                    component: () => import('@/components/entry/Menu.vue'),
                },
                {
                    path: 'menuconfig',
                    name: 'menuconfig',
                    component: () => import('@/components/entry/MenuConfig.vue'),
                },
            ],
        },
        {
            path: '/menuconfig',
            name: 'menuconfig',
            component: () => import('@/components/entry/MenuConfig.vue'),
        },
        {
            path: '/ace',
            name: 'ACE',
            component: () => import('@/components/ace/ACE.vue'),
        },
        {
            path: '/configuration',
            name: 'configuration',
            component: () => import('@/views/ConfigurationView.vue'),
            children: [{
                path: '/configuration',
                component: () => import('@/components/base/BaseConfiguration.vue'),
            }],
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('@/views/DashboardView.vue'),
            children: [{
                path: '/dashboard',
                component: () => import('@/components/base/BaseDashboard.vue'),
            }],
        },
    ],
})
