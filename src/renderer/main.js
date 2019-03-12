import Vue from 'vue'
import 'bulma-pro/bulma.sass'

import Toasted from 'vue-toasted'

// import the styles
import 'material-design-icons/iconfont/material-icons.css'

import './assets/style/main.sass'
import './assets/style/animations.sass'

import App from './App.vue'
import router from './router'

// eslint-disable-next-line
import { ipcRenderer } from 'electron'

const isDev = process.env.NODE_ENV === 'development'

Vue.use(Toasted, {
  duration: 3000,
  Icon: 'info',
  iconPack: 'material',
  position: 'bottom-center',
  type: 'info',
})

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
