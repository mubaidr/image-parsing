import Vue from 'vue'
import 'bulma-pro/bulma.sass'

import './assets/style/main.sass'
import './assets/style/animations.sass'
import './assets/fontawesome/css/fontawesome-all.css'
import 'epic-spinners/dist/lib/epic-spinners.min.css'

import { AtomSpinner } from 'epic-spinners/dist/lib/epic-spinners.min.js'

import App from './App.vue'
import router from './router'

// eslint-disable-next-line
import { ipcRenderer } from 'electron'

const isDev = process.env.NODE_ENV === 'development'

Vue.config.devtools = isDev
Vue.config.performance = isDev
Vue.config.productionTip = false

/** register spinners */
Vue.component('atom-spinner', AtomSpinner)

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

// menu routes handler
ipcRenderer.addListener('event', (e, data) => {
  if (data.route) {
    router.push(data.route)
  }
})
