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
            <PlayButton />
            <Timeline />
            <StepControls />
            <SpeedControls />
        </section>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {Timeline, PlayButton, StepControls,
        SpeedControls, Dashboard, DashboardMenu} from '../dashboard'
import {TheTopBar} from '../bars'

export default {
    components: {
        TheTopBar,
        DashboardMenu,
        PlayButton,
        Timeline,
        StepControls,
        SpeedControls,
        Dashboard,
    },
    beforeRouteLeave(to, from, next) {
        // Triggered when leaving the dashboard to go to another page.
        // This might happen when the user starts a new sim or logs off,
        // but also when clicking on the browser back button.
        // Cases where the user closes the tab or refreshes are handled
        // in DashboardView.
        if (this.leaveWithoutConfirmation) {
            this.leaveWithoutConfirmation = false  // reset value
            next()  // proceed without asking questions
        } else {
            // Make user to confirm before exiting.
            const confirmExit = () => {
                if (this.currentMode === 'kiosk' && this.getTimeoutWasActivated) {
                    this.timeout({
                        message: 'Are you still there?',
                        time: 10,
                        timeoutCallback: () => next(),
                    })
                } else {
                    this.confirm({
                        message: 'Terminate simulation and leave?  All unsaved data will be lost.',
                        confirmCallback: () => next(),
                    })
                }
            }
            // Prompt user to take the feedback survey *only* the first time (per session)
            if (!this.getSurveyWasPrompted) {
                this.showSurvey({prompt: true, onUnload: confirmExit})
            } else {
                confirmExit()
            }
        }
    },
    setup() {
        const dashboard = useDashboardStore()
        const {
            isTimerRunning, menuActive, leaveWithoutConfirmation,
        } = storeToRefs(dashboard)
        const {startTimer, pauseTimer} = dashboard
        return {
            isTimerRunning, menuActive, leaveWithoutConfirmation, startTimer,
            pauseTimer,
        }
    },
    data() {
        return {
            pausedForModal: false,
        }
    },
    computed: {
        ...mapGetters('modal', ['getModalActive', 'getSurveyWasPrompted',
                                'getTimeoutWasActivated']),
    },
    watch: {
        // If a modal opens while the timer is on,
        // pause it, then start it again after modal closes.
        getModalActive(newActive, oldActive) {
            if (oldActive === false && this.isTimerRunning === true) {
                this.pauseTimer()
                this.pausedForModal = true
            } else if (newActive === false && this.pausedForModal) {
                this.startTimer()
                this.pausedForModal = false
            }
        },
    },
    methods: {
        ...mapActions('modal', ['confirm', 'timeout', 'showSurvey']),
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
