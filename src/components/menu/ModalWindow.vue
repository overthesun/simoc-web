<template>
    <div v-if="getModalActive" class="modal">
        <div id="main-menu-wrapper" />
        <div id="modal-window">
            <header v-show="params.logo">
                <img src="../../assets/simoc-logo.svg" class="simoc-logo">
                <span class="simoc-logo-title">SIMOC</span>
            </header>
            <div v-show="params.title" id="menu-title">{{params.title}}</div>
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
        }
    },
    computed: {
        ...mapGetters('modal', ['getModalActive', 'getModalParams']),
    },
    watch: {
        getModalParams: {
            handler(newParams) {
                this.SETMODALACTIVE(true)
                this.params = newParams
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
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../sass/components/menu';

#modal {
  position: absolute;
  height: 100vh;
  width: 100vw;
}

#modal-window {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  min-height: 150px;
  margin-left: -150px;
  margin-top: -75px;
  background-color: #1e1e1e;
  border-radius: 5px;
  z-index: 1000;
  padding: 16px;
  box-sizing: border-box;
}

#modal-message {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
