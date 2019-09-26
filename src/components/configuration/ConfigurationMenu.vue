<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Configuration Menu
        </template>
        <template v-slot:menu-buttons>
            <button class='btn-disabled'>Download Configuration</button>
            <button class='btn-disabled'>Save Configuration</button>
            <button class='btn-disabled'>Load Configuration</button>
            <button class='btn-outline-warning btn-disabled'>Reset To Default</button>
            <button class='btn-logout' @click="logout">Log Out</button>
        </template>
    </BaseMenu>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {BaseMenu} from '../../components/base'

export default {
    components: {
       'BaseMenu': BaseMenu,
    },
    methods: {
        logout: async function(){
            if (!confirm('Do you want to log out?')) {
                return;
            }
            try {
                axios.get('/logout')
            } catch(error) {
                console.log(error)
            }
            this.$router.push("entry")
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
