<!-- This is the main view of the dashboard. The intent was to break up each 'panel' into it's own component and use a 'BasePanel' component with slots to populate
the title, and content. Allowing for things like the configuration menu orginally seen on other version, and additional functionality to be placed within the BasePanel
to prevent uncessary duplication as additional planels are created.

-->

<template>
    <div class='dashboard-view-wrapper'>
        <BasePanel v-for="(panelName,index) in activePanels" :key="index">
            <template v-slot:panel-title>{{panels[panelName].panelTitle}}</template>
            <template v-slot:panel-select>
                <!-- on change, update the panel name at index in the list of active panels -->
                <select class='panel-select' v-model="activePanels[index]">
                    <option selected disabled>Jump To Section</option>
                    <!-- populate the drop-down with all the available panels -->
                    <option v-for="(panel, panelName) in panels" :value="panelName">{{panel.panelTitle}}</option>
                </select>
            </template>
            <template v-slot:panel-content>
                <component :is="panelName" :canvasNumber="index"></component>
            </template>
        </BasePanel>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {BasePanel} from '../../components/basepanel'
// import all panels
import panels from '../../components/panels'
// import {MissionInfo,MissionConfig,EnergyVersus,PlantGrowth,GreenhouseConfig,AtmosphereConfig} from '../../components/panels'
export default {
    data(){
        return{
            humans:0,
            // list of default panels, update this to change the panels displayed
            activePanels: ["MissionConfig", "EnergyVersus", "AtmosphereConfig",
                           "MissionInfo", "GreenhouseConfig", "PlantGrowth"],
            panels: panels,
        }
    },
    components:{
        'BasePanel':BasePanel,
        // add all panels as components
        ...panels,
        /*
        //Graph components imported to be used within the panels.
        'EnergyVersus': panels.EnergyVersus,
        //'Gauge':Gauge,
        'GreenhouseConfig': panels.GreenhouseConfig,
        //'GreenhouseDoughnut':GreenhouseDoughnut,
        'MissionInfo': panels.MissionInfo,
        'MissionConfig': panels.MissionConfig,
        'PlantGrowth': panels.PlantGrowth,
        'AtmosphereConfig': panels.AtmosphereConfig
        */
    },
    computed:{
        ...mapGetters('wizard',['getConfiguration']),
        ...mapGetters('dashboard',['getAirStorageRatio','getTotalAgentMass','getStepBuffer','getAgentType']),
    },
}
</script>

<style lang="scss" scoped>


    .dashboard-view-wrapper{
        font-family: "Roboto", sans-serif;
        width:100%;
        height:100%;
        padding: 16px;
        box-sizing:border-box;

        display: grid;
        grid-template-columns: repeat(3,minmax(304px,1fr));
        grid-template-rows: repeat(2,minmax(200px,1fr));
        grid-row-gap: 16px;
        grid-column-gap: 16px;
        overflow:hidden;
    }

    /*.panel{
        background-color: #1e1e1e;
        display:grid;
        grid-template-rows: 32px 1fr;
        grid-row-gap: 16px;
        padding:8px;
    }

    .panel-title{
        margin:auto 0px;
        border-bottom: 1px solid #999;
        font-weight: 200;
        font-style:italic;
    }

    .panel-graph{
        position:relative;
    }

    .panel-graph-gauge{
        display:grid;
        grid-template-columns: repeat(3,1fr);
        grid-template-rows: repeat(2,1fr);
        grid-row-gap: 16px;
        grid-column-gap: 16px;
    }

    .panel-graph-doughnut{
        width: 100%;
        height: 100%;
    }

    .two-line-wrapper{
        display:grid;
        grid-template-columns: 1.5fr 1fr;
        grid-template-rows: repeat(auto-fill,32px);
    }

    .line-item,.line-title{
        margin:auto 0px;
    }

    .line-title{
        font-size: 14px;
        font-weight: 200;
    }
    .gauge-wrapper{
        display:grid;
        grid-template-rows: minmax(0px,1fr) 24px;
        grid-row-gap: 8px;
        text-align:center;
    }

    .gauge-text{
        font-size:18px;
        font-weight: 400;
    }*/
</style>
