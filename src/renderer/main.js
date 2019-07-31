import 'bulma-pro/bulma.sass'
import { ipcRenderer } from 'electron'
import 'material-design-icons/iconfont/material-icons.css'
import Vue from 'vue'
import Toasted from 'vue-toasted'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import App from './App.vue'
import './assets/style/animations.scss'
import './assets/style/main.scss'
import router from './router/index'
import store from './store/index'

const isDev = process.env.NODE_ENV === 'development'

Vue.use(Toasted, {
  duration: 2500,
  Icon: 'info',
  iconPack: 'material',
  position: 'bottom-center',
  type: 'info',
})
Vue.use(VueVirtualScroller)

Vue.config.devtools = isDev
Vue.config.performance = isDev
Vue.config.productionTip = false

// tslint:disable-next-line: no-unused-expression
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

// menu routes handler
ipcRenderer.on('change-view', (event, data) => {
  if (data.route) {
    router.push(data.route)
  }
})
