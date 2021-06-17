<template>
    <div class='agent-nav'>
        <div v-for='agent in agents' :key='agent'>
            <div 
                class='btn-agent' 
                @click="handleClick(agent)"
                :class="{ 'btn-agent-active' : agent === activeAgent}"
            >{{ agent }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'agents'
    ],
    data() {
        return {
            activeAgent: ''
        }
    },
    methods: {
        handleClick: function(agent) {
            this.activeAgent = agent
            console.log(this.activeAgent)
        }
    }
}
</script>

<style lang="scss" scoped>

    .agent-nav {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .btn-container {
        margin: 0;
        padding: 0;
    }

    .btn-agent {
        padding: 6px 0;
        margin: 0; 
        width: inherit;
        text-align: center;

        &:hover{
            background-color: rgba(238, 238, 238, 0.2);
            cursor: pointer;
        }

        &-active{
            background-color: rgba(238, 238, 238, 0.4);
            font-weight: 400;
        }

        &-active:hover{
            background-color: rgba(238, 238, 238, 0.4);
            font-weight: 400;
        }
    }
</style>