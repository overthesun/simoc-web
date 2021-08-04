<template>
    <button class="btn-logout" @click="logout">Log Out</button>
</template>

<script>
import axios from 'axios'
import {mapActions} from 'vuex'

export default {
    methods: {
        ...mapActions('modal', ['modalConfirm']),

        async logout() {
            this.modalConfirm({
                message: 'Do you want to log out?',
                confirmCallback: () => {
                    try {
                        axios.get('/logout')
                    } catch (error) {
                        console.log(error)
                    }
                    this.$router.push('entry')
                },
            })
        },
    },
}
</script>

<style lang="scss">

</style>
