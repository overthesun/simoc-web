<!-- Step controls component used on the dashboard. -->

<template>
    <div id="step-controls">
        <!-- Looks like: |< 25/100 >| -->
        <span class="icon-wrapper" title="Previous step" @click="prevStep">
            <fa-icon :icon="['fas','step-backward']" class="fa-icon" />
        </span>
        <span>{{state.currentStepBuffer}}/{{getTotalMissionHours}}</span>
        <span class="icon-wrapper" title="Next step" @click="nextStep">
            <fa-icon :icon="['fas','step-forward']" class="fa-icon" />
        </span>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {dashboardState as state} from '../../state/dashboard'

export default {
    data() {
        return {
            state,
        }
    },
    computed: {
        ...mapGetters('wizard', ['getTotalMissionHours']),
    },
    methods: {
        prevStep() {
            this.state.setCurrentStepBuffer(this.state.currentStepBuffer - 1)
        },
        nextStep() {
            this.state.setCurrentStepBuffer(this.state.currentStepBuffer + 1)
        },
    },
}
</script>

<style lang="scss">
</style>
