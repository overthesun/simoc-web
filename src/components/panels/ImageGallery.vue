<template>
    <div id="image-wrapper">
        <img src="../../assets/images/biosphere-00.jpg">
    </div>
</template>

<script>
export default {
    panelTitle: 'Images',
    modes: ['sim:b2'],
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
