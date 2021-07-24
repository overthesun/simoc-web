<!-- Container for all ace-related components -->

<template>
    <div class="ace-wrapper">
        <TheTopBar />
        <!-- Show the ACE menu component when getMenuActive is true. -->
        <AceMenu v-if="getMenuActive" />

        <div class="ace-container">
            <header>AGENT EDITOR</header>
            <hr class="rule">
            <div class="ace-main">
                <div class="nav-container">
                    <AceNavigation />
                </div>
                <div class="editor-container">
                    <AceEditor />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {TheTopBar} from '../components/bars'
import {AceMenu, AceEditor, AceNavigation} from '../components/ace'

export default {
    components: {
        TheTopBar: TheTopBar,
        AceMenu: AceMenu,
        AceEditor: AceEditor,
        AceNavigation: AceNavigation,
    },
    computed: {
        ...mapGetters('dashboard', ['getMenuActive']),
    },
    async created() {
        axios.defaults.withCredentials = true
        const params = {agent_desc: 'default'}
        axios.get('/get_agent_desc', {params: params})
                .then(response => {
                    if (response.status === 200) {
                        this.SETAGENTDESC({
                            agent_desc: response.data.agent_desc,
                            isDefault: true,
                        })
                        this.SETAGENTSCHEMA(response.data.agent_schema)
                    }
                }).catch(error => {
                    console.log(error)
                })
    },
    methods: {
        ...mapMutations('ace', ['SETAGENTDESC', 'SETAGENTSCHEMA']),
    },
}
</script>

<style lang="scss" scoped>
.ace-wrapper {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: flex-start;
}

.ace-container {
    position: relative;
    height: 80vh;
    width: 80vw;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: auto;
    padding: 16px;
    box-sizing: border-box;
    background-color: #1e1e1eaa;
    border: 1px solid #666;
    border-radius: 5px;
}

header {
    font-family: "Nasalization", "Open Sans", sans-serif;
    font-weight: 200;
    font-size: 22px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    box-sizing: border-box;
}

.rule {
    margin-top: 8px;
    width: 100%;
    color: #999;
}

.ace-main {
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
}

.nav-container {
    width: 200px;
    min-height: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}

.editor-container {
    margin-left: 16px;
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
    overflow-y :auto;
}
</style>
