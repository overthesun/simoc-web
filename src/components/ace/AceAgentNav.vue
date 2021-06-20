<template>
    <div class='agent-nav'>
        <div v-for='agent in getAgents' :key='agent'>
            <button 
                class='btn-agent' 
                @click="handleChangeAgent(agent)"
                :class="{ 'btn-agent-active' : agent === getActiveAgent}"
            >{{ formatAgent(agent) }}</button>
        </div>
        <span title='Add New' class="fa-2x new-agent-icon">
            <fa-icon icon="plus-circle" @click="$emit('newAgent')" />
        </span>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    computed: {
        ...mapGetters('ace', ['getAgents', 'getActiveAgent'])
    },
    methods: {
        ...mapMutations('ace', ['SETACTIVEAGENT']),

        handleChangeAgent: function(agent) {
            // TODO: validate Editor, alert if non-valid changes
            this.SETACTIVEAGENT(agent)
        },

        formatAgent: function(text) {
            let split = text.split("_")
            let cased = split.map(word => word.charAt(0).toUpperCase() + word.slice(1))
            return cased.join(" ")
        }
    }
}
</script>

<style lang="scss" scoped>

    .agent-nav {
        font-family: "Roboto", sans-serif;
        font-size: 14px;
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
        // box-sizing: border-box;
    }

    .btn-agent {
        font-size: 14px;
        font-weight: 800; 
        padding: 5px 10px;
        margin: 3px 3px;
        border: none;
        border-radius: 12px;
        color: black;
        background-color: rgba(238, 238, 238, 0.6);
        box-sizing: border-box;

        &:hover{
            background-color: #eee;
            cursor: pointer;
        }

        &-active{
            background-color: lightgreen;
        }
    }

    .new-agent-icon {
        color: rgba(238, 238, 238, 0.6);
        height: 1em;
        width: 1em;
        margin-left: 5px;

        &:hover{
            color: #eee;
            cursor: pointer;
        }
    }
</style>