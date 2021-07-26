<template>
  <div v-if="getPopupActive" class="popup">
    <div id="popupShadow" />
    <div id="popupWindow">
      <p>{{getPopupMessage}}</p>
      <button @click="handlePrimary">Ok</button>
      <button :v-if="getConfirmCallback" @click="handleSecondary">Cancel</button>
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
<style scoped>
#popup {
  position: absolute;
  height: 100vh;
  width: 100vw;
}

#popupShadow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(100, 100, 100, 0.4);
  z-index: 1001;
}

#popupWindow {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 100px;
  margin-top: -50px;
  width: 200px;
  margin-left: -100px;
  background-color: white;
  z-index: 1002
}
</style>
