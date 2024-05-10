<template>
  <div class="login_view">
    <!-- 布局 -->
    <div class="layout">
      <!-- 图标LOGO -->
      <div class="logo">
        <img src="@/assets/images/main-logo.png" alt="图片加载失败"/>
      </div>

      <!-- 内容输入区 -->
      <div class="input_box">

        <!-- 账户密码登录 -->
        <div class="item login_account" v-if="currentLoginType === LOGIN_TYPE.ACCOUNT">
          <p>
            <input type="text" v-model="accountParams.account" placeholder="请输入账号"/>
          </p>
          <p>
            <input class="mrs_password" :type="passwordDisplay ? 'text': 'password'"
                   v-model="accountParams.password" placeholder="请输入密码"/>
            <i class="iconfont show_password" @click="changePwdDisplay(false)" v-if="passwordDisplay">&#xe660;</i>
            <i class="iconfont show_password" @click="changePwdDisplay(true)" v-else>&#xe65c;</i>
          </p>
        </div>

        <!-- 手机号登录 -->
        <div class="item login_phone" v-if="currentLoginType === LOGIN_TYPE.PHONE">
          <p>
            <input type="text" v-model="phoneParams.phoneNo" placeholder="请输入手机号"/>
          </p>
          <p class="append_button">
            <input type="text" name="phone_code" v-model="phoneParams.verifyCode" placeholder="请输入验证码"/>
            <input type="button"
                   :value="getCodeCooling === ONE_MINUTE ? '获取验证码' : getCodeCooling + '秒后重发'"
                   @click="getCodeByPhone()"/>
          </p>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="submit_button">
        <button @click="login">登 录</button>
      </div>

      <!-- 选择登录方式 -->
      <div class="select_login_type">
        <p>
          <span @click="changeLoginType(LOGIN_TYPE.PHONE)"
                v-if="currentLoginType === LOGIN_TYPE.ACCOUNT">短信登录</span>
          <span @click="changeLoginType(LOGIN_TYPE.ACCOUNT)" v-else>账号登录</span>

          <span @click="toRegister">立即注册</span>
        </p>
        <p>
          <span @click="forgotPassword">忘记密码</span>
        </p>
      </div>

    </div>
    <Toast/>
  </div>
</template>

<script lang="ts" setup>
import {Ref, ref} from "vue";
import {useRouter} from "vue-router";
import api from "@/api/api";
import Toast, {showToast} from "@/components/common/Toast.vue";
import {LOGIN_TYPE, TOAST_TYPE} from '@/common/constant';
import {isEmpty} from "@/utils/util/util";
import {useAuthorizationStore} from "@/store/authorizationStore";
import {debounce} from "lodash-es";

const router = useRouter();
const {setToken, setUser} = useAuthorizationStore();
const currentLoginType: Ref<LOGIN_TYPE> = ref(LOGIN_TYPE.ACCOUNT);  // 当前登录方式
const passwordDisplay: Ref<boolean> = ref(false);             // 显示或隐藏密码
let countdownTimer: NodeJS.Timeout | null = null;  // 倒计时对象
const ONE_MINUTE: number = 60;  // 一分钟
let getCodeCooling: Ref<number> = ref(ONE_MINUTE);     // 获取验证码的冷却

// 账号密码登录对象
const accountParams: AccountLoginParams = {
  account: "",
  password: "",
};

// 手机号登录对象
const phoneParams: PhoneLoginParams = {
  phoneNo: "",
  verifyCode: ""
};

/**
 * 切换登录方式
 * @param type  登录方式
 */
const changeLoginType = debounce((type: LOGIN_TYPE) => {
  currentLoginType.value = type;
  // 清空数据
  accountParams.account = "";
  accountParams.password = "";

  phoneParams.phoneNo = "";
  phoneParams.verifyCode = "";
}, 100);

/**
 * 是否显示密码
 */
const changePwdDisplay = debounce((value: boolean) => {
  passwordDisplay.value = value;
}, 100);

const login = () => {
  console.log("登录...");
  switch (currentLoginType.value) {
      // 账号密码登录
    case LOGIN_TYPE.ACCOUNT:
      if (isEmpty(accountParams.account) || isEmpty(accountParams.password)) {
        showToast(TOAST_TYPE.ERROR, "请输入账号和密码");
        return;
      }
      // 账号密码登录接口
      api.accountLogin(accountParams).then(res => {
        console.log("账号密码登录...", res);
        afterLogin(res);
      }).catch((err: MrsResult<any>) => {
        showToast(TOAST_TYPE.ERROR, err.msg);
      });
      break;

      // 手机号登录
    case LOGIN_TYPE.PHONE:
      const valid = verifyPhoneNo(phoneParams.phoneNo);
      if (valid !== true) {
        showToast(TOAST_TYPE.ERROR, valid as string);
        return;
      }
      if (isEmpty(phoneParams.verifyCode)) {
        showToast(TOAST_TYPE.ERROR, "请输入验证码");
        return;
      }
      if (phoneParams.verifyCode.length !== 6) {
        showToast(TOAST_TYPE.ERROR, "验证码长度错误");
        return;
      }
      // 手机号登录接口
      api.phoneLogin(phoneParams).then(res => {
        console.log("手机号登录...", res);
        afterLogin(res);
      }).catch((err: MrsResult<any>) => {
        showToast(TOAST_TYPE.ERROR, err.msg);
      });
      break;
  }
}

