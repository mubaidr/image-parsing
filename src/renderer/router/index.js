import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      meta: {
        icon: 'fa-home'
      },
      component: require('@/components/Home').default
    },
    {
      path: '/design',
      name: 'Design',
      meta: {
        icon: 'fa-object-group'
      },
      component: require('@/components/Design').default
    },
    {
      path: '/generate',
      name: 'Generate',
      meta: {
        icon: 'fa-file-alt'
      },
      component: require('@/components/Generate').default
    },
    {
      path: '/process',
      name: 'Process',
      meta: {
        icon: 'fa-play'
      },
      component: require('@/components/Process').default,
      children: [{
          path: 'chooseDesign', // design
          name: 'Select Design',
          meta: {
            icon: 'fa-object-group'
          },
          component: require('@/components/Process/Design').default
        },
        {
          path: 'chooseData',
          name: 'Select Data',
          meta: {
            icon: 'fa-database'
          },
          component: require('@/components/Process/Data').default
        },
        {
          path: 'identifySource',
          name: 'Customize Options',
          meta: {
            icon: 'fa-qrcode'
          },
          component: require('@/components/Process/Identify').default
        },
        {
          path: 'startProcess',
          name: 'Process Now',
          meta: {
            icon: 'fa-play'
          },
          component: require('@/components/Process/Progress').default
        }
      ]
    },
    {
      path: '/about',
      name: 'About',
      meta: {
        icon: 'fa-info-circle'
      },
      component: require('@/components/About').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
