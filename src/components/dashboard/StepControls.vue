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
import {useLiveDataStore} from '@/store/modules/LiveDataStore'

export default {
    setup() {
        const liveData = useLiveDataStore()
        return {liveData}
    },
    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer', 'getCurrentMode']),
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
        /** Get the time at some step. When the live dashboard is initialized the time is undefined
         *  before the server sends it a bundle. If it is undefined return a default time of
         *  00:00:00. Note the nullish coalescing operator cannot be used else unhandled runtime
         *  error is thrown using an undefined key. This method is used only in live mode.
         *
         *  @returns {string} The time from the bundle at some step.
         */
        getTime() {
            const time = this.liveData.getTimestamp(this.getCurrentStepBuffer)
            return (time === undefined) ? '00:00:00' : time.time
        },
        /** Get the date at some step. When the live dashboard is initialized the date is undefined
         *  before the server sends it a bundle. If it is undefined return a default date of
         *  0000-00-00. Note the nullish coalescing operator cannot be used else unhandled runtime
         *  error is thrown using an undefined key. This method is used only in live mode.
         *
         *  @returns {string} The date from the bundle at some step.
         */
        getDate() {
            const date = this.liveData.getTimestamp(this.getCurrentStepBuffer)
            return (date === undefined) ? '0000-00-00' : date.date
        },
    },
}
</script>

<style lang="scss">
</style>
