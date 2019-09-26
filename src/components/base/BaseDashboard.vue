<!-- This component is incomplete, as such there are no slots added currently for the addition of
future dashboard views
-->

<template>
    <div id='dashboard-wrapper'>
        <!-- Show the dashboard menu component when getMenuActive is true. -->
        <MainMenu v-if="getMenuActive" />
        <TheTopBar />
        <section class='main-wrapper'>
            <Main />
        </section>
        <section id='footer-wrapper'>
            <PlayButton />
            <Timeline />
            <StepControls />
            <SpeedControls />
        </section>
    </div>
</template>

<script>
import {Timeline,PlayButton,StepControls,SpeedControls,Main,MainMenu} from '../../components/dashboard'
import {TheTopBar} from '../../components/bars'
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    components:{
        "TheTopBar": TheTopBar,
        "PlayButton": PlayButton,
        "Timeline": Timeline,
        "StepControls": StepControls,
        "SpeedControls": SpeedControls,
        "Main": Main,
        "MainMenu": MainMenu,
    },
    computed:{
        ...mapGetters('dashboard', ['getMenuActive'])
    },
    methods:{
        ...mapMutations('dashboard', ['SETMENUACTIVE'])
    }

}
</script>

<style lang="scss">
#dashboard-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    min-width: 100vw;
    min-height: 100vh;
    display: grid;
    grid-template-rows: 50px minmax(0px,1fr) 50px;
}

#footer-wrapper {
    position: relative;
    font-size: 18px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    box-sizing: border-box;
    background: linear-gradient(#444, #333);
    box-shadow: 0 -5px 5px #3339;
}

#dashboard-play-icon span {
    font-size: 24px;
    width: 36px;
    height: 36px;
}
#dashboard-play-icon span:hover {
    font-size: 26px;
}
#speed-controls,
#step-controls,
#footer-wrapper span {
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon-wrapper {
    font-size: 18px;
    width: 30px;
    height: 30px;
    text-align: center;
    border: 1px solid transparent;
}

.icon-wrapper:hover {
    font-size: 20px;
    border: 1px solid #252525;
}

.icon-disabled {
    color: #999;
}

</style>
