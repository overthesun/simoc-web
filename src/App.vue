<template>
    <div id="app" class="app">
        <div class="orientation-portrait">
            <img src="./assets/orientation.svg" class="orientation-logo"/>
        </div>
        <div class="normal orientation-landscape">
            <router-view />
        </div>
    </div>
</template>


<script>
export default {

}
</script>


<style lang="scss">
  /* Use Roboto for the dashboard, Open Sans for everything else */
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i|Roboto:100,300,400,500,700,900&display=swap');
  /* Use Nasalization for the logo */
  @font-face{
      font-family:'Nasalization';
      src: url('~@/assets/fonts/nasalization-rg-webfont.woff') format('woff');
  }
  body{
    font-family: "Open Sans", sans-serif;
    padding: 0px;
    margin: 0px;
    background-image:url('./assets/mars-bg.jpg');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: 50% 10%;
    background-color: #1e1e1e;
    color: #eee;
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
