<template>
    <World :game-config="configuration" :is-active="true" :fullscreen="fullscreen" />
</template>

<script>
import {storeToRefs} from 'pinia'
import {useWizardStore} from '../../store/modules/WizardStore'
import World from '@/threejs/World.vue'

export default {
    panelTitle: 'Habitat View',
    modes: ['sim:mars'],
    components: {
        World: World,
    },
    props: {
        fullscreen: {type: Boolean, default: true},
    },
    setup() {
        const wizard = useWizardStore()
        const {configuration} = storeToRefs(wizard)
        return {configuration}
    },
}
</script>

<style lang="scss" scoped>

</style>
