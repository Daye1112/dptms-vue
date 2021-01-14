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
    },
    {
      path: 'organization',
      name: 'organization',
      component: (resolve) => require(['@/views/system/organization'], resolve),
      meta: {title: '组织管理', icon: 'organization'}
    },
    {
      path: 'user',
      name: 'user',
      component: (resolve) => require(['@/views/system/user'], resolve),
      meta: {title: '用户管理', icon: 'user'}
    },
    {
      path: 'role',
      name: 'role',
      component: (resolve) => require(['@/views/system/role'], resolve),
      meta: {title: '角色管理', icon: 'role'}
    },
    {
      path: 'menu',
      name: 'menu',
      component: (resolve) => require(['@/views/system/menu'], resolve),
      meta: {title: '菜单管理', icon: 'menu'}
    },
    {
      path: 'permission',
      name: 'permission',
      component: (resolve) => require(['@/views/system/permission'], resolve),
      meta: {title: '权限管理', icon: 'permission'}
    },
  ]
}

export default systemRouter
