<template>
    <section class="panel-dl-wrapper">
        <dl>
            <dt title="&lt;=19.5%: minimum permissible level; &lt;=15%: decreased ability to work strenuously;
                       &lt;=12%: respiration and pulse increase; &lt;=8%: termination">
                O₂ (min. 8%):</dt>
                <dd :style='o2_style'>{{o2}}</dd>
            <dt title="&gt;=0.1%: complaints of stiffness and odors; &gt;=0.25%: general drowsiness;
                       &gt;=0.5%: adverse health effects; &gt;=1%: termination">
                CO₂ (max. 1%):</dt>
                <dd :style='co2_style'>{{co2}}</dd>
            <dt title="Inhabitants are terminated after 3 days with no water">
                Potable Water (sans 3 days):</dt>
                <dd>{{water}}</dd>
            <dt title="Inhabitants are terminated after 20 days with no water">
                Food Rations (sans 20 days):</dt>
                <dd>{{food}}</dd>
            <dt>Inhabitants:</dt>
                <dd>{{humans}}/{{getConfiguration.humans.amount}}</dd>
        </dl>
        <div id="humans">
            <fa-icon class="alive" v-for="h in humans" v-bind:key="h" :icon="['fas','male']" />
            <fa-icon class="dead" v-for="h in getConfiguration.humans.amount-humans" v-bind:key="h" :icon="['fas','male']" />
        </div>
    </section>
</template>


<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/utils'

export default {
    panelTitle: 'Inhabitants Status',
    data() {
        return {
            // shades of red to warn the user when values pass the threshold
            colors: ['#ff0000', '#cc0000', '#ff6600', '#ffcc00', '#eeeeee'],
            // inline styles for co2/o2
            co2_style: {color: '#eee'},
            o2_style: {color: '#eee'},
        }
    },
    computed:{
        ...mapGetters(['getGameID']),
        ...mapGetters('wizard', ['getConfiguration']),
        ...mapGetters('dashboard', ['getAgentType', 'getCurrentStepBuffer','getStorageCapacities','getAirStorageRatio']),
        step: function() {
            return this.getCurrentStepBuffer
        },
        o2: function() {
            return this.attempt_read(() => {
                const air_storage = this.getAirStorageRatio(this.step)
                const o2_perc = air_storage['atmo_o2'] * 100
                /*
                Color the 02 value in the panel based of this:
                O2 <= 19.5% -- yellow -- minimum permissible level
                O2 <= 15% -- orange -- decreased ability to work strenuously
                O2 <= 12% -- red -- respiration and pulse increase
                O2 <= 8% -- red2 -- terminated
                */
                for (let [k, threshold] of [8, 12, 15, 19.5, 100].entries()) {
                    if (o2_perc <= threshold) {
                        this.o2_style.color = this.colors[k]
                        break
                    }
                }
                return o2_perc.toFixed(3) + '%'
            })
        },
        co2: function() {
            return this.attempt_read(() => {
                const air_storage = this.getAirStorageRatio(this.step)
                const co2_perc = air_storage['atmo_co2'] * 100
                /*
                Color the co2 value in the panel based of this:
                CO2 >= 0.1% -- yellow -- complaints of stiffness and odors
                CO2 >= 0.25% -- orange -- general drowsiness
                CO2 >= 0.5% -- red -- adverse health effects
                CO2 >= 1% -- red2 -- terminated
                */
                for (let [k, threshold] of [1, 0.5, 0.25, 0.1, 0].entries()) {
                    if (co2_perc >= threshold) {
                        this.co2_style.color = this.colors[k]
                        break
                    }
                }
                return co2_perc.toFixed(3) + '%'
            })
        },
        water: function() {
            return this.attempt_read(() => {
                const storage = this.getStorageCapacities(this.step)
                const h2o_potb = storage['water_storage'][1]['h2o_potb']
                return h2o_potb.value + ' ' + h2o_potb.unit
            })
        },
        food: function() {
            return this.attempt_read(() => {
                const storage = this.getStorageCapacities(this.step)
                const food_edbl = storage['food_storage'][1]['food_edbl']
                return food_edbl.value + ' ' + food_edbl.unit
            })
        },
        humans: function() {
            let agents = this.getAgentType(this.getCurrentStepBuffer)
            if (agents !== undefined && agents['human_agent'] !== undefined) {
                return agents['human_agent']
            }
            else {
                // if we don't know the humans count, return the initial value
                return this.getConfiguration.humans.amount
            }
        },
    },
    methods:{
        stringFormatter: StringFormatter,
        attempt_read(func) {
            try {
                return func()
            }
            catch (error) {
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
