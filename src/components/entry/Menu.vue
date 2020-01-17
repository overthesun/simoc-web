
<!-- Menu screen presented to the user on successful login. -->

<template>
    <div class='entry-wrapper'>
        <BaseEntry>
            <template v-slot:option-items>
                <div class='option-item option-item-active'> MAIN MENU </div>
            </template>
            <template v-slot:entry-main>
                <button form='login-form' class='btn-normal' @click="toConfiguration">NEW CONFIGURATION</button>
                <button form='login-form' class='btn-normal btn-disabled'>LOAD SESSION</button>
            </template>
            <template v-slot:entry-button>
                <div class='btn-wrapper'>
                    <button form='login-form' class='btn-warning' @click="logout">Log Out</button>
                </div>
            </template>
        </BaseEntry>

    </div>
</template>

<script>
import axios from 'axios'
import {BaseEntry} from '../../components/base'
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    components:{
        'BaseEntry':BaseEntry,
    },
    methods:{
        ...mapMutations('wizard', ['SETACTIVECONFIGTYPE']),
        //Sends the user to the configuration menu screen. See router.js
        toConfiguration:function(){
            // menuconfig is currently skipped, we default on Custom config
            //this.$router.push('menuconfig')

            this.SETACTIVECONFIGTYPE('Custom')
            this.$router.push("configuration")
        },
        //Logout method called when the user hits the logout button
        //Sends the user back to the entry screen regardless if the server has successfully logged them out
        logout: async function(){
            try{
                axios.get('/logout')
            }catch(error){
                console.log(error)
            }
            this.$router.push("entry")
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
