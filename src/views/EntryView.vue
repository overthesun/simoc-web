<!-- Container for all entry related components -->

<template>
    <div class="base-entry-wrapper">
        <router-view />
    </div>
</template>

<script>

export default {

}
</script>

<style lang="scss" scoped>
.base-entry-wrapper{
    position: relative;
    width: 95%;
    height: 95%;
    max-width: 480px;
    max-height: 600px;
    margin: 0 auto;
    background-color: #1e1e1eaa;
    border: 1px solid #666;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 16px;
}


</style>
