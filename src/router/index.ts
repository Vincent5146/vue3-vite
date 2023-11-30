import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    // 通配符路由，匹配所有不在路由配置中的路径
    path: "/:catchAll(.*)",
    redirect: { name: "home", query: { lang: "en" } }, // 重定向到首页
  },
  {
    path: "/",
    name: "layout",
    component: () => import(/* webpackChunkName: "about" */ "../pages/layout.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import(/* webpackChunkName: "home" */ "../pages/HomeView.vue"),
      },
      {
        path: "/about",
        name: "about",
        component: () => import(/* webpackChunkName: "about" */ "../pages/AboutView.vue"),
      },
      {
        path: "/news",
        name: "news",
        component: () => import(/* webpackChunkName: "news" */ "../pages/NewsView.vue"),
      },
      {
        path: "/news/newsdetail/:id",
        name: "newsdetail",
        // path: "product/:productId",
        component: () => import("../pages/NewsdetailView.vue"),
      },
      {
        path: "/product",
        name: "product",
        component: () => import(/* webpackChunkName: "product" */ "../pages/ProductView.vue"),
      },
      {
        path: "/product/productdetail/:productId",
        name: "productdetail",
        // path: "product/:productId",
        component: () => import("../pages/ProductdetailView.vue"),
      },
      {
        path: "/faq",
        name: "faq",
        component: () => import(/* webpacksChunkName: "faq" */ "../pages/FaqView.vue"),
      },
      {
        path: "/wheretobuy",
        name: "wheretobuy",
        component: () => import(/* webpackChunkName: "wheretobuy" */ "../pages/WheretobuyView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }; // 将滚动位置设为顶部
  },
});

router.beforeEach((to, from, next) => {
  console.log(from);
  if (to.path === "/") {
    next({ name: "home", query: { lang: "en" } });
  } else {
    next();
  }
});

export default router;
