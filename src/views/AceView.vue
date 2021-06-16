<!-- Container for all ace-related components -->

<template>
    <div class='ace-wrapper'>
        <div class='ace-main'>
        <div class='ace-header'>
            <AceHeader />
        </div>
        <div class='ace-section-nav'>
            <AceSectionNav />
        </div>
        <div class='ace-body'>
            <div class="ace-agent-nav">
                <AceAgentNav />
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
    }
}
</script>

<style lang="scss" scoped>
    .ace-wrapper{
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-content: flex-start;
        justify-content: start;
    }

    .ace-main{
        padding: 20px;
    }

    .ace-header{
        width: 100%;
        border: 1px solid #eee
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
