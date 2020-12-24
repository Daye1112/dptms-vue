<template>
  <el-container>
    <el-aside class="sidebar-container">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          default-active="1"
          class="left-menu">
          <el-menu-item index="1">
            <svg-icon icon-class="user"/>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-main class="main-container">
        <keep-alive :include="keepAliveList">
          <router-view/>
        </keep-alive>
      </el-main>
      <el-footer class="footer">
        <small>Footer</small>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "SideLeftMenu",
  props: ['keepAliveList']
}
</script>

<style lang="scss" scoped>
  .footer {
    text-align: center;
    height: 30px !important;
    line-height: 30px;
    background: #f3f5f8;
  }

</style>
