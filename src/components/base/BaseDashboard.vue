<!-- This component is incomplete, as such there are no slots added currently for the addition of
future dashboard views
-->

<template>
    <div id="dashboard-wrapper">
        <!-- Show the dashboard menu component when menuActive is true. -->
        <DashboardMenu v-if="menuActive" />
        <TheTopBar />
        <section class="main-wrapper">
            <Dashboard />
        </section>
        <section id="footer-wrapper">
            <LiveButton v-if="currentMode === 'live'" />
            <PlayButton />
            <Timeline />
            <StepControls />
            <SpeedControls />
        </section>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useModalStore} from '../../store/modules/ModalStore'
import {Timeline, LiveButton, PlayButton, StepControls,
        SpeedControls, Dashboard, DashboardMenu} from '../dashboard'
import {TheTopBar} from '../bars'

export default {
    components: {
        TheTopBar,
        DashboardMenu,
        LiveButton,
        PlayButton,
        Timeline,
        StepControls,
        SpeedControls,
        Dashboard,
    },
    setup() {
        const dashboard = useDashboardStore()
        const modal = useModalStore()

        const {isTimerRunning, menuActive, currentMode} = storeToRefs(dashboard)
        const {modalActive} = storeToRefs(modal)

        const {startTimer, pauseTimer} = dashboard

        return {isTimerRunning, menuActive, currentMode, startTimer, pauseTimer, modalActive}
    },
    data() {
        return {
            pausedForModal: false,
        }
    },
    watch: {
        // If a modal opens while the timer is on,
        // pause it, then start it again after modal closes.
        modalActive(newActive, oldActive) {
            if (oldActive === false && this.isTimerRunning === true) {
                this.pauseTimer()
                this.pausedForModal = true
            } else if (newActive === false && this.pausedForModal) {
                this.startTimer()
                this.pausedForModal = false
            }
        },
    },
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
}

#dashboard-live-text div {
    margin-left: 6px;
    font-size: 14px;
    cursor: default;
}
#dashboard-play-icon span, #dashboard-live-icon span {
    font-size: 24px;
    width: 36px;
    height: 36px;
}
#dashboard-live-circle {
    font-size: 6px;
    transform: translateY(-50%);
    color: #fc0303;
}
#dashboard-play-icon span:hover, #dashboard-live-icon span:hover {
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
