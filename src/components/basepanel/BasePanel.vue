<template v-slot:panel-content>
    <div class='panel'>
        <header class='panel-header'>
            <slot name='panel-title'></slot>
            <slot name='panel-menu'></slot>
        </header>
        <slot name='panel-content'></slot>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'
export default {
    data(){
        return{

        }
    }
}
</script>

<style lang="scss">

.panel-dl-wrapper {
    overflow-y: auto;
}
.panel-dl-wrapper dl {
    display: grid;
    grid-template-columns: auto auto;
    grid-auto-rows: 25px;
    align-items: end;
    margin: 0;
}

.panel-dl-wrapper dt,
.panel-dl-wrapper dd {
    padding: 2px;
}

.panel-dl-wrapper dt {
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.panel-dl-wrapper dd {
    text-indent: 0;
    text-align: right;
}



.panel {
    background-color: #1e1e1eaa;
    border: 1px solid #666;
    box-shadow: 5px 5px 5px #333c;
    border-radius: 5px;
    min-height: 17em;
    display: grid;
    grid-template-rows: 26px 1fr;
    grid-row-gap: 16px;
    padding: 8px;
}

.panel-header {
    font-family: 'Nasalization', "Open Sans", sans-serif;
    margin: 0;
    border-bottom: 1px solid #999;
    font-size: 16px;
    font-weight: 300;
    display:grid;
    /* maybe using a single grid layout for
        title/icon/content would be better */
    grid-template-columns: 1fr 26px;
}

    .panel-select{
        margin-left:auto;
    }

    .panel-graph {
        position:relative;
        /* see https://github.com/chartjs/Chart.js/issues/4156#issuecomment-295180128 */
        min-width: 0;
        min-height: 0;
    }

    .panel-graph-gauge{
        display:grid;
        grid-template-columns: repeat(3,1fr);
        grid-template-rows: repeat(2,1fr);
        grid-row-gap: 16px;
        grid-column-gap: 16px;
    }

    .two-line-wrapper{
        display:grid;
        grid-template-columns: 1.5fr 1fr;
        grid-template-rows: repeat(auto-fill,32px);
    }

    .line-item,.line-title{
        margin:auto 0px;
    }

    .line-title{
        font-size: 14px;
        font-weight: 200;
    }

    .line-item{
        font-size: 18px;
        font-weight: 600;
    }




    .section-title{
        font-size: 14px;
        text-decoration: underline;
        font-weight: 200;
    }

    .gauge-wrapper{
        display:grid;
        grid-template-rows: minmax(0px,1fr) 24px;
        grid-row-gap: 8px;
        text-align:center;
    }

    .gauge-text{
        font-size:16px;
        font-weight: 400;
    }
</style>
