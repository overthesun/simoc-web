import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index.js";

Vue.config.productionTip = false;

import { library } from '@fortawesome/fontawesome-svg-core'
import {faPause,faPlay,faStepBackward,faStepForward,faMinus,faPlus,faTimes,faBars,faArrowLeft,faArrowRight,faInfoCircle,faCircle,faPlusCircle,faMale,faTrash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

library.add(faPlay,faPause,faStepBackward,faStepForward,faMinus,faPlus,faTimes,faBars,faArrowLeft,faArrowRight,faInfoCircle,faCircle,faPlusCircle,faMale,faTrash)

Vue.component('fa-icon', FontAwesomeIcon)
Vue.component('fa-layers',FontAwesomeLayers)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
