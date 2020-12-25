<template>
  <el-container class="main">
    <el-header>
      <el-menu
        :default-active="'1'"
        width="auto"
        class="top-menu"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <div class="top-logo">
          <svg-icon icon-class="monitor" class-name="icon"/>
          <span>DPTMS-项目组管理系统</span>
        </div>
        <el-menu-item v-for="route in routes[3].children" :index="route.name">
          <svg-icon :icon-class="route.meta && route.meta.icon"/>
          {{route.meta && route.meta.title}}
        </el-menu-item>
      </el-menu>
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
      },
      routes() {
        return this.$router.options.routes
      }
    },
    created() {
    },
    methods: {
      handleSelect(key, keyPath) {
        this.$router.push({name: key});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .top-menu {
    display: flex;
    height: 64px;
    line-height: 64px;
    padding: 0 24px;

    .top-logo {
      font-size: 16px;
      color: #fff;
      display: flex;
      align-items: center;
      cursor: pointer;

      span {
        padding-left: 10px;
      }

      .svg-icon {
        width: 32px;
        height: 32px;
      }
    }
  }

  .main {
    height: 100%;
  }
</style>
