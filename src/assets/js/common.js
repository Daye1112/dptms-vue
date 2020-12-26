export default {
  install(Vue) {
    Vue.prototype.getSideMenu = function () {
      let sideMenu = [];
      let activeHeaderMenu = this.$route.matched[1].name;
      for (const item of this.mainChildrenRoutes) {
        if (item.name === activeHeaderMenu) {
          sideMenu = item.children;
          break;
        }
      }
      return sideMenu;
    }
  }
}
