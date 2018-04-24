import Vue from 'vue'
import 'bulma-fluent/css/bulma.css'

import vueElectron from 'vue-electron'

import './mixins'

import './assets/style/main.sass'
import './assets/style/animations.sass'
import './assets/fontawesome/css/fontawesome-all.css'

import App from './App'
import router from './router'
import store from './store'
import dataPaths from "../../../utilities/data-paths.js";

Vue.use(vueElectron)

// eslint-disable-next-line
global.__paths = dataPaths()

Vue.config.productionTip = false
Vue.config.devtools = false

// eslint-disable-next-line
const app = new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
