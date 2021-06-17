<!-- Container for all ace-related components -->

<template>
    <div class='ace-wrapper'>
        <div class='ace-main'>
        <div class='ace-header'>
            <AceHeader />
        </div>
        <div class='ace-section-nav'>
            <AceSectionNav v-bind:sections="sections" />
        </div>
        <div class='ace-body'>
            <div class="ace-agent-nav">
                <AceAgentNav v-bind:agents="agents" />
            </div>
            <div class="ace-display">
                <AceDisplay />
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import {AceAgentNav,AceDisplay,AceHeader,AceSectionNav} from '../components/ace'

export default {
    components: {
        'AceAgentNav': AceAgentNav,
        'AceDisplay': AceDisplay,
        'AceHeader': AceHeader,
        'AceSectionNav': AceSectionNav
    },
    data() {
        return{
            sections: [
                'global',
                'currencies',
                'inhabitants',
                'eclss',
                'plants',
                'structure',
                'power',
                'communication',
                'storage'
            ],
            agents: [
                'Rice',
                'Wheat',
                'Cabbage',
                'Chard',
                'Celery',
                'Lettuce',
                'Spinach',
                'Dry Bean',
                'Peanut',
                'Soybean',
                'Strawberry',
                'Tomato',
                'Green Onion',
                'Onion',
                'Pea',
                'Pepper',
                'Snap Bean',
                'Radish',
                'Red Beet',
                'Carrot',
                'Sweet Potato',
                'White Potato'
            ]
        }
    },
    // created: function() {
    //     fetch('../../agent_desc.json')
    //         .then(result => result.json())
    //         .then(data => {
    //             this.sections = Object.keys(data)
    //             console.log(data)
    //         })
    // }
}
</script>

<style lang="scss" scoped>
    .ace-wrapper{
        height: 100vh;
        width: 100vw;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        align-content: flex-start;
        justify-content: start;
    }

    .ace-main{
        padding: 20px 60px;
    }

    .ace-header{
        width: 100%;
    }

    .ace-body{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .ace-agent-nav{
        width: 200px;
        border: 1px solid #eee
    }

    .ace-display{
        width: 100%;
        border: 1px solid #eee;
    }

</style>

<style lang="scss">
    .btn-normal{
        margin: 2px 4px;
        border-radius: 8px;
        padding: 4px 16px;
        font-size: 14px;
        font-weight: 600;
        background-color: #0099ee;
        border:none;
        color: #eee;

        &:hover{
            cursor: pointer;
        }

        &:focus{
            outline:none;
        }
    }

    .btn-warning{
        background-color: red;
    }

</style>