<template>
    <section class="panel-dl-wrapper">
        <dl>
            <dt title="&lt;=19.5%: minimum permissible level;
&lt;=15%: decreased ability to work strenuously;
&lt;=12%: respiration and pulse increase;
&lt;=8%: termination">
                O₂ (min. 8%):</dt>
            <dd :style="o2_style">{{o2}}</dd>
            <dt title="&gt;=0.1%: complaints of stiffness and odors;
&gt;=0.25%: general drowsiness;
&gt;=0.5%: adverse health effects;
&gt;=1%: termination">
                CO₂ (max. 1%):</dt>
            <dd :style="co2_style">{{co2}}</dd>
            <dt title="Inhabitants are terminated after 3 days with no water">
                Potable Water (sans 3 days):</dt>
            <dd>{{water}}</dd>
            <dt title="Inhabitants are terminated after 20 days with no food">
                Food (sans 20 days):</dt>
            <dd>{{food}}</dd>
            <dt>Inhabitants:</dt>
            <dd>{{humans}}/{{getConfiguration.humans.amount}}</dd>
        </dl>
        <div id="humans">
            <fa-icon v-for="h in humans" :key="h" :icon="['fa-solid','person']" class="alive" />
            <fa-icon v-for="h in getConfiguration.humans.amount-humans" :key="h"
                     :icon="['fa-solid','person']" class="dead" />
        </div>
    </section>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Inhabitants Status',
    modes: ['sim', 'kiosk'],
    data() {
        return {
            // shades of red to warn the user when values pass the threshold
            colors: ['#ff0000', '#cc0000', '#ff6600', '#ffcc00', '#eeeeee'],
            // inline styles for co2/o2
            co2_style: {color: '#eee'},
            o2_style: {color: '#eee'},
            food_storages: {},
        }
    },
    computed: {
        ...mapGetters(['getGameID']),
        ...mapGetters('wizard', ['getConfiguration']),
        ...mapGetters('dashboard', ['getAgentType', 'getCurrentStepBuffer',
                                    'getStorageCapacities', 'getGameConfig',
                                    'getGameCurrencies', 'getHumanAtmosphere']),
        step() {
            return this.getCurrentStepBuffer
        },
        total_air_storage_capacity() {
            // return the total capacity of the air storage
            let storage = this.getGameConfig.storages[this.getHumanAtmosphere]
            // TODO: Revert ABM Workaround
            // gameConfig structure has been updated in the backend, but presets use old structure.
            storage = Array.isArray(storage) ? storage[0] : storage
            return storage.total_capacity.value
        },
        o2() {
            return this.attempt_read(() => {
                const o2_perc = this.get_gas_percentage('o2')
                /*
                Color the O2 value in the panel based of this:
                O2 <= 19.5% -- yellow -- minimum permissible level
                O2 <= 15% -- orange -- decreased ability to work strenuously
                O2 <= 12% -- red -- respiration and pulse increase
                O2 <= 8% -- red2 -- terminated
                */
                // find the index of the first value above the threshold
                const k = [8, 12, 15, 19.5, 100].findIndex(threshold => threshold >= o2_perc)
                this.o2_style.color = this.colors[k]
                return `${o2_perc.toFixed(3)}%`
            })
        },
        co2() {
            return this.attempt_read(() => {
                const co2_perc = this.get_gas_percentage('co2')
                /*
                Color the CO2 value in the panel based of this:
                CO2 >= 0.1% -- yellow -- complaints of stiffness and odors
                CO2 >= 0.25% -- orange -- general drowsiness
                CO2 >= 0.5% -- red -- adverse health effects
                CO2 >= 1% -- red2 -- terminated
                */
                // find the index of the first value below the threshold
                const k = [1, 0.5, 0.25, 0.1, 0].findIndex(threshold => threshold <= co2_perc)
                this.co2_style.color = this.colors[k]
                return `${co2_perc.toFixed(3)}%`
            })
        },
        water() {
            return this.attempt_read(() => {
                const storage = this.getStorageCapacities(this.step)
                const {potable} = storage.water_storage[1]
                return `${potable.value} ${potable.unit}`
            })
        },
        food() {
            return this.attempt_read(() => {
                const storage = this.getStorageCapacities(this.step)
                let foodValue = 0
                let foodUnits = null
                // TODO: ABM Redesign Workaround
                Object.entries(this.food_storages).forEach(([storageName, foodCurrencies]) => {
                    if (!storage[storageName]) {
                        return
                    }
                    Object.values(foodCurrencies).forEach(c => {
                        foodValue += storage[storageName]['1'][c].value
                        if (!foodUnits) {
                            foodUnits = storage[storageName]['1'][c].unit
                        }
                    })
                })
                return `${foodValue} ${foodUnits}`
            })
        },
        humans() {
            const agents = this.getAgentType(this.getCurrentStepBuffer)
            if (agents !== undefined && agents.human_agent !== undefined) {
                return agents.human_agent
            } else {
                // if we don't know the humans count, return the initial value
                return this.getConfiguration.humans.amount
            }
        },
    },
    mounted() {
        // TODO: ABM Redesign Workaround
        // Compile a list of storages that include food, and which food currencies they contain.
        const {storages} = this.getGameConfig
        const foodTypes = Object.keys(this.getGameCurrencies.food)
        Object.entries(storages).forEach(([storageName, storageData]) => {
            const foodCurrencies = []
            if (storageData[0].storageType.includes('food_storage')) {
                Object.keys(storageData[0]).forEach(attr => {
                    if (foodTypes.includes(attr)) {
                        foodCurrencies.push(attr)
                    }
                })
            }
            if (foodCurrencies.length > 0) {
                this.food_storages[storageName] = foodCurrencies
            }
        })
    },
    methods: {
        stringFormatter: StringFormatter,
        get_gas_percentage(currency) {
            // calculate and return the percentage of the given gas
            const air_storage = this.getStorageCapacities(this.step)[this.getHumanAtmosphere][1]
            return air_storage[currency].value / this.total_air_storage_capacity * 100
        },
        attempt_read(func) {
            try {
                return func()
            } catch (error) {
                return '[loading data...]'
            }
        },
    },
}
</script>


<style lang="scss" scoped>
#humans {
    font-size: 64px;
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;

}
#humans .dead {
    color: red;
}
svg {
  margin: 8px;
}
</style>
