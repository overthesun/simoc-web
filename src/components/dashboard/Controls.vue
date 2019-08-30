<!-- Time speed control component used on the dashboard. SEE stepTimer.js in JS folder for more details on the functionality of the timer -->

<template>
    <div class='controls-wrapper'>
        <span class='icon-wrapper'>
            <fa-icon class='fa-icon menu-icon' :icon="['fas','backward']" @click="decreaseStepsPerSecond"/>
        </span>
        <span v-if="getIsTimerRunning" class='icon-wrapper icon-play'>
             <fa-icon class='fa-icon menu-icon' :icon="['fas','pause']"  @click="pauseTimer"/>
        </span>
        <span v-else class='icon-wrapper icon-play'>
             <fa-icon class='fa-icon menu-icon' :icon="['fas','play']" @click="resumeTimer"/>
        </span>
        <span class='icon-wrapper'>
            <fa-icon class='fa-icon menu-icon' :icon="['fas','forward']" @click="increaseStepsPerSecond"/>
        </span>
    </div>
</template>

<script>
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    data(){
        return{

        }
    },
    computed:{
        ...mapGetters('dashboard',['getIsTimerRunning'])
    },
    methods:{
        ...mapMutations('dashboard', ['STARTTIMER', 'PAUSETIMER',
                                      'INCSTEPINTERVAL', 'DECSTEPINTERVAL']),
        pauseTimer:function(){
            // pause the timer when the user clicks on the pause button
            this.PAUSETIMER()
        },
        resumeTimer:function(){
            // start/resume the timer when the user clicks on the play button
            this.STARTTIMER()
        },
        increaseStepsPerSecond:function(){
            // decrease the step interval and make the steps advance faster
            this.DECSTEPINTERVAL(250)
        },
        decreaseStepsPerSecond:function(){
            // increase the step interval and make the steps advance slower
            this.INCSTEPINTERVAL(250)
        }
    }
}
</script>

<style lang="scss" scoped>
.controls-wrapper {
    height: 48px;
    width: 196px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.icon-wrapper {
    font-size: 24px;
    width: 30px;
    text-align: center;
}

.icon-wrapper:hover {
    font-size: 28px;
}

.icon-disabled {
    color: #999;
}
</style>
