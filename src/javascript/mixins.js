import IdleJs from 'idle-js'

import {storeToRefs} from 'pinia'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {useDashboardStore} from '../store/modules/DashboardStore'

// mixin used to handle idle timeouts in kiosk mode
export const idleMixin = {
    setup() {
        const dashboard = useDashboardStore()
        const {kioskMode} = storeToRefs(dashboard)
        return {kioskMode}
    },
    data() {
        return {
            idle: new IdleJs({
                idle: 60 * 3 * 1000,  // 3 min idle time (60s * 3m, in ms)
                events: ['mousemove', 'keydown', 'mousedown', 'touchstart'],  // re-trigger events
                onIdle: () => {
                    // start the countdown modal on idle
                    this.showIdleCountdown(() => {
                        this.SETCOUNTDOWNENDED(true)
                        this.$router.push('/')
                    })
                },
                onActive: () => {
                    // abort the countdown on activity
                    if (this.getCountdownIsRunning) {
                        this.STOPCOUNTDOWNTIMER()
                    }
                },
                keepTracking: true,  // false tracks for idleness only once
                startAtIdle: false,  // true starts in the idle state
            }),
        }
    },

    computed: {
        ...mapGetters('modal', ['getCountdownIsRunning']),
    },
    beforeMount() {
        if (this.kioskMode) {
            this.idle.start()
        }
    },
    beforeUnmount() {
        if (this.kioskMode) {
            this.STOPCOUNTDOWNTIMER()
            this.idle.stop()
        }
    },
    methods: {
        ...mapActions('modal', ['timeout']),
        ...mapMutations('modal', ['SETCOUNTDOWNENDED', 'STOPCOUNTDOWNTIMER']),
        showIdleCountdown(next) {
            this.timeout({
                message: ('Terminating mission due to inactivity.\n' +
                          'Move the cursor to continue the mission.'),
                secondsLeft: 10,
                timeoutCallback: () => next(),
            })
        },
    },
}
