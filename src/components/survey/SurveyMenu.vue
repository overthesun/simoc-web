<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Survey
        </template>
        <template v-slot:survey>
            <form @submit.prevent="">
                <div class="question">
                    I am a:
                    <select ref="iama" v-model="iama" class="half-select" required>
                        <option value="student" selected>Student</option>
                        <option value="researcher">Researcher</option>
                        <option value="hobbyist">Hobbyist</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div v-if="iama === 'other'" class="question">
                    <input ref="iamaOther" v-model="iamaOther" class="text-input" type="text"
                           placeholder="please specify" required>
                </div>
                <div class="question">
                    I'm interested in:
                    <select ref="interestedIn" v-model="interestedIn" class="half-select" required>
                        <option value="fun" selected>Having fun</option>
                        <option value="learning">Learning</option>
                        <option value="testing">Testing a hypothesis</option>
                        <option value="research">Incorporating SIMOC into my research</option>
                    </select>
                </div>
            </form>
        </template>
        <template v-slot:menu-buttons>
            <button @click="handleCancel">Cancel</button>
            <button @click="handleSubmit">Submit</button>
        </template>
    </BaseMenu>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {BaseMenu} from '../base'

export default {
    components: {
        BaseMenu,
    },
    data() {
        return {
            iama: null,
            iamaOther: null,
            interestedIn: null,
            isWorking: null,
            email: null,
            joinList: null,
        }
    },
    computed: {
        ...mapGetters('wizard', ['getSurveyComplete']),
    },
    methods: {
        ...mapMutations('dashboard', ['SETSURVEYACTIVE', 'SETSURVEYCOMPLETE']),

        setIama(val) {
            console.log(`I am a ${val.target.value}.`)
        },

        handleCancel() {
            this.SETSURVEYACTIVE(false)
            console.log('survey cancelled')
        },
        handleSubmit() {
            this.SETSURVEYACTIVE(false)
            this.SETSURVEYCOMPLETE(true)
            console.log(`Survey submitted: I am a ${this.iama}. I'm interested in ${this.interestedIn}.`)
        },
    },
}
</script>

<style lang="scss">
.question{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 300px;
    padding-bottom: 20px;
}

.half-select{
    width: 50%;
}

.text-input{
    width: 100%;
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
