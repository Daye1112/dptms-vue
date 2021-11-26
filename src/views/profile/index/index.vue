<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8" :xs="24">
        <user-card/>
      </el-col>
      <el-col :span="16" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="登录记录" name="timeline">
            </el-tab-pane>
            <el-tab-pane label="账号信息" name="account">
              <user-info/>
            </el-tab-pane>
            <el-tab-pane label="个人密码" name="password">
              <password/>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import UserInfo from "./components/UserInfo";
import Password from "./components/Password";

export default {
  name: "Profile",
  components: {Password, UserInfo, UserCard},
  data() {
    return {
      activeTab: 'timeline'
    }
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
  .el-card.is-always-shadow {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .el-card {
    border: none;
    border-radius: 0;
  }

</style>

<style lang="scss">
</style>
