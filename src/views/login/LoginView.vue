<template>
  <div class="login_view">
    <!-- 布局 -->
    <div class="layout" v-if="displayParentPage">
      <!-- 图标LOGO -->
      <div class="logo">
        <img src="../../assets/vite.svg" alt="图片加载失败" />
      </div>

      <!-- 内容输入区 -->
      <div class="input_box">
        <!-- 账户密码登录 -->
        <div class="item login_account">
          <p>
            <input type="text" name="account" v-model="account" placeholder="请输入账号" />
          </p>
          <p>
            <input class="mrs_password" type="password" name="password" v-model="password" placeholder="请输入密码" />
            <i class="iconfont show_password" @click="handlerHidePwdBtnClick($event)">&#xe65a;</i>
          </p>
        </div>

        <!-- 手机号登录 -->
        <div class="item login_phone">
          <p>
            <input type="text" name="phone_no" v-model="phoneNo" placeholder="请输入手机号" />
          </p>
          <p class="append_button">
            <input type="text" name="phone_code" v-model="verifyCode" placeholder="请输入验证码" />
            <input type="button" value="获取验证码" @click="handlerSendVerifyCodeClick()" />
          </p>
        </div>

        <!-- 邮箱登录 -->
        <div class="item login_email">
          <p>
            <input type="text" name="email" v-model="email" placeholder="请输入邮箱" />
          </p>
          <p class="append_button">
            <input type="text" name="email_code" v-model="verifyCode" placeholder="请输入验证码" />
            <input type="button" value="获取验证码" @click="handlerSendVerifyCodeClick()" />
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
    <Toast />
  </div>
</template>

<script lang="ts">
import { reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVerifyStore } from '../../store/verifyStore';
import Toast, { showToast } from "../../components/common/Toast.vue";
/**
 * 登录业务逻辑
 */
export const useLoginEffect = () => {
  const route = useRoute();
  const router = useRouter();

  const verifyStore = useVerifyStore();

  /* 账户数据 */
  const accounts = reactive({
    account: "",
    password: "",
    phoneNo: "",
    email: "",
    verifyCode: "",
  });

  /* 应用数据 */
  const data = reactive({
    loginType: 1, // 登录类型：1、账号密码，2、手机号，3、邮箱
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

    if (inputBox !== null && target !== null) {
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
        case 1:
          inputBox.style.transform = "translateX(-33.33333%)";
          span.innerHTML = "账号登录";
          data.loginType = 2;
          break;
        // 手机号登录时
        case 2:
          inputBox.style.transform = "translateX(0)";
          span.innerHTML = "短信登录";
          data.loginType = 1;
          break;
      }
    }
  };

  /**
   * 处理获取验证码按钮的点击事件
   * @param type 类型（1、手机号；2、邮箱）
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
      case 1:
        permitLogin = verifyAccountContent();
        break;
      case 2:
        permitLogin = verifyPhoneContent();
        break;
      case 3:
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
    console.log("提交");
    const log = JSON.parse(JSON.stringify(accounts));
    console.log(log);
    // 跳转到主页
    // 假装自己已经登录成功
    handlerLoginSuccess();
  };

  /**
   * 处理登录成功后的事件
   */
  const handlerLoginSuccess = (): void => {
    console.log("登录成功！");
    const now = (new Date()).getTime();
    localStorage.setItem("lastLoginTime", now.toString());
    verifyStore.setToken("isToken.123456.Marisa");
    router.push("/password_view");
  }

  /**
   * 校验账户名和密码
   */
  const verifyAccountContent = (): boolean => {
    // 用户名正则，4到16位（字母，数字，下划线，减号）
    const accountRegExp: RegExp = /^[a-zA-Z0-9_-]{4,16}$/;
    // 密码正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
    const passwordRegExp: RegExp = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{6,20}$/;
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
    const emailRegExp: RegExp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
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
    const emailRegExp: RegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
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

  const { account, password, phoneNo, email, verifyCode } = toRefs(accounts);

  const { displayParentPage } = toRefs(data);

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
  components: { Toast },
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
