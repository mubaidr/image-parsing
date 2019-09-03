import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home.vue'
// generate
import Generate from '../views/Generate.vue'
import AnswerSheets from '../views/Generate/AnswerSheets.vue'
import TestData from '../views/Generate/TestData.vue'
// process
import Process from '../views/Process.vue'
import Extract from '../views/Process/Extract.vue'
import Review from '../views/Process/Review.vue'
// compile
import Compile from '../views/Compile.vue'
// utilities
import Utilities from '../views/Utilities.vue'
import TrainNN from '../views/Utilities/train-nn.vue'
// help
import Help from '../views/Help.vue'
import Contact from '../views/Help/Contact.vue'
import About from '../views/Help/About.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home',
      meta: {
        title: 'Home',
      },
      component: Home,
    },
    {
      path: '/generate',
      meta: {
        title: 'Generate',
      },
      component: Generate,
      children: [
        {
          path: '/generate/answer-sheets',
          meta: {
            title: 'Generate Answer Sheets',
          },
          component: AnswerSheets,
        },
        {
          path: '/generate/_test_data',
          meta: {
            title: 'Generate Test Data',
          },
          component: TestData,
        },
      ],
    },
    {
      path: '/process',
      meta: {
        title: 'Process',
      },
      component: Process,
      children: [
        {
          path: '/process/extract',
          meta: {
            title: 'Extract Results',
          },
          component: Extract,
        },
        {
          path: '/process/review',
          meta: {
            title: 'Review Results',
          },
          component: Review,
        },
      ],
    },
    {
      path: '/compile',
      meta: {
        title: 'Compile',
      },
      component: Compile,
    },
    {
      path: '/utilities',
      meta: {
        title: 'Utilities',
      },
      component: Utilities,
      children: [
        {
          path: '/utilities/train',
          meta: {
            title: 'Train',
          },
          component: TrainNN,
        },
      ],
    },
    {
      path: '/help',
      meta: {
        title: 'Help',
      },
      component: Help,
      children: [
        {
          path: '/help/contact',
          meta: {
            title: 'Contact',
          },
          component: Contact,
        },
        {
          path: '/help/about',
          meta: {
            title: 'About',
          },
          component: About,
        },
      ],
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
      : `${to.meta.title} - ${process.env.PRODUCT_NAME}`
})

export default router
