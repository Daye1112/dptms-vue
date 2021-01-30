const systemRouter = {
  path: '/system',
  name: 'system',
  redirect: '/system/systemIndex',
  component: (resolve) => require(['@/views/system/Main'], resolve),
  meta: {
    menuCode: 'SYS_MANAGE',
    icon: 'system-manage',
    title: '系统管理'
  },
  children: [
    {
      path: 'systemIndex',
      name: 'systemIndex',
      hidden: true,
      component: (resolve) => require(['@/views/system/index'], resolve),
      meta: {title: '系统管理'}
    },
    {
      path: 'cache',
      name: 'cache',
      component: (resolve) => require(['@/views/system/cache'], resolve),
      meta: {menuCode: 'SYS_CACHE_MANAGE', title: '缓存管理', icon: 'cache'}
    },
  ]
}

export default systemRouter
