import 'bulma-fluent'
import { ipcRenderer } from 'electron'
import 'material-design-icons/iconfont/material-icons.css'
import { createApp } from 'vue'
import VueToasted from 'vue-toasted'
import VueVirtualScroller from 'vue-virtual-scroller'
import App from './App.vue'
import './assets/style/animations.scss'
import './assets/style/main.scss'
import router from './router'
import store from './store'

// Vue.use(Toasted, {
//   duration: 2500,
//   Icon: "info",
//   iconPack: "material",
//   position: "bottom-center",
//   type: "info"
// });

// Vue.use(VueVirtualScroller);

const app = createApp(App).use(store).use(router)

app.component('vue-toasted', VueToasted)
app.component('vue-virtual-scroller', VueVirtualScroller)

app.mount('#app')

// menu routes handler
ipcRenderer.on('change-view', (event, data) => {
  const { route } = data

  if (route && route !== router.currentRoute.value) {
    router.push(route)
  }
})
