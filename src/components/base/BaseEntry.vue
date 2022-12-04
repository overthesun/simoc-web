<!-- component used for the holding the login / registration components. See EntryView for further details-->

<template>
    <div class="entry-wrapper">
        <header class="header">
            <img src="../../assets/simoc-logo.svg" class="simoc-logo">
            <span class="simoc-logo-title">SIMOC</span>
            <img src="../../assets/natgeo-trans.png" class="natgeo-logo">
        </header>
        <div class="main-options">
            <slot name="option-items" />
        </div>
        <main class="main">
            <slot name="entry-main" />
        </main>
        <div class="entry-button-wrapper">
            <slot name="entry-button" />
        </div>
        <footer class="footer">
            <a class="link" title="Go to the simoc.space homepage" target="_blank"
               href="https://simoc.space/">
                SIMOC
            </a>
            <a class="link" target="_blank" href="mailto:bugs@simoc.space?subject=SIMOC%20Bug%3A%20">
                Report Bug
            </a>
            <a class="link" title="End User License Agreement" target="_blank"
               href="https://simoc.space/end-user-license-agreement/">
                EULA
            </a>
        </footer>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .entry-wrapper{
        height:100%;
        width:100%;
        display:flex;
        justify-content:center;
        align-items:center;
        flex-direction:column;
        box-sizing:border-box;
        position:relative;
    }

    .warning-wrapper{
        position:absolute;
        left:0;
        top:-256px;
        z-index:99;
        height: auto;
        min-height:128px;
        max-height:256px;
        width:100%;
        background-color:#ff3100;
        transition: top .5s ease;
        padding:16px;
        box-sizing:border-box;
        border-bottom: 1px solid #eee;
        display:flex;
        justify-content:center;
        align-items:center;
        flex-direction:column;
        color:white;

        .dismiss-icon{
            position:absolute;
            top:0;
            right:0;
            margin:4px 8px;
            padding:4px;

            &:hover{
                cursor: pointer;
            }
        }
    }

    .warning-active{
        top:0px;
    }

    .header{
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom: 32px;
    }

    .simoc-logo{
        width: auto;
        height: 48px;
        margin-right:8px;
    }

    .natgeo-logo{
        width: auto;
        height: 60px;
        /* must be at least a full logo away from the rest */
        margin-left: 48px;
    }

    .simoc-logo-title{
        font-family: "Nasalization", "Open Sans", sans-serif;
        font-weight: 400;
        font-size: 22px;
    }

    .main{
        box-sizing:border-box;
        width:100%;
        height:100%;
        max-height:100%;
        display:flex;
        justify-content:flex-start;
        align-items:center;
        flex-direction:column;
        margin-bottom:16px;
        overflow: hidden;
        overflow-y:auto;
        position:relative;
    }

    .main-options{
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom: 36px;
    }

    .entry-button-wrapper{
        width:100%;
        height:48px;
        min-height:48px;
        margin-bottom: 32px;
        position:relative;
        display:flex;
        justify-content:center;
        align-items:center;
    }

    .btn-disabled{
        background-color: #4c4c4c;
        color: #999;
    }

    .footer{
        width: 100%;
        height: 24px;
        min-height:24px;
        display:flex;
        justify-content:space-evenly;
        align-items:center;
    }
</style>

<style lang="scss">
    .option-item {
        box-sizing:border-box;
        margin: 0px 16px;
        font-weight: 600;
        font-size: 24px;
        position: relative;

        &:hover{
            cursor:pointer;
        }

        &:after{
            box-sizing:border-box;
            position: absolute;
            right: 0;
            top: 100%;
            content:"";
            width: 0;
            border-bottom: 2px solid lightgreen;
            transition: width .2s ease;
        }

        &-active:after{
            width: 100%;
            left:0;
        }
    }


    .link {
        text-decoration: underline;
        &:visited,&{
            color:lightgreen;
        }

        &-disabled{
            color: #999;
        }
    }

    .btn-normal {
        width: 256px;
        height: 48px;
        min-height: 48px;
        margin-bottom: 12px;
        border-radius: 5px;
        padding: 12px 16px;
        font-size: 16px;
        font-weight: 600;
        background-color: #0099ee;
        border:none;
        color: #eee;

        &:hover{
            cursor: pointer;
        }

        &:focus{
            outline:none;
        }
    }

    .btn-mars, .btn-biosphere2 {
        width: 122px;
        height: 122px;
        min-height: 122px;
        margin-right: 12px;
        font-size: 14px;
        color: transparent;
        background: transparent;

        &:hover{
            cursor: pointer;
            color: rgba(255,255,255,1);
            transition: color 0.5s;
        }

        &:focus{
            outline:none;
        }
    }

    .btn-mars {
        background-image: url(../../assets/Mars-Ft-Calgary-small.jpg);

        &:hover{
            background-image: linear-gradient(to bottom, rgba(180,180,180,0.3), rgba(100,100,100,0.5)), url(../../assets/Mars-Ft-Calgary-small.jpg);
        }
    }

    .btn-biosphere2 {
        background-image: url(../../assets/biosphere2-small.jpg);

        &:hover{
            background-image: linear-gradient(to bottom, rgba(180,180,180,0.3), rgba(100,100,100,0.5)), url(../../assets/biosphere2-small.jpg);
        }
    }

    .btn-warning {
        margin-top:auto;
        width: 256px;
        height: 48px;
        min-height:48px;
        margin-top: auto;
        border-radius: 5px;
        padding: 12px 16px;
        font-size: 16px;
        font-weight: 600;
        background-color: #ff3100;
        border:none;
        color: #eee;

        &:hover{
            color: #eee;
            cursor: pointer;
        }

        &:focus{
            outline:none;
        }
    }
</style>
