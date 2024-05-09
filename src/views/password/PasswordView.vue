<template>
  <div class="main">
    <div class="layout">
      <!-- 顶部 -->
      <div class="table-header" :style="{'--header-height': tableHeadHeight}">
        <div @click="toEditView" class="m-button iconfont">&#xe665;</div>
        <form class="m-search-form" @submit="onSearch">
          <input type="text" v-model="keyWords" placeholder="搜索关键词">
          <input type="submit" value="搜索"/>
        </form>
      </div>

      <!-- 数据列表 -->
      <div class="mrs-table">
        <!-- 数据显示 -->
        <div class="mrs-content">
          <div class="mrs-item-list">
            <!-- 滚动组件 -->
            <my-scroll :container-height="contentViewHeight - tableHeadHeight" @scroll="loadRecordsPage">
              <!-- item -->
              <MrsTableItem :class="{'m-table-item': true,'record-slided': slidedId === e.id}"
                            v-for="(e, i) in passwordList"
                            :item="e"
                            :key="i" :m-index="e.id"
                            :show-mask="slidedId != null"
                            @edit-record="updateRecord"
                            @show-toast="myShowToast"
                            @click="showDetail(e.id)"
                            @item-slided="itemSlided"
                            @delete-by-id="deletePwdRecord"
                            @deleteBatch="deleteBatch"/>
              <div class="list-overed" v-if="isListOver">
                已经到底了
              </div>
            </my-scroll>
          </div>
        </div>
      </div>
    </div>
    <Toast/>
  </div>
</template>

<script lang="ts" setup>
import MyScroll from "@/components/common/MyScroll.vue";
import Toast, {showToast} from "@/components/common/Toast.vue";
import MrsTableItem from "@/views/password/components/MrsTableItem.vue";

import {onMounted, reactive, ref, Ref} from "vue";
import {useRouter} from "vue-router";
import api from "@/api/api";
import {HTTP_STATUS, TOAST_TYPE} from "@/common/constant";
import {getCurrentContentHeight} from "@/utils/util/util";


// 成员变量
const passwordList: Ref<PasswordRecord []> = ref([]);     // 密码列表
const keyWords: Ref<string | null> = ref(null);    // 搜索关键词
// 分页对象
const page = reactive({
  current: 1,
  size: 10
});
const slidedId: Ref<string | null> = ref(null); // 当前滑动ID
const contentViewHeight: Ref<number> = ref(getCurrentContentHeight());  // 内容区高度
const isListOver: Ref<boolean> = ref(false);

// 表头上面搜索框的高度
const tableHeadHeight: Ref<number> = ref(45);

/**
 * 分页查询密码信息
 */
const getPasswordsByPage = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    type SearchParams = {
      current: number,
      size: number,
      keyWords?: string
    }

    const params: SearchParams = {
      current: page.current,
      size: page.size,
    };
    if (keyWords.value) params.keyWords = keyWords.value;

    api.getRecordsList(params).then((res: MrsResult<MrsPage<PasswordRecord> | null>) => {
      console.log("返回值: ", res);
      if (res.code !== HTTP_STATUS.SUCCESS) {
        showToast(TOAST_TYPE.ERROR, res.msg, 2);
        reject(false);
        return;
      }
      let recordList: PasswordRecord[] = [];
      try {
        const data = res.data?.records;
        if (data?.length === 0) isListOver.value = true;
        if (data) recordList = [...data];
      } catch (ex) {
        showToast(TOAST_TYPE.ERROR, "数据解析失败", 1.5);
      }
      console.log("原始list: ", recordList);
      // 数据去重
      const idSet = new Set(passwordList.value.map(p => p.id));
      recordList = recordList.filter(p => !idSet.has(p.id));
      console.log("去重后: ", recordList);
      passwordList.value.push(...recordList);
      resolve(true);
    });
  });
}


/**
 * 编辑记录详情
 * @param id
 */
const updateRecord = (id: string): void => {
  console.log("编辑详情.。。");
  router.push({path: '/password-view/edit', query: {id}});
}


/**
 * 删除记录
 * @param id
 */
const deletePwdRecord = (id: string) => {
  console.log("删除记录", id)
  api.deletePasswordById(id).then((res: MrsResult<any>) => {
    console.log("删除记录: ", res);
    if (res.code === HTTP_STATUS.SUCCESS) {
      setTimeout(() => {
        location.reload();
      }, 200);
    }
  })
}

/**
 * 批量选中
 * @param id
 */
const deleteBatch = (id: string) => {
  console.log("批量删除", id);
}


/**
 * 搜索
 * @param event:Event 事件
 */
const onSearch = (event: Event) => {
  event.preventDefault();
  keyWords.value = keyWords.value || null;
  page.current = 1;
  page.size = 10;
  passwordList.value = [];
  getPasswordsByPage();
}

const router = useRouter();
const toEditView = () => {
  router.push("/password-view/edit");
}

/**
 *
 */
const loadRecordsPage = () => {
  console.log("到底了...");
  if (isListOver.value) {
    // 到底了

  } else {
    page.current++;
    getPasswordsByPage();
  }

}

onMounted(() => {
  getPasswordsByPage();
});

const showDetail = (id: string | null | undefined): void => {
  console.log('showDetail...', id);
  if (slidedId.value) {
    slidedId.value = null;
    return;
  }

  router.push({path: '/password-view/detail', query: {id}});
}

/**
 * 元素滑动
 * @param id
 */
const itemSlided = (id: string | null): void => {
  console.log('ID: ', id);
  slidedId.value = id;
}

/**
 * 提示消息
 */
const myShowToast = (msg: string, type: TOAST_TYPE) => {
  console.log(msg, type);
  showToast(type, msg, 1.5);
}

defineExpose({
  myShowToast, itemSlided, showDetail, onSearch,
  toEditView, loadRecordsPage
});
</script>

<style scoped lang="scss">
@import "@/assets/style/common.scss";

.layout {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  // 表头、搜索框那些
  .table-header {
    $headHeight: calc(var(--header-height) * 1px);
    width: 100%;
    height: $headHeight;
    background: $color-gray-light-9;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .m-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: $headHeight;
      height: $headHeight;
      font-size: 30px;
      color: $brand-blue;
    }

    .m-search-form {
      margin-left: 10px;
      background: $brand-blue;
      position: relative;
      width: calc(100% - 100px);
      height: calc(100% - 10px);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 16px;
      $btn-width: 60px;



      input[type="text"] {
        border: 0;
        display: flex;
        width: calc(100% - $btn-width);
        height: 100%;
        padding: 0 10px;
        outline: none;
        font-family: "方正黑体", serif;
      }

      input[type="submit"] {
        display: flex;
        border: 0;
        width: $btn-width;
        height: 100%;
        justify-content: center;
        align-items: center;
        background: $brand-blue;
        color: #FFF;
        font-family: "方正黑体", serif;
      }
    }

  }

  // 列表区域
  .mrs-table {
    overflow: hidden;

    .mrs-content {
      overflow-x: hidden;
      overflow-y: scroll;

      .mrs-item-list {

        .m-table-item {
          margin: 10px 0 10px 10px;
        }

        .list-overed {
          color: $color-gray-light-3;
          font-family: "鸿雷行书",sans-serif;
          text-align: center;
          padding: 5px;
        }
      }
    }
  }
}

.record-slided {
  transform: translateX(-120px);
}

</style>
