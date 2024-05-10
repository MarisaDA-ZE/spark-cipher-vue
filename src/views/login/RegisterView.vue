<template>
  <div class="register-wrapper" :style="{'--view-height': contentViewHeight, '--header-height': 45}">
    <!-- 顶部 -->
    <!-- 头部 -->
    <mrs-header :show-back="true" class="my-header">
      <template #center>
        注册账号
      </template>
    </mrs-header>
    <div class="content">
      123
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, Ref} from 'vue';
import {getCurrentContentHeight} from "@/utils/util/util";
import MrsHeader from "@/components/common/MrsHeader.vue";

const contentViewHeight: Ref<number> = ref(0);
onMounted(() => {
  contentViewHeight.value = getCurrentContentHeight();
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";
.register-wrapper {
  $header-height: calc(var(--header-height) * 1px);
  $view-height: calc(var(--view-height) * 1px);
  background: $color-gray-light-9;

  // 内容区域
  .content {
    padding: calc($header-height + 10px) 0 10px 0;
    width: 100%;
    height: $view-height;
    overflow-y: scroll;
  }
}
</style>
