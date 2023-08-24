<template>
  <div class="login-container">
    <div class="login-main">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
               label-position="left">

        <div class="title-container">
          <h3 class="title">注册登录DPTMS</h3>
        </div>

        <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="账号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
        </el-form-item>

        <el-form-item prop="captchaCode" class="code-input">
        <span class="svg-container">
          <svg-icon icon-class="verify-code"/>
        </span>
          <el-input
            v-model="loginForm.captchaCode"
            placeholder="验证码"
            name="code"
            type="text"
            tabindex="3"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <img :src="img" alt="" class="code-image" @click="getCaptcha">

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                   @click.native.prevent="handleLogin">登 录
        </el-button>

      </el-form>
    </div>
    <div class="login-footer">
      <small>
        DPTMS管理系统 Copyright &copy; 2020-{{new Date().getFullYear()}} Mr.Darren
      </small>
      <small>
        &nbsp;&nbsp;&nbsp;&nbsp;<a href="https://beian.miit.gov.cn" target="_blank">浙ICP备19032610号-2</a>
      </small>
    </div>
  </div>
</template>

<script>

import {mapActions} from 'vuex'
import request from '@/utils/request'

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        authType: 1,
        captchaCode: '',
        captchaKey: ''
      },
      img: '',
      loginRules: {
        username: [{required: true, trigger: 'blur', message: '请输入用户名'}],
        password: [{required: true, trigger: 'blur', message: '请输入密码'}],
        captchaCode: [{required: true, trigger: 'blur', message: '请输入验证码'}],
      },
      passwordType: 'password',
      loading: false
    }
  },
  watch: {},
  created() {
    this.getCaptcha();
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      'login': 'user/login'
    }),
    getCaptcha() {
      request.get("/auth/captcha")
        .then(response => {
          let data = response.data;
          this.loginForm.captchaKey = data.captchaKey;
          this.img = data.base64;
        })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.login({...this.loginForm})
            .then(() => {
              this.loading = false;
              this.$router.push({path: '/'})
            })
            .catch((error) => {
              this.getCaptcha();
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "login";
</style>
<style lang="scss" scoped>
  @import "login-scoped";
  .footer {
    flex: 0;
    text-align: center;
    height: 30px !important;
    line-height: 30px;
    background: #f3f5f8;
  }
</style>
