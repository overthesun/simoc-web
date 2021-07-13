<template>
    <div class="base-configuration-wrapper" :class="{'waiting': awaiting_response}">
        <TheTopBar />
        <!-- Show the configuration menu component when getMenuActive is true. -->
        <ConfigurationMenu v-if="getMenuActive" />
        <router-view>
            <!-- Wizard Jump Options, only available in Guided Configuration -->
            <template v-slot:navigation-section-select>
                <!-- Set the activeForm index if the user changes the value to something other than selected -->
                <select class="section-select" v-on:change="setActiveForm">
                    <option selected disabled>Jump To Section</option>
                    <option value="0" :selected="formIndex === 0">Initial</option>
                    <option value="1" :selected="formIndex === 1">Inhabitants</option>
                    <option value="2" :selected="formIndex === 2">Greenhouse</option>
                    <option value="3" :selected="formIndex === 3">Energy</option>
                    <option value="4" :selected="formIndex === 4">Finalize</option>
                </select>
            </template>
            <template v-slot:main-wizard-input>
                <form class="form-wrapper" ref="form" @submit.prevent="">
                    <!-- If we are in Guided config and not at the finalize step, only show the activeForm component -->
                    <component :is="activeForm" v-if="activeConfigType === 'Guided' && activeForm != 'Finalize'"/>
                    <!-- Else, if we are in the Custom config or in the Finalize step
                         of the Guided config, show all components -->
                    <section class="form-wrapper" :class="{'validating': validating}"
                             v-else-if="activeConfigType === 'Custom' || activeForm === 'Finalize'">
                        <Presets ref="presets" v-if="activeConfigType === 'Custom'" />
                        <Initial ref="initial" />
                        <Inhabitants ref="inhabitants" />
                        <Greenhouse ref="greenhouse" />
                        <Energy ref="energy" />
                        <!--
                        This works, but breaks the $refs (i.e. this.$refs works, but not this.$refs.component.$refs)
                        <component :is="formName" v-for="formName in forms" :ref="formName.toLowerCase()" />
                        -->
                    </section>
                </form>
            </template>
            <template v-slot:wizard-configuration-footer>
                <!-- Guided config bottom nav, with prev/next section and Launch Simulation buttons -->
                <nav class="configuration-button-wrapper" v-if="activeConfigType === 'Guided'"">
                    <!-- These use v-if instead of class binding, since they are simply either displayed or hidden.
                         No animations present to require it. -->
                    <button class="btn-previous" @click="decrementIndex" v-if="!isFirstForm">Previous Section</button>
                    <button class="btn-next" @click="incrementIndex" v-if="!isFinalForm">Next Section</button>
                    <button class="btn-launch" @click="launchSimulation" v-if="isFinalForm">Launch Simulation</button>
                </nav>
                <!-- Custom config bottom nav, no sections, only Launch Simulation button -->
                <nav class="configuration-button-wrapper" v-if="activeConfigType === 'Custom'"">
                    <button class="btn-launch" @click="launchSimulation">Launch Simulation</button>
                </nav>
            </template>

            <template v-slot:main-wizard-reference>
                <keep-alive>
                    <!-- Display the component with the name stored in the variable-->
                    <component :is="getActiveReference"/>
                </keep-alive>
                <!--<Reference/>-->
                <!--<GreenhouseDoughnut/>-->
            </template>
            <template v-slot:footer-wizard-reference>
            </template>
        </router-view>
    </div>

</template>

<script>
import axios from 'axios'
// import form components
import {ConfigurationMenu, Inhabitants, Greenhouse,
        Initial, Energy, Reference, Graphs, Presets} from '../components/configuration'
