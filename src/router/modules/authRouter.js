const authRouter = {
  path: '/auth',
  name: 'auth',
  redirect: '/auth/authIndex',
  component: (resolve) => require(['@/views/auth/Main'], resolve),
  meta: {
    menuCode: 'AUTH_MANAGE',
    icon: 'auth-manage',
    title: '安全管理'
  },
  children: [
    {
      path: 'authIndex',
      name: 'authIndex',
      hidden: true,
      component: (resolve) => require(['@/views/auth/index'], resolve),
      meta: {title: '安全管理'}
    },
    {
      path: 'organization',
      name: 'organization',
      component: (resolve) => require(['@/views/auth/organization'], resolve),
      meta: {menuCode: 'SYS_ORGANIZATION_MANAGE', title: '组织管理', icon: 'organization'}
    },
    {
      path: 'user',
      name: 'user',
      component: (resolve) => require(['@/views/auth/user'], resolve),
      meta: {menuCode: 'SYS_USER_MANAGE', title: '用户管理', icon: 'user'}
    },
    {
      path: 'role',
      name: 'role',
      component: (resolve) => require(['@/views/auth/role'], resolve),
      meta: {menuCode: 'SYS_ROLE_MANAGE', title: '角色管理', icon: 'role'}
    },
    {
      path: 'menu',
      name: 'menu',
      component: (resolve) => require(['@/views/auth/menu'], resolve),
      meta: {menuCode: 'SYS_MENU_MANAGE', title: '菜单管理', icon: 'menu'}
    },
    {
      path: 'permission',
      name: 'permission',
      component: (resolve) => require(['@/views/auth/permission'], resolve),
      meta: {menuCode: 'SYS_PERMISSION_MANAGE', title: '权限管理', icon: 'permission'}
    },
    {
      path: 'onlineUser',
      name: 'onlineUser',
      component: (resolve) => require(['@/views/auth/onlineUser'], resolve),
      meta: {menuCode: 'SYS_ONLINE_USER_MANAGE', title: '在线用户', icon: 'onlineUser'}
    },
  ]
}

export default authRouter
