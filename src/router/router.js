import Main from '@/views/Main'
import authRouter from './modules/authRouter'
import systemRouter from './modules/systemRouter'
import monitorRouter from './modules/monitorRouter'
import serviceRouter from './modules/serviceRouter'

export const constantRoutes = [
  {
    path: '/',
    component: Main,
    redirect: '/home',
    hidden: true,
    children: [
      {
        path: 'home',
        name: 'home',
        component: (resolve) => require(['@/views/home'], resolve),
        meta: {title: '首页'}
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/profile',
    component: Main,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'profile',
        component: (resolve) => require(['@/views/profile'], resolve),
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@/views/error/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  systemRouter,
  authRouter,
  monitorRouter,
  serviceRouter
]
