
const systemRouter = {
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
      component: (resolve) => require(['@/views/system/dashboard'], resolve),
      meta: {title: 'dashboard', icon: 'dashboard'}
    }
  ]
}

export default systemRouter
