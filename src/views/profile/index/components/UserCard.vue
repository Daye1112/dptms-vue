<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>
    <div class="user-profile">
      <div class="box-center">
        <div class="user-avatar">
          <img :src="userInfo.fileUrl ? userInfo.fileUrl : defaultAvatar"/>
          <div class="user-name text-center">
            <el-link type="primary" :underline="false" @click="uploadHeadImg">
              更换头像
            </el-link>
            <input type="file" accept="image/*" class="hiddenInput" @change="handleFile">
          </div>
        </div>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ userInfo.realName }}</div>
        <div class="user-role text-center text-muted">
          <span>{{ userInfo.username }}</span>
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

import {mapGetters} from 'vuex'
import defaultAvatar from '@/assets/images/default_avatar.gif'
import {fileUpload} from "@/utils/file"
import store from '@/store'

export default {
  name: "UserCard",
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      userTemp: '',
      defaultAvatar: defaultAvatar
    }
  },
  created() {
    this.userTemp = JSON.parse(JSON.stringify(this.userInfo));
  },
  methods: {
    uploadHeadImg() {
      this.$el.querySelector('.hiddenInput').click();
    },
    handleFile(e) {
      let _this = this;
      const $target = e.target || e.srcElement
      const file = $target.files[0]
      fileUpload(file).then(res => {
        _this.userTemp.fileId = res.id;
        this.$request.post("/auth/activeUser/updateInfo", this.userTemp)
          .then(response => {
            store.dispatch('user/getInfo');
            this.$message({
              type: 'success',
              message: '用户头像更新成功'
            });
          })
      });
    }
  }
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

  .user-avatar img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }

  .hiddenInput {
    display: none;
  }
</style>
