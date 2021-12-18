const fileRouter = {
  path: '/file',
  name: 'file',
  redirect: '/file/fileIndex',
  component: (resolve) => require(['@/views/file/Main'], resolve),
  meta: {
    menuCode: 'FLE_MANAGE',
    icon: 'fileManage',
    title: '文件管理'
  },
  children: [
    {
      path: 'fileIndex',
      name: 'fileIndex',
      hidden: true,
      component: (resolve) => require(['@/views/file/index'], resolve),
      meta: {title: '文件管理'}
    },
    {
      path: 'fileCenter',
      name: 'fileCenter',
      component: (resolve) => require(['@/views/file/fileCenter'], resolve),
      meta: {menuCode: 'FILE_CENTER_MANAGE', title: '文件中心', icon: 'fileCenter'}
    }
  ]
};

export default fileRouter
