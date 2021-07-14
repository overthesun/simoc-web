<template>
    <button @click="logout" class="btn-logout">Log Out</button>
</template>

<script>
import axios from 'axios'

export default {
    methods: {
        async logout() {
            if (!window.confirm('Do you want to log out?')) {
                return
            }
            try {
                axios.get('/logout')
            } catch (error) {
                console.log(error)
            }
            this.$router.push('entry')
        },
    },
}
</script>

<style lang="scss">

</style>
