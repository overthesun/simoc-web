<template>
    <div class='panel-graph'>
        <select v-model="currency" required>
            <option value='atmo_co2' selected>Carbon dioxide (CO₂)</option>
            <option value='atmo_o2'>Oxygen (O₂)</option>
            <option value='h2o_potb'>Potable Water</option>
            <option value='enrg_kwh'>Energy</option>
        </select>
        <div>
            <VersusGraph :id="'canvas-pc-' + canvasNumber" :plotted_value='currency' :unit='units[currency]' />
        </div>
    </div>
</template>

<script>
import {VersusGraph} from '../../components/graphs'

export default {
    panelTitle: 'Production / Consumption',
    data(){
        return{
            currency: 'atmo_co2',
            units: {
                atmo_co2: 'kg',
                atmo_o2: 'kg',
                h2o_potb: 'kg',
                enrg_kwh: 'kW',
            },
        }
    },
    props: {
        canvasNumber: 0,
    },
    components: {
       'VersusGraph': VersusGraph,
    },
}
</script>

<style lang="scss" scoped>
.panel-graph {
    display: grid;
    grid-template-rows: auto 1fr;
}
select {
    width: 50%;
}
.panel-graph select + div {
    /* see https://github.com/chartjs/Chart.js/issues/4156#issuecomment-295180128 */
    min-width: 0;
    min-height: 0;
}
</style>
