import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Nav from "../views/Nav.vue";
import NewsList from "../views/NewsList.vue";
import NewsEdit from "../views/NewsEdit.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/mvm",
    name: "nav",
    component: Nav,
    children: [
      {
        path: "/home",
        name: "home",
        component: Home,
      },
      {
        path: "/news",
        name: "newslist",
        component: NewsList,
      },
      {
        path: "/news/edit/:id",
        name: "news",
        component: NewsEdit,
        props: true,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next("/login");
  }

  next();
});

router.push("home");

export default router;
