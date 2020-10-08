import { ipcRenderer } from 'electron'
import 'v8-compile-cache'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/scss/animations.scss'
import './assets/scss/app.scss'
import router from './router'

createApp(App).use(router).mount('#app')

// TODO: vue add vuetify
// TODO: add de skew view

// menu routes handler
ipcRenderer.on('change-view', (event, data) => {
  const { route } = data

  if (route && route !== router.currentRoute.value) {
    router.push(route)
  }
})
