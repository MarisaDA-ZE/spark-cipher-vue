<template>
  <div class="main">
    <div class="layout">
      <!-- 顶部 -->
      <div class="table-header" :style="{'--header-height': tableHeadHeight}">
        <div @click="toEditView" class="m-button iconfont">&#xe665;</div>
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
import mockApi from "@/mocks/passwordMocks";
import {HTTP_STATUS, TOAST_TYPE} from "@/common/constant";
import {getCurrentContentHeight} from "@/utils/util/util";


// 成员变量
const passwordList: Ref<PasswordRecord []> = ref([]);     // 密码列表
const keyWords: Ref<string> = ref("");    // 搜索关键词
// 分页对象
const page = reactive({
  current: 1,
  size: 10
});
const slidedId: Ref<string | null> = ref(null); // 当前滑动ID
const contentViewHeight: Ref<number> = ref(getCurrentContentHeight());  // 内容区高度

// 表头上面搜索框的高度
const tableHeadHeight: Ref<number> = ref(45);

/**
 * 分页查询密码信息
 */
const getPasswordsByPage = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const params = {
      keyWords: keyWords.value,
      current: page.current,
      size: page.size,
    };

    api.getRecordsList(params).then((res: MrsResult<string | null>) => {
      console.log("返回值: ", res);
      if (res.code !== HTTP_STATUS.SUCCESS) {
        showToast(TOAST_TYPE.ERROR, res.msg, 2);
        reject(false);
        return;
      }
      let recordList: PasswordRecord[] = [];
      try {
        const data = res.data as MrsPageRecord<PasswordRecord> | null;
        if (data) recordList = [...data.records];
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
const deletePwdRecord = (id: number) => {
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
const deleteBatch = (id: number) => {
  console.log("批量删除", id);
}


/**
 * 搜索
 */
const searchByKeyword = (word: string) => {
  console.log(word);
  alert(word);
}

const router = useRouter();
const toEditView = () => {
  router.push("/password-view/edit");
}

/**
 *
 */
const loadRecordsPage = () => {
  console.log("到底了...")
}

onMounted(() => {
  mockApi.getRecordsList({}).then(res => {
    if (res.code === HTTP_STATUS.SUCCESS) {
      passwordList.value = [...res.data];
    } else {
      showToast(TOAST_TYPE.ERROR, res.msg, 1.5);
    }
  });
});

const showDetail = (id: string): void => {
  console.log('showDetail...', id);
  if(slidedId.value) {
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
  myShowToast, itemSlided, showDetail,
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

  }

  // 列表区域
  .mrs-table {
    overflow: hidden;

    .mrs-content {
      overflow-x: hidden;
      overflow-y: scroll;

      .mrs-item-list {

        .m-table-item{
          margin: 10px 0 10px 10px;
        }
      }
    }
  }
}

.record-slided {
  transform: translateX(-120px);
}

</style>
