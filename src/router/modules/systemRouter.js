const systemRouter = {
  path: '/system',
  name: 'system',
  redirect: '/system/dashboard',
  component: (resolve) => require(['@/views/system/Main'], resolve),
  meta: {
    menuCode: 'SYS_MANAGE',
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
      meta: {menuCode: 'SYS_ORGANIZATION_MANAGE',title: '组织管理', icon: 'organization'}
    },
    {
      path: 'user',
      name: 'user',
      component: (resolve) => require(['@/views/system/user'], resolve),
      meta: {menuCode: 'SYS_USER_MANAGE',title: '用户管理', icon: 'user'}
    },
    {
      path: 'role',
      name: 'role',
      component: (resolve) => require(['@/views/system/role'], resolve),
      meta: {menuCode: 'SYS_ROLE_MANAGE',title: '角色管理', icon: 'role'}
    },
    {
      path: 'menu',
      name: 'menu',
      component: (resolve) => require(['@/views/system/menu'], resolve),
      meta: {menuCode: 'SYS_MENU_MANAGE',title: '菜单管理', icon: 'menu'}
    },
    {
      path: 'permission',
      name: 'permission',
      component: (resolve) => require(['@/views/system/permission'], resolve),
      meta: {menuCode: 'SYS_PERMISSION_MANAGE',title: '权限管理', icon: 'permission'}
    },
  ]
}

export default systemRouter
