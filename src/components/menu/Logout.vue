<template>
    <button class="btn-logout" @click="logout">Log Out</button>
</template>

<script>
import axios from 'axios'
import {useModalStore} from '../../store/modules/ModalStore'

export default {
    setup() {
        const modal = useModalStore()
        const {confirm} = modal
        return {confirm}
    },
    methods: {
        async logout() {
            this.confirm({
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
