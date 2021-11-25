<template>
  <el-container>
    <el-aside class="sidebar-container">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeSideRouter"
          @select="handleSelect"
          text-color="#5C5C5C"
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
    <app-main :keepAliveList="keepAliveList"/>
  </el-container>
</template>

<script>
import AppMain from "./AppMain"

export default {
  name: "SideLeftMenu",
  components: {AppMain},
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

<style lang="scss">
  .left-menu {
    .el-menu-item {
      /*color: #555555;*/
      height: 40px;
      line-height: 40px;
    }
  }
</style>
