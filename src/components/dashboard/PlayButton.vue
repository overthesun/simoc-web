<!-- Play/Pause buttons for the Dashboard -->

<template>
    <div id="dashboard-play-icon">
        <span v-if="getIsTimerRunning" title="Pause" @click="pauseTimer">
            <fa-icon :icon="['fas','pause']" class="fa-icon" />
        </span>
        <span v-else title="Play" @click="resumeTimer">
            <fa-icon :icon="['fas','play']" class="fa-icon" />
        </span>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters('dashboard', ['getIsTimerRunning', 'getCurrentMode']),
    },
    methods: {
        ...mapMutations('dashboard', ['STARTTIMER', 'PAUSETIMER', 'SETSTEPINTERVAL', 'SETISLIVE']),
        pauseTimer() {
            // If the user selects pause while in the live Dashboard, the Dashboard is no
            // longer showing live data thus isLive is set to false in the dashboard store.
            if (this.getCurrentMode === 'live') {
                this.SETISLIVE(false)
            }

            // pause the timer when the user clicks on the pause button
            this.PAUSETIMER()
        },
        resumeTimer() {
            // If the user selects play while in the live Dashboard, the stepInterval is
            // set using the dashboard store mutator SETSTEPINTERVAL to increment the scrubber
            // at 1000 ms.
            if (this.getCurrentMode === 'live') {
                this.SETSTEPINTERVAL(1000)
            }
            // start/resume the timer when the user clicks on the play button
            this.STARTTIMER()
        },
    },
}
</script>

<style lang="scss">
</style>
