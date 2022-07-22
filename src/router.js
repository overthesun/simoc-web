import {createRouter, createWebHistory} from 'vue-router'

import EntryView from '@/views/EntryView.vue'
import ConfigurationView from '@/views/ConfigurationView.vue'
import DashboardView from '@/views/DashboardView.vue'
import AceView from '@/views/AceView.vue'
import EntryWelcome from '@/components/entry/Welcome.vue'
import EntryLogin from '@/components/entry/Login.vue'
import EntryMenu from '@/components/entry/Menu.vue'
import EntryMenuConfig from '@/components/entry/MenuConfig.vue'
import BaseConfiguration from '@/components/base/BaseConfiguration.vue'
import BaseDashboard from '@/components/base/BaseDashboard.vue'
// import {Login,Welcome,MainMenu} from './components/entry'
// import {MainMenu,ConfigurationMenu} from './components/mainmenu'

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
                    component: EntryWelcome,
                },
                {
                    path: 'entry',
                    name: 'entry',
                    component: EntryLogin,
                },
                {
                    path: 'menu',
                    name: 'menu',
                    component: EntryMenu,
                },
                {
                    path: 'menuconfig',
                    name: 'menuconfig',
                    component: EntryMenuConfig,
                },
            ],
        },
        {
            path: '/menuconfig',
            name: 'menuconfig',
            component: EntryMenuConfig,
        },
        {
            path: '/ace',
            name: 'ace',
            component: AceView,
        },
        {
            path: '/configuration',
            name: 'configuration',
            component: ConfigurationView,
            children: [{
                path: '/configuration',
                component: BaseConfiguration,
            }],
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardView,
            children: [{
                path: '/dashboard',
                component: BaseDashboard,
            }],
        },
    ],
})
