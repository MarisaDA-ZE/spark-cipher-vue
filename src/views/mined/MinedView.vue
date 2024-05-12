<template>
  <div class="mined_view">
    <!-- 用户信息 -->
    <div class="user-info">

      <!-- 工具栏，但还没想好放什么 -->
      <div class="util-bar"></div>

      <!-- 用户信息内容 -->
      <div class="container">
        <!-- 头像 -->
        <div class="user-avatar" :style="{'--avatar' : `url(${userInfo?.avatar || defaultAvatar})`}">
        </div>

        <!-- 用户名这些东西 -->
        <div class="infos-digest">
          <!-- 昵称 -->
          <p class="nick-name">{{ userInfo?.nickName || '未登录' }}</p>
          <!-- 等级 -->
          <p :class="'level level-' + userInfo?.level || 1">Lv.{{ userInfo?.level || 1 }}</p>
          <!-- 个性签名 -->
          <p class="signature">你所热爱的，就是你的生活。</p>
        </div>

      </div>

      <!-- 渐变背景图 -->
      <img class="bg-img" :src="bgOptions.current"
           :style="{'--opacity': bgOptions.opacity, '--transition': bgOptions.transition}"
           alt="背景图片加载失败"/>
    </div>
    <!-- 功能区域 -->
    <div class="function-list">
      <div class="function-item" @click="toUserDetail">
        <span class="text">个人信息</span>
        <i class="iconfont">&#xe60d;</i>
      </div>
      <div class="function-item" @click="logout">
        <span class="text">退出登录</span>
        <i class="iconfont">&#xe60d;</i>
      </div>
    </div>
    <Toast/>
  </div>
</template>

<script lang="ts" setup>
import Toast, {showToast} from "@/components/common/Toast.vue";
import {ElMessageBox} from 'element-plus'
import {onMounted, reactive, ref, Ref} from "vue";
import {useRouter} from "vue-router";
import api from "@/api/api";
import {clearStorage, getRandomInteger} from "@/utils/util/util";
import {useAuthorizationStore} from "@/store/authorizationStore";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import {TOAST_TYPE} from "@/common/constant";

const userStore = useAuthorizationStore();
const userInfo: Ref<MrsUser | null> = ref(userStore.getUser());

/**
 * 背景透明度的枚举
 */
enum BG_OPACITY {
  DISPLAY = 0.5, // 显示时的css透明度
  HIDDEN = 0,    // 不显示时的css透明度
}

/**
 * 背景图片的配置对象的类型
 */
type OptionsType = {
  baseURL: string;    // 图片的存储路径
  bgImages: string[]; // 动态图片的名称列表
  current: string;    // 当前图片的路径
  changeTime: number; // 单张图片的显示时间
  opacity: BG_OPACITY;// 图片显示时的透明度
  transition: number; // 图片切换时的过渡时间
  timer: null | NodeJS.Timeout; // 定时器对象
}

/**
 * 背景图片的配置对象
 */
const bgOptions = reactive<OptionsType>({
  baseURL: "/images/marisa",
  bgImages: ["/marisa_1.jpg", "/marisa_2.jpg", "/marisa_3.jpg", "/marisa_4.jpg", "/marisa_5.jpg"],
  current: "",
  opacity: BG_OPACITY.DISPLAY,
  transition: 500,
  changeTime: 5000,
  timer: null,
});
const router = useRouter();

/**
 * 渐变背景图的处理函数
 */
