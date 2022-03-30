<!-- This component is incomplete, as such there are no slots added currently for the addition of
future dashboard views
-->

<template>
    <div id="dashboard-wrapper">
        <!-- Show the dashboard menu component when getMenuActive is true. -->
        <DashboardMenu v-if="getMenuActive" />
        <TheTopBar />
        <section class="main-wrapper">
            <Main />
        </section>
        <section id="footer-wrapper">
            <!-- Live button is made available on the live Dashboard -->
            <LiveButton v-if="getCurrentMode === 'live'" />
            <PlayButton />
            <Timeline />
            <StepControls />
            <SpeedControls />
        </section>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {Timeline, LiveButton, PlayButton, StepControls,
        SpeedControls, Main, DashboardMenu} from '../dashboard'
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
        Main,
    },
    beforeRouteLeave(to, from, next) {
        // Triggered when leaving the dashboard to go to another page.
        // This might happen when the user starts a new sim or logs off,
        // but also when clicking on the browser back button.
        // Cases where the user closes the tab or refreshes are handled
        // in DashboardView.
        if (this.getLeaveWithoutConfirmation) {
            this.SETLEAVEWITHOUTCONFIRMATION(false)  // reset value
            next()  // proceed without asking questions
        } else {
            // Make user to confirm before exiting.
            const confirmExit = () => {
                this.confirm({
                    message: 'Terminate simulation and leave?  All unsaved data will be lost.',
                    confirmCallback: () => next(),
                })
            }
            // Prompt user to take the feedback survey *only* the first time (per session)
            if (!this.getSurveyWasPrompted) {
                this.showSurvey({prompt: true, onUnload: confirmExit})
            } else {
                confirmExit()
            }
        }
    },
    data() {
        return {
            pausedForModal: false,
        }
    },
    computed: {
        ...mapGetters('dashboard', ['getMenuActive', 'getLeaveWithoutConfirmation',
                                    'getIsTimerRunning', 'getCurrentMode']),
        ...mapGetters('modal', ['getModalActive', 'getSurveyWasPrompted']),
    },
    watch: {
        // If a modal opens while the timer is on,
        // pause it, then start it again after modal closes.
        getModalActive(newActive, oldActive) {
            if (oldActive === false && this.getIsTimerRunning === true) {
                this.PAUSETIMER()
                this.pausedForModal = true
            } else if (newActive === false && this.pausedForModal) {
                this.STARTTIMER()
                this.pausedForModal = false
            }
        },
    },
    methods: {
        ...mapMutations('dashboard', ['SETLEAVEWITHOUTCONFIRMATION', 'PAUSETIMER', 'STARTTIMER']),
        ...mapActions('modal', ['confirm', 'showSurvey']),
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
