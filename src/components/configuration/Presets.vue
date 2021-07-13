<!-- This particular component has one job and that is to populate and create the PRESETS field at the top of the finalization screen. This would also be at the
top of the custom (finalized screen only) configuration screen too. Selecting one of these will trigger the getConfiguration watcher in all configuration form components.

Presets should really be stored within the database and retrieved similar to that of the plant names.

Future version would also retrieve any saved configurations the user has saved either in cookies or under a user profile.

Future version should also automatically switch the selected preset to 'custom' if the current configuration doesn't match all field values within each configuration
-->

<template>
    <form class='form-wrapper form-presets' @submit.prevent="">
        <label class='input-wrapper'>
            <div class='input-title' @click="SETACTIVEREFENTRY('Presets')">
                Presets <fa-icon :icon="['fas','info-circle']" />
            </div>
            <div class='input-description'>Employ preset configurations to learn from basic agent interactions. Some succeed. Some fail.</div>
            <div>
                <div class='presets-dropdown'>
                    <select class='input-field-select' ref='preset_dropdown'
                            v-model="selected" v-on:change="updateConfig(selected)">
                        <option :value=EMPTY hidden disabled selected>Preset</option>
                        <option :value=name v-for="(preset, name) in getPresets" :key=name>{{preset.name}}</option>
                        <option :value=CUSTOM>[Custom]</option>
                    </select>
                </div>
                <div v-if="selected == CUSTOM" class="custom-preset">
                    <button @click="saveToLocalStorage">Save</button>
                    <button @click="loadFromLocalStorage(true)">Reset</button>
                </div>
            </div>
        </label>
    </form>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
// global constants used to mark the empty and custom presets
const EMPTY = 'empty'
const CUSTOM = 'custom'
export default {
    data() {
        return {
            // copied constants to access them in html template
            EMPTY: EMPTY,
            CUSTOM: CUSTOM,
            selected: EMPTY,   // the selected preset name is saved here
            none: EMPTY,  // initial empty preset
            custom: CUSTOM,  // custom preset, loaded from localstorage
            dont_set_custom: false,  // when true, avoids setting the custom preset
        }
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration', 'getResetConfig', 'getPresets']),
    },
    methods: {
        ...mapMutations('wizard', ['SETACTIVEREFENTRY', 'SETRESETCONFIG', 'RESETCONFIG']),
        ...mapActions('wizard', ['SETCONFIGURATION', 'SETPRESET']),

        updateConfig: function(name) {
            // don't set [custom] if the user picks a preset
            this.dont_set_custom = true
            if (name === CUSTOM) {
                this.loadFromLocalStorage()
            } else {
                this.SETPRESET(name)
            }
        },
        saveToLocalStorage: function() {
            // save custom preset to local storage
            if (confirm('Save the current configuration as a custom preset?')) {
                try {
                    const config = JSON.stringify(this.getConfiguration)
                    localStorage.setItem('custom-config', config)
                } catch (error) {
                    alert('An error occurred while saving the configuration: ' + error)
                    return
                }
                alert('Custom preset saved.')
            }
        },
        loadFromLocalStorage: function(ask_confirm) {
            // this is called either when the user selects "[Custom]" or
            // when the user presses reset and it will load the custom
            // preset from the local storage if available
            if (ask_confirm && !confirm('Reset changes and reload the custom preset?')) {
                return
            }
            const config = localStorage.getItem('custom-config')
            if (config) {
                this.SETCONFIGURATION(JSON.parse(config))
            } else {
                alert('No Custom preset found. Use the Save button to save one.')
            }
        },
    },
    watch: {
        getResetConfig: function() {
            // someone changed the resetconfig var, so we have to reset the form
            if (!this.getResetConfig) {
                return  // only reset it when it's true
            }
            // avoid changing the selected preset to custom
            this.dont_set_custom = true
            // reset the config to the empty preset
            this.selected = EMPTY
            this.RESETCONFIG()
            // restore the var to false
            this.SETRESETCONFIG(false)
        },
        getConfiguration: {
            handler: function() {
                // Triggered when the configuration changed.
                // This happens either when the user selected a new preset
                // or when they edited a field.  If they selected a preset
                // dont_set_custom should be true, so that "custom" won't be
                // selected, otherwise it will when they edit a single field
                if (this.dont_set_custom || this.selected == CUSTOM) {
                    this.dont_set_custom = false
                    return
                }
                this.selected = CUSTOM
            },
            deep: true,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../sass/components/configuration-input';

.presets-dropdown,
.custom-preset {
    display: inline;
}
</style>
