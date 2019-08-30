<!-- This component is incomplete, as such there are no slots added currently for the addition of
future dashboard views
-->

<template>
    <div class='dashboard-wrapper'>
        <MainMenu v-if="getMenuActive" /> <!-- Menu component for the dashboard. Uses a simple v-if statement to show the menu active or hidden.
        <!--<section class='toolbar-wrapper'></section>-->
        <section class='main-wrapper'>
            <Main/>
        </section>
        <section class='footer-wrapper'>
            <Controls/> <!-- Speed controls component -->
            <Timeline/> <!-- Timeline bar component -->
            <div class='menu-icon'>
                <fa-icon class='fa-icon menu-icon' :icon="['fas','bars']" @click='SETMENUACTIVE(true)'/>
            </div>
        </section>
    </div>
</template>

<script>
import {Timeline,Controls,Main,MainMenu} from '../../components/dashboard'
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    components:{
        "Timeline":Timeline,
        "Controls":Controls,
        "Main":Main,
        "MainMenu":MainMenu
    },
    computed:{
        ...mapGetters('dashboard', ['getMenuActive'])
    },
    methods:{
        ...mapMutations('dashboard', ['SETMENUACTIVE'])
    }

}
</script>

<style lang="scss" scoped>
.dashboard-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    min-width: 100vw;
    min-height: 100vh;
    display: grid;
    grid-template-rows: minmax(0px,1fr) 60px;
}

.menu-icon {
    width: 36px;
    height: 36px;
}

.toolbar-wrapper {
    background-color: #252525;
}

.footer-wrapper {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #1e1e1e;
    box-sizing: border-box;
}

</style>
