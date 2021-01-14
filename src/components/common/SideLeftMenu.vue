<template>
  <el-container>
    <el-aside class="sidebar-container">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeSideRouter"
          @select="handleSelect"
          class="left-menu">
          <template v-for="item in sideRouter">
            <template v-if="!item.hidden">
              <el-menu-item :index="item.name">
                <svg-icon :icon-class="item.meta && item.meta.icon"/>
                {{item.meta && item.meta.title}}
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-main class="main-container">
        <div class="main-content">
          <keep-alive :include="keepAliveList">
            <router-view/>
          </keep-alive>
        </div>
      </el-main>
      <el-footer class="footer">
        <small>Copyright &copy; 2020-{{new Date().getFullYear()}} DPTMS-项目组管理系统</small>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "SideLeftMenu",
  props: ['keepAliveList'],
  data() {
    return {
      sideRouter: [],
      activeSideRouter: ''
    }
  },
  created() {
    this.sideRouter = this.getSideMenu();
    this.activeSideRouter = this.$route.matched[2].name;
  },
  methods: {
    handleSelect(key, keyPath) {
      this.goTo(key);
    },
    goTo(name) {
      this.activeSideRouter = name;
      this.$router.push({name: name});
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer {
    text-align: center;
    height: 30px !important;
    line-height: 30px;
    background: #f3f5f8;
  }

  .svg-icon {
    width: 16px;
    height: 16px;
  }
</style>
