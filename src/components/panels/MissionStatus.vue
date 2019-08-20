<template>
    <div class='two-line-wrapper'>
        <div class='line-title'>Mission ID:</div>
        <div class='line-item'>{{getGameID}}</div>
        <div class='line-title'>Location:</div>
        <div class='line-item'>{{stringFormatter(getConfiguration.location)}}</div>
        <div class='line-title'>Duration:</div>
        <div class='line-item'>{{getCurrentStepBuffer}}/{{getTotalMissionHours}} h</div>
        <div class='line-title'>Mars days:</div>
        <div class='line-item'>{{calcSols(getCurrentStepBuffer-1)}}</div>
        <div class='line-title'>Earth days:</div>
        <div class='line-item'>{{calcDays(getCurrentStepBuffer-1)}}</div>
        <div class='line-title'>Inhabitants:</div>
        <div class='line-item'>{{humanCount()}}/{{getConfiguration.humans.amount}}</div>
        <!-- TODO: restore this when we get the value from the backend
        <div class='line-title'>Food:</div>
        <div class='line-item'>{{getConfiguration.food.amount}}/{{getConfiguration.food.amount}}</div>-->
        <!-- TODO: make the next two dynamic? -->
        <div class='line-title'>Surface Temp.:</div>
        <div class='line-item'>210K | -63C</div>
        <div class='line-title'>Solar Gain:</div>
        <div class='line-item'>500 W/m<sup>2</sup></div>
    </div>
</template>


<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/stringFormatter'

export default {
    panelTitle: 'Mission Status',
    computed:{
        ...mapGetters(['getGameID']),
        ...mapGetters('wizard', ['getConfiguration', 'getTotalMissionHours']),
        ...mapGetters('dashboard', ['getAgentType', 'getCurrentStepBuffer']),
    },
    methods:{
        stringFormatter: StringFormatter,
        humanCount: function() {
            let agents = this.getAgentType(this.getCurrentStepBuffer)
            if (agents !== undefined && agents['human_agent'] !== undefined) {
                return agents['human_agent']
            }
            else {
                // if we don't know the humans count, return the initial value
                return this.getConfiguration.humans.amount
            }
        },
        calcDays: function (totalHours) {
            var totalHours = Math.max(totalHours, 0)
            let days = Math.floor(totalHours/24)
            let hours = totalHours%24
            return days + 'd ' + hours + 'h 0m'
        },
        calcSols: function (totalHours) {
            var totalHours = Math.max(totalHours, 0)
            let days = Math.floor(totalHours/24.629444)
            let hours = totalHours%24.629444
            let minutes = Math.floor(hours%1*60)
            return days + 'd ' + Math.floor(hours) + 'h ' + minutes + 'm'
        },
    },
}
</script>


<style lang="scss" scoped>

</style>
