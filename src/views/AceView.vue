<!-- Container for all ace-related components -->

<template>
    <div class='ace-wrapper'>
        <TheTopBar />
        <!-- Show the ACE menu component when getMenuActive is true. -->
        <AceMenu v-if="getMenuActive" />

        <div class='ace-main'>
            <header>ADVANCED CONFIGURATION EDITOR</header> 
            <hr class="rule">
            <AceSectionNav />
            <AceAgentNav />
            <hr class="rule">

            <AceEditor />
        </div>
    </div>
</template>

<script>
import {TheTopBar} from '../components/bars'
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {AceMenu,AceAgentNav,AceEditor,AceHeader,AceSectionNav} from '../components/ace'
import defaultAgentDesc from '../../agent_desc.json'

export default {
    components: {
        'TheTopBar': TheTopBar,
        'AceMenu': AceMenu,
        'AceAgentNav': AceAgentNav,
        'AceEditor': AceEditor,
        'AceSectionNav': AceSectionNav,
    },
    created() {
        this.SETAGENTDESC({
            agent_desc: defaultAgentDesc,
            def: true
        })
    },
    computed: {
        ...mapGetters('dashboard', ['getMenuActive']),
    },
    methods: {
        ...mapMutations('ace', ['SETAGENTDESC']),
    },
};
</script>

<style lang="scss" scoped>

    .ace-wrapper{
        min-height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-content: flex-start;
        justify-content: flex-start;
    }

    .ace-main{
        // Copied '.configuration-wrapper' from BaseConfiguration.vue
        position: relative;
        height: 100%;
        width: 80vw;
        max-width: 1200px;
        margin: auto;
        margin-top: 20px;
        // display: grid;
        // grid-template-columns: 50% 50%;
        // grid-template-rows: minmax(0,1fr);
        box-sizing: border-box;
        background-color: #1e1e1eaa;
        border: 1px solid #666;
        border-radius: 5px;

        // Added for ACE
        padding:16px;
    }

    // Copied from BaseConfiguration.vue
    header {
        font-family: "Nasalization", "Open Sans", sans-serif;
        font-weight: 200;
        font-size: 22px;
        display:flex;
        justify-content:flex-start;
        align-items:center;
        position:relative;

        //Added for ACE
        height: auto;

    }

    // .rule {
    //     margin-top: 8px;
    //     color: #999
    // }

    // .ace-body{
    //     display: flex;
    //     flex-direction: row;
    //     justify-content: flex-start;
    // }

    // .ace-agent-nav{
    //     width: 200px;
    //     border: 1px solid #eee
    // }

    // .ace-display{
    //     width: 100%;
    //     border: 1px solid #eee;
    // }

</style>