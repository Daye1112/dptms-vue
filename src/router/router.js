import Main from '@/views/Main'
import systemRouter from './modules/systemRouter'

const componentsRouter = [
  // componentsRouter,
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
    path: '/main',
    name: 'main',
    component: Main,
    redirect: '/main/home',
    hidden: true,
    children: [
      {
        path: 'home',
        name: 'home',
        component: (resolve) => require(['@/views/home'], resolve)
      },
      systemRouter
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default componentsRouter
