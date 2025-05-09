<!-- Component to house a live-rendered 3d layout of the current configuration
-->

<template>
    <World :game-config="configuration" :is-active="active" />
</template>

<script>
import {storeToRefs} from 'pinia'
import {useWizardStore} from '../../store/modules/WizardStore'
import World from '@/threejs/World.vue'

export default {
    components: {
        World,
    },
    setup() {
        const wizard = useWizardStore()
        const {configuration, activeReference} = storeToRefs(wizard)
        return {configuration, activeReference}
    },
    data() {
        return {
            active: true,
        }
    },
    watch: {
        activeReference(newRef, oldRef) {
            this.active = (newRef === 'Layout')
        },
    },
}

</script>

<style lang="scss" scoped>

</style>
