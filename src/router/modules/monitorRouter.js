const monitorRouter = {
  path: '/monitor',
  name: 'monitor',
  redirect: '/monitor/monitorIndex',
  component: (resolve) => require(['@/views/monitor/Main'], resolve),
  meta: {
    menuCode: 'MONITOR_MANAGE',
    icon: 'monitor-manage',
    title: '监控管理'
  },
  children: [
    {
      path: 'monitorIndex',
      name: 'monitorIndex',
      hidden: true,
      component: (resolve) => require(['@/views/monitor/index'], resolve),
      meta: {title: '监控管理'}
    },
    {
      path: 'loginLog',
      name: 'loginLog',
      component: (resolve) => require(['@/views/monitor/loginLog'], resolve),
      meta: {menuCode: 'MONITOR_LOGIN_LOG_MANAGE', title: '登录日志', icon: 'loginLog'}
    },
  ]
}

export default monitorRouter
