<template>
  <el-container class="main">
    <el-header>
      <el-menu
        :default-active="activerouter"
        width="auto"
        class="top-menu"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <div class="top-logo" @click="goTo('home')">
          <svg-icon icon-class="monitor" class-name="icon"/>
          <span>DPTMS-项目组管理系统</span>
        </div>
        <template v-if="mainChildrenRoutes && mainChildrenRoutes.length > 0">
          <template v-for="item in mainChildrenRoutes">
            <template v-if="!item.hidden">
              <el-menu-item :index="item.name">
                <svg-icon :icon-class="item.meta && item.meta.icon"/>
                {{item.meta && item.meta.title}}
              </el-menu-item>
            </template>
          </template>
        </template>
      </el-menu>
    </el-header>
    <el-container>
      <router-view v-if="isRouterAlive" :key="key"/>
    </el-container>
  </el-container>
</template>

<script>
import {mapGetters} from 'vuex'
import logo from '@/assets/images/logo.png'

export default {
  name: "Main",
  data() {
    return {
      isRouterAlive: true,
      logoSrc: logo,
      activeRouter: ''
    }
  },
  computed: {
    ...mapGetters([
      'mainChildrenRoutes',
    ]),
    key() {
      return this.$route.path;
    }
  },
  created() {
    this.activerouter = this.$route.matched[1].name;
  },
  methods: {
    handleSelect(key, keyPath) {
      this.goTo(key);
    },
    goTo(name){
      this.activerouter = name;
      this.$router.push({name: name});
    }
  }
}
</script>

<style lang="scss" scoped>
  .top-menu {
    display: flex;
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
