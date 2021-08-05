<template>
    <div>
        <form v-show="!(getSurveyComplete)" ref="survey" name="survey" @submit.prevent="">
            <div class="question">
                I am a:
                <select ref="iama" v-model="iama" name="iama" class="input-field-select half-select" required>
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
                <input ref="iamaOther" v-model="iamaOther" name="iamaOther" class="text-input input-field-text"
                       type="text" placeholder="Specify" required>
            </div>
            <div class="question">
                I'm interested in:
                <select ref="interestedIn" v-model="interestedIn" name="interestedIn"
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
                    <input v-model="isWorking" type="radio" value="yes" name="isWorking" required>
                    <label for="yesWorking">Yes</label>
                    <input v-model="isWorking" type="radio" value="no" name="isWorking">
                    <label for="noWorking">No</label>
                </div>
            </div>
            <div v-if="isWorking === 'yes'" class="question">
                How are you using SIMOC?
                <input ref="howUsing" v-model="howUsing" name="howUsing" class="text-input input-field-text"
                       type="text">
            </div>
            <div v-if="isWorking === 'no'" class="question">
                How can we improve?
                <input ref="makeBetter" v-model="makeBetter" name="makeBetter" class="text-input input-field-text"
                       type="text">
            </div>
            <div class="question">
                <input ref="email" v-model="email" name="email" class="text-input input-field-text" type="text"
                       placeholder="Email (optional)">
            </div>
            <input ref="joinList" v-model="joinList" name="joinList" class="" type="checkbox">
            Join our mailing list
            <a class="reference-link" href="#" @click="toggleMailInfo">
                <fa-icon :icon="['fas','info-circle']" />
            </a>
            <div v-show="showMailInfo" class="question">
                We invite you to our SIMOC Users email list. We will notify you of updates to SIMOC
                and give you occasional opportunities to try beta releases before they go live. The
                volume is low, just a handful per year. We will never share nor sell your email
                address. We welcome your feedback and engagement of the growing, always improving
                SIMOC simulation.
            </div>
        </form>
        <div id="menu-buttons">
            <button v-show="!(getSurveyComplete)" class="btn-warning" @click="handleCancel">
                Cancel
            </button>
            <button v-show="!(getSurveyComplete)" @click="handleSubmit">
                Submit
            </button>
            <div v-show="getSurveyComplete" class="leaving-message">
                Survey, received, thank you.
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
    props: {
        cleanup: {
            type: Function,
            default: null,
        },
    },
    data() {
        return {
            timerWasRunning: null, // status of game timer
            showMailInfo: false,

            // Survey fields
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
        ...mapGetters('modal', ['getSurveyComplete']),
    },
    methods: {
        ...mapMutations('modal', ['SETSURVEYCOMPLETE']),

        toggleMailInfo() {
            this.showMailInfo = !this.showMailInfo
        },

        handleCancel() {
            this.cleanup()
        },

        handleSubmit() {
            const {survey} = this.$refs
            if (!survey.checkValidity()) {
                survey.reportValidity()
                return  // abort until the form is invalid
            }
            this.SETSURVEYCOMPLETE(true)
            setTimeout(() => {
                this.cleanup()
                this.SETSURVEYCOMPLETE(false) // Use for testing
            }, 1500)

            console.log(new FormData(survey))

            // Submit form to google api, add to sheets
            // responses: https://docs.google.com/spreadsheets/d/1RQo4gaQN4suIcTw1qgBFzse7TT3lrohb6m6Va_h1xMA/edit?usp=sharing
            // ref: https://dev.to/omerlahav/submit-a-form-to-a-google-spreadsheet-1bia
            //  * Each field requires a 'name' attribute to match a column in the google sheet
            //  * The google script sends an email with the response to 'contact@simoc.space'
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzKl5p9W99ku8IMNeHwqEsTwp123CGzDtAp2VihQc8H6VBm8faroVyt0FqQjeNSP3rK/exec'

            // TODO: use a loading cursor while it submits
            fetch(scriptURL, {method: 'POST', body: new FormData(survey)})
                    .then(response => console.log('Success!', response))
                    .catch(error => console.error('Error!', error.message))
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

form{
    margin-bottom: 32px;
}

</style>
