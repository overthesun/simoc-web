<template>
    <button class='btn-logout' @click="logout">Log Out</button>
</template>

<script>
import axios from 'axios'

export default {
    methods: {
        logout: async function() {
            if (!confirm('Do you want to log out?')) {
                return;
            }
            try {
                axios.get('/logout')
            } catch(error) {
                console.log(error)
            }
            this.$router.push("entry")
        },
    }
}
</script>

<style lang="scss">

</style>
