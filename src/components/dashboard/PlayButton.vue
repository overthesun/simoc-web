<!-- Play/Pause buttons for the Dashboard -->

<template>
    <div id="dashboard-play-icon">
        <span v-if="getIsTimerRunning" title="Pause" @click="pauseTimer">
            <fa-icon :icon="['fa-solid','pause']" class="fa-icon" />
        </span>
        <span v-else title="Play" @click="resumeTimer">
            <fa-icon :icon="['fa-solid','play']" class="fa-icon" />
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
        ...mapGetters('dashboard', ['getIsTimerRunning']),
    },
    methods: {
        ...mapMutations('dashboard', ['STARTTIMER', 'PAUSETIMER']),
        pauseTimer() {
            // pause the timer when the user clicks on the pause button
            this.PAUSETIMER()
        },
        resumeTimer() {
            // start/resume the timer when the user clicks on the play button
            this.STARTTIMER()
        },
    },
}
</script>

<style lang="scss">
</style>
