<!-- Live button for the Dashboard -->

<template>
    <div v-if="getIsLive" id="dashboard-live-text">
        <span> LIVE </span>
    </div>
    <div v-else id="dashboard-live-icon">
        <span title="Live" @click="goLive">
            <fa-icon :icon="['fas','circle']" class="fa-icon" />
        </span>
    </div>
</template>


<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters('dashboard', ['getIsLive']),
    },
    beforeMount() {
        this.SETISLIVE(true)
    },
    methods: {
        ...mapMutations('dashboard', ['SETSTEPINTERVAL', 'STARTTIMER', 'SETISLIVE']),
        /** This method accesses the changeInterval method in stepTimer.js through the
         *  dashboard store mutator SETSTEPINTERVAL setting the stepInterval to 0 and
         *  sets SETISLIVE to true. When this occurs the thumb moves to the right of the
         *  timeline, is hidden, and disabled.
         */
        goLive() {
            this.SETISLIVE(true)
            this.SETSTEPINTERVAL(0)
            this.STARTTIMER()
        },
    },
}
</script>


<style lang="scss">
</style>
