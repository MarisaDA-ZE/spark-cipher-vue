<template>
  <div class="password-edit-wrapper" :style="{'--view-height': contentViewHeight, '--header-height': 45}">
    <!-- 头部 -->
    <mrs-header :show-back="true">
      <template #center>
        新增密码
      </template>
    </mrs-header>

    <!-- 内容区域 -->
    <div class="content">
      <form action="#">
        <div class="input-item input-text-item">
          <span class="item-title">标题</span>
          <label>
            <input type="text" placeholder="请输入标题">
          </label>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, Ref} from 'vue';
import MrsHeader from "@/components/common/MrsHeader.vue";
import {getCurrentContentHeight} from "@/utils/util/util";

const contentViewHeight: Ref<number> = ref(getCurrentContentHeight());  // 内容区高度

</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";
.password-edit-wrapper {
  $header-height: calc(var(--header-height) * 1px);
  $view-height: calc(var(--view-height) * 1px);

  .content {
    padding-top: $header-height;
    width: 100%;
    height: $view-height;
    overflow-y: scroll;

    $item-height: 35px;

    .input-item {
      height: $item-height;
      display: flex;

      .item-title {
        height: $item-height;
        width: 40px;
        font-size: 14px;
        line-height: $item-height;
        text-align: justify;
        text-align-last: justify;
        color: $info-gray;
        margin-right: 10px;
      }
    }

    .input-text-item {
    }
  }
}


</style>
