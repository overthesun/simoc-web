<!-- Base menu component -->

<template>
    <div id='main-menu-wrapper' @click="closeMenu">
        <div id='menu-wrapper'>
            <header>
                <img src='../../assets/simoc-logo.svg' class='simoc-logo'/>
                <span class='simoc-logo-title'>SIMOC</span>
            </header>
            <div id='menu-title'>
                <slot name='menu-title' />
            </div>
            <div id='menu-buttons'>
                <slot name='menu-buttons' />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {mapState,mapGetters,mapMutations} from 'vuex'
export default {
    methods: {
        // TODO this should be moved out of the dashboard store
        ...mapMutations('dashboard', ['SETMENUACTIVE']),
        closeMenu: function() {
            // if the other menus want to perform additional
            // actions they can use beforeDestroy
            this.SETMENUACTIVE(false)
        },
    }
}
</script>

<style lang="scss" scoped>
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
    height: 600px;
    max-height: 600px;
    background-color: #1e1e1e;
    border-radius: 5px;
    z-index: 1000;
    padding: 16px;
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

#menu-buttons .btn-disabled {
    color: #999 !important;
    background-color: transparent;
    border: 1px solid #999;
    &:hover {
        cursor: not-allowed !important;
    }
}

#menu-buttons .btn-outline-warning {
    color: #eee;
    background-color: transparent;
    border: 2px solid #ff3100;
}

#menu-buttons .btn-logout {
    color: #eee;
    background-color: #ff3100;
    border: none;
    margin-top: 24px;
}

</style>
