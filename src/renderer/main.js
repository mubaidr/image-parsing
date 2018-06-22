import Vue from 'vue'
import 'bulma-fluent/css/bulma.css'
import 'bulma-addons/css/bulma.css'

import './mixins'

import './assets/style/main.sass'
import './assets/style/animations.sass'
import './assets/fontawesome/css/fontawesome-all.css'

// barcode fonts
// import './assets/free3of9/fre3of9x.ttf'

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
