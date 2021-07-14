<!-- Play/Pause buttons for the Dashboard -->

<template>
    <div id="dashboard-play-icon">
        <span v-if="getIsTimerRunning" @click="pauseTimer" title="Pause">
            <fa-icon class="fa-icon" :icon="['fas','pause']"/>
        </span>
        <span v-else @click="resumeTimer" title="Play">
            <fa-icon class="fa-icon" :icon="['fas','play']"/>
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
