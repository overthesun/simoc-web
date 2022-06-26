<!-- Play/Pause buttons for the Dashboard -->

<template>
    <div id="dashboard-play-icon">
        <span v-if="state.isTimerRunning" title="Pause" @click="state.pauseTimer()">
            <fa-icon :icon="['fas','pause']" class="fa-icon" />
        </span>
        <span v-else title="Play" @click="state.startTimer()">
            <fa-icon :icon="['fas','play']" class="fa-icon" />
        </span>
    </div>
</template>

<script>
import {dashboardState as state} from '../../state/dashboard'

export default {
    data() {
        return {
            state,
        }
    },
}
</script>

<style lang="scss">
</style>
