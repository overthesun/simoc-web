<!-- Step controls component used on the dashboard. -->

<template>
    <div id="step-controls">
        <!-- Looks like: |< 25/100 >| -->
        <span @click="prevStep" class="icon-wrapper" title="Previous step">
            <fa-icon :icon="['fas','step-backward']" class="fa-icon" />
        </span>
        <span>{{getCurrentStepBuffer}}/{{getTotalMissionHours}}</span>
        <span @click="nextStep" class="icon-wrapper" title="Next step">
            <fa-icon :icon="['fas','step-forward']" class="fa-icon" />
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
