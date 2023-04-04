<!-- Container for all entry related components -->

<template>
    <v-card class="base-entry-wrapper">
        <router-view />
    </v-card>
</template>

<script>

export default {

}
</script>

<style lang="scss" scoped>
.base-entry-wrapper{
    position:relative;
    width: 480px;
    height: 600px;
    max-height: 600px;
    border: 1px solid #666;
    box-sizing:border-box;
    padding: 16px;

    overflow:hidden;
}

</style>
