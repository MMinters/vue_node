
<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">系统登陆</div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px" class="ms-content">
        <el-form-item prop="name">
          <el-input v-model="loginForm.name" placeholder="用户名" @keyup.enter.native="handleLogin">
            <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input type="password" placeholder="密码" v-model="loginForm.pwd" @keyup.enter.native="handleLogin">
            <el-button slot="prepend" icon="el-icon-question"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="captcha-box">
            <el-input type="captcha" placeholder="请输入验证码" v-model="loginForm.captcha" @keyup.enter.native="handleLogin">
              <el-button slot="prepend">验证码</el-button>
            </el-input>
            <div class="captcha-svg" @click="getCaptcha" v-html="captchaSvg"></div>
            <div class="captcha-hint" @click="getCaptcha">看不清？点击更换</div>
          </div>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click.native.prevent="handleLogin">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login ,getCaptcha } from '@/api/admin';
import md5 from 'js-md5';
export default {
  name: "Login",
  data () {
    return {
      loginForm: {
        name: "admin",
        pwd: "666666",
      },
      loginRules: {
        name: [
          {
            required: true,
            trigger: "blur",
            message: "请输入用户名",
          },
        ],
        pwd: [
          { required: true, trigger: "blur", message: "请输入密码" },
        ],
        captcha: [
          { required: true, trigger: "blur", message: "请输入验证码" },
        ],
      },
      loading: false,
      redirect: undefined,
      captchaSvg:""
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    //点击登陆
    handleLogin () {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return
        await login({...this.loginForm,pwd:md5(this.$nodeMD5+this.loginForm.pwd)});
        this.$router.push({ path: this.redirect || "/" });
      });
    },
    async getCaptcha(){
      let {data}=await getCaptcha();
      this.captchaSvg=data;
    },
  },
};
</script>


<style scoped lang="scss">
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 100%;
  background: #808080; /* fallback for old browsers */
  background: -webkit-linear-gradient(
          to top,
          #2d8cc4,
          #d8d0d0
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
          to top,
          #2d8cc4,
          #d8d0d0
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 450px;
  transform: translate(-50%,-50%);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
}
.ms-login >>> .el-input--small .el-input__inner {
  height: 40px;
}
.captcha-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.captcha-svg{
  height: 36px;
  min-width: 110px;
  border-radius: 3px;
  margin-left: 10px;
  cursor: pointer;
  overflow: hidden;
}
.captcha-hint{
  color: #6166dc;
  font-size: 12px;
  position: absolute;
  transform: scale(0.8);
  right: -5px;
  bottom: -26px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
