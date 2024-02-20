<template>
    <v-app>
        <v-main class="bg">
            <div class="app">
                <div class="orientation-portrait">
                    <img src="./assets/orientation.svg" class="orientation-logo">
                </div>
                <div class="normal orientation-landscape">
                    <ModalWindow />
                    <router-view />
                </div>
            </div>
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
  @font-face{
      font-family:'Nasalization';
      src: url('@/assets/fonts/nasalization-rg-webfont.woff') format('woff');
  }

  html {
    overflow-y: auto
  }

 .bg {
    background: url('./assets/mars-bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: 50% 10%;
    background-color: #1e1e1e;
  }

  .orientation-portrait{
    display:none;
  }

  .orientation-landscape{
    display:block;
  }

  .orientation-logo{
    width: 256px;
    height: auto;
  }

   .app{
    width: 100vw;
    height: 100vh;
    min-width: 600px;
    //position: relative;

    display:flex;
    justify-content:center;
    align-items:center;
  }

  .v-application {
    font-family: "Open Sans", sans-serif !important;
  }

  .v-btn.v-btn--menu {
    font-family: sans-serif !important;
    cursor: pointer;
    margin-bottom: 12px;
}

   @media all and (orientation: portrait){
    .orientation-portrait{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: rgba(#1e1e1e,.75);
    }

    .orientation-landscape{
      display:none;
    }
  }

</style>
