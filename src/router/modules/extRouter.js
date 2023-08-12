export const apiDocRouter = {
  path: '/apiDoc',
  name: 'apiDoc',
  redirect: '/apiDoc/index',
  component: (resolve) => require(['@/views/apiDoc/Main'], resolve),
  meta: {
    menuCode: 'API_DOC_MANAGE',
    icon: 'apiDoc',
    title: '接口文档'
  },
  children: [
    {
      path: 'index',
      name: 'index',
      component: (resolve) => require(['@/views/apiDoc/index'], resolve),
      meta: {title: '接口文档'}
    }
  ]
};

export const sbaRouter = {
  path: '/sba',
  name: 'sba',
  redirect: '/sba/index',
  component: (resolve) => require(['@/views/sba/Main'], resolve),
  meta: {
    menuCode: 'SBA_MANAGE',
    icon: 'sba',
    title: '服务监控'
  },
  children: [
    {
      path: 'index',
      name: 'index',
      component: (resolve) => require(['@/views/sba/index'], resolve),
      meta: {title: '服务监控'}
    }
  ]
};
