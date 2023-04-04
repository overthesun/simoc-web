import 'vuetify/styles'
import {createVuetify} from 'vuetify'

export default createVuetify({
    // https://vuetifyjs.com/en/features/theme/
    theme: {
        defaultTheme: 'dark',
    },
    defaults:{
        VBtn: {
            class: 'text-none',
            color: '#0099ee',
            width: '256px',
            height: '48px',
        }
    }
})
