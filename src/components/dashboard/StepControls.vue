<!-- Step controls component used on the dashboard. -->

<template>
    <div id="step-controls">
        <!-- Looks like: |< 25/100 >| -->
        <span class="icon-wrapper" title="Previous step" @click="prevStep">
            <fa-icon :icon="['fa-solid','backward-step']" class="fa-icon" />
        </span>
        <span>{{currentStepBuffer}}/{{getTotalMissionHours}}</span>
        <span class="icon-wrapper" title="Next step" @click="nextStep">
            <fa-icon :icon="['fa-solid','forward-step']" class="fa-icon" />
        </span>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '@/store/modules/DashboardStore'

export default {
    setup() {
        const dashboard = useDashboardStore()
        const {currentStepBuffer} = storeToRefs(dashboard)
        const {setCurrentStepBuffer} = dashboard
        return {currentStepBuffer, setCurrentStepBuffer}
    },
    computed: {
        ...mapGetters('wizard', ['getTotalMissionHours']),
    },
    methods: {
        prevStep() {
            this.setCurrentStepBuffer(this.currentStepBuffer - 1)
        },
        nextStep() {
            this.setCurrentStepBuffer(this.currentStepBuffer + 1)
        },
    },
}
</script>

<style lang="scss">
</style>
