<!--
Menu to select between guided and custom configuration.

  THIS MENU IS CURRENTLY UNUSED.

Can be reenabled in Menu.vue if needed.
-->

<template>
    <div class="entry-wrapper">
        <BaseEntry>
            <template v-slot:option-items>
                <div class="option-item option-item-active"> CONFIGURATION MENU </div>
            </template>
            <template v-slot:entry-main>
                <button form="login-form" class="btn-normal" @click="toGuided">GUIDED CONFIGURATION</button>
                <button form="login-form" class="btn-normal" @click="toCustom">CUSTOM CONFIGURATION</button>
            </template>
            <template v-slot:entry-button>
                <div class="btn-wrapper">
                    <button form="login-form" class="btn-warning" @click="toMainMenu">MAIN MENU</button>
                </div>
            </template>
        </BaseEntry>

    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
import {BaseEntry} from '../base'

export default {
    components: {
        BaseEntry,
    },
    computed: {
        ...mapGetters('wizard', []),
    },
    methods: {
        ...mapMutations('wizard', ['SETACTIVECONFIGTYPE']),

        toMainMenu() {
            this.$router.push('menu')
        },
        toGuided() {
            this.SETACTIVECONFIGTYPE('Guided')
            this.$router.push('configuration')
        },
        toCustom() {
            this.SETACTIVECONFIGTYPE('Custom')
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
