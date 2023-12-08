<template>
  <div class="login_view">
    <!-- 布局 -->
    <div class="layout" v-if="displayParentPage">
      <!-- 图标LOGO -->
      <div class="logo">
        <img src="../../assets/vite.svg" alt="图片加载失败"/>
      </div>

      <!-- 内容输入区 -->
      <div class="input_box">
        <!-- 账户密码登录 -->
        <div class="item login_account">
          <p>
            <input type="text" name="account" v-model="account" placeholder="请输入账号"/>
          </p>
          <p>
            <input class="mrs_password" type="password" name="password" v-model="password" placeholder="请输入密码"/>
            <i class="iconfont show_password" @click="handlerHidePwdBtnClick($event)">&#xe65a;</i>
          </p>
        </div>

        <!-- 手机号登录 -->
        <div class="item login_phone">
          <p>
            <input type="text" name="phone_no" v-model="phoneNo" placeholder="请输入手机号"/>
          </p>
          <p class="append_button">
            <input type="text" name="phone_code" v-model="verifyCode" placeholder="请输入验证码"/>
            <input type="button" value="获取验证码" @click="handlerSendVerifyCodeClick()"/>
          </p>
        </div>

        <!-- 邮箱登录 -->
        <div class="item login_email">
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
        <button @click="handlerSubmitButtonClick()">登 录</button>
      </div>

      <!-- 选择登录方式 -->
      <div class="select_login_type">
        <p>
          <span @click="handlerPhoneLoginClick($event)">短信登录</span>
        </p>
        <p>
          <span @click="handlerForgotPasswordClick()">忘记密码</span>
        </p>
      </div>

      <!-- 其它方式登录 -->
      <div class="more_login">
        <p class="highlight">选择其它方式登录</p>
        <div class="items">
          <div class="item">
            <p>
              <svg aria-hidden="true">
                <use xlink:href="#icon-youxiang"></use>
              </svg>
            </p>
            <p>邮箱</p>
          </div>
          <div class="item">
            <p>
              <svg aria-hidden="true">
                <use xlink:href="#icon-QQ"></use>
              </svg>
            </p>
            <p>QQ</p>
          </div>
          <div class="item">
            <p>
              <svg aria-hidden="true">
                <use xlink:href="#icon-weixin"></use>
              </svg>
            </p>
            <p>微信</p>
          </div>
          <div class="item">
            <p>
              <svg aria-hidden="true">
                <use xlink:href="#icon-zhifubao"></use>
              </svg>
            </p>
            <p>支付宝</p>
          </div>
        </div>
      </div>

    </div>
    <Toast/>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useCryptoStore} from '../../store/cryptoStore';
import {useTokenStore} from '../../store/tokenStore';
import Toast, {showToast} from "../../components/common/Toast.vue";
import {ENABLE_ENCRYPT_LINK, LOGIN_TYPE} from '../../common/constant';
import {get, post} from "../../utils/util/http-util";
import {SM2KeyPair, SM2Util} from "../../utils/sm2/sm2-util";

/**
 * 登录业务逻辑
 */
