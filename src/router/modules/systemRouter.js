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
    {
      path: 'application',
      name: 'application',
      component: (resolve) => require(['@/views/system/application'], resolve),
      meta: {menuCode: 'SYS_APPLICATION_MANAGE', title: '应用管理', icon: 'application'}
    },
    {
      path: 'config',
      name: 'config',
      component: (resolve) => require(['@/views/system/config'], resolve),
      meta: {menuCode: 'SYS_CONFIG_MANAGE', title: '配置管理', icon: 'config'}
    },
    {
      path: 'profile',
      name: 'profile',
      hidden: true,
      component: (resolve) => require(['@/views/system/config/profile'], resolve),
      meta: {menuCode: 'SYS_CONFIG_PROFILE_MANAGE', title: '环境管理'}
    },
    {
      path: 'release',
      name: 'release',
      hidden: true,
      component: (resolve) => require(['@/views/system/config/release'], resolve),
      meta: {menuCode: 'SYS_CONFIG_RELEASE_MANAGE', title: '发布管理'}
    },
  ]
};

export default systemRouter
