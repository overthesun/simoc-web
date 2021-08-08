- Contains all logic for constructing and displaying modals
- Watches 'modalParams' from store/modal, uses it to show/hide relevant sections
- Manages 'modalActive' status and resets modalParams on close
- If one modal closes while another is opening, 'cleaningUp' moves opening to nextTick

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
                <div v-for="button in params.buttons" id="menu-buttons" :key="button.text">
                    <button :class="{'btn-warning': button.color === 'warning'}"
                            @click="handleClick(button.callback)">{{button.text}}</button>
                </div>
                <div v-show="params.survey">
                    <Survey :cleanup="cleanup" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Survey from './Survey'

export default {
    components: {
        Survey,
    },
    data() {
        return {
            params: {},
            cleaningUp: false,
        }
    },
    computed: {
        ...mapGetters('modal', ['getModalActive', 'getModalParams']),
    },
    watch: {
        getModalParams: {
            handler(updatedParams) {
                const setModal = newParams => {
                    this.SETMODALACTIVE(true)
                    this.params = newParams
                }
                // Let the current menu finish the cleanup() cycle before creating the new one
                if (this.cleaningUp) {
                    this.$nextTick(() => setModal(updatedParams))
                } else {
                    setModal(updatedParams)
                }
            },
            deep: true,
        },
    },
    methods: {
        ...mapMutations('modal', ['SETMODALACTIVE', 'RESETMODALPARAMS']),

        async handleClick(callback) {
            callback()
            this.cleanup()
        },

        cleanup() {
            this.SETMODALACTIVE(false)
            this.RESETMODALPARAMS()

            this.cleaningUp = true
            this.$nextTick(() => {
                this.cleaningUp = false
            })
        },
    },
}
</script>

Styling is *not* scoped, so that Survey can use the menu-button css.
<style lang="scss">

#main-menu-wrapper {
    position: absolute;
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