/**
 * 登录后跳转
 * @param result  是否登录成功
 */
const afterLogin = (result: MrsResult<MrsLResp>): void => {
  console.log("result: ", result);
  if (result.status) {
    const resp: MrsLResp = result.data;
    console.log("登录成功...", resp);
    setUser(resp.userVo);
    setToken(resp.token);
    router.push("/password-view");
  } else {
    showToast(TOAST_TYPE.ERROR, result.msg);
  }
}

/**
 * 获取手机号验证码
 */
const getCodeByPhone = () => {
  if (getCodeCooling.value !== ONE_MINUTE) return;
  const valid = verifyPhoneNo(phoneParams.phoneNo);
  if (valid !== true) {
    showToast(TOAST_TYPE.ERROR, valid as string);
    return;
  }

  console.log("发送验证码...", phoneParams.phoneNo);
  api.sendCodeByPhoneNo({phoneNo: phoneParams.phoneNo}).then(res => {
    if (res.status) {
      showToast(TOAST_TYPE.SUCCESS, res.msg);
    } else {
      if (countdownTimer) clearInterval(countdownTimer);
      getCodeCooling.value = ONE_MINUTE;
      showToast(TOAST_TYPE.ERROR, res.msg);
    }
  });

  getCodeCooling.value--;
  countdownTimer = setInterval(() => {
    getCodeCooling.value--;
    if (getCodeCooling.value === 0 && countdownTimer) {
      clearInterval(countdownTimer);
      getCodeCooling.value = ONE_MINUTE;
    }
  }, 1000);
}

/**
 * 校验手机号
 * @param phoneNo 手机号
 * @return boolean  是否符合要求
 */
const verifyPhoneNo = (phoneNo: string): string | boolean => {
  if (isEmpty(phoneNo)) return "请输入手机号";
  const regExp = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4(?:(?:10|4[01])\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/;
  return regExp.test(phoneNo) ? true : "手机号格式错误";
}

const toRegister = () => {
  console.log("注册...");
  router.push("/register-view");
}

/**
 * 忘记密码
 */
const forgotPassword = () => {
  console.log("忘记密码,以后再说...");
  showToast(TOAST_TYPE.INFO, "我不到啊...");
}

</script>

<style scoped lang="scss">
@import "@/assets/style/common.scss";

.login_view {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  .layout {
    width: 100%;

    // 图标logo
    .logo {
      margin: 20px 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;

      img {
        height: 100px;
      }
    }

    // 输入模块
    .input_box {
      width: 300%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      // transform: translateX(-33.33333%);
      transition: all 200ms;

      .item {
        // border: 1px solid;
        width: 33.33333%;
        // height: 160px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        flex-direction: column;

        p {
          // border: 1px solid;
          width: 70%;
          margin: 10px 0;
          height: 40px;
          padding: 5px;
          position: relative;

          input {
            border: 0;
            width: 100%;
            height: 100%;
            outline: none;
          }

          input[type="text"],
          input[type="password"] {
            padding-left: 10px;
            font: 16px/100% "方正黑体", sans-serif;
            border-bottom: 1px dotted #000;
          }

          // 显示密码的按钮
          .show_password {
            position: absolute;
            //top: center;
            right: 5px;
            cursor: pointer;
            padding: 2px 5px;
            user-select: none;
            font-size: 18px;
          }
        }

        .append_button {
          input[type="text"] {
            width: 70%;
          }

          input[type="button"] {
            width: 30%;
            cursor: pointer;
            color: $brand-blue;
            background: rgba($color: #000000, $alpha: 0);
          }
        }
      }
    }

    // 登录按钮
    .submit_button {
      // border: 1px solid;
      width: 100%;
      margin: 10px auto;
      display: flex;
      justify-content: center;
      align-items: center;

      button {
        border: 0;
        //width: 120px;
        width: 70%;
        height: 35px;
        border-radius: 35px;
        cursor: pointer;
        font: 16px/100% "";
        outline: none;
        color: $brand-blue;
        background: $color-primary-light-9;
      }
    }

    // 切换登录模式
    .select_login_type {
      // border: 1px solid;
      width: 100%;
      padding: 0 15%;
      margin: 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font: 10px/120% "";

      span {
        // border: 1px solid;
        padding: 4px;
        cursor: pointer;
        color: $brand-blue;
        user-select: none;
      }
    }

    // 其它方式登录
    .more_login {
      margin: 40px 0 0;

      .highlight {
        padding: 0 15%;
        font: 16px/120% "";
        color: $color-gray-light-5;
      }

      .items {
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;

        .item {
          width: 60px;
          height: 80px;
          margin: 0 10px;

          p {
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
            user-select: none;
          }

          p:first-child {
            height: 60px;
            border-radius: 50%;
            cursor: pointer;

            svg {
              width: 35px;
              height: 35px;
            }
          }

          p:last-child {
            height: 20px;
            font-size: 14px;
            color: $color-gray-light-5;
          }
        }
      }
    }
  }
}
</style>
