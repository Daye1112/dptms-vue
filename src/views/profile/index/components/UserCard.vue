<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>
    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="defaultAvatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <el-link type="primary" :underline="false" class="change-avatar" @click="dialogVisible = true">
            更换头像
          </el-link>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ userInfo.realName }}</div>
        <div class="user-role text-center text-muted">
          <span>暂未开发</span>
        </div>
      </div>
    </div>
    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <el-icon class="el-icon-tickets"/>
          <span>个人描述</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            暂未开发
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>

import PanThumb from '@/components/PanThumb'
import {mapGetters} from 'vuex'
import defaultAvatar from '@/assets/images/default_avatar.gif'

export default {
  name: "UserCard",
  components: {PanThumb},
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      dialogVisible: false,
      page: {
        width: window.screen.width * 0.5,
        height: window.screen.height * 0.5
      },
      defaultAvatar: defaultAvatar
    }
  },
}
</script>

<style lang="scss" scoped>
  .box-center {
    margin: 0 auto;
    display: table;
  }

  .text-muted {
    color: #777;
  }

  .user-profile {
    .user-name {
      font-weight: bold;
    }

    .box-center {
      padding-top: 10px;
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }

    .user-follow {
      padding-top: 20px;
    }
  }

  .user-bio {
    margin-top: 20px;
    color: #606266;

    span {
      padding-left: 4px;
    }
    .logo-wrapper {
      display: inline-block;
      margin: 10px 0;
      img {
        width: 1.4rem;
        display: inline-block;
        margin: 0 .6rem;
        cursor: pointer;
        &.unbind {
          -webkit-filter: grayscale(100%);
          -moz-filter: grayscale(100%);
          -o-filter: grayscale(100%);
          filter: grayscale(100%);
        }
        &.radius {
          border-radius: 50%;
        }
      }
    }
    .user-bio-section {
      font-size: 14px;
      padding: 15px 0;

      .user-bio-section-header {
        border-bottom: 1px solid #dfe6ec;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-weight: bold;
      }
    }
  }
</style>
