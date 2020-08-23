import Vue from "vue";
import Router from "vue-router";
// compile
import Compile from "../views/Compile.vue";
// generate
import Generate from "../views/Generate.vue";
import AnswerSheets from "../views/Generate/AnswerSheets.vue";
// help
import Help from "../views/Help.vue";
import About from "../views/Help/About.vue";
import Contact from "../views/Help/Contact.vue";
import Home from "../views/Home.vue";
// process
import Process from "../views/Process.vue";
import Extract from "../views/Process/Extract.vue";
import Review from "../views/Process/Review.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/home",
      meta: {
        title: "Home",
      },
      component: Home,
    },
    {
      path: "/generate",
      meta: {
        title: "Generate",
      },
      component: Generate,
      children: [
        {
          path: "/generate/answer-sheets",
          meta: {
            title: "Generate Answer Sheets",
          },
          component: AnswerSheets,
        },
      ],
    },
    {
      path: "/process",
      meta: {
        title: "Process",
      },
      component: Process,
      children: [
        {
          path: "/process/extract",
          meta: {
            title: "Extract Results",
          },
          component: Extract,
        },
        {
          path: "/process/review",
          meta: {
            title: "Review Results",
          },
          component: Review,
        },
      ],
    },
    {
      path: "/compile",
      meta: {
        title: "Compile",
      },
      component: Compile,
    },
    {
      path: "/help",
      meta: {
        title: "Help",
      },
      component: Help,
      children: [
        {
          path: "/help/contact",
          meta: {
            title: "Contact",
          },
          component: Contact,
        },
        {
          path: "/help/about",
          meta: {
            title: "About",
          },
          component: About,
        },
      ],
    },
    {
      path: "*",
      redirect: "/home",
    },
  ],
});

router.afterEach((to) => {
  const productName = process.env.PRODUCT_NAME || "";

  document.title =
    to.path === "/home" ? productName : `${to.meta.title} - ${productName}`;
});

export default router;
