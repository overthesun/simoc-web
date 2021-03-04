<template>
    <section class="panel-dl-wrapper">
        <select v-model="info_section" required id="mission-info-select">
            <option value="mission-status" selected>Mission Status</option>
            <option value="mission-config">Mission Configuration</option>
            <option value="celestial-body">Celestial Body Info</option>
        </select>

        <dl v-if="info_section == 'mission-status'">
            <dt>Mission ID:</dt>
                <dd>{{getGameID}}</dd>
            <dt>Location:</dt>
                <dd>{{stringFormatter(getConfiguration.location)}}</dd>
            <dt>Duration:</dt>
                <dd>{{getCurrentStepBuffer}}/{{getTotalMissionHours}} h</dd>
            <dt>Mars days:</dt>
                <dd>{{calcSols(getCurrentStepBuffer-1)}}</dd>
            <dt>Earth days:</dt>
                <dd>{{calcDays(getCurrentStepBuffer-1)}}</dd>
            <dt>Inhabitants:</dt>
                <dd>{{humanCount()}}/{{getConfiguration.humans.amount}}</dd>
            <!-- TODO: restore this when we get the value from the backend
            <dt>Food:</dt>
                <dd>{{getConfiguration.food.amount}}/{{getConfiguration.food.amount}}</dd>-->
            <!-- TODO: make the next two dynamic? -->
            <dt>Surface Temp.:</dt>
                <dd>210 K | -63 °C | -81 °F</dd>
            <dt>Solar Gain:</dt>
                <dd>500 W/m²</dd>
        </dl>
    </section>
</template>


<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Mission Status',
    data() {
        return {
            info_section: 'mission-status',
        }
    },
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
