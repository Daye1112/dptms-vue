import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
// import componentsRouter from './modules/components'

Vue.use(Router)
export const constantRoutes = [
  // componentsRouter,
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