const useGradualBg = (): void => {
  bgOptions.timer = null;
  let prevIndex = 0;
  const randomIndex = getRandomInteger(bgOptions.bgImages.length - 1);
  prevIndex = randomIndex;
  let url = new URL(bgOptions.baseURL + `${bgOptions.bgImages[randomIndex]}`, import.meta.url);
  // console.log('URL: ', url);
  bgOptions.current = url.pathname;
  bgOptions.timer = setInterval(() => {
    let randomIndex = 0;
    while (1) {
      randomIndex = getRandomInteger(bgOptions.bgImages.length - 1);
      if (randomIndex !== prevIndex) break;
    }
    prevIndex = randomIndex;
    url = new URL(bgOptions.baseURL + `${bgOptions.bgImages[randomIndex]}`, import.meta.url);
    bgOptions.opacity = BG_OPACITY.HIDDEN;
    setTimeout(() => {
      bgOptions.opacity = BG_OPACITY.DISPLAY;
      bgOptions.current = url.pathname;
    }, bgOptions.transition);
  }, bgOptions.changeTime);
}

/**
 * 跳转到个人信息编辑
 */
const toUserDetail = (): void => {
  showToast(TOAST_TYPE.INFO, "在写了，在写了>_<");
}

/**
 * 用户登出
 */
const logout = (): void => {
  ElMessageBox.confirm(
      '真的要退出登录吗？',
      '退出登录',
      {
        confirmButtonText: '是的',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        console.log("退出登录...");
        api.logout().then(res => {
          clearStorage();
          if (res.code === 200) {
            router.push("/login");
          }
        });
      });
}

onMounted(() => {
  useGradualBg();
});
</script>

<style scoped lang="scss">
@import "@/assets/style/common.scss";

.mined_view {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: $color-gray-light-9;

  // 用户信息
  .user-info {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
    z-index: 0;
    background-color: #FFF;

    .util-bar {
      width: 100%;
      height: 30px;
    }

    // 用户信息内容盒子
    .container {
      position: relative;
      width: 100%;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 5;


      // 头像
      .user-avatar {
        margin-right: 10px;
        width: 100px;
        height: 100px;
        border-radius: 100%;
        overflow: hidden;
        background: var(--avatar) center center/100% no-repeat;
        flex-shrink: 0;
        user-select: none;
        pointer-events: none;
        //border: 5px solid $brand-blue;
      }

      // 基础信息摘要
      .infos-digest {
        flex: 1;
        flex-shrink: 0;
        height: 100px;
        padding: 10px 0;

        // 昵称
        .nick-name {
          font-size: 20px;
        }

        // 等级
        .level {
          margin: 3px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 20px;
          font-size: 14px;
          color: #FFF;
          background-color: rgba(0, 0, 0, 0.4);
        }

        .level-1 {
          background-color: rgba(0, 0, 0, 0.4);
        }

        .level-2 {
          background-color: rgba(58, 223, 0, 0.65);
        }

        .level-3 {
          background-color: rgba(1, 169, 219, 0.65);
        }

        .level-4 {
          background-color: rgba(255, 191, 0, 0.65);
        }

        .level-5 {
          background-color: rgba(255, 128, 0, 0.65);
        }

        .level-6 {
          background-color: rgba(254, 46, 46, 0.65);
        }

        .signature {
          font-size: 13px;
          color: #666;
        }

      }
    }

    // 渐变背景
    .bg-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      user-select: none;
      pointer-events: none;
      opacity: var(--opacity);
      transition: opacity calc(var(--transition) * 1ms);
      z-index: 0;
    }
  }

  .function-list {
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px auto 0;
    border-radius: 5px;
    background: #FFF;

    .function-item {
      position: relative;
      padding: 10px;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;

      i {
        transform: translateX(15px);
        font-size: 24px;
      }
    }

    .function-item::after {
      position: absolute;
      content: '';
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: rgba(0, 0, 0, 0.25);
      border-radius: 50%;
    }

    .function-item:first-child {
      padding-top: 5px;
    }

    .function-item:last-child {
      padding-bottom: 5px;

      &::after {
        display: none;
      }
    }
  }

  .logout {
    margin: 0 auto;
    width: 100px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    background: rgba(0, 135, 227, 0.7);
    color: #FFF;
    font: 16px/100% "";

  }
}
</style>
