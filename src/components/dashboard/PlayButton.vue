<!-- Play/Pause buttons for the Dashboard -->

<template>
    <div id="dashboard-play-icon">
        <span v-if="isTimerRunning" title="Pause" @click="pauseTimerHandler()">
            <fa-icon :icon="['fa-solid','pause']" class="fa-icon" />
        </span>
        <span v-else title="Play" @click="startTimerHandler()">
            <fa-icon :icon="['fa-solid','play']" class="fa-icon" />
        </span>
    </div>
</template>

<script>
import {useDashboardStore} from '../../store/modules/DashboardStore'

export default {
    setup() {
        const {
            isTimerRunning, currentMode, isLive, pauseTimer, startTimer, setStepInterval,
        } = useDashboardStore()
        return {isTimerRunning, currentMode, isLive, pauseTimer, startTimer,
                setStepInterval}
    },
    methods: {
        pauseTimerHandler() {
            // If the user selects pause while in the live Dashboard, the Dashboard is no
            // longer showing live data thus isLive is set to false in the dashboard store.
            if (this.currentMode === 'live') {
                this.isLive = false
            }
            // pause the timer when the user clicks on the pause button
            this.pauseTimer()
        },
        startTimerHandler() {
            // If the user selects play while in the live Dashboard, the stepInterval is
            // set using the dashboard store mutator SETSTEPINTERVAL to increment the scrubber
            // at 1000 ms.
            if (this.currentMode === 'live') {
                this.setStepInterval(1000)
            }
            // start/resume the timer when the user clicks on the play button
            this.startTimer()
        },
    },
}
</script>

<style lang="scss">
</style>
