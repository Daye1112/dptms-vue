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
  ]
}

export default serviceRouter
