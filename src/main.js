import {createApp} from 'vue'
import VueGtag, {trackRouter} from 'vue-gtag-next'
import {createPinia} from 'pinia'

import {library} from '@fortawesome/fontawesome-svg-core'
import {faPause, faPlay, faBackwardStep, faForwardStep, faMinus, faPlus, faXmark,
        faBars, faArrowLeft, faArrowRight, faCircleInfo, faListUl, faCircle,
        faCircleDot, faCirclePlus, faPerson, faTrash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon, FontAwesomeLayers} from '@fortawesome/vue-fontawesome'
import store from './store/index'
import router from './router'
import vuetify from './plugins/vuetify'
import App from './App.vue'

library.add(faPlay, faPause, faBackwardStep, faForwardStep, faMinus, faPlus, faXmark,
            faBars, faArrowLeft, faArrowRight, faCircleInfo, faListUl, faCircle,
            faCircleDot, faCirclePlus, faPerson, faTrash)

// Gtag/Analytics tracking
// Beta and NGS have two different tracking ids
// Tracking is only active in production mode
let tracking_id = null
if (window.location.hostname.startsWith('beta')) {
    tracking_id = 'UA-29092818-7'  // beta id
} else {
    tracking_id = 'UA-29092818-6'  // NGS id
}

createApp(App)
        .use(router)
        .use(vuetify)
        .use(store)
        .use(VueGtag, {
            isEnabled: import.meta.env.MODE === 'production',
            property: {id: tracking_id},
        })
        .use(createPinia())
        .component('FaIcon', FontAwesomeIcon)
        .component('FaLayers', FontAwesomeLayers)
        .mount('#app')

// Enable Analytics tracking for SPAs
trackRouter(router)
