<!-- Timeline component -->

<template>
    <!-- Timeline visualization for live mode -->
    <div v-if="getIsLive" class="timeline-wrapper">
        <span class="timeline-item">
            <input v-model.number="currentStep" :min="1" :max="getTotalMissionHours"
                   :style="{'background-image': 'linear-gradient(to right, #fc0303 0%, \
                            #fc0303 ' + currentPercentage + '%, \
                            #d0d0d0 ' + currentPercentage +'%, \
                            #d0d0d0 '+ bufferPercentage +'%, \
                            #444343 ' + bufferPercentage + '%, \
                            #444343 100%)'}"
                   class="live-timeline" type="range" disabled>
        </span>
    </div>
    <!-- Timeline visualization for step mode -->
    <div v-else class="timeline-wrapper">
        <span class="timeline-item">
            <input v-model.number="currentStep" :min="1" :max="getTotalMissionHours"
                   :style="{'background-image': 'linear-gradient(to right, #67e300 0%, \
                            #67e300 ' + currentPercentage + '%, \
                            #d0d0d0 ' + currentPercentage +'%, \
                            #d0d0d0 '+ bufferPercentage +'%, \
                            #444343 ' + bufferPercentage + '%, \
                            #444343 100%)'}"
                   class="timeline" type="range"
                   @input="pauseBuffer" @change="updateBuffer">
        </span>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {StepTimer} from '../../javascript/stepTimer'

export default {
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
        ...mapGetters('dashboard', ['getCurrentStepBuffer', 'getMaxStepBuffer', 'getTimerID',
                                    'getIsTimerRunning', 'getStepInterval', 'getCurrentMode',
                                    'getIsLive']),
        ...mapGetters('wizard', ['getTotalMissionHours']),
    },
    watch: {
        // update scrubber percentages when the current and/or max step change
        getCurrentStepBuffer() { this.updatePercentages() },
        getMaxStepBuffer() { this.updatePercentages() },
    },
    mounted() {
        // start the timer when the component is mounted, the actual
        // visualization will start only when the buffer has enough data
        this.startTimer()
    },
    methods: {
        ...mapMutations('dashboard', ['SETTIMERID', 'STARTTIMER', 'PAUSETIMER',
                                      'STOPTIMER', 'UPDATEBUFFERCURRENT']),

        startTimer() {
            // initialize and return the step timer that updates the
            // current step and triggers watches that update the panels
            this.STOPTIMER()  // if a timer exists already, stop it

            let stepTimer
            if (this.getCurrentMode === 'live') {
                stepTimer = new StepTimer(() => {
                    // start timer immediately if in live mode and there is at least
                    // 1 bundle in the maxStepBuffer indicating an available reading
                    if (this.getMaxStepBuffer >= 1) {
                        this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer + 1)
                    }
                }, 0)
            } else if (this.getCurrentMode === 'sim') {
                stepTimer = new StepTimer(() => {
                    // increment the step only if we have enough buffered steps
                    // TODO check the number of steps requests so we can still
                    // run simulations with a number of steps <= the limit
                    if (this.getMaxStepBuffer >= 30) {
                        this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer + 1)
                    }
                }, this.getStepInterval)
            }

            this.SETTIMERID(stepTimer)
            this.STARTTIMER()
            return stepTimer
        },

        // called when the user starts dragging the timeline slider to
        // prevent updates while the user is interacting with the slider
        pauseBuffer() {
            // update the graphs in real-time while the user drags
            this.UPDATEBUFFERCURRENT(this.currentStep)
            if (this.userIsDragging) {
                // the user is still dragging, do nothing else
                return
            }
            // save the current state before pausing
            this.timerWasRunning = this.getIsTimerRunning
            this.userIsDragging = true
            if (this.getTimerID !== null) {
                this.PAUSETIMER()
            }
        },

        // called when the user selects a new step on the timeline slider
        updateBuffer() {
            this.userIsDragging = false  // the user released the slider
            this.UPDATEBUFFERCURRENT(this.currentStep)
            // when the timer is paused and the slider moved beyond the max
            // the position is not updated unless we call updatePercentages()
            this.updatePercentages()
            if (this.timerWasRunning) {
                this.startTimer()
            }
        },

        updatePercentages() {
            this.currentStep = this.getCurrentStepBuffer
            this.currentPercentage = (this.getCurrentStepBuffer / this.getTotalMissionHours) * 100
            this.bufferPercentage = (this.getMaxStepBuffer / this.getTotalMissionHours) * 100
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

    .live-timeline{
        z-index:99;
        appearance:none;
        border-radius: 2px;
        width: 70vw;
        height: 4px;
        outline:none;
        background: transparent no-repeat;
    }

    .live-timeline::-webkit-slider-thumb{
        visibility: hidden;
    }

    .live-timeline::-moz-range-thumb{
        visibility: hidden;
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
