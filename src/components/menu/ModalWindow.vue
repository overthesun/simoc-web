This component is to show various popups and menus 'in front of' the app.

These were formerly different components in each section (config, dashboard, ace),
and it was thought simpler to have just a single component, and share functions
to activate and populate it.

<template>
    <div v-if="getModalActive" id="main-menu-wrapper" @click.self="cleanup">
        <div id="menu-wrapper">
            <header v-show="params.logo">
                <img src="../../assets/simoc-logo.svg" class="simoc-logo">
                <span class="simoc-logo-title">SIMOC</span>
            </header>
            <div v-show="params.title" id="menu-title">{{params.title}}</div>
            <div id="menu-content">
                <p v-show="params.message" id="modal-message">{{params.message}}</p>
                <div id="menu-buttons" :class="{'buttons-horiz': params.type === 'confirm'}">
                    <button
                        v-for="button in params.buttons"
                        :key="button.text"
                        :class="{'btn-warning': button.type === 'warning'}"
                        @click="handleClick(button.callback)">
                        {{button.text}}
                    </button>
                </div>
                <p v-show="getTime + 1" id="modal-time">
                    {{getTime > 0 ? getTime : "Mission terminated."}}
                </p>
                <!-- TODO: Use an slot instead, share with other non-standard modals -->
                <div v-show="params.survey">
                    <Survey :cleanup="cleanup" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Survey from './Survey.vue'

export default {
    components: {
        Survey,
    },
    data() {
        return {
            // Copied from store/modal by watcher below. Used to generate modal layout.
            params: {},
        }
    },
    computed: {
        ...mapGetters('modal', ['getModalActive', 'getModalParams', 'getTime']),
    },
    watch: {
        // Watch params in store/modal, use to show/hide the menu and determine layout
        getModalParams: {
            handler(updatedParams) {
                const setModal = newParams => {
                    this.SETMODALACTIVE(true)
                    this.params = newParams
                }
                // If modal is active, let it finish the cleanup() cycle before creating the new one
                this.$nextTick(() => setModal(updatedParams))

                if (this.getModalParams.type === 'timeout') {
                    this.STARTTIMER()
                }
            },
            deep: true,
        },
    },
    methods: {
        ...mapMutations('modal', ['SETMODALACTIVE', 'RESETMODALPARAMS', 'STARTTIMER']),

        async handleClick(callback) {
            callback()
            this.cleanup()
        },

        cleanup() {
            if (this.params.onUnload) {
                this.params.onUnload()
            }
            this.SETMODALACTIVE(false)
            this.RESETMODALPARAMS()
        },
    },
}
</script>

Styling is *not* scoped, so that Survey can use the menu-button css.
<style lang="scss">

#main-menu-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 200;
    height: 100vh;
    width: 100vw;
    background-color: rgba(#999,.55);
    display: flex;
    justify-content: center;
    align-items: center;
}

#menu-wrapper {
    width: 480px;
    min-height: 150px;
    max-height: 90vh;
    background-color: #1e1e1e;
    border-radius: 5px;
    z-index: 1000;
    padding: 16px 8px 32px 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

#menu-wrapper header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
}

#menu-wrapper .simoc-logo {
    width: auto;
    height: 48px;
    margin-right: 8px;
}

#menu-wrapper .simoc-logo-title {
    font-family: "Nasalization", "Open Sans", sans-serif;
    font-weight: 400;
    font-size: 22px;
}

#menu-title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px 16px;
    margin-bottom: 48px;
    box-sizing: border-box;
    font-weight: 600;
    font-size: 24px;
    position: relative;
    &:after {
        box-sizing: border-box;
        position: absolute;
        left: 0;
        right: 0;
        top: 100%;
        content: "";
        border-bottom: 2px solid lightgreen;
        transition: width .2s ease;
        width: 100%;
    }
}

#menu-content {
    text-align: center;
    padding: 0 16px;
    overflow: auto;
}

#menu-buttons {
    display: flex;
    justify-content: flex-start;;
    align-items: center;
    flex-direction: column;
}

#menu-buttons.buttons-horiz {
    flex-direction: row;
    justify-content: center;
}

#menu-buttons button {
    width: 256px;
    height: 48px;
    min-height: 48px;
    margin-bottom: 12px;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 600;
    background-color: #0099ee;
    border: none;
    color: #eee;
    &:hover {
        cursor: pointer;
    }
    &:focus {
        outline: none;
    }
}

#menu-buttons.buttons-horiz button {
    width: 128px;
    margin-left: 10px;
    margin-right: 10px;
}

#menu-buttons .btn-logout {
    color: #eee;
    background-color: #ff3100;
    border: none;
    margin-top: 24px;
}

#menu-buttons .btn-warning {
    color: #eee;
    background-color: #ff3100;
    border: none;
}

</style>
