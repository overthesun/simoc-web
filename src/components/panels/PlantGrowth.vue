<template>
  <section class="plant-growth-wrapper">
      <table class="plant-growth">
          <tr>
              <th>Plant Species</th>
              <th>Qty</th>
              <th>% of Growth</th>
          </tr>
          <tr v-for="(item,index) in getConfiguration.plantSpecies" :key="index">
              <td >
                  {{stringFormatter(getConfiguration.plantSpecies[index].type)}}
              </td>
              <td>
                  {{getConfiguration.plantSpecies[index].amount}}
              </td>
              <td>
                  {{getTotalAgentMassPerc(index)}}
              </td>
          </tr>
      </table>
  </section>
</template>


<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {StringFormatter} from '../../javascript/stringFormatter'

export default {
    computed:{
        ...mapGetters('wizard',['getConfiguration']),
        ...mapGetters('dashboard',['getAirStorageRatio','getTotalAgentMass','getStepBuffer','getAgentType']),
    },
    methods:{
        stringFormatter: StringFormatter,
        getTotalAgentMassPerc: function(index) {
            let totalAgentMass = this.getTotalAgentMass(this.getStepBuffer.current)
            if (totalAgentMass === undefined) {
                return '[loading data...]'
            }
            else {
                return totalAgentMass[this.getConfiguration.plantSpecies[index].type].value.toExponential(3) + "%"
            }
        },
    }
}
</script>


<style lang="scss" scoped>
.plant-growth-wrapper {
    overflow-y: auto;
}
.plant-growth {
    width: 100%;
}
.plant-growth th,
.plant-growth td {
    text-align: center;
    padding: 2px 0;
}

.plant-growth th:first-child,
.plant-growth td:first-child {
    text-align: left;
}
.plant-growth th:last-child,
.plant-growth td:last-child {
    text-align: right;
}

</style>
