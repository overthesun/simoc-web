import {createApp} from 'vue'
import VueGtag from 'vue-gtag-next'

import {library} from '@fortawesome/fontawesome-svg-core'
import {faPause, faPlay, faStepBackward, faStepForward, faMinus, faPlus, faTimes,
        faBars, faArrowLeft, faArrowRight, faInfoCircle, faListUl, faCircle,
        faPlusCircle, faMale, faTrash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon, FontAwesomeLayers} from '@fortawesome/vue-fontawesome'
import store from './store/index'
import router from './router'
import App from './App'

library.add(faPlay, faPause, faStepBackward, faStepForward, faMinus, faPlus, faTimes,
            faBars, faArrowLeft, faArrowRight, faInfoCircle, faListUl, faCircle,
            faPlusCircle, faMale, faTrash)

createApp(App)
        .use(router)
        .use(store)
        .use(VueGtag, {
            // enable Gtag/Analytics tracking
            // remember to use the right code for each branch
            config: {id: 'UA-29092818-6'},
            enabled: process.env.NODE_ENV === 'production',
        }, router)
        .component('FaIcon', FontAwesomeIcon)
        .component('FaLayers', FontAwesomeLayers)
        .mount('#app')
