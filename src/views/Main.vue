<template>
  <el-container class="main">
    <el-header>
      <el-row>
        <el-col :span="20">
          <el-menu
            :default-active="activerouter"
            width="auto"
            class="top-menu"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#e0e0e0"
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
        </el-col>
        <el-col :span="4" class="right-menu">
          <el-dropdown trigger="click" class="dropdown">
            <div class="user-avatar">
              <img :src="userInfo.fileUrl ? userInfo.fileUrl : defaultAvatar"/>
              <span class="user-name">{{userInfo.username}}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/profile/index">
                <el-dropdown-item>
                  <span style="display:block;">
                    <svg-icon icon-class="profile"/>
                    个人中心
                  </span>
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided @click.native="logout">
                <span style="display:block;">
                  <svg-icon icon-class="logout"/>
                  退出
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <router-view v-if="isRouterAlive" :key="key"/>
    </el-container>
  </el-container>
</template>

<script>
import {mapGetters} from 'vuex'
import logo from '@/assets/images/logo.png'
import defaultAvatar from '@/assets/images/default_avatar.gif'

export default {
  name: "Main",
  data() {
    return {
      isRouterAlive: true,
      logoSrc: logo,
      activeRouter: '',
      defaultAvatar: defaultAvatar
    }
  },
  computed: {
    ...mapGetters([
      'mainChildrenRoutes',
      'userInfo'
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
    goTo(name) {
      this.activerouter = name;
      this.$router.push({name: name});
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      await this.$store.dispatch('permission/resetState');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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
      color: #e0e0e0;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-right: 20px;

      span {
        padding-left: 10px;
      }

      .svg-icon {
        width: 32px;
        height: 32px;
      }
    }
  }

  .right-menu {
    height: 61px;
    background: #545c64;
    text-align: right;

    .dropdown {
      height: 61px;
      padding-right: 20px;

      .user-avatar {
        display: flex;
        float: right;
        color: #e0e0e0;
        font-size: 16px;
        cursor: pointer;

        img {
          margin-top: 12px;
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }

        span {
          padding: 0 10px 0 5px;
        }
      }
    }
  }

  .main {
    height: 100%;
  }
</style>
