import {createRouter, createWebHistory} from 'vue-router'

import EntryView from '/src/views/EntryView.vue'

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
                    component: () => import('/src/components/entry/Welcome.vue'),
                },
                {
                    path: 'entry',
                    name: 'entry',
                    component: () => import('/src/components/entry/Login.vue'),
                },
                {
                    path: 'menu',
                    name: 'menu',
                    component: () => import('/src/components/entry/Menu.vue'),
                },
                /* Menu to select guided/custom config -- no longer used
                {
                    path: 'menuconfig',
                    name: 'menuconfig',
                    component: () => import('/src/components/entry/MenuConfig.vue'),
                },
                */
            ],
        },
        /* Menu to select guided/custom config -- no longer used
        {
            path: '/menuconfig',
            name: 'menuconfig',
            component: () => import('/src/components/entry/MenuConfig.vue'),
        },
        */
        {
            path: '/configuration',
            name: 'configuration',
            component: () => import('/src/views/ConfigurationView.vue'),
            children: [{
                path: '/configuration',
                component: () => import('/src/components/base/BaseConfiguration.vue'),
            }],
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('/src/views/DashboardView.vue'),
            children: [{
                path: '/dashboard',
                component: () => import('/src/components/base/BaseDashboard.vue'),
            }],
        },
        {
            path: '/ace',
            name: 'ace',
            conponent: () => import('/src/views/AceView.vue'),
        },
    ],
})
