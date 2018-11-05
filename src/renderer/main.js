import Vue from 'vue'
import 'bulma-pro/bulma.sass'
import 'bulma-addons/bulma.sass'

import './assets/style/main.sass'
import './assets/style/animations.sass'
import './assets/fontawesome/css/fontawesome-all.css'

import './mixins'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.config.devtools = false

/* eslint-disable no-new */
new Vue({
  components: {
    App,
  },
  router,
  store,
  template: '<App/>',
}).$mount('#app')

/* Enable webpack hot reloading */
if (module && module.hot) {
  module.hot.accept()
}
