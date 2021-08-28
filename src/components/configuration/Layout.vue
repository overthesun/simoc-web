<!-- Component to house a live-rendered 3d layout of the current configuration
-->

<template>
    <p>Layout</p>
</template>
    <World :game-config="getConfiguration" :is-active="active" />

<script>
import {mapGetters} from 'vuex'
// import World from '../../threejs/World'

export default {
    // components: {
    //     World,
    // },
    data() {
        return {
            active: true,
        }
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration', 'getActiveReference']),
    },
    watch: {
        getActiveReference(newRef, oldRef) {
            this.active = (newRef === 'Layout')
        },
    },
}

</script>

<style lang="scss" scoped>

</style>
