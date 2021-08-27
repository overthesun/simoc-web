import Vue from 'vue'
import VueGtag from 'vue-gtag'

import {library} from '@fortawesome/fontawesome-svg-core'
import {faPause, faPlay, faStepBackward, faStepForward, faMinus, faPlus, faTimes,
        faBars, faArrowsAlt, faArrowLeft, faArrowRight, faInfoCircle, faListUl, faCircle,
        faPlusCircle, faMale, faTrash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon, FontAwesomeLayers} from '@fortawesome/vue-fontawesome'
import store from './store/index'
import router from './router'
import App from './App'

Vue.config.productionTip = false

library.add(faPlay, faPause, faStepBackward, faStepForward, faMinus, faPlus, faTimes,
            faBars, faArrowsAlt, faArrowLeft, faArrowRight, faInfoCircle, faListUl, faCircle,
            faPlusCircle, faMale, faTrash)

Vue.component('fa-icon', FontAwesomeIcon)
Vue.component('fa-layers', FontAwesomeLayers)

// enable Gtag/Analytics tracking
Vue.use(VueGtag, {
    // remember to use the right code for each branch
    config: {id: 'UA-29092818-6'},
    enabled: process.env.NODE_ENV === 'production',
}, router)


new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
