import Vue from 'vue'
import 'bulma-pro/bulma.sass'

// import the styles
import 'vue-good-table/dist/vue-good-table.css'
import 'material-design-icons/iconfont/material-icons.css'

import './assets/style/main.sass'
import './assets/style/animations.sass'

import VModal from 'vue-js-modal'
import VueGoodTablePlugin from 'vue-good-table'

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

/* eslint-disable no-new */
new Vue({
  components: {
    App,
  },
  router,
  template: '<App/>',
}).$mount('#app')

// menu routes handler
ipcRenderer.addListener('event', (e, data) => {
  if (data.route) {
    router.push(data.route)
  }
})
