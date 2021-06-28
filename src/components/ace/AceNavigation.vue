<template>
    <div class="ace-nav-wrapper">
        <div v-for="section in sections" v-bind:key="section" >
            <div 
                class='section' 
                @click="toggle(section)"
        >{{ formatLabel(section) }}</div>
            <div class="menu" :class="{'menu-open': isOpen[section]}" >
                <div v-for="agent in Object.keys(agentDesc[section])" v-bind:key="section+agent" class="agent-wrapper">
                    <div 
                        class="agent"
                        @click="handleAgent(section, agent)"
                        :class="{'agent-active': agent === activeAgent}"
                    >{{ formatLabel(agent) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'

export default {
    data() {
        return{
            isOpen: {},
        }
    },
    computed: {
        ...mapGetters('ace',{
            agentDesc: 'getActiveAgentDesc',
            sections: 'getSections',
            activeAgent: 'getActiveAgent'
        }),
    },
    mounted() {
        this.sections.forEach(section => {
            this.$set(this.isOpen, section, false)
        })
    },
    methods: {
        ...mapMutations('ace',['SETACTIVEAGENT', 'SETACTIVESECTION']),

        toggle: function(section) {
            this.$set(this.isOpen, section, !this.isOpen[section])
        }, 

        handleAgent: function(section, agent) {
            this.SETACTIVESECTION(section)
            this.SETACTIVEAGENT(agent)
        },

        formatLabel: function(text) {
            let words = text.split("_")
            let capitalized = words.map(w => w.charAt(0).toUpperCase() + w.slice(1))
            return capitalized.join(" ")
        }
    }
}
</script>

<style lang="scss" scoped>

    .ace-nav-wrapper {
        position: relative;
        width: 200px;
        overflow-y: auto;
        height: auto;
    }

    .section {
        // width: 100%;
        padding: 5px;
        text-align: left;
        color: #eee;
        font-size: 14pt;
        font-weight: 400;
        
        &:hover{
            cursor:pointer;
            background-color: rgba(238, 238, 238, 0.2);
        }
    }

    .menu {
        max-height: 0;
        overflow: hidden;
        transition: 0.5s ease all; 

        &-open{
            max-height: 1000px; 
            overflow: hidden;
        }
    } 

    .agent {
        // width: 100%;
        padding: 5px;
        text-align: left;
        color: #eee;
        font-size: 12pt;
        font-weight: 200;
        padding-left: 20px;
        
        &:hover{
            cursor:pointer;
            background-color: rgba(238, 238, 238, 0.2);
        }

        &-active{
            font-weight: 400px;
            background-color: rgba(238, 238, 238, 0.4);
        }
    }

</style>
