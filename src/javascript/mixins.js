import IdleJs from 'idle-js'

import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../store/modules/DashboardStore'
import {useModalStore} from '../store/modules/ModalStore'

// mixin used to handle idle timeouts in kiosk mode
export const idleMixin = {
    setup() {
        const dashboard = useDashboardStore()
        const modal = useModalStore()
        const {kioskMode} = storeToRefs(dashboard)

        const {getCountdownIsRunning, countdownEnded} = storeToRefs(modal)

        const {timeout, stopCountdownTimer} = modal

        return {kioskMode, getCountdownIsRunning, countdownEnded, timeout, stopCountdownTimer}
    },
    data() {
        return {
            idle: new IdleJs({
                idle: 60 * 3 * 1000,  // 3 min idle time (60s * 3m, in ms)
                events: ['mousemove', 'keydown', 'mousedown', 'touchstart'],  // re-trigger events
                onIdle: () => {
                    // start the countdown modal on idle
                    this.showIdleCountdown(() => {
                        this.countdownEnded = true
                        this.$router.push('/')
                    })
                },
                onActive: () => {
                    // abort the countdown on activity
                    if (this.getCountdownIsRunning) {
                        this.stopCountdownTimer()
                    }
                },
                keepTracking: true,  // false tracks for idleness only once
                startAtIdle: false,  // true starts in the idle state
            }),
        }
    },
    beforeMount() {
        if (this.kioskMode) {
            this.idle.start()
        }
    },
    beforeUnmount() {
        if (this.kioskMode) {
            this.stopCountdownTimer()
            this.idle.stop()
        }
    },
    methods: {
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
