<template>
  <div class="more-login">
    <div class="header">
      <p @click="goBack()">
        <svg aria-hidden="true">
          <use xlink:href="#icon-shuangzuo_double-left"></use>
        </svg>
        返回
      </p>
    </div>
    <div class="content">
      <p class="highlight">其它方式登录</p>
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
</template>

<script lang="ts">
import { useRouter } from "vue-router";

const useMoreLoginEffect = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return { goBack };
};

export default {
  name: "moreLogin",
  components: {},
  setup() {
    const { goBack } = useMoreLoginEffect();
    return { goBack };
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/style/common.scss";

.more-login {
  background: $classic-white;
  width: 100%;
  height: 100%;

  .header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 40px;

    p {
      height: 100%;
      width: 80px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      cursor: pointer;
      font: 16px/120% "";
      color: $brand-blue;

      svg {
        margin-left: 5px;
        width: 24px;
        fill: $brand-blue;
      }
    }
  }

  .content {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-wrap: wrap;
    
    .highlight{
      font: 26px/150% "";
      user-select: none;
      pointer-events: none;
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
            width : 45px;
            height: 45px;
          }
        }

        p:last-child {
          transform: translateY(10px);
          height: 20px;
          color: $color-gray-light-5;
        }
      }
    }
  }
}
</style>
