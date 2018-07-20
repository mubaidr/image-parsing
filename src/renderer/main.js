import Vue from 'vue'
import 'bulma-fluent/css/bulma.css'
import 'bulma-addons/css/bulma.css'

import './mixins'

import './assets/style/main.sass'
import './assets/style/animations.sass'
import './assets/fontawesome/css/fontawesome-all.css'

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
Vue.config.devtools = false

/* eslint-disable no-new */
new Vue({
  components: {
    App,
  },
  router,
  template: '<App/>',
}).$mount('#app')

/* Enable webpack hot reloading */
if (module && module.hot) {
  module.hot.accept()
}
