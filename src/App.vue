<template>
  <v-app>
    <v-main>
      <v-container class="bg" fluid>
        <v-responsive class="d-flex align-center text-center fill-height">
          <div class="app">
            <div class="orientation-portrait">
              <img src="./assets/orientation.svg" class="orientation-logo">
            </div>
            <div class="normal orientation-landscape">
              <ModalWindow />
              <router-view />
            </div>
          </div>
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>
import ModalWindow from '@/components/menu/ModalWindow.vue'
</script>


<style lang="scss">
/* Use Roboto for the dashboard, Open Sans for everything else */
@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i|Roboto:100,300,400,500,700,900&display=swap');

/* Use Nasalization for the logo */
@font-face {
  font-family: 'Nasalization';
  src: url('@/assets/fonts/nasalization-rg-webfont.woff') format('woff');
}

body {
  font-family: "Open Sans", sans-serif;
  padding: 0;
  margin: 0;
  // not working correctly possibly due to vuetify component
  overflow: hidden;
}

.bg {
  background: url('./assets/mars-bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: 50% 10%;
  height: auto;
}

.orientation-portrait {
  display: none;
}

.orientation-landscape {
  display: block;
}

.orientation-logo {
  width: 256px;
  height: auto;
}

.app {
  width: 100vw;
  height: 100vh;
  min-width: 600px;
  //position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
}

@media all and (orientation: portrait) {
  .orientation-portrait {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(#1e1e1e, .75);
  }

  .orientation-landscape {
    display: none;
  }
}
</style>
