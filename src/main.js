import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index.js";
import VueGtag from "vue-gtag";

Vue.config.productionTip = false;

import { library } from '@fortawesome/fontawesome-svg-core'
import {faPause,faPlay,faStepBackward,faStepForward,faMinus,faPlus,faTimes,faBars,faArrowLeft,faArrowRight,faInfoCircle,faListUl,faCircle,faPlusCircle,faMale,faTrash,faChevronLeft,faChevronRight} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

library.add(faPlay,faPause,faStepBackward,faStepForward,faMinus,faPlus,faTimes,faBars,faArrowLeft,faArrowRight,faInfoCircle,faListUl,faCircle,faPlusCircle,faMale,faTrash,faChevronLeft,faChevronRight)

Vue.component('fa-icon', FontAwesomeIcon)
Vue.component('fa-layers',FontAwesomeLayers)

// enable Gtag/Analytics tracking
Vue.use(VueGtag, {
  // remember to use the right code for each branch
  config: {id: 'UA-29092818-6'},
  enabled: process.env.NODE_ENV === 'production',
}, router);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
