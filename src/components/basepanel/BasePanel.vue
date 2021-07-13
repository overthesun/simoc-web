<template v-slot:panel-content>
    <div class="panel">
        <header class="panel-header">
            <slot name="panel-title"></slot>
            <slot name="panel-menu"></slot>
        </header>
        <slot name="panel-content"></slot>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
export default {
    data() {
        return {

        }
    },
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

.panel select {
    color: #eee;
    background-color: transparent;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 3px;
    margin: auto;
    /* see https://github.com/filamentgroup/select-css/blob/master/src/select-css.css */
    appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23EEEEEE%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, transparent 0%, transparent 100%);
    background-repeat: no-repeat, repeat;
    background-position: right .7em top 50%, 0 0;
    background-size: .65em auto, 100%;
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
