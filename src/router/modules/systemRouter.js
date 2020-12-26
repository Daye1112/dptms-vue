
const systemRouter = {
  path: '/system',
  name: 'system',
  redirect: '/system/dashboard',
  component: (resolve) => require(['@/views/system/Main'], resolve),
  meta: {
    menuCode: 'SYSTEM_MANAGE',
    icon: 'system-manage',
    title: '系统管理'
  },
  children: [
    {
      path: 'dashboard',
      name: 'dashboard',
      component: (resolve) => require(['@/views/system/dashboard'], resolve),
      meta: {title: '主页', icon: 'dashboard'}
    }
  ]
}

export default systemRouter