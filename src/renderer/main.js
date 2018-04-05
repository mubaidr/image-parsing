import Vue from 'vue'

import 'bulma-fluent/css/bulma.css'
import './assets/main.sass'
import './assets/animations.sass'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.config.productionTip = false
Vue.config.devtools = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
