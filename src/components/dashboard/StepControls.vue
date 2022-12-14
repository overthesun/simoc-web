<!-- Step controls component used on the dashboard. -->

<template>
    <div id="step-controls">
        <!-- Looks like (sim mode): |< 25/100 >| -->
        <!-- Looks like: (live mode): |< 5|12:37:28 >| -->
        <span class="icon-wrapper" title="Previous step" @click="prevStep">
            <fa-icon :icon="['fa-solid','backward-step']" class="fa-icon" />
        </span>
        <span v-if="currentMode === 'live'">{{currentStepBuffer}}|{{getTime()}}</span>
        <span v-else>{{currentStepBuffer}}/{{getTotalMissionHours}}</span>
        <span class="icon-wrapper" title="Next step" @click="nextStep">
            <fa-icon :icon="['fa-solid','forward-step']" class="fa-icon" />
        </span>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {useLiveStore} from '../../store/modules/LiveStore'

export default {
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const liveStore = useLiveStore()
        const {currentStepBuffer, currentMode} = storeToRefs(dashboard)
        const {setCurrentStepBuffer} = dashboard
        const {getTotalMissionHours} = wizard
        const {getTimestamp} = liveStore
        return {currentStepBuffer, currentMode, setCurrentStepBuffer,
                getTotalMissionHours, getTimestamp}
    },
    methods: {
        prevStep() {
            this.setCurrentStepBuffer(this.currentStepBuffer - 1)
        },
        nextStep() {
            this.setCurrentStepBuffer(this.currentStepBuffer + 1)
        },
        /** Get the time at some step. When the live dashboard is initialized the time is undefined
         *  before the server sends it a bundle. If it is undefined return a default time of
         *  00:00:00. Note the nullish coalescing operator cannot be used else unhandled runtime
         *  error is thrown using an undefined key. This method is used only in live mode.
         *
         *  @returns {string} The time from the bundle at some step.
         */
        getTime() {
            const time = this.getTimestamp(this.currentStepBuffer)
            return (time === undefined) ? '00:00:00' : time.time
        },
    },
}
</script>

<style lang="scss">
</style>
