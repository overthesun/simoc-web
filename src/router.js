import Vue from 'vue'
import Router from 'vue-router'

import {EntryView, ConfigurationView, DashboardView, AceView} from './views'
import {EntryWelcome, EntryLogin, EntryMenu, EntryMenuConfig} from './components/entry'
import {BaseConfiguration, BaseDashboard} from './components/base'
// import {Login,Welcome,MainMenu} from './components/entry'
// import {MainMenu,ConfigurationMenu} from './components/mainmenu'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
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
            path: 'menuconfig',
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
