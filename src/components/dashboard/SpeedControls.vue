<!-- Speed controls component used on the dashboard. -->

<template>
    <div id="speed-controls">
        <!-- Looks like: - 1x + -->
        <span class="icon-wrapper" title="Decrease speed" @click="changeSpeed(-1)">
            <fa-icon :icon="['fa-solid','minus']" class="fa-icon" />
        </span>
        <span title="Current speed">{{speeds[speedIndex]}}x</span>
        <span class="icon-wrapper" title="Increase speed" @click="changeSpeed(+1)">
            <fa-icon :icon="['fa-solid','plus']" class="fa-icon" />
        </span>
    </div>
</template>

<script>
import {useDashboardStore} from '@/store/modules/DashboardStore.vue'

export default {
    setup() {
        const dashboard = useDashboardStore()
        const {setStepInterval} = dashboard
        return {setStepInterval}
    },
    data() {
        return {
            speeds: [0.25, 0.5, 1, 2, 4, 8],  // available speeds
            speedIndex: null,
        }
    },
    beforeMount() {
        // set the initial speed to 1x
        this.speedIndex = 2
        this.changeSpeed(0)
    },
    mounted() {
        // Handle keyboard shortcuts for +/-
        // The rest of the shortcuts are in DashboardView
        this.keyListener = e => {
            if (e.key === '+') {
                this.changeSpeed(+1)
                e.preventDefault()
            } else if (e.key === '-') {
                this.changeSpeed(-1)
                e.preventDefault()
            }
        }
        window.addEventListener('keydown', this.keyListener.bind(this))
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.keyListener)
    },
    methods: {
        changeSpeed(offset) {
            // Change the speed of the step timer.
            // offset can be -1 or +1 to use the previous/next speed in the array
            this.speedIndex = Math.max(0, Math.min(this.speeds.length-1, this.speedIndex+offset))
            // if the speed is e.g. 4x, the interval must be 250ms
            this.setStepInterval(1 / this.speeds[this.speedIndex] * 1000)
        },
    },
}
</script>

<style lang="scss">
</style>
