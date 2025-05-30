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
            <dd>{{humans}}/{{configuration.humans.amount}}</dd>
        </dl>
        <div id="humans">
            <fa-icon v-for="h in humans" :key="h" :icon="['fa-solid','person']" class="alive" />
            <fa-icon v-for="h in configuration.humans.amount-humans" :key="h"
                     :icon="['fa-solid','person']" class="dead" />
        </div>
    </section>
</template>


<script>
import {storeToRefs} from 'pinia'

import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {StringFormatter} from '../../javascript/utils'

/*
TODO: If the data hasn't been sent, we want to display "[loading..]" as
a placeholder. On this panel, several fields use the 'attempt_read' method,
which displays "[loading...]" if an error is raised while fetching the data.

The new getData method doesn't raise an error if an index is out of range, it
returns 0 (long story), so the "[loading...]" wasn't shown. I changed it to show
when "currentStepBuffer === 0", which should only ever happen at the beginning.
This is probably a more appropriate method and should be implemented everywhere.
*/

export default {
    panelTitle: 'Inhabitants Status',
    modes: ['sim'],
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {
            currentStepBuffer, gameConfig, currencyDict, humanAtmosphere,
        } = storeToRefs(dashboard)
        const {getData} = dashboard
        const {configuration} = storeToRefs(wizard)
        return {
            currentStepBuffer, gameConfig, currencyDict, humanAtmosphere,
            getData, configuration,
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
        step() {
            return this.currentStepBuffer
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
                    if (typeof store === 'number') {
                        foodValue += store
                    } else if (typeof store === 'object') {
                        foodValue += Object.values(store).reduce((a, b) => a + b)
                    } else {
                        console.error('Unexpected food storage type', store)
                    }
                })
                return `${foodValue.toFixed(3)} kg`
            })
        },
        humans() {
            const agents = this.getData(['human', 'active', this.currentStepBuffer])
            if (Number.isNaN(agents) || this.currentStepBuffer === 0) {
                // if we don't know the humans count, return the initial value
                return this.configuration.humans.amount
            } else {
                return agents
            }
        },
        totalAtmosphere() {
            return this.getData([this.humanAtmosphere, 'storage', 'SUM', 1])
        },
    },
    mounted() {
        // Compile a list of active food currencies
        this.foodCurrencies = []
        Object.entries(this.currencyDict).forEach(([currency, data]) => {
            if (data.category === 'food') {
                this.foodCurrencies.push(currency)
            }
        })
    },
    methods: {
        stringFormatter: StringFormatter,
        get_gas_percentage(currency) {
            // calculate and return the percentage of the given gas
            const amount = this.getData([this.humanAtmosphere, 'storage', currency, this.step])
            if (Number.isNaN(amount) || this.currentStepBuffer === 0) {
                throw Error('Nothing here yet..')
            }
            return amount / this.totalAtmosphere * 100
        },
        attempt_read(func) {
            try {
                return func()
            } catch {
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
