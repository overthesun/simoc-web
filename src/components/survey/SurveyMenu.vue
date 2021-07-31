<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Survey
        </template>
        <template v-slot:survey>
            <form v-show="!(getSurveyComplete)" ref='survey' @submit.prevent="">
                <div class="question">
                    I am a:
                    <select ref="iama" name="iama" v-model="iama" class="input-field-select half-select" required>
                        <option value="classroom_instructor" selected>Classroom Instructor</option>
                        <option value="student_k-12">Student (K-12)</option>
                        <option value="citizen_scientist">Citizen Scientist</option>
                        <option value="university_researcher">University researcher</option>
                        <option value="professional_researcher">Professional researcher</option>
                        <option value="space_exploration_enthusiast">Space exploration enthusiast</option>
                        <option value="analog_astronaut">Analog Astronaut</option>
                        <option value="curious_passer-by">Curious passer-by</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div v-if="iama === 'other'" class="question">
                    <input ref="iamaOther" v-model="iamaOther" class="text-input input-field-text"
                           type="text" placeholder="Specify" required>
                </div>
                <div class="question">
                    I'm interested in:
                    <select ref="interestedIn" v-model="interestedIn"
                            class="input-field-select half-select" required>
                        <option value="fun" selected>Having fun</option>
                        <option value="learning">Learning about off-Earth human habitation</option>
                        <option value="testing">Testing a hypothesis</option>
                        <option value="research">Incorporating SIMOC into my research</option>
                        <option value="playing">Playing space-related video games</option>
                    </select>
                </div>
                <div class="question">
                    Is SIMOC working for you?
                    <div>
                        <input type="radio" id="yesWorking" value="yes" v-model="isWorking" required>
                        <label for="yesWorking">Yes</label>
                        <input type="radio" id="noWorking" value="no" v-model="isWorking">
                        <label for="noWorking">No</label>
                    </div>
                </div>
                <div v-if="isWorking === 'yes'" class="question">
                    Great! How are your using SIMOC?
                    <input ref="makeBetter" v-model="makeBetter" class="text-input input-field-text" type="text">
                </div>
                <div v-if="isWorking === 'no'" class="question">
                    How can we improve?
                    <input ref="howUsing" v-model="howUsing" class="text-input input-field-text" type="text">
                </div>
                <div class="question">
                    <input ref="email" v-model="email" class="text-input input-field-text" type="text"
                           placeholder="Email (optional)">
                </div>
                <input ref="joinList" v-model="joinList" class="" type="checkbox">
                Join our mailing list
            </form>
        </template>
        <template v-slot:menu-buttons>
            <button @click="handleCancel" class="btn-warning btn-logout"
                    v-show="!(getSurveyComplete)" >Cancel</button>
            <button @click="handleSubmit" v-show="!(getSurveyComplete)">Submit</button>
            <div v-show="getSurveyComplete" class="leaving-message">
                Survey, received, thank you.
            </div>
        </template>
    </BaseMenu>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {BaseMenu} from '../base'

export default {
    name: 'SurveyMenu',
    components: {
        BaseMenu,
    },
    data() {
        return {
            timerWasRunning: null, // status of game timer
            iama: null,
            iamaOther: null,
            interestedIn: null,
            isWorking: null,
            makeBetter: null,
            howUsing: null,
            email: null,
            joinList: null,
        }
    },
    computed: {
        ...mapGetters('dashboard', ['getSurveyComplete', 'getTimerWasRunning']),
    },
    beforeDestroy() {
        if (this.getTimerWasRunning) {
            this.STARTTIMER()
            this.SETTIMERWASRUNNING(null)
        }
    },
    methods: {
        ...mapMutations('dashboard', ['SETSURVEYACTIVE', 'SETSURVEYCOMPLETE',
                                      'STARTTIMER', 'SETTIMERWASRUNNING']),

        setIama(val) {
            console.log(`I am a ${val.target.value}.`)
        },

        handleCancel() {
            this.SETSURVEYACTIVE(false)
            console.log('survey cancelled')
        },
        handleSubmit() {
            const {survey} = this.$refs
            if (!survey.checkValidity()) {
                survey.reportValidity()
                return  // abort until the form is invalid
            }
            this.SETSURVEYCOMPLETE(true)
            setTimeout(() => this.SETSURVEYACTIVE(false), 1500)
            console.log(`Survey submitted: I am a ${this.iama}. I'm interested in ${this.interestedIn}.`)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../sass/components/configuration-input';

.question{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 320px;
    padding-bottom: 20px;
}

.half-select{
    width: 50%;
}

.text-input{
    width: 100%;
    margin-bottom: 0;
}

.reference-link{
    text-decoration: none;
    color: lightgreen;
    font-weight: 600;

    &:visited{
        color: lightgreen;
    }
}

</style>
