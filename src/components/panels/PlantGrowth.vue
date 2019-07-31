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
                  {{getTotalAgentMass(getStepBuffer.current)[getConfiguration.plantSpecies[index].type].value.toExponential(3) + "%"}}
              </td>
          </tr>
      </table>
  </section>
</template>


<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    computed:{
        ...mapGetters('wizard',['getConfiguration']),
        ...mapGetters('dashboard',['getAirStorageRatio','getTotalAgentMass','getStepBuffer','getAgentType']),
    },
    methods:{
        stringFormatter: function(value){
            let formatted = ""

            formatted = value.replace(/_/g," ")
            formatted = formatted.toLowerCase()
                    .split(" ")
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ")

            return formatted
        }
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
