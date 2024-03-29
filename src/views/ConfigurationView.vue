<template>
    <div :class="{'waiting': awaiting_response}" class="base-configuration-wrapper" :style="{
        'background-image': 'url(' + bgImage + ')' }">
        <TheTopBar />
        <!-- Show the configuration menu component when getMenuActive is true. -->
        <ConfigurationMenu v-if="menuActive" />
        <router-view v-slot="{Component}">
            <component :is="Component">
                <!-- Wizard Jump Options, only available in Guided Configuration -->
                <template #navigation-section-select>
                    <!-- Set the activeForm index if the user changes the value to something other than selected -->
                    <select class="section-select" @change="setActiveForm">
                        <option selected disabled>Jump To Section</option>
                        <option :selected="formIndex === 0" value="0">Initial</option>
                        <option :selected="formIndex === 1" value="1">Inhabitants</option>
                        <option :selected="formIndex === 2" value="2">Greenhouse</option>
                        <option :selected="formIndex === 3" value="3">Energy</option>
                        <option :selected="formIndex === 4" value="4">Finalize</option>
                    </select>
                </template>
                <template #main-wizard-input>
                    <form ref="form" class="form-wrapper" @submit.prevent="">
                        <!-- If we are in Guided config and not at the finalize step,
                             only show the activeForm component -->
                        <component :is="activeForm" v-if="activeConfigType === 'Guided' && activeForm != 'Finalize'" />
                        <!-- Else, if we are in the Custom config or in the Finalize step
                            of the Guided config, show all components -->
                        <section v-else-if="activeConfigType === 'Custom' || activeForm === 'Finalize'"
                                 :class="{'validating': validating}" class="form-wrapper">
                            <Presets v-if="activeConfigType === 'Custom'" ref="presets" />
                            <Initial ref="initial" />
                            <Inhabitants ref="inhabitants" />
                            <ECLSS ref="eclss" />
                            <Greenhouse ref="greenhouse" />
                            <Energy v-if="simLocation === 'mars'" ref="energy" />
                            <!--
                            This works, but breaks the $refs (i.e. this.$refs works, but not this.$refs.component.$refs)
                            <component :is="formName" v-for="formName in forms" :ref="formName.toLowerCase()" />
                            -->
                        </section>
                    </form>
                </template>
                <template #wizard-configuration-footer>
                    <!-- Guided config bottom nav, with prev/next section and Launch Simulation buttons -->
                    <nav v-if="activeConfigType === 'Guided'" class="configuration-button-wrapper">
                        <!-- These use v-if instead of class binding, since they are simply either displayed or hidden.
                            No animations present to require it. -->
                        <button v-if="!isFirstForm" class="btn-previous" @click="decrementIndex">Previous Section</button>
                        <button v-if="!isFinalForm" class="btn-next" @click="incrementIndex">Next Section</button>
                        <button v-if="isFinalForm" class="btn-launch" @click="launchSimulation">Launch Simulation</button>
                    </nav>
                    <!-- Custom config bottom nav, no sections, only Launch Simulation button -->
                    <nav v-if="activeConfigType === 'Custom'" class="configuration-button-wrapper">
                        <button class="btn-launch" @click="launchSimulation">Launch Simulation</button>
                    </nav>
                </template>
                <template #main-wizard-reference>
                    <!-- Display the component with the name stored in the variable-->
                    <keep-alive>
                        <component :is="activeReference" />
                    </keep-alive>
                    <!--<Reference/>-->
                    <!--<GreenhouseDoughnut/>-->
                </template>
                <template #footer-wizard-reference />
            </component>
        </router-view>
    </div>

</template>

<script>
import axios from 'axios'
import {storeToRefs} from 'pinia'
// import form components
import {useDashboardStore} from '../store/modules/DashboardStore'
import {useWizardStore} from '../store/modules/WizardStore'
import {useModalStore} from '../store/modules/ModalStore'
import {TheTopBar} from '../components/bars'
import {ConfigurationMenu, Presets, Initial, Inhabitants, ECLSS,
        Greenhouse, Energy, Reference, Graphs, Layout} from '../components/configuration'
import {idleMixin} from '../javascript/mixins'
import b2Url from '@/assets/b2-bg.jpg'
import marsUrl from '@/assets/mars-bg.jpg'

