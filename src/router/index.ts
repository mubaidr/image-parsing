import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// generate
// import Generate from '../views/Generate.vue'
// import AnswerSheets from '../views/Generate/AnswerSheets.vue'
// help
// import Help from '../views/Help.vue'
// import About from '../views/Help/About.vue'
// import Contact from '../views/Help/Contact.vue'
import Home from '../views/Home.vue'
// process
// import Process from '../views/Process.vue'
// import Compile from '../views/Process/Compile.vue'
// import Extract from '../views/Process/Extract.vue'
// import Review from '../views/Process/Review.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    meta: {
      title: 'Home',
    },
    component: Home,
  },
  // {
  //   path: '/generate',
  //   meta: {
  //     title: 'Generate',
  //   },
  //   component: Generate,
  //   children: [
  //     {
  //       path: '/generate/answer-sheets',
  //       meta: {
  //         title: 'Generate Answer Sheets',
  //       },
  //       component: AnswerSheets,
  //     },
  //   ],
  // },
  // {
  //   path: '/process',
  //   meta: {
  //     title: 'Process',
  //   },
  //   component: Process,
  //   children: [
  //     {
  //       path: '/process/extract',
  //       meta: {
  //         title: 'Extract Results',
  //       },
  //       component: Extract,
  //     },
  //     {
  //       path: '/process/review',
  //       meta: {
  //         title: 'Review Results',
  //       },
  //       component: Review,
  //     },
  //     {
  //       path: '/process/compile',
  //       meta: {
  //         title: 'Compile Results',
  //       },
  //       component: Compile,
  //     },
  //   ],
  // },
  // {
  //   path: '/help',
  //   meta: {
  //     title: 'Help',
  //   },
  //   component: Help,
  //   children: [
  //     {
  //       path: '/help/contact',
  //       meta: {
  //         title: 'Contact',
  //       },
  //       component: Contact,
  //     },
  //     {
  //       path: '/help/about',
  //       meta: {
  //         title: 'About',
  //       },
  //       component: About,
  //     },
  //   ],
  // },
  {
    path: '*',
    redirect: '/home',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.afterEach((to) => {
  // TODO: get name from APP
  const productName = process.env.PRODUCT_NAME || ''

  document.title =
    to.path === '/home' ? productName : `${to.meta.title} - ${productName}`
})

export default router
