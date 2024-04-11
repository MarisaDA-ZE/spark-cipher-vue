<template>
  <div class="mrs-header">
    <!-- 返回按钮 -->
    <div class="mrs-backer" @click="backClickHandler()" v-if="false">
      <i class="iconfont">&#xe60d;</i>
    </div>

    <!-- 搜索框 -->
    <div class="mrs-search" v-if="search_display">
      <label>
        <i class="iconfont">&#xe60e;</i>
        <input type="text" name="search" placeholder="请输入关键词" v-model="search_content"
               @keyup.enter="searchClickHandler()">
      </label>
      <i id="mrs-clean-btn" class="iconfont mrs-clean-btn" v-show="search_content"
         @click="cleanClickHandler()">&#xe620;</i>
    </div>

    <!-- 搜索按钮（平时隐藏） -->
    <i id="mrs-search-btn" class="iconfont mrs-search-btn" v-show="search_content"
       @click="searchClickHandler()">&#xe648;</i>

  </div>
</template>

<script lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";

export default {
  name: "Header",
  props: ["search_display"],
  setup() {
    const search_content = ref("");
    const router = useRouter();

    /**
     * 处理返回点击事件
     */
    const backClickHandler = () => {
      console.log(router.getRoutes());
      router.back();
    };

    /**
     * 处理清空搜索内容点击事件
     */
    const cleanClickHandler = () => {
      const clean_btn: HTMLInputElement | null = document.querySelector("#mrs-clean-btn");
      const search_btn: HTMLInputElement | null = document.querySelector("#mrs-search-btn");
      search_content.value = " ";
      if (clean_btn == null || search_btn == null) return false;
      search_btn.style.transform = "transform: translateX(-25px) scale(0.1)";
      search_btn.style.opacity = "0%";
      clean_btn.style.opacity = "0%";
      setTimeout(() => {
        search_btn.removeAttribute("style");
        clean_btn.removeAttribute("style");
        search_content.value = "";
      }, 100);

    };

    /**
     * 处理搜索按钮点击事件
     */
    const searchClickHandler = () => {
      if (!search_content.value) return false;

      alert(search_content.value);
    }

    return {search_content, backClickHandler, cleanClickHandler, searchClickHandler};
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/common";

$header-height: calc(var(--header-height) * 1px);

@keyframes beforeHeaderAppear {
  from {
    transform: translateY(calc($header-height * -1px)) scaleY(0);
  }

  to {
    transform: translateY(0) scaleY(1);
  }
}

.mrs-header {
  position: fixed;
  top: 0;
  width: 100%;
  height: $header-height;
  user-select: none;
  background: $color-gray-light-9;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  animation-name: beforeHeaderAppear;
  animation-duration: 200ms;
  z-index: 10;
  overflow: hidden;

  // 返回按钮
  .mrs-backer {
    transform: rotate(180deg);
    height: 100%;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    i {
      font-size: $font-icons-size;
      color: $brand-blue;
      font-weight: bold;
    }
  }

  // 搜索输入框
  .mrs-search {
    height: 35px;
    width: 255px;
    margin: 0 5px 0 10px;
    position: relative;

    label {
      background: $color-gray-light-8;
      padding: 0 5px;
      width: 100%;
      height: 100%;
      cursor: text;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      border-radius: 5px;

      i {
        font-size: $font-content-size-21;
        color: $color-gray-light-1;
        font-weight: bolder;
      }

      input[type="text"] {
        border: none;
        display: block;
        width: 100%;
        height: 100%;
        outline: none;
        background: none;
        transform: translateX(5px);
        color: $color-gray-light-1;
        font: 16px /120% "Microsoft YaHei UI";
      }
    }

    @keyframes beforeCleanAppear {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    .mrs-clean-btn {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%) scale(0.6);
      cursor: pointer;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: $color-gray-light-5;
      font-size: 16px;
      font-weight: bold;
      transition: all 100ms;
      animation-name: beforeCleanAppear;
      animation-duration: 300ms;
    }
  }

  @keyframes beforeButtonAppear {
    from {
      transform: translateX(-25px) scale(0.1);
    }

    to {
      transform: scale(1);
    }
  }

  .mrs-search-btn {
    display: flex;
    width: 45px;
    height: 35px;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    cursor: pointer;
    font-weight: bolder;
    border-radius: 5px;
    background: $color-primary-light-8;
    color: $brand-blue;
    animation-name: beforeButtonAppear;
    animation-duration: 300ms;
    transition: all 100ms;
    z-index: -1;
  }
}
</style>
