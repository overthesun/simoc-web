import {createVuetify} from 'vuetify'
// eslint-disable-next-line
import {VBtn} from 'vuetify/components/VBtn'

const simocBaseTheme = {
    colors: {
        background: '#1e1e1e',
        primary: '#0099ee',
        warning: '#ff3100',
    },
}

const b2BaseTheme = {

}

export default createVuetify({
    dark: true,
    // https://vuetifyjs.com/en/features/theme/
    aliases: {
        VBtnMenu: VBtn,
    },
    theme: {
        defaultTheme: 'simocBaseTheme',
        themes: {
            simocBaseTheme,
            b2BaseTheme,
        },
    },
    defaults: {
        VBtnMenu: {
            class: 'v-btn--menu',
            color: 'primary',
            width: '256px',
            height: '48px',
        },
    },
})
