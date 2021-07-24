This component renders a 3d view of the habitat using threeJS.
ref: https://discoverthreejs.com/book/introduction/threejs-with-frameworks/

<template>
    <World :game-config="getConfiguration" :is-active="true"/>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import World from '../../threejs/World.vue'

export default {
    panelTitle: '3D View',
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
