<!-- This component renders a single reference 'page'
-->

<template>
    <div class="reference-item">
        <div class="reference-item-title">
            <fa-icon :icon="['fa-solid','list-ul']" title="Go to Table of Contents"
                     @click="setActiveRefEntry('Table')" /> {{heading}}
        </div>
        <slot class="reference-item-entry" />
    </div>
</template>

<script>
import {useWizardStore} from '../../store/modules/WizardStore'

export default {
    props: {
        heading: {type: String, required: true},
    },
    setup() {
        const wizard = useWizardStore()
        const {setActiveRefEntry} = wizard
        return {setActiveRefEntry}
    },
}
</script>

<style lang="scss">
</style>
