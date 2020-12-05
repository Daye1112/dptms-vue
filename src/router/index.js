import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'
// import componentsRouter from './modules/components'

Vue.use(Router)
export const constantRoutes = [
  // componentsRouter,
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/main',
    name: 'main',
    component: Main,
    redirect: '/main/system',
    hidden: true,
    children: [
      {
        path: 'system',
        name: 'system',
        redirect: '/main/system/dashboard',
        hidden: true,
        component: (resolve) => require(['@/views/system/Main'], resolve),
        meta: {
          menuCode: 'SYSTEM_MANAGE',
          icon: 'dashboard'
        },
        children: [
          {
            path: 'dashboard',
            name: 'dashboard',
            component: (resolve) => require(['@/views/system/dashboard/dashboard'], resolve),
            meta: {title: 'dashboard', icon: 'dashboard'}
          }
        ]
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
