<template>
  <div class="register">
    <el-form
      ref="registerRef"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
    >
      <h3 class="title">若依后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="registerForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleRegister"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="确认密码"
          @keyup.enter="handleRegister"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          size="large"
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleRegister"
        >
          <template #prefix>
            <svg-icon
              icon-class="validCode"
              class="el-input__icon input-icon"
            />
          </template>
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          class="register-button"
          @click.prevent="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div class="login-link">
          <router-link class="link-type" :to="'/login'"
            >使用已有账户登录</router-link
          >
        </div>
      </el-form-item>
    </el-form>
    <!-- 底部 -->
    <div class="el-register-footer">
      <span>Copyright © 2024-2023 easyCode All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import { getCodeImg, register } from "@/api/login";

const router = useRouter();
const { proxy } = getCurrentInstance();

const registerForm = ref({
  username: "",
  password: "",
  confirmPassword: "",
  code: "",
  uuid: "",
});

const equalToPassword = (rule, value, callback) => {
  if (registerForm.value.password !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const registerRules = {
  username: [
    { required: true, trigger: "blur", message: "请输入您的账号" },
    {
      min: 2,
      max: 20,
      message: "用户账号长度必须介于 2 和 20 之间",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, trigger: "blur", message: "请输入您的密码" },
    {
      min: 5,
      max: 20,
      message: "用户密码长度必须介于 5 和 20 之间",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    { required: true, trigger: "blur", message: "请再次输入您的密码" },
    { required: true, validator: equalToPassword, trigger: "blur" },
  ],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }],
};

const codeUrl = ref("");
const loading = ref(false);
const captchaEnabled = ref(true);

function handleRegister() {
  proxy.$refs.registerRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      register(registerForm.value)
        .then((res) => {
          const username = registerForm.value.username;
          ElMessageBox.alert(
            "<font color='red'>恭喜你，您的账号 " +
              username +
              " 注册成功！</font>",
            "系统提示",
            {
              dangerouslyUseHTMLString: true,
              type: "success",
            }
          )
            .then(() => {
              router.push("/login");
            })
            .catch(() => {});
        })
        .catch(() => {
          loading.value = false;
          if (captchaEnabled.value) {
            getCode();
          }
        });
    }
  });
}

function getCode() {
  getCodeImg().then((res) => {
    captchaEnabled.value =
      res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      registerForm.value.uuid = res.uuid;
    }
  });
}

getCode();
</script>

<style lang='scss' scoped>
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(270deg, #74b9ff, #a29bfe, #74b9ff);
  background-size: 600% 600%;
  animation: gradient 10s ease infinite;
}

.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #2d3436;
  font-weight: bold;
  font-size: 24px;
}

.register-form {
  border-radius: 8px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  .el-input {
    height: 44px;

    input {
      height: 44px;
    }
  }

  .input-icon {
    height: 42px;
    width: 16px;
    margin-left: 10px;
  }
}

.register-button {
  width: 100%;
  background-color: #0984e3;
  border-color: #0984e3;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #74b9ff;
  }
}

.login-link {
  float: right;

  .link-type {
    color: #0984e3;
    text-decoration: none;
  }
}

.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #dfe6e9;
  font-family: Arial, sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
}

.register-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
    height: 40px;
    padding-left: 12px;
  }
}
</style>
