<template>
  <el-container>
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
            系统管理
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">我的工作台</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项1</el-menu-item>
              <el-menu-item index="2-4-2">选项2</el-menu-item>
              <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="3" disabled>消息中心</el-menu-item>
          <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
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
</style>
