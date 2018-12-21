/* eslint-disable global-require */

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      meta: {
        title: 'Home',
        icon: 'fa-home',
      },
      component: require('@/components/Home.vue').default,
    },
    {
      path: '/generate',
      meta: {
        title: 'Generate',
        icon: 'fa-file-alt',
      },
      component: require('@/components/Generate.vue').default,
    },
    {
      path: '/process',
      meta: {
        title: 'Process',
        icon: 'fa-play',
      },
      component: require('@/components/Process.vue').default,
    },
    {
      path: '/compile',
      meta: {
        title: 'Compile',
        icon: 'fa-tasks',
      },
      component: require('@/components/Compile.vue').default,
    },
    {
      path: '/train',
      meta: {
        title: 'Train',
        icon: 'fa-vials',
      },
      component: require('@/components/Train.vue').default,
    },
    {
      path: '/about',
      meta: {
        title: 'About',
        icon: 'fa-info-circle',
      },
      component: require('@/components/About.vue').default,
    },
    {
      path: '/help',
      meta: {
        title: 'Help',
        icon: 'fa-info-circle',
      },
      component: require('@/components/Help.vue').default,
    },
    {
      path: '*',
      redirect: '/home',
    },
  ],
})
