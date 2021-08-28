<template>
    <p>ThreeD</p>
</template>
    <World :game-config="getConfiguration" :is-active="true" />

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
// import World from '../../threejs/World'

export default {
    panelTitle: 'Habitat View',
    // components: {
    //     World: World,
    // },
    computed: {
        ...mapGetters('wizard', ['getConfiguration']),
    },
}
</script>

<style lang="scss" scoped>

</style>
