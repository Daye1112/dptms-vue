<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8" :xs="24">
        user
      </el-col>
      <el-col :span="16" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="账号信息" name="timeline">
            </el-tab-pane>
            <el-tab-pane label="登录记录" name="account">
            </el-tab-pane>
            <el-tab-pane label="个人秘密" name="password">
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
    }
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
</style>
