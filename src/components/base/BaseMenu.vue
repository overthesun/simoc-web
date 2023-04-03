<!-- Base menu component -->

<template>
    <div id="main-menu-wrapper" @click="closeMenu">
        <div id="menu-wrapper">
            <header>
                <img src="../../assets/simoc-logo.svg" class="simoc-logo">
                <span class="simoc-logo-title">SIMOC</span>
            </header>
            <div id="menu-title">
                <slot name="menu-title" />
            </div>
            <div id="menu-buttons">
                <slot name="menu-buttons" />
            </div>
        </div>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'

export default {
    setup() {
        const dashboard = useDashboardStore()
        const {menuActive} = storeToRefs(dashboard)
        return {menuActive}
    },
    methods: {
        // TODO this should be moved out of the dashboard store
        closeMenu() {
            // if the other menus want to perform additional
            // actions they can use beforeDestroy
            this.menuActive = false
        },
    },
}
</script>
