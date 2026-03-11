<template>
    <v-app>
        <v-main class="bg">
            <div class="app">
                <ModalWindow />
                <router-view />
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

  body{
    padding: 0px;
    margin: 0px;
    overflow: hidden;
  }

 .bg {
    background: url('./assets/mars-bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: 50% 10%;
    background-color: #1e1e1e;
  }


  .app {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .v-application {
    font-family: "Open Sans", sans-serif !important;
  }

  .v-btn.v-btn--menu {
    font-family: sans-serif !important;
    cursor: pointer;
  }


</style>
