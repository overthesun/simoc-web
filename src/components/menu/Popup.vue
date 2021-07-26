<template>
  <div v-if="getPopupActive" class="popup">
    <div id="main-menu-wrapper" />
    <div id="popup-window">
      <p id="popup-message">{{getPopupMessage}}</p>
      <div id="menu-buttons">
        <button @click="handlePrimary">Ok</button>
        <button v-if="getConfirmCallback" @click="handleSecondary"
                class="btn-warning">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  computed: {
    ...mapGetters('popup', ['getPopupActive', 'getPopupMessage', 'getConfirmCallback'])
  },
  methods: {
    ...mapMutations('popup', ['SETPOPUPACTIVE', 'SETPOPUPMESSAGE', 'SETCONFIRMCALLBACK']),
    ...mapActions('popup', ['executeCallback']),

    handlePrimary() {
      this.SETPOPUPACTIVE(false)
      if (this.getConfirmCallback) {
        this.executeCallback()
      }
      this.cleanup()
    },
    handleSecondary() {
      this.cleanup()
    },
    cleanup() {
      this.SETPOPUPACTIVE(false)
      this.SETPOPUPMESSAGE(false)
      this.SETCONFIRMCALLBACK(null)
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../sass/components/menu';

#popup {
  position: absolute;
  height: 100vh;
  width: 100vw;
}

#popup-window {
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

#popup-message {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
