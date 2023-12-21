<template>
  <div class="login_view">
    <!-- 布局 -->
    <div class="layout">
      <!-- 图标LOGO -->
      <div class="logo">
        <img src="../../assets/vite.svg" alt="图片加载失败"/>
      </div>

      <!-- 内容输入区 -->
      <div class="input_box" ref="mrsInputBox">

        <!-- 账户密码登录 -->
        <div class="item login_account" v-if="systemData.loginType === LOGIN_TYPE.ACCOUNT">
          <p>
            <input type="text" name="account" v-model="account" placeholder="请输入账号"/>
          </p>
          <p>
            <input class="mrs_password" type="password" name="password" v-model="password" placeholder="请输入密码"/>
            <i class="iconfont show_password" @click="handlerHidePwdBtnClick($event)">&#xe65a;</i>
          </p>
        </div>

        <!-- 手机号登录 -->
        <div class="item login_phone" v-if="systemData.loginType === LOGIN_TYPE.PHONE">
          <p>
            <input type="text" name="phone_no" v-model="phoneNo" placeholder="请输入手机号"/>
          </p>
          <p class="append_button">
            <input type="text" name="phone_code" v-model="verifyCode" placeholder="请输入验证码"/>
            <input type="button" value="获取验证码" @click="handlerSendVerifyCodeClick()"/>
          </p>
        </div>

        <!-- 邮箱登录 -->
        <div class="item login_email" v-if="systemData.loginType === LOGIN_TYPE.EMAIL">
          <p>
            <input type="text" name="email" v-model="email" placeholder="请输入邮箱"/>
          </p>
          <p class="append_button">
            <input type="text" name="email_code" v-model="verifyCode" placeholder="请输入验证码"/>
            <input type="button" value="获取验证码" @click="handlerSendVerifyCodeClick()"/>
          </p>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="submit_button">
        <button @click="login()">登 录</button>
      </div>

      <!-- 选择登录方式 -->
      <div class="select_login_type">
        <p>
          <span @click="switchLoginType()" ref="mrsSwitchSpan">短信登录</span>
        </p>
        <p>
          <span @click="handlerForgotPasswordClick()">忘记密码</span>
        </p>
      </div>

      <!-- 其它方式登录 -->
      <div class="more_login" v-if="false">
        <p class="highlight">选择其它方式登录</p>
        <div class="items">
          <div class="item" @click="switchLoginType(LOGIN_TYPE.EMAIL)">
            <p>
              <svg aria-hidden="true">
                <use xlink:href="#icon-youxiang"></use>
              </svg>
            </p>
            <p>邮箱</p>
          </div>
        </div>
      </div>
    </div>
    <Toast/>
  </div>
</template>

<script lang="ts" setup>
import {reactive, Ref, ref, toRefs} from "vue";
import {useRouter} from "vue-router";
import {useCryptoStore} from '../../store/cryptoStore';
import {useAuthorizationStore} from '../../store/authorizationStore';
import Toast, {showToast} from "../../components/common/Toast.vue";
import {ENABLE_ENCRYPT_LINK, LOGIN_TYPE} from '../../common/constant';
import {post} from "../../utils/util/http-util";
import {SM2KeyPair, SM2Util} from "../../utils/sm2/sm2-util";
import {regVerify, getDeviceFingerprint} from "../../utils/util/util";

type ACCOUNT = {
  account?: string;   // 用户名
  password?: string;  // 密码
  phoneNo?: string;   // 手机号
  email?: string;     // 邮箱
  verifyCode?: string;// 验证码
  f?: string;         // 设备标识
  loginType?: LOGIN_TYPE;// 登录方式
};

const router = useRouter();
const authorizationStore = useAuthorizationStore();
const cryptoStore = useCryptoStore();

/* 输入框 */
const mrsInputBox: Ref<HTMLDivElement | null> = ref(null);
const mrsSwitchSpan: Ref<HTMLSpanElement | null> = ref(null);

/* 账户数据 */
const accounts: ACCOUNT = reactive({
  account: "",
  password: "",
  phoneNo: "",
  email: "",
  verifyCode: "",
  f: "",
  loginType: LOGIN_TYPE.ACCOUNT
});

/* 应用数据 */
const systemData = reactive({
  loginType: LOGIN_TYPE.ACCOUNT, // 登录类型：1、账号密码，2、手机号，3、邮箱
  loginTypeSwitchLock: true,  // 登录类型切换的锁
  hidePwd: false,             // 是否显示密码
  hidePwdLock: false,         // 显示密码点击冷却
});


/**
 * 切换登录方式
 */
const switchLoginType = (lType?: LOGIN_TYPE): void => {

  if (mrsInputBox.value && mrsSwitchSpan.value) {
    // 500毫秒内此方法只能触发一次
    if (!systemData.loginTypeSwitchLock) {
      return;
    }
    systemData.loginTypeSwitchLock = false;
    setTimeout(() => {
      systemData.loginTypeSwitchLock = true;
    }, 500);

    // 切换
    switch (systemData.loginType) {
        // 账号密码登录时
      case LOGIN_TYPE.ACCOUNT:
        mrsSwitchSpan.value.innerHTML = "账号登录";
        systemData.loginType = LOGIN_TYPE.PHONE;
        break;
        // 手机号登录时
      case LOGIN_TYPE.PHONE:
        mrsSwitchSpan.value.innerHTML = "短信登录";
        systemData.loginType = LOGIN_TYPE.ACCOUNT;
        break;
    }
    if (lType) {
      // systemData.loginType = lType;
      console.log(lType)
    }
    accounts.loginType = systemData.loginType;
  }
};

/**
 * 处理获取验证码按钮的点击事件
 */
const handlerSendVerifyCodeClick = (): void => {
  console.log("获取验证码");
};

