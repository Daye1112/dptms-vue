<template>
  <el-container class="main">
    <el-header>
      <el-row>
        <el-col :span="6">
          <div class="top-logo">
            <svg-icon icon-class="monitor" class-name="icon"/>
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
            <el-menu-item v-for="route in routes[3].children" :index="route.path">
                <svg-icon :icon-class="route.meta && route.meta.icon"/>
                {{route.meta && route.meta.title}}
            </el-menu-item>
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
import path from 'path'
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
    },
    routes() {
      return this.$router.options.routes
    }
  },
  created(){
    console.log(this.routes[3].children);
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      path.resolve(key);
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

    .svg-icon {
      width: 32px;
      height: 32px;
      vertical-align: -10px;
    }
  }

  .main {
    height: 100%;
  }
</style>
