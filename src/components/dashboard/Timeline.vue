<!-- Timeline component
There is an issues with this that causes the stepTimer to resume once the user slides the timeline indicator to a new place. It will override the current state of the timer.
A condition needs to be added in if the timer is paused by some other means than just by the timeline indicator methods
-->

<template>
        <div class='timeline-wrapper'>
<!--            <input class='timeline' type='range' min='0' max='100' v-model="value" :style="{'background-image':'linear-gradient(to right,green 0%, green ' + value + '%,lightgreen ' + value +'%,lightgreen '+ stepMax +'%,#999 ' + stepMax + '%,#999 100%)'}" v-on:input="killClock" v-on:change="updateStep">
            -->
            <div class='timeline-item timeline-text'>{{getCurrentStepBuffer}}</div>
            <span class='timeline-item'>
                <input class='timeline' type='range' min='1' :disabled="getForcedPause" :max="getTotalMissionHours" v-model="currentStep" v-on:input="pauseBuffer" v-on:change="updateBuffer" :style="{'background-image':'linear-gradient(to right,#67e300 0%, #67e300 ' + currentPercentage + '%,#d0d0d0 ' + currentPercentage +'%,#d0d0d0 '+ bufferPercentage +'%,#444343 ' + bufferPercentage + '%,#444343 100%)'}" >
            </span>
            <div class='timeline-item timeline-text'>{{getTotalMissionHours}}</div>
        </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
import {StepTimer} from '../../javascript/stepTimer'
export default {
    data(){
        return{
            currentPercentage:1,
            bufferPercentage:1,
            currentStep:1
        }
    },

    mounted:function() {
        //Create a new timer object once the user has deselected the indicator
        //The interval also needs to be stored universally to allow this to create a
        //new timer object with the last used speed.
        this.startTimer(1000)
    },

    computed:{
        ...mapGetters('dashboard',['getCurrentStepBuffer','getMaxStepBuffer','getTimerID','getForcedPause']),
        ...mapGetters('wizard',['getTotalMissionHours'])

    },
    methods:{
        ...mapMutations('dashboard',['SETTIMERID','STARTTIMER','PAUSETIMER','STOPTIMER','UPDATEBUFFERCURRENT']),

        startTimer: function(interval) {
            // initialize and return the step timer that updates the
            // current step and triggers watches that update the panels
            this.STOPTIMER()  // if a timer exists already, stop it
            let stepTimer = new StepTimer( () => {
                // increment the step only if we have enough buffered steps
                // TODO check the number of steps requests so we can still
                // run simulations with a number of steps <= the limit
                if (this.getMaxStepBuffer >= 30) {
                    this.UPDATEBUFFERCURRENT(this.getCurrentStepBuffer+1)
                }
            }, interval)
            this.SETTIMERID(stepTimer)
            this.STARTTIMER()
            return stepTimer
        },

        //Pause the timer if the user has started to drag the timeline slider. This prevents updates while the user
        //interactives with the timeline.
        pauseBuffer:function(){
            // TODO save current state to local var and restore it in updatebuffer
            if (this.getTimerID != null) {
                this.PAUSETIMER()
            }
        },

        //If the user has set the slider to a new value, reset everything to the new step.
        //Remember pause actually kills the old timer within the stepTimer.js
        updateBuffer:function(){
            console.log('updateBuffer called')
            this.UPDATEBUFFERCURRENT(parseInt(this.currentStep))

            //Create a new timer object once the user has deselected the indicator
            //The interval also needs to be stored universally to allow this to create a
            //new timer object with the last used speed.
            console.log('timeline:78')
            this.startTimer(1000)  // TODO Resume the timer. This is also the spot that causes a bug with the timeline starting up regardless of the state.
        },
        updatePercentages: function() {
            this.currentStep = this.getCurrentStepBuffer
            this.currentPercentage = (this.getCurrentStepBuffer / this.getTotalMissionHours) * 100
            this.bufferPercentage = (this.getMaxStepBuffer / this.getTotalMissionHours) * 100
        },

    },
    watch: {
        // update scrubber percentages when the current and/or max step change
        getCurrentStepBuffer: function() { this.updatePercentages() },
        getMaxStepBuffer: function() { this.updatePercentages() },
    },
}
</script>

<style lang="scss" scoped>
    .timeline-wrapper{
        width: auto;
        height: 32px;
        background-color: #1e1e1e;
        display:grid;
        grid-template-rows:1fr;
        grid-template-columns: auto 1fr auto;
        grid-column-gap: 32px;
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
        width: 704px;
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
