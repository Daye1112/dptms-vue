import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'
// import componentsRouter from './modules/components'

Vue.use(Router)
export const constantRoutes = [
  // componentsRouter,
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/',
    component: Main,
    hidden: true,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/dashboard/index'], resolve),
        name: 'Dashboard',
        meta: {title: 'dashboard', icon: 'dashboard'}
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
