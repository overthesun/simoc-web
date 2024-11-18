<template>
    <div>
        <form v-show="!surveyComplete" ref="survey" name="survey" @submit.prevent="">
            <!-- Google Sheets requires each form element to have a name attribute -->
            <div class="question">
                I am a:
                <select v-model="iama" name="iama" class="input-field-select half-select" required>
                    <option value="null" hidden disabled>Occupation</option>
                    <option value="classroom_instructor">Classroom Instructor</option>
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
                    <option value="null" hidden disabled>Activity</option>
                    <option value="fun">Having fun</option>
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
            <div v-if="isWorking === 'yes'" class="question-multiline">
                How are you using SIMOC?
                <textarea v-model="howUsing" name="howUsing" class="text-area input-field-text" />
            </div>
            <div v-if="isWorking === 'no'" class="question-multiline">
                How can we improve?
                <textarea v-model="makeBetter" name="makeBetter"
                          class="text-area input-field-text" />
            </div>
            <div class="question">
                <input v-model="email" name="email" class="text-input input-field-text" type="text"
                       pattern="^[^@\s]+@[^.\s]+\.\w+$" placeholder="Email (optional)">
            </div>
            <div class="question">
                <input v-model="yourName" name="yourName" class="text-input input-field-text" type="text"
                       placeholder="First and Last Name (optional)">
            </div>
            <input v-model="joinList" name="joinList" type="checkbox">
            Join our mailing list
            <a class="input-title" href="#" :title="MLHelpText">
                <fa-icon :icon="['fa-solid','circle-info']" />
            </a>
            <div id="menu-buttons" class="buttons-horiz">
                <button class="btn-warning" @click="handleCancel">
                    Cancel
                </button>
                <button @click="handleSubmit">
                    Submit
                </button>
            </div>
        </form>
        <div v-show="surveyComplete" class="submit-message">{{onSubmitMessage}}</div>
    </div>
</template>

<script>
export default {
    props: {
        cleanup: {
            type: Function,
            default: null,
        },
    },
    data() {
        return {
            // Display this as tooltip when hovering on the info icon next to 'join our mailing list'
            // eslint-disable-next-line vue/max-len
            MLHelpText: 'We invite you to our SIMOC Users email list. We will notify you of updates to SIMOC and give you occasional opportunities to try beta releases before they go live. The volume is low, just a handful per year. We will never share nor sell your email address. We welcome your feedback and engagement of the growing, always improving SIMOC simulation.',
            onSubmitMessage: null,  // show this at the bottom while submitting
            surveyComplete: false,  // controls whether to show form or onSubmitMessage

            // Survey fields
            iama: null,
            iamaOther: null,
            interestedIn: null,
            isWorking: 'yes',
            makeBetter: null,
            howUsing: null,
            yourName: null,
            email: null,
            joinList: null,
        }
    },
    methods: {
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
            this.surveyComplete = true

            // Submit form to google api, add to sheets.
            // Each field requires a 'name' attribute to match a column in the google sheet.
            // The google script sends an email with the response to 'contact@simoc.space'.
            // responses: https://docs.google.com/spreadsheets/d/1RQo4gaQN4suIcTw1qgBFzse7TT3lrohb6m6Va_h1xMA/edit?usp=sharing
            // ref: https://dev.to/omerlahav/submit-a-form-to-a-google-spreadsheet-1bia
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzKl5p9W99ku8IMNeHwqEsTwp123CGzDtAp2VihQc8H6VBm8faroVyt0FqQjeNSP3rK/exec'
            fetch(scriptURL, {method: 'POST', body: new FormData(survey)})
                    // TODO: Close the window immediately, show pop-up in corner when complete
                    .then(response => {
                        this.onSubmitMessage = 'Submitted feedback successfully.'
                        setTimeout(() => {
                            this.cleanup()
                        }, 1000)
                    })
                    .catch(error => {
                        this.onSubmitMessage =
                            'There was a problem submitting feedback. Please try again later.'
                        setTimeout(() => {
                            this.cleanup()
                        }, 1000)
                    })
        },
    },
}
</script>

<style lang="scss" scoped>
@use '../../sass/components/configuration-input';

.question{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 320px;
    padding-bottom: 20px;

    &-multiline {
        text-align: left;
        max-width: 320px;
        padding-bottom: 20px;
    }
}

.half-select{
    width: 50%;
}

.text-input{
    width: 100%;
    margin-bottom: 0;
}

.text-area{
    width: 100%;
    margin-bottom: 0;
    font-family: inherit;
    height: auto;
}

#menu-buttons{
    margin-top: 32px;
}

</style>
