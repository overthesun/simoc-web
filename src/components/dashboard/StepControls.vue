<!-- Step controls component used on the dashboard. -->

<template>
    <div id='step-controls'>
        <!-- Looks like: |< 25/100 >| -->
        <span class='icon-wrapper' @click='prevStep' title='Previous step'>
            <fa-icon class='fa-icon' :icon="['fas','step-backward']"/>
        </span>
        <span :title="formatHours(getCurrentStepBuffer-1) + '/' + formatHours(getTotalMissionHours)">{{getCurrentStepBuffer}}/{{getTotalMissionHours}}</span>
        <span class='icon-wrapper' @click='nextStep' title='Next step'>
            <fa-icon class='fa-icon' :icon="['fas','step-forward']"/>
        </span>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer']),
        ...mapGetters('wizard', ['getTotalMissionHours'])
    },
    methods: {
        ...mapMutations('dashboard', ['UPDATEBUFFERCURRENT']),
        prevStep: function() {
            this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer-1)
        },
        nextStep: function() {
            this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer+1)
        },
        // the step starts at 1, so make sure to pass getCurrentStepBuffer-1
        formatHours: function (totalHours) {
            let days = Math.floor(totalHours / 24)
            let hours = totalHours % 24
            return `${days}d ${hours}h`
        },
    },
}
</script>

<style lang="scss">
</style>
