<!--
Initial welcome screen component. Basic HTML component with the exception of
the button click sending the user to the login screen.
Future version should use a cookie and store the current version number of SIMOC
the user last accepted the welcome message on.
If it matches on mounted then the component should automatically send the user
to the entry screens to prevent this from popping up on repeat vistors.
-->

<template>
    <div class="entry-wrapper">
        <!-- Normal Mode -->
        <BaseEntry v-if="!kioskMode">
            <template #entry-main>
                <div class="welcome-wrapper">
                    <p class="welcome-title">WELCOME TO SIMOC Live</p>

                    <p>SIMOC Live is a real-time environmental monitoring system for space habitat analogs.</p>

                    <p>Through the SIMOC Live interface, you will have access to real-time data collected from
                        environmental sensors in space habitat analogs. The system continuously monitors critical
                        atmospheric components including CO2 levels, relative humidity, temperature, pressure, and
                        volatile organic compounds (VOCs). Originally developed for SAM (Space Analog for the Moon and Mars)
                        at the University of Arizona's Biosphere 2, this system helps validate habitat simulation models
                        with real-world data.</p>

                    <p>To learn more about SIMOC and SIMOC Live, enjoy tutorials, and download classroom
                        curricula visit: <a class="link" target="_blank" href="https://simoc.space/">
                            simoc.space</a></p>

                    <p>Finally, by pressing the PROCEED button below, you confirm that you have
                        read and agree to the
                        <a class="link" href="https://simoc.space/about/end-user-license-agreement/"
                           target="_blank">End User License Agreement</a>.</p>
                </div>
            </template>

            <template #entry-button>
                <v-btn-menu @click="toLiveDashboard">PROCEED</v-btn-menu>
            </template>
        </BaseEntry>
        <!-- Kiosk Mode -->
        <BaseEntry v-else>
            <template #entry-main>
                <div class="welcome-wrapper">
                    <p class="welcome-title">WELCOME TO MARS!</p>

                    <p>To live on Mars you will need to carefully manager your air, water, food,
                        and energy generation to survive. In this computer simulation of a Mars
                        habitat, you choose the number of astronauts, the size of your habitat, the
                        plants in your greenhouse, solar panels and batteries.</p>

                    <p>Will you have enough electricity to make it through the night? Enough food
                        to last for a month? Can you survive on Mars?</p>
                </div>
            </template>

            <template #entry-button>
                <button class="btn-normal" @click="toConfiguration">NEW MISSION</button>
            </template>
        </BaseEntry>
    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'
import {useWizardStore} from '../../store/modules/WizardStore'
import {BaseEntry} from '../base'

export default {
    components: {
        BaseEntry,
    },
    setup() {
        const dashboard = useDashboardStore()
        const wizard = useWizardStore()
        const {currentMode, parameters, kioskMode, simLocation} = storeToRefs(dashboard)
        const {setLiveConfig} = wizard
        return {currentMode, parameters, kioskMode, simLocation, setLiveConfig}
    },
    methods: {
        toConfiguration() {
            this.$router.push('configuration')
        },
        toLiveDashboard() {
            this.currentMode = 'live'  // set 'live' mode
            this.parameters = {min_step_num: 0}  // create min_step_num parameter
            this.setLiveConfig({duration: {amount: 0}}, this.simLocation)  // set duration in wizard store
            this.$router.push('dashboard')
        },
    },
}
</script>

<style lang="scss" scoped>
.entry-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
}

.welcome-wrapper {
    height: 100%;
    width: 100%;
}

.welcome-title {
    margin-top: 0;
    font-weight: bold;
}

p {
    font-family: "Open Sans", sans-serif;
}
</style>
