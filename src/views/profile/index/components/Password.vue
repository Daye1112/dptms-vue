<template>
  <el-form ref="dataForm"
           :rules="rules"
           :model="userTemp"
           size="small"
           label-position="right"
           label-width="80px"
  >
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="userTemp.oldPassword"/>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="userTemp.newPassword"/>
    </el-form-item>
    <el-form-item label="再次确认" prop="confirmPassword">
      <el-input v-model="userTemp.confirmPassword"/>
    </el-form-item>
    <el-form-item style="text-align: right">
      <el-button round size="medium" type="primary"  @click="changePassword()">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Password",
  data() {
    return {
      userTemp: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{required: true, message: '请输入旧密码', trigger: 'blur'}],
        newPassword: [{required: true, message: '请输入新密码', trigger: 'blur'}],
        confirmPassword: [{required: true, message: '请再次确认密码', trigger: 'blur'}]
      },
    }
  },
  methods: {
    changePassword() {

    }
  }
}
</script>

<style scoped>

</style>
