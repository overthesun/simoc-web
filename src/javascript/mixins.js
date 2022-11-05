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

// idleMixin is used to start and stop the IdleJS object.
export const idleMixin = {
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
}
