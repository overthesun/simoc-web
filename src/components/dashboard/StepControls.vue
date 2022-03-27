<!-- Step controls component used on the dashboard. -->

<template>
    <div id="step-controls">
        <!-- Looks like (sim mode): |< 25/100 >| -->
        <!-- Looks like: (live mode): |< 5|12:37:28 >| -->
        <span class="icon-wrapper" title="Previous step" @click="prevStep">
            <fa-icon :icon="['fas','step-backward']" class="fa-icon" />
        </span>
        <span v-if="getCurrentMode === 'sim'">{{getCurrentStepBuffer}}/{{getTotalMissionHours}}</span>
        <span v-if="getCurrentMode === 'live'">{{getCurrentStepBuffer}}|{{getTime()}}</span>
        <span class="icon-wrapper" title="Next step" @click="nextStep">
            <fa-icon :icon="['fas','step-forward']" class="fa-icon" />
        </span>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer', 'getCurrentMode']),
        ...mapGetters('livedata', ['getTimestamp']),
        ...mapGetters('wizard', ['getTotalMissionHours']),
    },
    methods: {
        ...mapMutations('dashboard', ['UPDATEBUFFERCURRENT']),
        prevStep() {
            this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer - 1)
        },
        nextStep() {
            this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer + 1)
        },
        getTime() {
            const time = this.getTimestamp(this.getCurrentStepBuffer)

            try {
                return time.time
            } catch (e) {
                return '00:00:00'
            }
        },
        getDate() {
            const date = this.getTimestamp(this.getCurrentStepBuffer)

            try {
                return date.date
            } catch (e) {
                return '0000-00-00'
            }
        },
    },
}
</script>

<style lang="scss">
</style>
