const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userInfo: state => state.user.userInfo,
  allRoutes: state => state.permission.allRoutes,
  userRoutes: state => state.permission.userRoutes,
}
export default getters
