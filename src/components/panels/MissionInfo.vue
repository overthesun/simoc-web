<template>
    <section class="panel-dl-wrapper">
        <select id="mission-info-select" v-model="info_section" required>
            <option value="mission-status" selected>Mission Status</option>
            <option value="mission-config">Initial Configuration</option>
            <option value="location-info">Location Info</option>
        </select>

        <dl v-if="info_section == 'mission-status'">
            <dt v-if="parameters.game_id">Mission ID:</dt>
            <dd v-if="parameters.game_id">{{parameters.game_id}}</dd>
            <dt>Location:</dt>
            <dd>{{stringFormatter(simLocation)}}</dd>
            <template v-if="simLocation === 'mars'">
                <dt>Duration:</dt>
                <dd>{{currentStepBuffer}}/{{getTotalMissionHours}} h</dd>
                <dt>Mars days:</dt>
                <dd>{{calcSols(currentStepBuffer-1)}}</dd>
                <dt>Earth days:</dt>
                <dd>{{calcDays(currentStepBuffer-1)}}</dd>
            </template>
            <template v-else-if="simLocation === 'b2'">
                <dt>Start Date:</dt>
                <dd>{{startDate.toLocaleString('en', {dateStyle: 'medium', timeStyle: 'short'})}}</dd>
                <dt>Current Date:</dt>
                <dd>{{calcDate(currentStepBuffer).toLocaleString('en', {dateStyle: 'medium', timeStyle: 'short'})}}</dd>
            </template>
            <dt>Inhabitants:</dt>
            <dd>{{humanCount()}}/{{configuration.humans.amount}}</dd>
            <!-- TODO: restore this when we get the value from the backend
            <dt>Food:</dt>
                <dd>{{configuration.food.amount}}/{{configuration.food.amount}}</dd>-->
        </dl>

        <dl v-if="info_section == 'mission-config'">
            <dt>Location:</dt>
            <dd>{{stringFormatter(simLocation)}}</dd>
            <template v-if="simLocation === 'b2'">
                <dt>Start Date:</dt>
                <dd>{{startDate.toLocaleDateString()}}</dd>
            </template>
            <dt>Duration:</dt>
            <dd>{{configuration.duration.amount}} {{stringFormatter(configuration.duration.units)}}</dd>
            <dt>Food:</dt>
            <dd>{{configuration.food.amount}} {{configuration.food.units}}</dd>
            <template v-if="simLocation === 'mars'">
                <dt>Crew Quarters:</dt>
                <dd>{{stringFormatter(configuration.crewQuarters.type).split(' ').pop()}}</dd>
                <dt>Greenhouse:</dt>
                <dd>{{stringFormatter(configuration.greenhouse.type).split(' ').pop()}}</dd>
                <dt>Solar PV Array:</dt>
                <dd>{{configuration.powerGeneration.amount}} panels</dd>
                <dt>Batteries:</dt>
                <dd>{{configuration.powerStorage.amount}} {{configuration.powerStorage.units}}</dd>
                <dt>ECLSS:</dt>
                <dd>{{configuration.eclss.amount}}</dd>
            </template>
            <template v-else-if="simLocation === 'b2'">
                <dt>CO2 Upper Limit:</dt>
                <dd>{{configuration.eclss.co2UpperLimit * 1e4}} ppm</dd>
                <dt>CO2 Reserves:</dt>
                <dd>{{configuration.eclss.co2Reserves}} kg</dd>
                <dt>CO2 Lower Limit:</dt>
                <dd>{{configuration.eclss.co2LowerLimit * 1e4}} ppm</dd>
                <dt>O2 Reserves:</dt>
                <dd>{{configuration.eclss.o2Reserves}} kg</dd>
                <dt>O2 Lower Limit:</dt>
                <dd>{{configuration.eclss.o2LowerLimit}} %</dd>
                <dt>Improved Crop Management:</dt>
                <dd>{{configuration.improvedCropManagement ? 'True' : 'False'}}</dd>
            </template>
            <dt>Inhabitants:</dt>
            <dd>{{configuration.humans.amount}}</dd>
        </dl>

        <dl v-if="info_section == 'location-info'">
            <dt>Location:</dt>
            <dd>{{stringFormatter(simLocation)}}</dd>
            <dt>Day length:</dt>
            <dd>{{locationInfo.dayLength[simLocation]}}</dd>
            <dt>Surface Temperature:</dt>
            <dd>{{locationInfo.surfaceTemperature[simLocation]}}</dd>
            <dt>Solar Gain:</dt>
            <dd>{{locationInfo.solarGain[simLocation]}}</dd>
            <dt>Atmospheric Pressure:</dt>
            <dd>{{locationInfo.atmosphericPressure[simLocation]}}</dd>
            <dt>Gravity:</dt>
            <dd>{{locationInfo.gravity[simLocation]}}</dd>
        </dl>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Mission Information',
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {currentStepBuffer, simLocation, parameters} = storeToRefs(dashboard)
        const {getData} = dashboard
        const {configuration, getTotalMissionHours} = storeToRefs(wizard)
        return {currentStepBuffer, simLocation, parameters, getData, configuration,
                getTotalMissionHours}
    },
    modes: ['sim'],
    data() {
        return {
            info_section: 'mission-status',
            locationInfo: {
                dayLength: {mars: '24h 37m 23s', b2: '24h'},
                surfaceTemperature: {mars: '210 K | -63 °C | -81 °F', b2: '288 K | 15 °C | -60 °F'},
                solarGain: {mars: '500 W/m²', b2: '2000 W/m²'},
                atmosphericPressure: {mars: '0.636 kPa', b2: '101 kPa'},
                gravity: {mars: '3.71 m/s²', b2: '9.81 m/s²'},
            },
        }
    },
    computed: {
        startDate() {
            if (this.simLocation === 'b2') {
                return new Date(Date.parse(`${this.configuration.startDate} 00:00:00`))
            } else {
                return null
            }
        },
    },
    methods: {
        stringFormatter: StringFormatter,
        humanCount() {
            const agents = this.getData(
                ['human_agent', 'amount', this.currentStepBuffer]
            )
            if (agents !== undefined && agents !== null) {
                return agents
            } else {
                // if we don't know the humans count, return the initial value
                return this.configuration.humans.amount
            }
        },
        calcDays(totalHours) {
            const total = Math.max(totalHours, 0)
            const days = Math.floor(total/24)
            const hours = totalHours%24
            return `${days}d ${hours}h 0m`
        },
        calcSols(totalHours) {
            const total = Math.max(totalHours, 0)
            const days = Math.floor(total / 24.629444)
            const hours = totalHours % 24.629444
            const minutes = Math.floor((hours % 1) * 60)
            return `${days}d ${Math.floor(hours)}h ${minutes}m`
        },
        calcDate(stepBuffer) {
            const startDate = new Date(this.startDate)
            const currentMS = startDate.setHours(this.startDate.getHours() + stepBuffer)
            return new Date(currentMS)
        },
    },
}
</script>


<style lang="scss" scoped>
#mission-info-select {
    width: 50%;
    margin-bottom: 1em;
}
</style>
