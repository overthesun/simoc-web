<template>
    <div class="menu">
        <div v-for="section in sections" v-bind:key="section">
            <div class='section option-item'>{{ section }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sections: [
                'GLOBAL',
                'CURRENCIES',
                'INHABITANTS',
                'ECLSS',
                'PLANTS',
                'STRUCTURE',
                'POWER',
                'COMMUNICATION',
                'STORAGE'
            ]
        }
    }
}
</script>

<style lang="scss" scoped>

    .menu {
        display: flex;
        flex-flow: row wrap;
        width: 100%;
    }

    .section {
        padding: 10px 30px;
        font-size: 20px;
    }

    // Copied from BaseConfiguration.vue
    .option-item {
        position:relative;

        &:hover{
            cursor:pointer;
        }

        &:after{
            box-sizing:border-box;
            position:absolute;
            right:0;
            top:100%;
            content:"";
            width:0;
            border-bottom: 2px solid lightgreen;
            transition: width .2s ease;
        }

        &-active:after{
            width:100%;
            left:0;
        }

        &-disabled{
            color:#999;
        }
    }
</style>