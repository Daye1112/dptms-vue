const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userInfo: state => state.user.userInfo,
  menuList: state => state.user.menuList,
  menuCodeList: state => state.user.menuCodeList,
  orgList: state => state.user.orgList,
  allRoutes: state => state.permission.allRoutes,
  mainRoutes: state => state.permission.mainRoutes,
  mainChildrenRoutes: state => state.permission.mainChildrenRoutes
}
export default getters
