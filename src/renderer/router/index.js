import Vue from 'vue'
import Router from 'vue-router'
import About from '../views/About'
import Compile from '../views/Compile'
import Extract from '../views/Extract'
import Generate from '../views/Generate'
import Help from '../views/Help'
import Home from '../views/Home'
import Review from '../views/Review'
import Train from '../views/Train'

Vue.use(Router)

const router = new Router({
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
      component: Home,
    },
    {
      path: '/generate',
      meta: {
        title: 'Generate',
        icon: 'fa-file-alt',
      },
      component: Generate,
    },
    {
      path: '/process',
      redirect: '/extract',
    },
    {
      path: '/extract',
      meta: {
        title: 'Extract Results',
        icon: 'fa-play',
      },
      component: Extract,
    },
    {
      path: '/review',
      meta: {
        title: 'Review Results',
        icon: 'fa-play',
      },
      component: Review,
    },
    {
      path: '/compile',
      meta: {
        title: 'Compile',
        icon: 'fa-tasks',
      },
      component: Compile,
    },
    {
      path: '/train',
      meta: {
        title: 'Train',
        icon: 'fa-vials',
      },
      component: Train,
    },
    {
      path: '/about',
      meta: {
        title: 'About',
        icon: 'fa-info-circle',
      },
      component: About,
    },
    {
      path: '/help',
      meta: {
        title: 'Help',
        icon: 'fa-info-circle',
      },
      component: Help,
    },
    {
      path: '*',
      redirect: '/home',
    },
  ],
})

router.afterEach(to => {
  document.title =
    to.path === '/home'
      ? process.env.PRODUCT_NAME
      : `${ to.meta.title } - ${ process.env.PRODUCT_NAME }`
})

export default router
