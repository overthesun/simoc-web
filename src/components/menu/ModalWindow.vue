<template>
    <div v-if="getModalActive" class="modal">
        <div id="main-menu-wrapper" />
        <div id="modal-window">
            <p v-show="message !== ''" id="modal-message">{{message}}</p>
            <div v-for="button in buttons" id="menu-buttons" :key="button.text">
                <button :class="{'btn-warning': button.color === 'warning'}"
                        @click="handleClick(button.callback)">{{button.text}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    data() {
        return {
            logo: false,
            title: '',
            message: '',
            survey: false,
            join: false,
            buttons: [],
            onLoad: null,
            onUnload: null,
        }
    },
    computed: {
        ...mapGetters('modal', ['getModalActive', 'getModalParams']),
    },
    watch: {
        getModalParams(newParams) {
            this.SETMODALACTIVE(true)
            Object.keys(newParams).forEach(param => {
                this[param] = newParams[param]
            })
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