import {TheTopBar} from '../components/bars'
import {GreenhouseDoughnut} from '../components/graphs'
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
export default {
    components: {
        TheTopBar,
        ConfigurationMenu,
        Presets,
        Initial,
        Inhabitants,
        Greenhouse,
        Energy,
        Reference,
        GreenhouseDoughnut,
        Graphs,
    },
    data() {
        return {
            formIndex: 0, // Current index of the form that should be used from the wizard store
            activeForm: 'Initial', // Default starting form
            forms: ['initial', 'inhabitants', 'greenhouse', 'energy'],  // list of forms components
            // add a CSS class while validating to make missing required fields red
            validating: false,
            // true while waiting for a response after clicking on "Launch Simulation"
            awaiting_response: false,
            menuActive: false, // Used with class binding to display the menu.
            stepMax: 1,
            greenhouseSize: {
                none: 0,
                greenhouse_small: 490,
                greenhouse_medium: 2454,
                greenhouse_large: 5610,
            },
        }
    },
    beforeMount() {
        this.RESETCONFIG()
        this.activeForm = this.getActiveForm
        this.activeConfigType = this.getActiveConfigType
    },
    computed: {
        ...mapGetters('dashboard', ['getMenuActive', 'getStepParams']),
        ...mapGetters('wizard', ['getConfiguration', 'getFormattedConfiguration',
                                 'getActiveConfigType', 'getActiveForm',
                                 'getFormLength', 'getTotalMissionHours',
                                 'getActiveReference', 'getActiveRefEntry',
                                 'getPresets', 'getSimdataLocation']),

        // Used to hide the normal button and display the active button
        isFinalForm() {
            return (this.getFormLength-1) === this.formIndex
        },
        // Hides the prvevious button if the active form is the first one.
        isFirstForm() {
            return this.formIndex === 0
        },
    },
    methods: {
        ...mapMutations('wizard', ['RESETCONFIG', 'SETACTIVEFORMINDEX']),
        ...mapMutations('dashboard', ['SETGAMECONFIG', 'SETSIMULATIONDATA',
                                      'SETLOADFROMSIMDATA', 'SETBUFFERMAX']),
        ...mapMutations(['SETGAMEID']),
        ...mapActions('wizard', ['SETCONFIGURATION']),


        toggleMenu() {
            this.menuActive = !this.menuActive
        },

        // Sets the active form, using the value from the select field
        // This happens automatically by changing the watched formIndex
        setActiveForm(event) {
            let {value: index} = event.target
            this.formIndex = parseInt(index)
        },

        decrementIndex() {
            let index = Math.max(0, (this.formIndex-1))
            this.formIndex = index
        },

        incrementIndex() {
            let max = this.getFormLength-1
            this.formIndex = Math.min(max, (this.formIndex+1))
        },

        handleAxiosError(error) {
            console.error(error)
            if (error.response && error.response.status == 401) {
                alert('Please log in again to continue.')
                this.$router.push('entry')
            } else {
                alert(error)
            }
        },

        importPresetData(preset) {
            // import cached simulation data for the preset
            try {
                console.log('* Loading cached simdata...')
                const fname = preset.simdata_file.split('.')[0]
                const data = require('../assets/simdata/' + fname + '.json')
                return data
            } catch (error) {
                console.log('* Loading cached simdata failed, falling back on regular request')
                console.error(error)
                return null
            }
        },

        async launchSimulation() {
            if (this.awaiting_response) {
                return  // wait for a response before sending a new request
            }
            // check if the form is valid
            this.validating = true
            const form = this.$refs.form
            if (!form.checkValidity()) {
                form.reportValidity()
                return  // abort until the form is invalid
            }
            // change the mouse cursor to the "loading" icon
            this.awaiting_response = true
            // This is a workaround to return control to the main loop
            // so that Vue can see that the value of awaiting_response
            // changed and update the mouse cursor to the "loading" icon.
            // 10ms seem to be enough to give time to Vue to see the change
            // but it's not 100% reliable.  I couldn't find a way to make
            // it work reliably with await this.$nextTick()
            await new Promise(r => setTimeout(r, 10))  // await for 10ms

            // load cached simdata if the user selects a preset
            const presets = this.getPresets
            const preset_name = this.$refs.presets.$refs.preset_dropdown.value
            if (preset_name in presets) {
                const simdata = this.importPresetData(presets[preset_name])
                if (simdata) {
                    try {
                        this.SETCONFIGURATION(simdata.configuration)
                        this.SETSIMULATIONDATA(simdata)
                        this.SETBUFFERMAX(simdata.steps)
                        this.SETLOADFROMSIMDATA(true)
                        this.$router.push('dashboard')
                        return  // nothing else to do if this worked
                    } catch (error) {
                        console.error(error)  // report full error in the console and continue
                    } finally {
                        this.awaiting_response = false
                    }
                }
            }

            // ask the server to calculate the simdata for custom (non-preset) configs
            try {
                // get the formatted configuration from wizard store
                var configParams = {step_num: this.getTotalMissionHours,
                                    game_config: this.getFormattedConfiguration}
            } catch (err_msg) {
                alert(err_msg)
                return  // abort if there are any errors
            }
            try {
                this.awaiting_response = true
                // Wait for the new game to be created
                const response = await axios.post('/new_game', configParams)
                // store the game ID and full game_config from the response
                this.SETGAMEID(response.data.game_id)
                this.SETGAMECONFIG(response.data.game_config)
                this.SETLOADFROMSIMDATA(false)
                // If all is well then move the user to the dashboard screen
                this.$router.push('dashboard')
            } catch (error) {
                this.handleAxiosError(error)
            } finally {
                this.awaiting_response = false
            }
        },
    },
    watch: {
        // If the active form changes update the activeForm variable with the one at the formIndex
        getActiveForm: {
            handler() {
                this.activeForm = this.getActiveForm
            },
            deep: true,
        },
        // If the form index changes update the active form with the one at the formIndex
        // Mostly used for when either the buttons or the select menu or used to navigate
        formIndex: {
            handler() {
                this.SETACTIVEFORMINDEX(this.formIndex)
                this.activeForm = this.getActiveForm
            },
        },
    },
}
</script>

