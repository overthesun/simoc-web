<template>
    <World :game-config="configuration" :is-active="true" />
</template>

<script>
import {storeToRefs} from 'pinia'
import World from '@/threejs/World.vue'
import {useWizardStore} from '../../store/modules/WizardStore'

export default {
    panelTitle: 'Habitat View',
    modes: ['sim', 'kiosk'],
    components: {
        World: World,
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
