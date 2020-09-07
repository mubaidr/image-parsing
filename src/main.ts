// @ts-ignore
import('v8-compile-cache')

import { createApp } from 'vue'
import App from './App.vue'
import './assets/scss/animations.scss'
import './assets/scss/app.scss'
import router from './router'

createApp(App).use(router).mount('#app')

// TODO: vue add vuetify
