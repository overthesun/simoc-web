<template>
    <World :game-config="getConfiguration" :is-active="true" />
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import World from '@/threejs/World.vue'

export default {
    panelTitle: 'Habitat View',
    modes: ['sim'],
    components: {
        World: World,
    },
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),
    },
}
</script>

<style lang="scss" scoped>

</style>
