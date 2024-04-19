<template>
  <div class="mrs-header">

    <!-- 左侧部分 -->
    <div class="mrs-backer">
      <div class="left" @click="backClickHandler()" v-if="showBack">
        <div class="icon">
          <i class="iconfont">&#xe60d;</i>
        </div>
        <slot name="left" v-if="$slots.left"></slot>
      </div>
    </div>

    <!-- 中间部分 -->
    <div class="center">
      <slot name="center" v-if="$slots.center"></slot>
    </div>

    <!-- 右侧部分 -->
    <div class="right">
      <slot name="right" v-if="$slots.right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineProps} from "vue";
import {useRouter} from "vue-router";

defineProps({
  showBack: {
    type: Boolean,
    default: false
  },
});

const router = useRouter();

/**
 * 处理返回点击事件
 */
const backClickHandler = () => {
  console.log(router.getRoutes());
  router.back();
}

defineExpose({});
</script>

<style scoped lang="scss">
@import "src/assets/style/common";

$header-height: calc(var(--header-height) * 1px);

$side-width: 60px;

.mrs-header {
  position: fixed;
  top: 0;
  width: 100%;
  height: $header-height;
  user-select: none;
  background: $color-gray-light-9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  overflow: hidden;

  // 返回按钮
  .mrs-backer {
    width: $side-width;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: $brand-blue;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        transform: rotate(180deg);
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        i {
          font-size: $font-icons-size;
        }
      }
    }
  }

  .right {
    width: $side-width;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
