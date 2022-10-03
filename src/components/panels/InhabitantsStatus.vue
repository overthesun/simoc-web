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
import {storeToRefs} from 'pinia'

import {useDashboardStore} from '@/store/modules/DashboardStore'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Inhabitants Status',
    modes: ['sim'],
    setup() {
        const dashboard = useDashboardStore()

        const {
            currentStepBuffer,
            gameConfig,
            currencyDict,
            humanAtmosphere,
        } = storeToRefs(dashboard)

        const {
            getData,
        } = dashboard

        return {
            currentStepBuffer,
            gameConfig,
            currencyDict,
            humanAtmosphere,
            getData,
        }
    },
    data() {
        return {
            // shades of red to warn the user when values pass the threshold
            colors: ['#ff0000', '#cc0000', '#ff6600', '#ffcc00', '#eeeeee'],
            // inline styles for co2/o2
            co2_style: {color: '#eee'},
            o2_style: {color: '#eee'},
            foodCurrencies: null,
        }
    },
    computed: {
        ...mapGetters(['getGameID']),
        ...mapGetters('wizard', ['getConfiguration']),
        step() {
            return this.currentStepBuffer
        },
        total_air_storage_capacity() {
            // return the total capacity of the air storage
            let storage = this.gameConfig.storages[this.humanAtmosphere]
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
                const potable = this.getData(
                    ['water_storage', 'storage', 'potable', this.step]
                )
                return `${potable.toFixed(3)} kg`
            })
        },
        food() {
            return this.attempt_read(() => {
                const foodStorages = this.getData(
                    ['*', 'storage', this.foodCurrencies.join(','), this.step]
                )
                let foodValue = 0
                Object.values(foodStorages).forEach(store => {
                    foodValue += Object.values(store).reduce((a, b) => a + b)
                })
                return `${foodValue.toFixed(3)} kg`
            })
        },
        humans() {
            const agents = this.getData(['human_agent', 'amount', this.currentStepBuffer])
            if (Number.isNaN(agents)) {
                return this.getConfiguration.humans.amount
            } else {
                return agents
            }
        },
    },
    mounted() {
        // Compile a list of active food currencies
        this.foodCurrencies = []
        Object.entries(this.currencyDict).forEach(([currency, data]) => {
            if (data.currencyClass === 'food') {
                this.foodCurrencies.push(currency)
            }
        })
    },
    methods: {
        stringFormatter: StringFormatter,
        get_gas_percentage(currency) {
            // calculate and return the percentage of the given gas
            const air_storage_value = this.getData(
                [this.humanAtmosphere, 'storage', currency, this.step]
            )
            if (Number.isNaN(air_storage_value)) {
                throw Error('Nothing here yet..')
            }
            return air_storage_value / this.total_air_storage_capacity * 100
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
