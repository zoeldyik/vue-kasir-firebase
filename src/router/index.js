import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import {fbAuth} from "../firebase/config"
import store from "../store/index"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: ()=> import('../views/dashboard/Dashboard.vue')
  },
  {
    path: "/dashboard/categories",
    name: "categories",
    component: ()=> import('../views/dashboard/Categories.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  const checkUser = fbAuth.currentUser;
    
  (checkUser) ? store.commit('setIsLogin',true) : store.commit('setIsLogin', false);

  if(to.path === '/dashboard' || to.path === '/categories'){
    if(checkUser){
      return next();
    }else{
      return router.push('/login');
    }
  }else if(to.path === '/login'){
    if(checkUser){
      return router.push('/dashboard');
    }else{
      return next();
    }
  }else{
    return next();
  }
})

export default router
