<template>
    <div>
        <form v-show="!getSurveyComplete" ref="survey" name="survey" @submit.prevent="">
            <!-- Google Sheets requires each form element to have a name attribute -->
            <div class="question">
                I am a:
                <select v-model="iama" name="iama" class="input-field-select half-select" required>
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
                <input v-model="iamaOther" name="iamaOther" class="text-input input-field-text"
                       type="text" placeholder="Specify" required>
            </div>
            <div class="question">
                I'm interested in:
                <select v-model="interestedIn" name="interestedIn"
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
                <input v-model="howUsing" name="howUsing" class="text-input input-field-text"
                       type="text">
            </div>
            <div v-if="isWorking === 'no'" class="question">
                How can we improve?
                <input v-model="makeBetter" name="makeBetter" class="text-input input-field-text"
                       type="text">
            </div>
            <div class="question">
                <input v-model="email" name="email" class="text-input input-field-text" type="text"
                       pattern="^[^@\s]+@[^.\s]+\.\w+$" placeholder="Email (optional)">
            </div>
            <input v-model="joinList" name="joinList" type="checkbox">
            Join our mailing list
            <a class="reference-link" href="#" @click="toggleMLInfo">
                <fa-icon :icon="['fas','info-circle']" />
            </a>
            <div v-show="showMLInfo" class="question">
                We invite you to our SIMOC Users email list. We will notify you of updates to SIMOC
                and give you occasional opportunities to try beta releases before they go live. The
                volume is low, just a handful per year. We will never share nor sell your email
                address. We welcome your feedback and engagement of the growing, always improving
                SIMOC simulation.
            </div>
            <div id="menu-buttons">
                <button v-show="!getSurveyComplete" class="btn-warning" @click="handleCancel">
                    Cancel
                </button>
                <button v-show="!getSurveyComplete" @click="handleSubmit">
                    Submit
                </button>
            </div>
        </form>
        <div v-show="getSurveyComplete" class="submit-message">{{onSubmitMessage}}</div>
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
            showMLInfo: false,
            onSubmitMessage: null,  // show this at the bottom while submitting

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

        toggleMLInfo() {
            this.showMLInfo = !this.showMLInfo
        },

        handleCancel() {
            this.cleanup()
        },

        async handleSubmit() {
            const {survey} = this.$refs
            if (!survey.checkValidity()) {
                survey.reportValidity()
                return  // abort until the form is valid
            }
            // Remove the survey form, show the message instead
            this.onSubmitMessage = 'Submitting feedback...'
            this.SETSURVEYCOMPLETE(true)

            // Submit form to google api, add to sheets.
            // Each field requires a 'name' attribute to match a column in the google sheet.
            // The google script sends an email with the response to 'contact@simoc.space'.
            // responses: https://docs.google.com/spreadsheets/d/1RQo4gaQN4suIcTw1qgBFzse7TT3lrohb6m6Va_h1xMA/edit?usp=sharing
            // ref: https://dev.to/omerlahav/submit-a-form-to-a-google-spreadsheet-1bia
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzKl5p9W99ku8IMNeHwqEsTwp123CGzDtAp2VihQc8H6VBm8faroVyt0FqQjeNSP3rK/exec'
            fetch(scriptURL, {method: 'POST', body: new FormData(survey)})
                    .then(response => {
                        this.onSubmitMessage = 'Submitted feedback successfully.'
                        setTimeout(() => {
                            this.cleanup()
                        }, 1000)
                    })
                    .catch(error => {
                        this.onSubmitMessage =
                            'There was a problem submitting feedback. Please try again later.'

                        // TODO: Close the window immediately, show pop-up in corner when complete
                        setTimeout(() => {
                            this.cleanup()
                            this.SETSURVEYCOMPLETE(false)
                        }, 1000)
                    })
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

#menu-buttons{
    margin-top: 32px;
}

</style>
