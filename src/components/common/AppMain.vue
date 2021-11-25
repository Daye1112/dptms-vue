<template>
  <el-container>
    <el-main class="main-container">
      <div class="main-content">
        <keep-alive :include="keepAliveList">
          <router-view/>
        </keep-alive>
      </div>
    </el-main>
    <el-footer class="footer">
      <small>DPTMS-项目组管理系统 Copyright &copy; 2020-{{new Date().getFullYear()}} Mr.Darren</small>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "AppMain",
  props: ['keepAliveList'],
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
