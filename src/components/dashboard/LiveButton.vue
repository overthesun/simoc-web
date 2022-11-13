<!-- Live button for the Dashboard -->

<template>
    <div v-if="isLive" id="dashboard-live-text">
        <div><fa-icon id="dashboard-live-circle" :icon="['fa-solid','circle']" class="fa-icon" /> LIVE</div>
    </div>
    <div v-else id="dashboard-live-icon">
        <span title="Go Live" @click="goLive">
            <fa-icon :icon="['fa-solid','circle-dot']" class="fa-icon" />
        </span>
    </div>
</template>


<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
export default {
    setup() {
        const dashboard = useDashboardStore()
        const {isLive} = storeToRefs(dashboard)
        const {setStepInterval, startTimer} = dashboard
        return {isLive, setStepInterval, startTimer}
    },
    beforeMount() {
        this.isLive = true
    },
    methods: {
        /** This method accesses the changeInterval method in stepTimer.js through the
         *  dashboard store mutator SETSTEPINTERVAL setting the stepInterval to 0 and
         *  sets SETISLIVE to true. When this occurs the thumb moves to the right of the
         *  timeline, is hidden, and disabled.
         */
        goLive() {
            this.isLive = true
            this.setStepInterval(0)
            this.startTimer()
        },
    },
}
</script>


<style lang="scss">
</style>
