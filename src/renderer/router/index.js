import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      redirect: '/'
    },
    {
      path: '/',
      name: 'Home',
      component: require('@/components/Home').default
    },
    {
      path: '/about',
      name: 'About',
      component: require('@/components/About').default
    },
    {
      path: '/load',
      name: 'Load',
      component: require('@/components/Load').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
