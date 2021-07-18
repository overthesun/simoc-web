<!-- Component to house a live-rendered 3d layout of the current configuration
-->

<template>
    <World :gameConfig="getConfiguration" :isActive="active"/>
</template>

<script>
import {GreenhouseConfig, PowerUsage} from '../graphs'
import {mapGetters} from 'vuex'
import World from '../../threejs/World'

export default {
    data() {
        return {
            active: true
        }
    },
    components: {
        World,
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration', 'getActiveReference']),
    },
    watch: {
        getActiveReference(newRef, oldRef) {
            this.active = (newRef === 'Layout') ? true : false
        }
    }
}

</script>

<style lang="scss" scoped>

</style>
