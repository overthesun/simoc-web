<!-- Play/Pause buttons for the Dashboard -->

<template>
    <div id="dashboard-play-icon">
        <span v-if="isTimerRunning" title="Pause" @click="pauseTimer()">
            <fa-icon :icon="['fa-solid','pause']" class="fa-icon" />
        </span>
        <span v-else title="Play" @click="startTimer()">
            <fa-icon :icon="['fa-solid','play']" class="fa-icon" />
        </span>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'

export default {
    setup() {
        const dashboard = useDashboardStore()
        const {isTimerRunning} = storeToRefs(dashboard)
        const {pauseTimer, startTimer} = dashboard
        return {isTimerRunning, pauseTimer, startTimer}
    },
}
</script>

<style lang="scss">
</style>
