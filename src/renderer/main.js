import Vue from 'vue'
import 'bulma-pro/bulma.sass'
// import 'bulma-fluent/bulma.sass'

// import the styles
import 'vue-good-table/dist/vue-good-table.css'

import './assets/style/main.sass'
import './assets/style/animations.sass'
import './assets/fontawesome/css/fontawesome-all.css'
import 'epic-spinners/dist/lib/epic-spinners.min.css'

import VModal from 'vue-js-modal'
import VueGoodTablePlugin from 'vue-good-table'
import { AtomSpinner, LoopingRhombusesSpinner } from 'epic-spinners/src/lib'

import App from './App.vue'
import router from './router'

Vue.use(VModal)
Vue.use(VueGoodTablePlugin)

// eslint-disable-next-line
import { ipcRenderer } from 'electron'

const isDev = process.env.NODE_ENV === 'development'

Vue.config.devtools = isDev
Vue.config.performance = isDev
Vue.config.productionTip = false

/** register spinners */
Vue.component('atom-spinner', AtomSpinner)
Vue.component('looping-rhombuses-spinner', LoopingRhombusesSpinner)

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
