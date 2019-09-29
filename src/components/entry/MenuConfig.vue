<!-- Component used to display the configuration menu, after the user initially logs in -->

<template>
    <div class='entry-wrapper'>
        <BaseEntry>
            <template v-slot:option-items>
                <div class='option-item option-item-active'> CONFIGURATION MENU </div>
            </template>
            <template v-slot:entry-main>
                <button form='login-form' class='btn-normal' @click="toGuided">GUIDED CONFIGURATION</button>
                <button form='login-form' class='btn-normal' @click="toExpert">EXPERT CONFIGURATION</button>
            </template>
            <template v-slot:entry-button>
                <div class='btn-wrapper'>
                    <button form='login-form' class='btn-warning' @click="toMainMenu">MAIN MENU</button>
                </div>
            </template>
        </BaseEntry>

    </div>
</template>

<script>
import {BaseEntry} from '../../components/base'
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    components:{
        'BaseEntry':BaseEntry,
    },
    computed:{
        ...mapGetters('wizard', [])
    },
    methods:{
        ...mapMutations('wizard', ['SETACTIVECONFIGTYPE']),

        toMainMenu:function(){
            this.$router.push("menu")
        },
        toGuided:function(){
            this.SETACTIVECONFIGTYPE('Guided')
            this.$router.push("configuration")
        },
        toExpert:function(){
            this.SETACTIVECONFIGTYPE('Expert')
            this.$router.push("configuration")

        }
    }
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
