<template>
    <section id="header-wrapper">
        <div id="logo-wrapper">
            <img src="../../assets/simoc-logo.svg" class="simoc-logo">
            <span class="simoc-logo-title">SIMOC</span>
        </div>
        <div id="dashboard-menu-icon">
            <span title="Open menu" @click="menuActive = true">
                <fa-icon :icon="['fa-solid','bars']" class="fa-icon menu-icon" />
            </span>
        </div>
    </section>
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
}
</script>

<style lang="scss" scoped>
#header-wrapper {
    display: grid;
    grid-template-columns: minmax(0px,1fr) 50px;
    background: linear-gradient(#333, #444);
    padding: 0 16px;
}
#logo-wrapper {
    display: flex;
    align-items: center;
    font-family: "Nasalization", "Open Sans", sans-serif;
    font-weight: 400;
    font-size: 32px;
}
#logo-wrapper img {
    height: 40px;
    margin-right: 16px;
}

#dashboard-menu-icon {
    display: flex;
    justify-content: right;
    align-items: center;
    box-sizing: border-box;
    font-size: 36px;
    width: 50px;
    height: 50px;
}
#dashboard-menu-icon span:hover {
    font-size: 40px;
}
</style>
