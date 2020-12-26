export default {
  install(Vue) {
    Vue.prototype.getSideMenu = function () {
      let sideMenu = [];
      let activeHeaderMenu = this.$route.matched[1].name;
      let mainChildrenRoutes = this.$store.getters.mainChildrenRoutes;
      for (const item of mainChildrenRoutes) {
        if (item.name === activeHeaderMenu) {
          sideMenu = item.children;
          break;
        }
      }
      return sideMenu;
    }
  }
}
