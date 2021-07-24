<!-- Component to house a live-rendered 3d layout of the current configuration
-->

<template>
    <World :game-config="getConfiguration" :is-active="active" />
</template>

<script>
import {mapGetters} from 'vuex'
import {GreenhouseConfig, PowerUsage} from '../graphs'
import World from '../../threejs/World'

export default {
    components: {
        World,
    },
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
