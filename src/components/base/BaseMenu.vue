<!-- Base menu component -->

<template>
    <div id="main-menu-wrapper" @click="menuActive = false">
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
import {useDashboardStore} from '@/store/modules/DashboardStore'

export default {
    setup() {
        // TODO this should be moved out of the dashboard store
        const dashboard = useDashboardStore()
        const {menuActive} = storeToRefs(dashboard)
        // if the other menus want to perform additional
        // actions they can use beforeDestroy
        return {menuActive}
    },
}
</script>

<style lang="scss" scoped>
@import '../../sass/components/menu';
</style>
