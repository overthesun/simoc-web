<!-- Timeline component -->

<template>
        <div class="timeline-wrapper">
            <span class="timeline-item">
                <input class="timeline" type="range" min="1" :max="getTotalMissionHours"
                       v-model.number="currentStep" v-on:input="pauseBuffer" v-on:change="updateBuffer"
                       :style="{'background-image': 'linear-gradient(to right, #67e300 0%, \
                               #67e300 ' + currentPercentage + '%, \
                               #d0d0d0 ' + currentPercentage +'%, \
                               #d0d0d0 '+ bufferPercentage +'%, \
                               #444343 ' + bufferPercentage + '%, \
                               #444343 100%)'}" >
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

    mounted() {
        // start the timer when the component is mounted, the actual
        // visualization will start only when the buffer has enough data
        this.startTimer()
    },

    computed: {
        ...mapGetters('dashboard', ['getCurrentStepBuffer', 'getMaxStepBuffer', 'getTimerID',
                                    'getIsTimerRunning', 'getStepInterval']),
        ...mapGetters('wizard', ['getTotalMissionHours']),

    },
    methods: {
        ...mapMutations('dashboard', ['SETTIMERID', 'STARTTIMER', 'PAUSETIMER',
                                      'STOPTIMER', 'UPDATEBUFFERCURRENT']),

        startTimer() {
            // initialize and return the step timer that updates the
            // current step and triggers watches that update the panels
            this.STOPTIMER()  // if a timer exists already, stop it
            const stepTimer = new StepTimer(() => {
                // increment the step only if we have enough buffered steps
                // TODO check the number of steps requests so we can still
                // run simulations with a number of steps <= the limit
                if (this.getMaxStepBuffer >= 30) {
                    this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer + 1)
                }
            }, this.getStepInterval)
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
            if (this.getTimerID != null) {
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
    watch: {
        // update scrubber percentages when the current and/or max step change
        getCurrentStepBuffer() { this.updatePercentages() },
        getMaxStepBuffer() { this.updatePercentages() },
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