<style lang="scss" scoped>
.base-configuration-wrapper{
    position: relative;
    width: 100vw;
    height: 100vh;
    min-width: 100vw;
    min-height: 100vh;
    display: grid;
    grid-template-rows: 50px minmax(0px,1fr);
}

    .form-wrapper{
        margin-bottom:24px;
    }

    .configuration-button-wrapper{
        display:flex;
        justify-content:flex-start;
        align-items:center;
    }

    .btn-next{
        width: 196px;
        height: 48px;
        min-height: 48px;
        margin-left: auto;
        margin-bottom: 24px;
        border-radius: 5px;
        padding: 12px 16px;
        font-size: 16px;
        font-weight: 600;
        background-color: #0099ee;
        border:none;
        color: #eee;

        &:hover{
            cursor: pointer;
        }

        &:focus{
            outline:none;
        }
    }

    .btn-previous{
        width: 196px;
        height: 48px;
        min-height: 48px;
        margin-bottom: 24px;
        border-radius: 5px;
        padding: 12px 16px;
        font-size: 16px;
        font-weight: 600;
        background-color: transparent;
        border:2px solid #ff3100;
        color: #eee;

        &:hover{
            cursor: pointer;
        }

        &:focus{
            outline:none;
        }
    }

    .btn-launch{
        width: 196px;
        height: 48px;
        min-height: 48px;
        margin-left:auto;
        margin-bottom: 24px;
        border-radius: 5px;
        padding: 12px 16px;
        font-size: 16px;
        font-weight: 600;
        background-color: #0099ee;
        border:none;
        color: #eee;

        &:hover{
            cursor: pointer;
        }

        &:focus{
            outline:none;
        }
    }

</style>

<style lang="scss">
/* this must be unscoped in order to work
   with the labels of the subcomponents */
.waiting, .waiting label, .waiting .btn-launch:hover {
    cursor: wait;
}
</style>
