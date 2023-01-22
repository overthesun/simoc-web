<!-- This component renders a single reference 'page'
-->

<template>
    <div class="reference-item">
        <div class="reference-item-title">
            <fa-icon :icon="['fa-solid','list-ul']" title="Go to Table of Contents"
                        @click="setActiveRefEntry('Table')" /> {{heading}}
        </div>
        <slot class="reference-item-entry"></slot>
    </div>
</template>

<script>

export default {
    props: {
        setActiveRefEntry: {type: Function, required: true},
        heading: {type: String, required: true},
    }
}
</script>

<style lang="scss">
</style>
