const serviceRouter = {
  path: '/service',
  name: 'service',
  redirect: '/service/serviceIndex',
  component: (resolve) => require(['@/views/service/Main'], resolve),
  meta: {
    menuCode: 'SERVICE_MANAGE',
    icon: 'service-manage',
    title: '服务管理'
  },
  children: [
    {
      path: 'serviceIndex',
      name: 'serviceIndex',
      hidden: true,
      component: (resolve) => require(['@/views/service/index'], resolve),
      meta: {title: '服务管理'}
    },
    {
      path: 'application',
      name: 'application',
      component: (resolve) => require(['@/views/service/application'], resolve),
      meta: {menuCode: 'SERVICE_APPLICATION_MANAGE', title: '应用管理', icon: 'service-manage'}
    },
    {
      path: 'config',
      name: 'config',
      component: (resolve) => require(['@/views/service/config'], resolve),
      meta: {menuCode: 'SERVICE_CONFIG_MANAGE', title: '配置管理', icon: 'config'}
    },
    {
      path: 'profile',
      name: 'profile',
      hidden: true,
      component: (resolve) => require(['@/views/service/config/profile'], resolve),
      meta: {menuCode: 'SERVICE_CONFIG_PROFILE_MANAGE', title: '环境管理'}
    },
    {
      path: 'release',
      name: 'release',
      hidden: true,
      component: (resolve) => require(['@/views/service/config/release'], resolve),
      meta: {menuCode: 'SERVICE_CONFIG_RELEASE_MANAGE', title: '发布管理'}
    }
  ]
}

export default serviceRouter
