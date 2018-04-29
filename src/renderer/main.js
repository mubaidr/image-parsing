import Vue from 'vue'
import 'bulma-fluent/css/bulma.css'

import './mixins'

import './assets/style/main.sass'
import './assets/style/animations.sass'
import './assets/fontawesome/css/fontawesome-all.css'

import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.config.devtools = false

Vue.use(require('vue-electron'))

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

// eslint-disable-next-line
global.__paths = require('../utilities/data-paths.js').__paths

// fabric.js
Vue.prototype.$fabric = fabric

/* Enable webpack hot reloading */
if (module.hot) {
  module.hot.accept();
}
