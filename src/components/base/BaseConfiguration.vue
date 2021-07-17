<!--
This component is the base component for creating the configuration wizard view. The slots within are
used to populate the various sections with the approriate component passed in via the 'ConfigurationView' component.<template>
The plan was that by configuring the base component in this way that the layout could be used for future features such as
payload creator, greenhouse editor, etc for within the dashboard. With a fimiliar layout, and only the need to populate the slots with the
approriate filler. A number of modifications would be needed to modify things like the title, and the configuration
menu button being present on other unrelated configurations.
 -->

<template>
    <div class='configuration-wrapper' >
        <!-- The form side of the wizard screen -->
        <section class='wizard-wrapper' :class="{'no-form-select-dropdown': getActiveConfigType === 'Custom'}">
            <header>SIMULATION CONFIGURATION</header>
            <!-- Dropdown used to select sections, only available in Guided Configuration -->
            <nav v-if="getActiveConfigType === 'Guided'" class='navigation-wrapper'>
                <slot name='navigation-section-select'></slot>
            </nav>
            <main class='main main-wizard'>
                <slot name='main-wizard-input'></slot>
            </main>
            <footer class='footer'>
                <slot name='wizard-configuration-footer'></slot>
            </footer>
        </section>
        <!-- The reference side of the wizard screen -->
        <section class='reference-wrapper'>
            <header>REFERENCE</header>
            <!-- This is the navigation section at the top of the wizard reference. class-binding to a universal variable is used to dictate which one is set to active.
                The universal variable is used so that things like the wizard form headers can be used to set what the active section is. Such as clicking a title and
                the approriate reference entry appearing on the right side.
            -->
            <nav class='configuration-options reference-options'>
                <div class='option-item' @click="SETACTIVEREFERENCE('Reference')" :class="{'option-item-active' : 'Reference'===activeOption}">REFERENCE</div>
                <!--<div class='option-item' @click="SETACTIVEREFERENCE('Recommended')" :class="{'option-item-active' : 'Recommended'===activeOption}">RECOMMENDED</div> Enabled Once Recommended Is Completed
                <div class='option-item option-item-disabled'>RECOMMENDED</div>-->
                <div class='option-item' @click="SETACTIVEREFERENCE('Graphs')" :class="{'option-item-active' : 'Graphs'===activeOption}">GRAPHS</div>
                <div class='option-item' @click="SETACTIVEREFERENCE('Layout')" :class="{'option-item-active' : 'Layout'===activeOption}">LAYOUT</div>
            </nav>
            <main class='main main-reference'>
                <slot name='main-wizard-reference'></slot>
            </main>
            <footer class='footer'>
                <slot name='footer-wizard-reference'></slot>
            </footer>
        </section>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations} from 'vuex'
export default {
    computed:{
        ...mapGetters('wizard',['getActiveConfigType','getActiveReference']),

        // used to flag which section link is active within the reference navigation
        // uses class-binding to activate the class and underline the title
        activeOption:function(){
            return this.getActiveReference
        }
    },
    methods:{
        ...mapMutations('wizard',['SETACTIVEREFERENCE']),
    }
}
</script>

<style lang="scss" scoped>
.configuration-wrapper {
    position: relative;
    height: 80vh;
    width: 80vw;
    max-width: 1200px;
    margin: auto;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: minmax(0,1fr);
    box-sizing: border-box;
    background-color: #1e1e1eaa;
    border: 1px solid #666;
    border-radius: 5px;
}

    .wizard-wrapper{
        height:100%;
        width:100%;
        padding:16px;
        border-right: 1px solid #666;
        box-sizing:border-box;
    }

    .wizard-wrapper,.reference-wrapper{
        display:grid;
        grid-template-rows: 22px 32px minmax(0,1fr) 48px;
        grid-row-gap: 32px;
    }

    /* omit the form select dropdown from the Custom config grid template */
    .wizard-wrapper.no-form-select-dropdown{
        grid-template-rows: 22px minmax(0,1fr) 48px;
    }

    .main-reference{
        width: 100%;
        overflow: hidden;
    }

    .reference-wrapper{
        height:100%;
        max-width: 100%;
        padding:16px;
        box-sizing:border-box;
        overflow: hidden;
    }

    header {
        font-family: "Nasalization", "Open Sans", sans-serif;
        font-weight: 200;
        font-size: 22px;
        display:flex;
        justify-content:flex-start;
        align-items:center;
        position:relative;

       &:after{
            position:absolute;
            content:"";
            display:block;
            width:100%;
            border-bottom:2px solid #999;
            left:0;
            top:100%;
            margin-top:16px;
        }
    }

    .section-select{
        border:none;
        background:transparent;
        color: #eee;
        width:auto;
        height:100%;
        //padding:2px 4px;
        font-size:24px;
        font-weight:600;
        position:relative;
        //text-decoration: underline;
        //text-decoration-color: lightgreen;

        &:hover{
            cursor:pointer;
        }

        &:focus{
            outline:none;
        }

        option{
            font-size: 16px;
            color:#1e1e1e;
        }
    }

    .configuration-options{
        width:100%;
        display:flex;
        /* use this when Recommended is restored
        justify-content:space-between;*/
        justify-content: space-evenly;
        align-items:center;
        font-size:24px;
        font-weight:600;
    }

    .main-wizard{
        min-height:0;
        height:100%;
        overflow:hidden;
        overflow-y:auto;
        position:relative;
    }

    .option-item{
        position:relative;
        font-size:0.9em;

        &:hover{
            cursor:pointer;
        }

        &:after{
            box-sizing:border-box;
            position:absolute;
            right:0;
            top:100%;
            content:"";
            width:0;
            border-bottom: 2px solid lightgreen;
            transition: width .2s ease;
        }

        &-active:after{
            width:100%;
            left:0;
        }

        &-disabled{
            color:#999;
        }
    }
</style>
