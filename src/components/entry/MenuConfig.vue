<!--
Menu to select between guided and custom configuration.

  THIS MENU IS CURRENTLY UNUSED.

Can be reenabled in Menu.vue if needed.
-->

<template>
    <div class="entry-wrapper">
        <BaseEntry>
            <template #option-items>
                <div class="option-item option-item-active"> CONFIGURATION MENU </div>
            </template>
            <template #entry-main>
                <button form="login-form" class="btn-normal" @click="toGuided">GUIDED CONFIGURATION</button>
                <button form="login-form" class="btn-normal" @click="toCustom">CUSTOM CONFIGURATION</button>
            </template>
            <template #entry-button>
                <div class="btn-wrapper">
                    <button form="login-form" class="btn-warning" @click="toMainMenu">MAIN MENU</button>
                </div>
            </template>
        </BaseEntry>

    </div>
</template>

<script>
import {storeToRefs} from 'pinia'
import {BaseEntry} from '../base'
import {useWizardStore} from '../../store/modules/WizardStore'

export default {
    components: {
        BaseEntry,
    },
    setup() {
        const wizard = useWizardStore()
        const {activeConfigType} = storeToRefs(wizard)
        return {activeConfigType}
    },
    methods: {
        toMainMenu() {
            this.$router.push('menu')
        },
        toGuided() {
            this.activeConfigType = 'Guided'
            this.$router.push('configuration')
        },
        toCustom() {
            this.activeConfigType = 'Custom'
            this.$router.push('configuration')
        },
    },
}
</script>

<style lang="scss" scoped>
    .entry-wrapper{
        height:100%;
        width:100%;
        display:flex;
        justify-content:center;
        align-items:center;
        flex-direction:column;
        box-sizing:border-box;
        position:relative;
    }

    .btn-warning{
        background-color: #ff3100;
    }
</style>