export default {
    components: {
        TheTopBar,
        ConfigurationMenu,
        Presets,
        Initial,
        Inhabitants,
        ECLSS,
        Greenhouse,
        Energy,
        Reference,
        Graphs,
        Layout,
    },
    mixins: [idleMixin],
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const modal = useModalStore()
        const {
            menuActive, parameters, loadFromSimData, maxStepBuffer, currentMode, isLive,
            simLocation,
        } = storeToRefs(dashboard)
        const {
            configuration, getFormattedConfiguration, getPresets, activeConfigType, getActiveForm,
            activeFormIndex, formOrder, getTotalMissionHours, activeReference, activeRefEntry,
            simdataLocation,
        } = storeToRefs(wizard)
        const {modalActive} = storeToRefs(modal)
        const {setGameParams, setSimulationData, setGameId} = dashboard
        const {resetConfigDefault, setConfiguration} = wizard
        const {alert, setModalParams} = modal
        return {
            menuActive, parameters, loadFromSimData, maxStepBuffer, currentMode, isLive,
            simLocation, setGameParams, setSimulationData, setGameId, configuration,
            getFormattedConfiguration, activeConfigType, getActiveForm, formOrder,
            getTotalMissionHours, activeReference, activeRefEntry, getPresets, simdataLocation,
            resetConfigDefault, activeFormIndex, setConfiguration, alert, modalActive,
            setModalParams,
        }
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
            stepMax: 1,
            greenhouseSize: {
                none: 0,
                greenhouse_small: 490,
                greenhouse_medium: 2454,
                greenhouse_large: 5610,
            },
        }
    },
    computed: {
        // Returns the imported static urls for the page backgrounds of mars and earth
        bgImage() {
            if (this.simLocation === 'b2') {
                return b2Url
            } else {
                return marsUrl
            }
        },
        // Used to hide the normal button and display the active button
        isFinalForm() {
            return (this.formOrder.length-1) === this.formIndex
        },
        // Hides the prvevious button if the active form is the first one.
        isFirstForm() {
            return this.formIndex === 0
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
                this.activeFormIndex = this.formIndex
                this.activeForm = this.getActiveForm
            },
        },
    },
    beforeMount() {
        this.resetConfigDefault(this.simLocation)
        this.menuActive = false
        this.activeForm = this.getActiveForm
    },
    methods: {
        toggleMenu() {
            this.menuActive = !this.menuActive
        },

        // Sets the active form, using the value from the select field
        // This happens automatically by changing the watched formIndex
        setActiveForm(event) {
            const {value: index} = event.target
            this.formIndex = parseInt(index, 10)
        },

        decrementIndex() {
            const index = Math.max(0, (this.formIndex-1))
            this.formIndex = index
        },

        incrementIndex() {
            const max = this.formOrder.length-1
            this.formIndex = Math.min(max, (this.formIndex+1))
        },

        handleAxiosError(error, msg) {
            const errmsg = error.response.data.message || error.message
            this.$gtag.exception({description: `Launch simulation: ${errmsg}`})
            console.error(error)
            if (error.response && error.response.status === 401) {
                this.alert('Please log in again to continue.')
                this.$router.push('entry')
            } else {
                this.alert(msg || error)
            }
        },


        async importPresetData(preset) {
            // import cached simulation data for the preset
            try {
                // Retrieve simdata file from the backend
                const fname = preset.simdata_file.split('.')[0]
                console.log(`* Loading cached <${fname}> simdata ...`)
                const response = await axios.get(`/simdata/${fname}.json.gz`)
                return response.data  // get the actual data out of the response object
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
            const {form} = this.$refs
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
            // eslint-disable-next-line no-promise-executor-return
            await new Promise(r => setTimeout(r, 10))  // await for 10ms

            // load cached simdata if the user selects a preset
            const presets = this.getPresets(this.simLocation)
            const preset_name = this.$refs.presets.$refs.preset_dropdown.value
            if (preset_name in presets) {
                let data
                try {
                    if (this.simLocation === 'b2') {
                        this.setModalParams({
                            message: 'Downloading simulation data.\n' +
                                     'Please wait, this could take a few seconds...',
                        })
                        this.modalActive = true
                    }
                    data = await this.importPresetData(presets[preset_name])
                } finally {
                    this.modalActive = false
                }
                if (data) {
                    try {
                        const {configuration, ...simdata} = data
                        this.setConfiguration(configuration, this.simLocation)
                        this.setSimulationData(simdata)
                        this.currentMode = 'sim'
                        this.isLive = false
                        this.loadFromSimData = true
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
            let configParams
            try {
                // get the formatted configuration from wizard store
                // the store will also validate it and throw errors if it's invalid
                configParams = {step_num: this.getTotalMissionHours,
                                game_config: this.getFormattedConfiguration}
            } catch (err_msg) {
                this.alert(err_msg)
                return  // abort if there are any errors
            }
            try {
                this.awaiting_response = true
                // Wait for the new game to be created
                const response = await axios.post('/new_game', configParams)
                // store the game ID and full game_config from the response
                this.setGameId(response.data.game_id)
                this.setGameParams(response.data.game_config)
                this.currentMode = 'sim'
                this.isLive = false
                this.loadFromSimData = false
                // If all is well then move the user to the dashboard screen
                this.$router.push('dashboard')
            } catch (error) {
                const err_msg = ('We are working hard to run as many simulations\n' +
                                 'as possible, but we currently reached capacity.\n' +
                                 'Please try again in just a minute.')
                this.handleAxiosError(error, err_msg)
            } finally {
                this.awaiting_response = false
            }
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
    background-attachment: fixed;
    background-size: cover;
    background-position: 50% 10%;
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
