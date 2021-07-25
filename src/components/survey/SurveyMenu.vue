<template>
    <BaseMenu>
        <template v-slot:menu-title>
            Survey
        </template>
        <template v-slot:menu-buttons>
            Would you like a glass of water? Y/N
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
    computed: {
        ...mapGetters('wizard', ['getSurveyComplete']),

        // isValid() {
        //     const {form} = this.$parent.$refs
        //     if (!form.checkValidity()) {
        //         form.reportValidity()
        //         return false
        //     } else {
        //         return true
        //     }
        // },
    },
    methods: {
        ...mapMutations('dashboard', ['SETSURVEYACTIVE', 'SETSURVEYCOMPLETE']),

        handleCancel() {
            this.SETSURVEYACTIVE(false)
            console.log('survey cancelled')
        },
        handleSubmit() {
            this.SETSURVEYACTIVE(false)
            this.SETSURVEYCOMPLETE(true)
            console.log('survey submitted')
        },
    },
}
</script>

<style lang="scss">
.reference-link{
    text-decoration: none;
    color: lightgreen;
    font-weight: 600;

    &:visited{
        color: lightgreen;
    }
}

</style>
