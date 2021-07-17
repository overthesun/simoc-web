<!-- Component to house a live-rendered 3d layout of the current configuration
-->

<template>
    <World :gameConfig="getConfiguration" />
</template>

<script>
import {GreenhouseConfig, PowerUsage} from '../graphs'
import {mapGetters} from 'vuex'
import World from '../../threejs/World'

export default {
    components: {
        World,
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),
    },
}

</script>

<style lang="scss" scoped>

</style>
