<!-- Timeline component -->

<template>
    <div class="timeline-wrapper">
        <span class="timeline-item">
            <input v-model.number="currentStep" :min="1" :max="getTotalMissionHours"
                   :style="{'background-image': 'linear-gradient(to right, #67e300 0%, \
                            #67e300 ' + currentPercentage + '%, \
                            #d0d0d0 ' + currentPercentage + '%, \
                            #d0d0d0 ' + bufferPercentage + '%, \
                            #444343 ' + bufferPercentage + '%, \
                            #444343 100%)'}"
                   class="timeline" type="range"
                   @input="pauseBuffer" @change="updateBuffer">
        </span>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

import {storeToRefs} from 'pinia'
import {useDashboardStore} from '../../store/modules/DashboardStore'

export default {
    setup() {
        const dashboard = useDashboardStore()
        const {
            isTimerRunning, timerId, currentStepBuffer, maxStepBuffer,
        } = storeToRefs(dashboard)
        const {
            initTimer, pauseTimer, startTimer, setCurrentStepBuffer,
        } = dashboard
        return {
            isTimerRunning, timerId, currentStepBuffer, maxStepBuffer,
            initTimer, pauseTimer, startTimer, setCurrentStepBuffer,
        }
    },
    data() {
        return {
            currentPercentage: 1,
            bufferPercentage: 1,
            currentStep: 1,
            timerWasRunning: null,  // the status of timer before drag&dropping
            userIsDragging: false,  // true when the user is dragging the slider
        }
    },
    computed: {
        ...mapGetters('wizard', ['getTotalMissionHours']),
    },
    watch: {
        // update scrubber percentages when the current and/or max step change
        currentStepBuffer() { this.updatePercentages() },
        maxStepBuffer() { this.updatePercentages() },
    },
    mounted() {
        // start the timer when the component is mounted, the actual
        // visualization will start only when the buffer has enough data
        this.initTimer()
    },
    methods: {
        // called when the user starts dragging the timeline slider to
        // prevent updates while the user is interacting with the slider
        pauseBuffer() {
            // update the graphs in real-time while the user drags
            this.setCurrentStepBuffer(this.currentStep)
            if (this.userIsDragging) {
                // the user is still dragging, do nothing else
                return
            }
            // save the current state before pausing
            this.timerWasRunning = this.isTimerRunning
            this.userIsDragging = true
            if (this.timerId !== null) {
                this.pauseTimer()
            }
        },

        // called when the user selects a new step on the timeline slider
        updateBuffer() {
            this.userIsDragging = false  // the user released the slider
            this.setCurrentStepBuffer(this.currentStep)
            // when the timer is paused and the slider moved beyond the max
            // the position is not updated unless we call updatePercentages()
            this.updatePercentages()
            if (this.timerWasRunning) {
                this.startTimer()
            }
        },

        updatePercentages() {
            this.currentStep = this.currentStepBuffer
            // Before we receive steps from the server, the currentStep (and first step) is 0.
            // Once we receive the first step, the first step becomes 1, and step 0 is removed.
            // Because of this we need to subtract 1 from all the values.
            const totalMissionHours = this.getTotalMissionHours - 1
            this.currentPercentage = ((this.currentStepBuffer - 1) / totalMissionHours) * 100
            this.bufferPercentage = ((this.maxStepBuffer - 1) / totalMissionHours) * 100
        },
    },
}
</script>

<style lang="scss" scoped>
    .timeline-wrapper{
        width: auto;
        height: 32px;
        display:grid;
        grid-template-rows:1fr;
        grid-template-columns: auto 1fr auto;
        margin: 8px 0px;
        position:relative;
    }


    .timeline-item{
        display:flex;
        justify-content:center;
        align-items:center;
    }

    .timeline-text{
        font-size: 16px;
        font-weight: 200;
    }

    .timeline{
        z-index:99;
        appearance:none;
        border-radius: 2px;
        width: 70vw;
        height: 4px;
        outline:none;
        background:transparent;
        background-repeat:no-repeat;
    }

    .timeline::-webkit-slider-thumb{
        appearance:none;
        width: 8px;
        height: 16px;
        border-radius:25%;
        background-color: #67e300;
    }

    .timeline::-moz-range-thumb{
        width: 16px;
        height: 16px;
        border-radius:50%;
        background-color: #67e300;
        cursor:pointer;
    }
</style>
