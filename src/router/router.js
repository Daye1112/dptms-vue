import Main from '@/views/Main'
import systemRouter from './modules/systemRouter'

const componentsRouter = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/login',
    name: 'login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/main',
    name: 'main',
    component: Main,
    redirect: '/main/home',
    hidden: true,
    children: [
      {
        path: 'home',
        name: 'home',
        component: (resolve) => require(['@/views/home'], resolve),
        meta: {title: '首页', icon: 'dashboard'}
      },
      systemRouter
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default componentsRouter
