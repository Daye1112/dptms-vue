<template>
  <el-container class="main">
    <el-header>
      <el-row>
        <el-col :span="6">
          <div class="top-logo">
            <svg-icon icon-class="monitor" class-name="icon" />
            DPTMS-项目组管理系统
          </div>
        </el-col>
        <el-col :span="18">
        <el-menu
          :default-active="'1'"
          width="auto"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="1">
            <svg-icon icon-class="monitor" class-name="icon" />
            导航一
          </el-menu-item>
          <el-menu-item index="2">导航二</el-menu-item>
          <el-menu-item index="3">导航三</el-menu-item>
          <el-menu-item index="4">导航四</el-menu-item>
          <el-submenu index="5">
            <template slot="title">更多</template>
            <el-menu-item index="5-1">选项1</el-menu-item>
            <el-menu-item index="5-2">选项2</el-menu-item>
            <el-menu-item index="6-3">选项3</el-menu-item>
          </el-submenu>
        </el-menu>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <router-view v-if="isRouterAlive" :key="key"/>
    </el-container>
  </el-container>
</template>

<script>
import logo from '@/assets/images/logo.png'

export default {
  name: "Main",
  data() {
    return {
      isRouterAlive: true,
      logoSrc: logo
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="scss" scoped>
  .top-logo {
    background-color: #545c64;
    color: #fff;
    padding-left: 15px;
    font-size: medium;
    .svg-icon{
      width: 32px;
      height: 32px;
      vertical-align: -10px;
    }
  }
  .main{
    height: 100%;
  }
</style>
