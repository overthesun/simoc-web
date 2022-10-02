<!-- Step controls component used on the dashboard. -->

<template>
    <div id="step-controls">
        <!-- Looks like: |< 25/100 >| -->
        <span class="icon-wrapper" title="Previous step" @click="prevStep">
            <fa-icon :icon="['fa-solid','backward-step']" class="fa-icon" />
        </span>
        <span>{{getCurrentStepBuffer}}/{{getTotalMissionHours}}</span>
        <span class="icon-wrapper" title="Next step" @click="nextStep">
            <fa-icon :icon="['fa-solid','forward-step']" class="fa-icon" />
        </span>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer']),
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
    },
}
</script>

<style lang="scss">
</style>
