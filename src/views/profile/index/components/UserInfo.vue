<template>
  <el-form ref="dataForm"
           :rules="rules"
           :model="userTemp"
           size="small"
           label-position="right"
           label-width="70px"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="userTemp.username"/>
    </el-form-item>
    <el-form-item label="姓名" prop="realName">
      <el-input v-model="userTemp.realName"/>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-select v-model="userTemp.gender">
        <el-option key="" label="请选择" value=""/>
        <el-option v-for="item in genderMap" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
    </el-form-item>
    <el-form-item label="联系电话" prop="phoneNumber">
      <el-input v-model="userTemp.phoneNumber"/>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="userTemp.email"/>
    </el-form-item>
    <el-form-item style="text-align: right">
      <el-button round size="medium" type="primary" @click="changeUserInfo()">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapGetters} from 'vuex'
import request from '@/utils/request'
import store from '@/store'

export default {
  name: "UserInfo",
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      userTemp: '',
      genderMap: [
        {
          "key": 1,
          "value": "男"
        },
        {
          "key": 2,
          "value": "女"
        }
      ],
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}]
      },
    }
  },
  created() {
    this.userTemp = JSON.parse(JSON.stringify(this.userInfo));
  },
  methods: {
    changeUserInfo() {
      this.$confirm('确定更新信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            request.post("/auth/activeUser/updateInfo", this.userTemp)
              .then(response => {
                store.dispatch('user/getInfo');
                this.$message({
                  type: 'success',
                  message: '用户更新成功'
                });
              })
          }
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
