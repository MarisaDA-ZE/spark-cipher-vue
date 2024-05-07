<template>
  <div class="password-detail-wrapper" :style="{'--view-height': contentViewHeight, '--header-height': 45}">
    <!-- 头部 -->
    <mrs-header :show-back="true" class="my-header">
      <template #center>
        <span style="font-size: 16px;">{{ replaceText(currentRecord?.title.value) }}</span>
      </template>
      <template #right>
        <span @click.stop="editRecord" style="padding: 0 10px; color: #409EFF">
          <i class="iconfont" style="font-size: 18px;">&#xe66c;</i>
        </span>
      </template>
    </mrs-header>

    <!-- 内容区域 -->
    <div class="content">

      <div class="record-title">
        <!-- 更新时间 -->
        <div class="create-time">
          <span class="label">上次更新</span>
          <span class="value">{{ lastUpdateTime }}</span>
        </div>
      </div>

      <!-- item元素 -->
      <div class="record-item" v-for="(e, i) in someRenderRecordItem" :key="i">
        <div class="item-label">{{ e.label + ': ' }}</div>
        <!-- 文本 -->
        <div @click.stop="copyText(e.value)" :class="{'item-value': true, 'item-text-value': !computedIsURL(e.value)}"
             v-if="!computedIsURL(e.value)">{{ e.value }}
        </div>
        <!-- 网址 -->
        <a class="item-value item-url-value" :href="e.value" v-else>{{ e.value }}</a>
      </div>
    </div>
    <Toast/>
  </div>
</template>

<script lang="ts" setup>
import {Ref, ref, onMounted, computed, getCurrentInstance} from "vue";
import {useRoute, useRouter} from "vue-router";

import MrsHeader from "@/components/common/MrsHeader.vue";
import {getCurrentContentHeight, isURL, recordKeySortDeep, stringReplace, computedDiffTime} from "@/utils/util/util";
import api from "@/api/api";
import Toast, {showToast} from "@/components/common/Toast.vue";
import {TOAST_TYPE} from "@/common/constant";

const contentViewHeight: Ref<number> = ref(0);  // 内容区高度

const router = useRouter();
const route = useRoute();
const recordId: Ref<string> = ref(route.query.id as string);

const currentRecord: Ref<PasswordRecord | null> = ref(null);

const instance = getCurrentInstance();
const someRenderRecordItem: Ref<PasswordRecordItem[]> = ref([]);
const copyThrottle: Ref<boolean> = ref(true); // 复制的节流
const lastUpdateTime: Ref<string> = ref('');

/**
 * 处理字符串
 * @param text  待处理文本
 * @param size  保留长度
 * @param defaultVal  默认显示
 */
const replaceText = (text: string, size: number = 12, defaultVal: string = "暂无数据"): string => {
  return stringReplace(text, size, defaultVal);
}


/**
 * 渲染数据前
 */
const beforeRender = () => {
  api.getRecordById({id: recordId.value}).then((res: MrsResult<PasswordRecord>) => {
    console.log("res: ", res);
    if (res.status) {
      currentRecord.value = res.data;
      lastUpdateTime.value = computedDiffTime(res.data.updateTime || res.data.createTime);
      const sorted = recordKeySortDeep(currentRecord.value, 'sort');
      for (let key of sorted) {
        // 遇到一个null后面的就都是null了，排序时已经处理了
        if (key == null) return;
        let value: PasswordRecordItem | undefined = (currentRecord.value as any)[key];
        const customs: PasswordRecordItem[] | undefined = currentRecord.value?.customs;
        if (typeof value === 'undefined' && customs !== undefined) {
          value = customs.find((e: PasswordRecordItem) => (e.key === key));
        }
        if (value) someRenderRecordItem.value.push(value);
      }
    }
  });
}

/**
 * 编辑记录
 */
const editRecord = () => {
  console.log('showDetail...');
  router.push({path: '/password-view/edit', query: {id: recordId.value}});
}

/**
 * 检查一个字符串是否是URL
 */
const computedIsURL = computed(() => {
  return (url: string | null | undefined) => {
    return isURL(url);
  }
});

/**
 * 复制操作
 * @param text
 */
const copyText = (text: string) => {
  console.log("复制...", text);
  if (copyThrottle.value) {
    copyThrottle.value = false;
    if (instance) {
      const {appContext} = instance;
      appContext.config.globalProperties.$copyText(text)
    }
    showToast(TOAST_TYPE.SUCCESS, "复制成功", 1.5);
    setTimeout(() => {
      copyThrottle.value = true;
    }, 300);
  }
}

onMounted(() => {
  console.log("onMounted...");
  contentViewHeight.value = getCurrentContentHeight();
  beforeRender();
});

defineExpose({editRecord});
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.password-detail-wrapper {
  $header-height: calc(var(--header-height) * 1px);
  $view-height: calc(var(--view-height) * 1px);
  background: $color-gray-light-9;

  .content {
    position: relative;
    padding-top: calc($header-height + 10px);
    width: 100%;
    height: $view-height;
    overflow-y: scroll;
    background: #FFF;

    .record-title {
      position: absolute;
      right: 0;
      top: calc($header-height + 8px);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;
      line-height: 100%;
      padding-right: 10px;
      color: $info-gray;

      .create-time {
        .label {
          margin-right: 5px;
        }
      }
    }

    .record-item {
      margin: 10px 0;
      padding: 0 10px;

      .item-label {
        color: #999;
        font-size: 16px;
        letter-spacing: 2px;
        font-family: "思源柔黑", serif;
      }

      .item-value {
        padding: 5px 8px;
        line-height: 150%;
        color: #444;
        background: $color-gray-light-9;
        border-radius: 5px;
        word-break: break-word;
        overflow-wrap: break-word;
        font-family: "方正黑体", serif;
      }

      .item-text-value {
        position: relative;
        padding-right: 30px;
      }

      .item-text-value::after {
        content: "复制";
        position: absolute;
        top: 5px;
        right: 4px;
        font-family: "方正黑体", serif;
        color: $color-primary-light-3;
        font-size: 12px;
        user-select: none;
      }

      .item-url-value {
        display: block;
        color: $brand-blue;
        line-height: 160%;
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 2.9px;
      }
    }

    // first-child是更新时间，所以这里取第二个元素
    .record-item:nth-child(2) {
      margin-top: 0;
    }

    .record-item:last-child {
      margin-bottom: 0;
    }
  }

}
</style>
