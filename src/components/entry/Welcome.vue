<!--
Initial welcome screen component. Basic HTML component with the exception of
the button click sending the user to the login screen.
Future version should use a cookie and store the current version number of SIMOC
the user last accepted the welcome message on.
If it matches on mounted then the component should automatically send the user
to the entry screens to prevent this from popping up on repeat vistors.
-->

<template>
    <div class="entry-wrapper">
        <BaseEntry>
            <template v-slot:entry-main>
                <div class="welcome-wrapper">
                    <p class="welcome-title">WELCOME TO SIMOC</p>

                    <p>SIMOC is a Scalable, Interactive Model of an Off-world Community.</p>

                    <p>Through the SIMOC web interface you will configure and then test a Mars
                        habitat of your design. You will select food rations, life support,
                        solar panels and batteries, crew quarters and greenhouse, and plants to
                        clean the air and provide food. Set your model in motion and learn if
                        your astronauts make it ... or not! As an iterative research tool, SIMOC
                        encourages you to make adjustments and try again until you find the
                        right combination to sustain your mission on Mars.</p>

                    <p>In using SIMOC, no personal information will be stored or used by SIMOC
                        or its developer Over the Sun, LLC. Login information is required only
                        for the creation of user sessions, storing user settings, and holding
                        session data. The server may be reset from time to time, so be certain
                        to download your preferred configurations and simulation data.</p>

                    <p>If you experience a bug while using SIMOC, please submit a report to
                        <a class="link" href="mailto:bugs@simoc.space?subject=SIMOC%20Bug%3A%20">
                            bugs@simoc.space</a> with a complete description, including what you were
                        doing prior to the issue.</p>

                    <p>To learn more about SIMOC, enjoy tutorials, and download classroom
                        curricula visit: <a class="link" target="_blank" href="https://simoc.space/">
                            simoc.space</a></p>

                    <p>Finally, by pressing the PROCEED button below, you confirm that you have
                        read and agree to the
                        <a class="link" href="https://simoc.space/about/end-user-license-agreement/"
                           target="_blank">End User License Agreement</a>.</p>
                </div>
            </template>

            <template v-slot:entry-button>
                <button class="btn-warning" @click="toLogin">PROCEED</button>
            </template>
        </BaseEntry>
    </div>
</template>

<script>
import {BaseEntry} from '../base'

export default {
    components: {
        BaseEntry,
    },
    methods: {
        toLogin() {
            this.$router.push('entry')
        },
    },
}
</script>

<style lang="scss" scoped>
.entry-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
}

.welcome-wrapper {
    height: 100%;
    width: 100%;
}

.welcome-title {
    margin-top: 0;
    font-weight: bold;
}

p {
    font-family: "Open Sans", sans-serif;
}
</style>
