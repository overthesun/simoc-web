<!-- This particular component has one job and that is to populate and create the PRESETS field at the top of the finalization screen. This would also be at the
top of the custom (finalized screen only) configuration screen too. Selecting one of these will trigger the configuration watcher in all configuration form components.

Presets should really be stored within the database and retrieved similar to that of the plant names.

Future version would also retrieve any saved configurations the user has saved either in cookies or under a user profile.

Future version should also automatically switch the selected preset to 'custom' if the current configuration doesn't match all field values within each configuration
-->

<template>
    <form class="form-wrapper form-presets" @submit.prevent="">
        <label class="input-wrapper">
            <div class="input-title" @click="setActiveRefEntry('Presets')">
                Presets <fa-icon :icon="['fa-solid','circle-info']" />
            </div>
            <div v-if="simLocation === 'mars'" class="input-description">
                Employ preset configurations to learn from basic agent interactions. Some succeed. Some fail.
            </div>
            <div v-else-if="simLocation === 'b2'" class="input-description">
                Employ preset configurations to explore and build on the <a class="reference-link" href="#" @click="setActiveRefEntry('Presets')">historical Biosphere 2 missions</a>.
            </div>
            <div>
                <div class="presets-dropdown">
                    <select ref="preset_dropdown" v-model="selected"
                            class="input-field-select" @change="updateConfig(selected)">
                        <option v-for="(preset, name) in getPresets(simLocation)" :key="name"
                                :value="name">{{preset.name}}</option>
                        <option :value="CUSTOM">[Custom]</option>
                    </select>
                </div>
                <div v-if="selected === CUSTOM" class="custom-preset">
                    <button @click="saveToLocalStorage">Save</button>
                    <button @click="loadFromLocalStorage(true)">Reset</button>
                </div>
            </div>
        </label>
    </form>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {useModalStore} from '../../store/modules/ModalStore'

// global constant used to mark the custom preset
const CUSTOM = 'custom'
export default {
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const modal = useModalStore()
        const {simLocation} = storeToRefs(dashboard)
        const {configuration, resetConfig, getDefaultPresetName, getPresets} = storeToRefs(wizard)
        const {setActiveRefEntry, resetConfigDefault, setConfiguration, setPreset} = wizard
        const {alert, confirm} = modal
        return {
            simLocation, configuration, resetConfig, getDefaultPresetName, getPresets,
            setActiveRefEntry, resetConfigDefault, setConfiguration, setPreset, alert, confirm,
        }
    },
    data() {
        return {
            // copied constants to access them in html template\
            CUSTOM: CUSTOM,
            selected: null,   // set to the default by ConfigurationView
            custom: CUSTOM,  // custom preset, loaded from localstorage
            dont_set_custom: false,  // when true, avoids setting the custom preset
        }
    },
    watch: {
        resetConfig() {
            // someone changed the resetconfig var, so we have to reset the form
            if (!this.resetConfig) {
                return  // only reset it when it's true
            }
            // avoid changing the selected preset to custom
            this.dont_set_custom = true
            // reset the config to the default preset for the location
            this.selected = this.getDefaultPresetName(this.simLocation)
            this.resetConfigDefault(this.simLocation)
            // restore the var to false
            this.resetConfig = false
        },
        configuration: {
            handler() {
                // Triggered when the configuration changed.
                // This happens either when the user selected a new preset
                // or when they edited a field.  If they selected a preset
                // dont_set_custom should be true, so that "custom" won't be
                // selected, otherwise it will when they edit a single field
                if (this.dont_set_custom || this.selected === CUSTOM) {
                    this.dont_set_custom = false
                    return
                }
                this.selected = CUSTOM
            },
            deep: true,
        },
    },
    mounted() {
        // the actual default preset is loaded in ConfigurationView,
        // here we just update the name in the presets dropdown to match it
        this.selected = this.getDefaultPresetName(this.simLocation)
    },
    methods: {
        updateConfig(name) {
            // don't set [custom] if the user picks a preset
            this.dont_set_custom = true
            if (name === CUSTOM) {
                this.loadFromLocalStorage()
            } else {
                this.setPreset(name, this.simLocation)
            }
        },
        saveToLocalStorage() {
            // save custom preset to local storage
            this.confirm({
                message: 'Save the current configuration as a custom preset?',
                confirmCallback: () => {
                    try {
                        const config = JSON.stringify(this.configuration)
                        localStorage.setItem(`custom-config-${this.simLocation}`, config)
                        this.alert('Custom preset saved.')
                    } catch (e) {
                        this.alert(`An error occurred while saving the configuration: ${e}`)
                    }
                },
            })
        },
        loadFromLocalStorage(ask_confirm) {
            // this is called either when the user selects "[Custom]" or
            // when the user presses reset and it will load the custom
            // preset from the local storage if available
            const loadPreset = () => {
                const config = localStorage.getItem(`custom-config-${this.simLocation}`)
                if (config) {
                    this.setConfiguration(JSON.parse(config), this.simLocation)
                } else {
                    this.alert('No Custom preset found. Use the Save button to save one.')
                }
            }

            if (ask_confirm) {
                this.confirm({
                    message: 'Reset changes and reload the custom preset?',
                    confirmCallback: () => loadPreset(),
                })
            } else {
                loadPreset()
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@use '../../sass/components/configuration-input';

.presets-dropdown,
.custom-preset {
    display: inline;
}
</style>
