const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userInfo: state => state.user.userInfo,
  allRoutes: state => state.permission.allRoutes,
  mainRoutes: state => state.permission.mainRoutes,
  mainChildrenRoutes: state => state.permission.mainChildrenRoutes,
  orgId: state => state.organization.orgId
}
export default getters
