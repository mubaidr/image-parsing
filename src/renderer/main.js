import Vue from 'vue'
import Toasted from 'vue-toasted'

// import the styles
import 'bulma-fluent/bulma.sass'
import 'material-design-icons/iconfont/material-icons.css'

import './assets/style/animations.scss'
import './assets/style/main.scss'

import App from './App.vue'
import router from './router/index'

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

// tslint:disable-next-line: no-unused-expression
new Vue({
  el: '#app',
  router,
  render: h => h(App),
})

// menu routes handler
ipcRenderer.addListener('event', data => {
  if (data.route) {
    router.push(data.route)
  }
})
