<template>
    <div v-if="getModalActive" class="modal">
        <div id="main-menu-wrapper" />
        <div id="modal-window">
            <p id="modal-message">{{getModalMessage}}</p>
            <div id="menu-buttons">
                <button @click="handlePrimary">Ok</button>
                <button v-if="getConfirmCallback" class="btn-warning"
                        @click="handleSecondary">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    computed: {
        ...mapGetters('modal', ['getModalActive', 'getModalMessage', 'getConfirmCallback']),
    },
    methods: {
        ...mapMutations('modal', ['SETMODALACTIVE', 'SETMODALMESSAGE', 'SETCONFIRMCALLBACK']),
        ...mapActions('modal', ['executeCallback']),

        handlePrimary() {
            this.SETMODALACTIVE(false)
            if (this.getConfirmCallback) {
                this.executeCallback()
            }
            this.cleanup()
        },
        handleSecondary() {
            this.cleanup()
        },
        cleanup() {
            this.SETMODALACTIVE(false)
            this.SETMODALMESSAGE(false)
            this.SETCONFIRMCALLBACK(null)
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
