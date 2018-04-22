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
      meta: {
        title: 'Home',
        icon: 'fa-home'
      },
      component: require('@/components/Home').default
    },
    {
      path: '/design',
      meta: {
        title: 'Design',
        icon: 'fa-object-group'
      },
      component: require('@/components/Design').default
    },
    {
      path: '/generate',
      meta: {
        title: 'Generate',
        icon: 'fa-file-alt'
      },
      component: require('@/components/Generate').default,
      children: [{
          path: 'choose-design', // design
          meta: {
            title: 'Design',
            icon: 'fa-object-group'
          },
          component: require('@/components/Generate/Design').default
        },
        {
          path: 'choose-data',
          meta: {
            title: 'Data',
            icon: 'fa-database'
          },
          component: require('@/components/Generate/Data').default
        },
        {
          path: 'choose-options',
          meta: {
            title: 'Options',
            icon: 'fa-qrcode'
          },
          component: require('@/components/Generate/options').default
        },
        {
          path: 'start-generate',
          meta: {
            title: 'Generate',
            icon: 'fa-play'
          },
          component: require('@/components/Generate/Progress').default
        }
      ]
    },
    {
      path: '/process',
      meta: {
        title: 'Process',
        icon: 'fa-play'
      },
      component: require('@/components/Process').default,
      children: [{
          path: 'choose-design',
          meta: {
            title: 'Design',
            icon: 'fa-object-group'
          },
          component: require('@/components/Process/Design').default
        },
        {
          path: 'choose-data',
          meta: {
            title: 'Data',
            icon: 'fa-database'
          },
          component: require('@/components/Process/Data').default
        },
        {
          path: 'choose-options',
          meta: {
            title: 'Options',
            icon: 'fa-qrcode'
          },
          component: require('@/components/Process/options').default
        },
        {
          path: 'start-process',
          meta: {
            title: 'Process',
            icon: 'fa-play'
          },
          component: require('@/components/Process/Progress').default
        }
      ]
    },
    {
      path: '/about',
      meta: {
        title: 'About',
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
