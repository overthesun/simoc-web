<template>
    <section class="panel-dl-wrapper">
        <select id="mission-info-select" v-model="info_section" required>
            <option value="mission-status" selected>Mission Status</option>
            <option value="mission-config">Initial Configuration</option>
            <option value="location-info">Location Info</option>
        </select>

        <dl v-if="info_section == 'mission-status'">
            <dt v-if="getGameID">Mission ID:</dt>
            <dd v-if="getGameID">{{getGameID}}</dd>
            <dt>Location:</dt>
            <dd>{{stringFormatter(simLocation)}}</dd>
            <dt>Duration:</dt>
            <dd>{{currentStepBuffer}}/{{getTotalMissionHours}} h</dd>
            <dt>Mars days:</dt>
            <dd>{{calcSols(currentStepBuffer-1)}}</dd>
            <dt>Earth days:</dt>
            <dd>{{calcDays(currentStepBuffer-1)}}</dd>
            <dt>Inhabitants:</dt>
            <dd>{{humanCount()}}/{{configuration.humans.amount}}</dd>
            <!-- TODO: restore this when we get the value from the backend
            <dt>Food:</dt>
                <dd>{{configuration.food.amount}}/{{configuration.food.amount}}</dd>-->
        </dl>

        <dl v-if="info_section == 'mission-config'">
            <dt>Location:</dt>
            <dd>Mars</dd>
            <dt>Duration:</dt>
            <dd>{{configuration.duration.amount}} {{stringFormatter(configuration.duration.units)}}</dd>
            <dt>Food:</dt>
            <dd>{{configuration.food.amount}} {{configuration.food.units}}</dd>
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
            <dt>Inhabitants:</dt>
            <dd>{{configuration.humans.amount}}</dd>
        </dl>

        <dl v-if="info_section == 'location-info'">
            <dt>Location:</dt>
            <dd>{{stringFormatter(simLocation)}}</dd>
            <dt>Day length:</dt>
            <dd>24h 37m 23s</dd>
            <dt>Surface Temperature:</dt>
            <dd>210 K | -63 °C | -81 °F</dd>
            <dt>Solar Gain:</dt>
            <dd>500 W/m²</dd>
            <dt>Atmospheric Pressure:</dt>
            <dd>0.636 kPa</dd>
            <dt>Gravity:</dt>
            <dd>3.71 m/s²</dd>
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
        const {currentStepBuffer, simLocation} = storeToRefs(dashboard)
        const {getData} = dashboard
        const {configuration, getTotalMissionHours} = storeToRefs(wizard)
        return {currentStepBuffer, simLocation, getData, configuration, getTotalMissionHours}
    },
    modes: ['sim'],
    data() {
        return {
            info_section: 'mission-status',
        }
    },
    computed: {
        ...mapGetters(['getGameID']),
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
    },
}
</script>


<style lang="scss" scoped>
#mission-info-select {
    width: 50%;
    margin-bottom: 1em;
}
</style>
