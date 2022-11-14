/**
 * Mixins (mixins.js)
 *
 * Mixins prevent the same code required through several components from being
 * repeated within that component. See reference below for usage. Note that if
 * an option in a mixin is already defined in a component, the two will be merged.
 *
 * ref: https://v2.vuejs.org/v2/guide/mixins.html?redirect=true
 *
 * @author Ryan Meneses
 * @version 1.0
 * @since November 5, 2022
 */

import {mapMutations} from 'vuex'

import IdleJs from 'idle-js'

// idleMixin is used to start and stop the IdleJS object.
export const idleMixin = {
    setup() {
        const dashboard = useDashboardStore()
        const {currentMode} = storeToRefs(dashboard)
        return {currentMode}
    },
    data() {
        return {
            idle: new IdleJs({
                idle: 60 * 3 * 1000,  // 3 min idle time (60s * 3m, in ms)
                events: ['mousemove', 'keydown', 'mousedown', 'touchstart'],  // re-trigger events
                onIdle: () => {
                    this.SETTIMEOUTWASACTIVATED(true)
                    this.$router.push('/')
                },  // After idle time launch timeout modal from BaseDashboard.
                onActive: () => {
                    this.SETTIMEOUTWASACTIVATED(false)
                    this.STOPCOUNTDOWNTIMER()
                },  // If activity is detected reset the countdown and hide the modal.
                keepTracking: true,  // false tracks for idleness only once
                startAtIdle: false,  // true starts in the idle state
            }),
        }
    },
    beforeMount() {
        if (this.currentMode === 'kiosk') {
            this.idle.start()
        }
    },
    beforeUnmount() {
        if (this.currentMode === 'kiosk') {
            this.idle.stop()
        }
    },
    methods: {
        ...mapMutations('modal', ['SETTIMEOUTWASACTIVATED', 'STOPCOUNTDOWNTIMER']),
    },
}
