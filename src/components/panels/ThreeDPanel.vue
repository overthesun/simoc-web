This component renders a 3d view of the habitat using threeJS.
ref: https://discoverthreejs.com/book/introduction/threejs-with-frameworks/

<template>
    <div id="scene-container">
        <!-- Canvas will be inserted here -->
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import World from '../../threejs/World'

export default {
    panelTitle: '3D View',
    data() {
        return {}
    },
    mounted() {
        const container = document.getElementById('scene-container');

        const world = new World(container)

        world.render()
    }
}
</script>


<style lang="scss" scoped>
#scene-container {
    max-width: 100%;
    max-height: 100%;
}
</style>
