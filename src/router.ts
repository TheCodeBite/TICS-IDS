import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/register.vue';
import About from './views/About.vue';
import Sale from './views/Sale.vue';
import Transaccion from './views/transacction.vue';

Vue.use(Router);

const router= new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: Sale,
    },
    {
      path: '/transacciones',
      name: 'transacciones',
      component: Transaccion,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    { path: '*', redirect: '/login' }
  ],
});
router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn){
    return next('/login');
  }
  next();
})

export default router;
