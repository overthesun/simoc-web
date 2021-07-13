<!-- Step controls component used on the dashboard. -->

<template>
    <div id="step-controls">
        <!-- Looks like: |< 25/100 >| -->
        <span class="icon-wrapper" @click="prevStep" title="Previous step">
            <fa-icon class="fa-icon" :icon="['fas','step-backward']"/>
        </span>
        <span>{{getCurrentStepBuffer}}/{{getTotalMissionHours}}</span>
        <span class="icon-wrapper" @click="nextStep" title="Next step">
            <fa-icon class="fa-icon" :icon="['fas','step-forward']"/>
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
