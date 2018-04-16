import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
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
      path: '/design',
      name: 'Design',
      component: require('@/components/Design').default,
      children: [{
          path: 'start',
          name: 'Start'
        },
        {
          path: 'edit',
          name: 'Edit'
        }
      ]
    },
    {
      path: '/generate',
      name: 'Generate',
      component: require('@/components/Generate').default,
      children: [{
        path: 'start',
        name: 'Start'
      }]
    },
    {
      path: '/process',
      name: 'Process',
      component: require('@/components/Process').default,
      children: [{
          path: 'start',
          name: 'Start'
        },
        {
          path: 'load',
          name: 'Load'
        },
        {
          path: 'identify',
          name: 'Identify'
        },
        {
          path: 'progress',
          name: 'Progress'
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