export const useLoginEffect = () => {
  const route = useRoute();
  const router = useRouter();

  const tokenStore = useTokenStore();
  const cryptoStore = useCryptoStore();

  /* 账户数据 */
  const accounts = reactive({
    account: "",
    password: "",
    phoneNo: "",
    email: "",
    verifyCode: "",
    loginType: LOGIN_TYPE.ACCOUNT
  });

  /* 应用数据 */
  const data = reactive({
    loginType: LOGIN_TYPE.ACCOUNT, // 登录类型：1、账号密码，2、手机号，3、邮箱
    loginTypeSwitchLock: true,  // 登录类型切换的锁
    displayParentPage: true,    // 是否显示主页面
    hidePwd: false,             // 是否显示密码
    hidePwdLock: false,         // 显示密码点击冷却
  });

  /**
   * 初始化
   */
  const init = (): void => {
    data.displayParentPage = true;
    console.log(data.displayParentPage);

  };

  /**
   * 处理切换登录方式按钮的点击事件
   * @param _event Event对象
   */
  const handlerPhoneLoginClick = (_event: Event): void => {
    const inputBox: HTMLDivElement | null = document.querySelector(".input_box");
    const target: EventTarget | null = _event.target;

    if (inputBox !== null && target) {
      // 800毫秒内此方法只能触发一次
      if (!data.loginTypeSwitchLock) {
        return;
      }
      data.loginTypeSwitchLock = false;
      setTimeout(() => {
        data.loginTypeSwitchLock = true;
      }, 800);

      // 切换
      const span = target as HTMLSpanElement;
      switch (data.loginType) {
          // 账号密码登录时
        case LOGIN_TYPE.ACCOUNT:
          inputBox.style.transform = "translateX(-33.33333%)";
          span.innerHTML = "账号登录";
          data.loginType = LOGIN_TYPE.PHONE;
          break;
          // 手机号登录时
        case LOGIN_TYPE.PHONE:
          inputBox.style.transform = "translateX(0)";
          span.innerHTML = "短信登录";
          data.loginType = LOGIN_TYPE.ACCOUNT;
          break;
      }
      accounts.loginType = data.loginType;
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
  const handlerSubmitButtonClick = (): void => {
    // 校验数据合法性
    let permitLogin = false;
    switch (data.loginType) {
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
    console.log("登录：", permitLogin);
    if (!permitLogin) return;
    onSubmit();
  }

  /**
   * 提交登录信息
   */
  const onSubmit = (): void => {
    console.log("提交", data.loginType);
    const log = JSON.parse(JSON.stringify(accounts));
    console.log(log);
    post("/auth/accountLogin", accounts).then(res => {
      console.log(res);
      // 跳转到主页
      if (res?.code === 200) {
        const token = res?.data;
        console.log("登录成功！");
        const now = (new Date()).getTime();
        localStorage.setItem("lastLoginTime", now.toString());
        tokenStore.setToken(token);
        cryptoInit();
        router.push("/password_view");
      } else {
        showToast("error", res.msg, 1.5);
      }
    });
  };

  // 初始化密钥
  const cryptoInit = (): void => {
    // 如果不启用数据加密，则不会生成和获取密钥对
    if (!ENABLE_ENCRYPT_LINK) return;
    const serviceKeyPair: SM2KeyPair = {
      publicKey: null,
      privateKey: null
    };
    get("/crypto/getServicePublicKey").then(res => {
      console.log(res);
      if (res.code === 200) {
        serviceKeyPair.publicKey = res.data;
        cryptoStore.setServicePublicKey(serviceKeyPair);  // 保存服务端密钥对
        cryptoStore.createServiceKeyPair(); // 创建客户端密钥对
      } else {
        showToast("error", res.msg, 1.5);
      }
    });
  }

  /**
   * 校验账户名和密码
   */
  const verifyAccountContent = (): boolean => {
    // 用户名正则，4到16位（字母，数字，下划线，减号）
    const accountRegExp: RegExp = /^[a-zA-Z0-9_-☆★]{4,16}$/;
    // 密码正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
    const passwordRegExp: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z-!@#&*$_.\d]{6,}$/;
    const verifyAccount: boolean = handlerVerifyText(accounts.account, accountRegExp);
    const verifyPassword: boolean = handlerVerifyText(accounts.password, passwordRegExp);
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
    const emailRegExp: RegExp = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
    // 验证码，6位数字
    const verifyCodeRegExp: RegExp = /^\d{6}$/;
    const verifyPhoneNo: boolean = handlerVerifyText(accounts.phoneNo, emailRegExp);
    const verifyVCode: boolean = handlerVerifyText(accounts.verifyCode, verifyCodeRegExp);
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
    const verifyEmail: boolean = handlerVerifyText(accounts.email, emailRegExp);
    const verifyVCode: boolean = handlerVerifyText(accounts.verifyCode, verifyCodeRegExp);
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
   * 通过正则校验数据合法性
   * @param text 被校验的内容
   * @param regExp 正则表达式
   */
  const handlerVerifyText = (text: string, regExp: RegExp): boolean => {
    const e = new RegExp(regExp);
    return e.test(text);
  };

  /**
   * 处理忘记密码按钮的单击事件
   */
  const handlerForgotPasswordClick = (): void => {
    console.log("忘记密码");
  };

  /**
   * 处理更多登录按钮的点击事件
   */
  const handlerMoreLoginClick = (): void => {
    router.push("/login/more_login");
    data.displayParentPage = false;
    console.log("更多登录方式");
  };

  /**
   * 处理显示密码按钮点击事件
   */
  const handlerHidePwdBtnClick = (event: Event) => {
    if (data.hidePwdLock) return;
    data.hidePwdLock = true;
    const target = event.target as HTMLLIElement;
    const input = document.querySelector(".mrs_password") as HTMLInputElement;
    if (data.hidePwd) {
      target.innerHTML = "&#xe65a;";
      data.hidePwd = false;
      input.type = "password";
    } else {
      target.innerHTML = "&#xe660;";
      data.hidePwd = true;
      input.type = "text";
    }

    setTimeout(() => {
      data.hidePwdLock = false;
    }, 500);
  }

  const {account, password, phoneNo, email, verifyCode} = toRefs(accounts);

  const {displayParentPage} = toRefs(data);

  return {
    account, password, phoneNo, email, verifyCode,
    displayParentPage,
    init,
    handlerSubmitButtonClick,
    handlerPhoneLoginClick,
    handlerForgotPasswordClick,
    handlerSendVerifyCodeClick,
    handlerMoreLoginClick,
    handlerHidePwdBtnClick,
  };
};

export default {
  name: "LoginView",
  components: {Toast},
  setup() {
    const {
      account, password, phoneNo, email, verifyCode,
      displayParentPage,
      init,
      handlerSubmitButtonClick,
      handlerPhoneLoginClick,
      handlerForgotPasswordClick,
      handlerSendVerifyCodeClick,
      handlerMoreLoginClick,
      handlerHidePwdBtnClick,
    } = useLoginEffect();

    init();

    return {
      account, password, phoneNo, email, verifyCode,
      displayParentPage,
      handlerSubmitButtonClick,
      handlerPhoneLoginClick,
      handlerForgotPasswordClick,
      handlerSendVerifyCodeClick,
      handlerMoreLoginClick,
      handlerHidePwdBtnClick,
    };
  },
};
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
            top: center;
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