/**
 * 处理登录按钮点击事件
 */
const login = (): void => {
  // 校验数据
  let permitLogin = false;
  switch (systemData.loginType) {
    case LOGIN_TYPE.ACCOUNT:
      permitLogin = verifyAccountContent();
      break;
    case LOGIN_TYPE.PHONE:
      permitLogin = verifyPhoneContent();
      break;
    case LOGIN_TYPE.EMAIL:
      permitLogin = verifyEmailContent();
      break;
  }
  console.log("数据校验：", permitLogin);
  if (!permitLogin) return;
  onSubmit();
}

/**
 * 提交登录信息
 */
const onSubmit = (): void => {
  console.log("提交", systemData.loginType);
  const spk = cryptoStore.getServicePublicKey();
  let encrypt: string = "";
  if (spk) encrypt = "04" + SM2Util.encrypt(JSON.stringify(accounts), spk);
  const s: string = ENABLE_ENCRYPT_LINK ? encrypt : JSON.stringify(accounts);
  post("/auth/accountLogin", {text: s, f: authorizationStore.getFinger()}).then(res => {
    console.log(res);
    // 登录成功
    if (res?.code === 200) {
      const dt = res?.data;
      console.log("登录成功！");
      authorizationStore.setToken(dt.token);
      authorizationStore.setUser(dt.user);
      router.push("/password_view");
    } else {
      showToast("error", res.msg, 1.5);
    }
  });
};

/**
 * 校验账户名和密码
 */
const verifyAccountContent = (): boolean => {
  // 用户名正则，4到16位（字母，数字，下划线，减号）
  const accountRegExp: RegExp = /^[a-zA-Z0-9_-☆★]{4,16}$/;
  // 密码正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
  const passwordRegExp: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z-!@#&*$_.\d]{6,}$/;
  const verifyAccount: boolean = regVerify(accounts.account, accountRegExp);
  const verifyPassword: boolean = regVerify(accounts.password, passwordRegExp);
  if (!verifyAccount) {
    showToast('error', "用户名为4~16位可包含字母，数字，下划线，减号", 2);
    return false;
  }
  if (!verifyPassword) {
    showToast('error', "密码最少6位，确保包含大小写字母、数字、特殊字符", 2);
    return false;
  }
  return true;
};

/**
 * 校验手机号验证码
 */
const verifyPhoneContent = (): boolean => {
  // 手机号正则
  // /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
  const emailRegExp: RegExp = /^(?:(?:\+|00)86)?1(?:3\d|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8\d|9[1589])\d{8}$/;
  // 验证码，6位数字
  const verifyCodeRegExp: RegExp = /^\d{6}$/;
  const verifyPhoneNo: boolean = regVerify(accounts.phoneNo, emailRegExp);
  const verifyVCode: boolean = regVerify(accounts.verifyCode, verifyCodeRegExp);
  if (!verifyPhoneNo) {
    showToast('error', "请输入正确的手机号", 2);
    return false;
  }
  if (!verifyVCode) {
    showToast('error', "验证码输入有误！", 2);
    return false;
  }
  return true;
};

/**
 * 校验邮箱验证码
 */
const verifyEmailContent = () => {
  // 邮箱正则
  const emailRegExp: RegExp = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  // 验证码，6位数字
  const verifyCodeRegExp: RegExp = /^\d{6}$/;
  const verifyEmail: boolean = regVerify(accounts.email, emailRegExp);
  const verifyVCode: boolean = regVerify(accounts.verifyCode, verifyCodeRegExp);
  if (!verifyEmail) {
    showToast('error', "请输入正确的邮箱地址", 2);
    return false;
  }
  if (!verifyVCode) {
    showToast('error', "验证码输入有误！", 2);
    return false;
  }
  return true;
};


/**
 * 处理忘记密码按钮的单击事件
 */
const handlerForgotPasswordClick = (): void => {
  console.log("忘记密码");
};


/**
 * 处理显示密码按钮点击事件
 */
const handlerHidePwdBtnClick = (event: Event) => {
  if (systemData.hidePwdLock) return;
  systemData.hidePwdLock = true;
  const target = event.target as HTMLLIElement;
  const input = document.querySelector(".mrs_password") as HTMLInputElement;
  if (systemData.hidePwd) {
    target.innerHTML = "&#xe65a;";
    systemData.hidePwd = false;
    input.type = "password";
  } else {
    target.innerHTML = "&#xe660;";
    systemData.hidePwd = true;
    input.type = "text";
  }
  setTimeout(() => {
    systemData.hidePwdLock = false;
  }, 500);
}

/**
 * 初始化
 */
const init = () => {
  // 如果不启用数据加密，则不会生成和获取密钥对
  if (!ENABLE_ENCRYPT_LINK) return;
  getDeviceFingerprint().then((finger: string | undefined) => {
    console.log(finger);
    if (finger) authorizationStore.setFinger(finger);
    // 创建客户端密钥
    cryptoStore.createClientKeyPair().then(ckp => {
      // 协商密钥对
      post("/crypto/negotiateKeyPair", {publicKey: ckp.publicKey, f: finger}).then(res => {
        console.log("服务端密钥: ", res);
        if (res.code === 200) {
          const keyPair: SM2KeyPair = {
            publicKey: null,
            privateKey: null
          };
          keyPair.publicKey = res.data;
          cryptoStore.setServiceKeyPair(keyPair);  // 保存服务端密钥对
        } else {
          showToast("error", res.msg, 1.5);
        }
      });
    });
  });
};
init();

const {account, password, phoneNo, email, verifyCode} = toRefs(accounts);

// defineExpose({});
</script>

<style scoped lang="scss">
@import "../../assets/style/common.scss";

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
            font: 16px/100% "黑体";
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
        width: 120px;
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
