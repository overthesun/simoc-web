<!--
This is the main view of the dashboard.  It dynamically loads all the panels found in the panels/
dir and shows a list of default panels as defined in the activePanels variable.
Each panel has a menu that allows adding, changing, or removing panels,
that is populated with all the panels found in the panels/ dir.
The layout of each panel is defined in BasePanel.vue to avoid duplication.
-->

<template>
    <div class="dashboard-view-wrapper">
        <BasePanel v-for="([panelName, panelSection],index) in activePanels.map(p => p.split(':'))" :key="index">
            <template v-slot:panel-title><div class="panel-title">{{panels[panelName].panelTitle}}</div></template>
            <template v-slot:panel-menu>
                <div class="panel-menu">
                    <!-- the menu icon, shows the options menu when clicked -->
                    <div class="menu-icon-wrapper" @click="openPanelMenu(index)">
                        <fa-icon :icon="['fas','bars']" class="fa-icon menu-icon" />
                    </div>
                    <!-- the options menu -->
                    <div v-if="index === visibleMenu" class="panel-menu-options">
                        <!-- this menu has two steps: first shows the add/change/remove options;
                             if the user selects add/change, hide the options and show the dropdown -->
                        <ul v-if="index !== visiblePanelSelect">
                            <li><button @click="showPanelSelect(index, 0)">Add Panel</button></li>
                            <li><button @click="showPanelSelect(index, 1)">Change Panel</button></li>
                            <li><button v-if="activePanels.length > 1"
                                        @click="removePanel(index)">Remove Panel</button></li>
                        </ul>
                        <!-- panel select dropdown: on change, update the activePanels list by changing
                             the panel name at index or by adding the panel name at index+1 -->
                        <select v-else v-model="selectedPanel" class="panel-select"
                                @change="updatePanels(index, replacePanel)">
                            <option hidden selected value="null">Select Panel:</option>
                            <!-- populate the drop-down with all the available panels, sorted by title -->
                            <option v-for="[pTitle, pName] in sortedPanels" :value="pName">{{pTitle}}</option>
                        </select>
                    </div>
                </div>
            </template>
            <template v-slot:panel-content>
                <component :is="panelName" :canvas-number="index"
                           :panel-index="index" :panel-section="panelSection"
                           @panel-section-changed="updatePanelSection" />
            </template>
        </BasePanel>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {BasePanel} from '../basepanel'
import panels from '../panels'  // import all panels

export default {
    data() {
        return {
            // list of default panels; update this to change the initial panels displayed
            activePanels: [],
            panels: panels,  // object mapping all available panel names with their corresponding object
            visibleMenu: null,  // the index of the visible panel menu, null if no panel menu is open
            visiblePanelSelect: null,  // the index of the visible panel select dropdown
            selectedPanel: null,  // store the name of the panel selected through the dropdown
            replacePanel: null,  // if 0, updatePanels will add a new panel; if 1, it will replace the panel
        }
    },
    beforeMount() {
        // load saved panels from local storage or use default layout
        const savedPanels = localStorage.getItem('panels-layout')
        if (savedPanels) {
            this.SETACTIVEPANELS(JSON.parse(savedPanels))
        } else {
            this.SETDEFAULTPANELS()
        }
    },
    components: {
        BasePanel,
        ...panels,  // add all panels as components
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),
        ...mapGetters('dashboard', ['getActivePanels']),
        sortedPanels() {
            // return a sorted array of [[title, name], [..., ...], ...]
            const sorted = []
            Object.entries(this.panels).forEach(([panelName, panel]) => {
                sorted.push([panel.panelTitle, panelName])
            })
            return sorted.sort()
        },
    },
    methods: {
        ...mapMutations('dashboard', ['SETACTIVEPANELS', 'SETDEFAULTPANELS']),

        openPanelMenu(index) {
            // open the panel menu at index or close it if it's already open
            this.visibleMenu = (this.visibleMenu === index) ? null : index
        },
        closePanelMenu(index) {
            // reset variables and close the menu
            this.replacePanel = null
            this.selectedPanel = null
            this.visiblePanelSelect = null
            this.visibleMenu = null
        },
        showPanelSelect(index, replace) {
            // show the panel select dropdown
            this.visiblePanelSelect = index
            // set whether the selected panel will replace the one at index or added at index+1
            this.replacePanel = replace  // 1: replace panel, 0: add new one
        },
        updatePanels(index, replace) {
            // do nothing if we are replacing a panel with the same panel
            if (this.replacePanel &&
                this.selectedPanel === this.activePanels[index].split(':')[0]) {
                this.closePanelMenu()
                return
            }
            // replace or add the selected panel
            const panelName = this.selectedPanel
            this.activePanels.splice(replace?index:index+1, replace, panelName)
            this.SETACTIVEPANELS(this.activePanels)
            this.closePanelMenu()
        },
        updatePanelSection(index, section) {
            // update the section of the panel at index
            const panelName = this.activePanels[index].split(':')[0]
            this.activePanels[index] = [panelName, section].join(':')
            this.SETACTIVEPANELS(this.activePanels)
        },
        removePanel(index) {
            // remove the selected panel
            this.activePanels.splice(index, 1)
            this.SETACTIVEPANELS(this.activePanels)
            this.closePanelMenu()
        },
    },
    watch: {
        getActivePanels() {
            this.activePanels = this.getActivePanels
        },
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
        grid-template-columns: repeat(3, minmax(304px,1fr));
        /* the first minmax value should be ~1em more than the panel
           min-height, or the row gap disappears with multiple rows */
        grid-template-rows: repeat(auto-fit, minmax(18em,1fr));
        grid-row-gap: 16px;
        grid-column-gap: 16px;
        overflow: auto;
    }

    .panel-menu {
        position: relative;

    }
    .panel-menu .menu-icon-wrapper {
        text-align: right;
        display: block;
    }
    .panel-menu .menu-icon {
      width: 24px;
      height: 24px;
    }
    .panel-menu-options {
        position: absolute;
        right: 0;
        z-index: 10;
        background-color: #1e1e1e;
        min-width: 150px;
    }
    .panel-menu-options ul {
        margin: 0;
        padding: 0;
    }
    .panel-menu-options ul li {
        list-style-type: none;
    }
    .panel-menu-options ul li button {
        width: 100%;
        color: #eee;
        background-color: transparent;
        border: 1px solid #eee;
        margin: 0;
        padding: 3px;
    }
    .panel-menu-options ul li:first-child button {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    .panel-menu-options ul li:last-child button {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
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
