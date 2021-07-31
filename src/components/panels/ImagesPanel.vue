<template>
    <div id="image-wrapper">
        <img src="../../assets/images/simoc-00.jpg">
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    panelTitle: 'Habitat View (Old)',
    data() {
        return {}
    },
    computed: {},
    methods: {},
}
</script>


<style lang="scss" scoped>
#image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
#image-wrapper img {
    max-width: 100%;
}
</style>
