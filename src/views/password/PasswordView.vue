<template>
  <div class="main">
    <div class="layout">
      <!-- 数据列表 -->
      <div class="mrs-table">


        <div @click="showRouter">编辑</div>
        <!-- 数据显示 -->
        <div class="mrs-content">
          <div class="mrs-item-list">
            <my-scroll style="background: rgba(0,255,128,0.5)" :container-height="contentViewHeight - 57" @scroll="loadRecordsPage">

              <MrsTableItem v-for="(e, i) in passwordList" :item="e" :key="i" :mrsKey="i" @showDetails="showPwdDetails"
                            @editRecord="saveOrUpdateRecord" @deleteRecord="deletePwdRecord" @deleteBatch="deleteBatch"/>
            </my-scroll>

          </div>
        </div>
      </div>

      <!-- 查看信息对话框 -->
      <!--      <el-dialog v-model="detailVisible" :title="activeRecord.name" :width="'80%'" :show-close="false">-->
      <!--        <div class="mrs-dialog">-->
      <!--          <p><span>账号: </span><span class="allow-copy" @click="writeToClipboard(activeRecord.account)">{{-->
      <!--              activeRecord.account-->
      <!--            }}</span>-->
      <!--          </p>-->
      <!--          <p><span>密码: </span><span class="allow-copy" @click="writeToClipboard(activeRecord.password)">{{-->
      <!--              activeRecord.password-->
      <!--            }}</span>-->
      <!--          </p>-->
      <!--          <p><span>备注: </span><span>{{ activeRecord.remarks }}</span></p>-->
      <!--          <p><span>官网: </span><a :class="activeRecord?.url ? 'dialog-url' : 'dialog-url-prevent'"-->
      <!--                                   :href="activeRecord?.url">{{ activeRecord?.url }}</a></p>-->
      <!--          <p><span>创建时间: </span><span>{{ activeRecord.createDateTime }}</span></p>-->
      <!--        </div>-->
      <!--      </el-dialog>-->

      <!-- 编辑、新建对话框 -->
      <!--      <el-dialog v-model="editedVisible" :title="saveOrUpdateFlag === 1 ? '修改密码' : '新建密码'" :width="'80%'"-->
      <!--                 :show-close="false">-->
      <!--        <div class="mrs-dialog-edited">-->
      <!--          <p><label>-->
      <!--            <span>名称: </span>-->
      <!--            <input type="text" v-model="activeRecord.name"-->
      <!--                   class="mrs-input checked"-->
      <!--                   placeholder="请输入账户名称"/>-->
      <!--          </label></p>-->
      <!--          <p><label>-->
      <!--            <span>账号: </span>-->
      <!--            <input type="text" v-model="activeRecord.account" class="mrs-input checked"-->
      <!--                   placeholder="请输入账号"/>-->
      <!--          </label></p>-->
      <!--          <p><label>-->
      <!--            <span>密码: </span>-->
      <!--            <input type="text" v-model="activeRecord.password" class="mrs-input checked"-->
      <!--                   placeholder="请输入密码"/>-->
      <!--          </label></p>-->
      <!--          <p><label>-->
      <!--            <span>备注: </span>-->
      <!--            <input type="text" v-model="activeRecord.remarks" class="mrs-input" placeholder="请输入备注信息"/>-->
      <!--          </label></p>-->
      <!--          <p><label>-->
      <!--            <span>官网: </span>-->
      <!--            <input type="text" v-model="activeRecord.url" class="mrs-input" placeholder="请输入官网地址"/>-->
      <!--          </label></p>-->
      <!--          <div class="btn-info">-->
      <!--            <input type="button" class="submit" value="保 存" @click="onSubmitChange">-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-dialog>-->

    </div>
    <Toast/>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, Ref} from "vue";

import api from "@/api/api";
import MyScroll from "@/components/common/MyScroll.vue";
import MrsTableItem from "@/components/password/MrsTableItem.vue";
import Toast, {showToast} from "@/components/common/Toast.vue";
import {SM2Util} from "@/utils/sm2/sm2-util";
import {useCryptoStore} from "@/store/cryptoStore";
import {CLIENT_ENCRYPT_PREFIX, ENABLE_ENCRYPT_LINK} from "@/common/constant";
import {useRouter} from "vue-router";
import {getCurrentContentHeight} from "@/utils/util/util";

// 仓库
const cryptoStore = useCryptoStore();

// 成员变量
const passwordList: Ref<PasswordRecord []> = ref([
  {},{},
  {},{},
  {},{},
  {},{},
  {},{}
]);     // 密码列表
const keyWords: Ref<string> = ref("");    // 搜索关键词
// 分页对象
const page = reactive({
  current: 1,
  size: 10
});

const currentRecord: Ref<PasswordRecord | null> = ref(null);  // 当前正在操作的密码对象
const detailVisible: Ref<boolean> = ref(false); // 查看弹框
const editedVisible: Ref<boolean> = ref(false); // 编辑弹窗
const saveOrUpdateFlag: Ref<number> = ref(0);  // 操作是新建还是编辑
const contentViewHeight: Ref<number> = ref(getCurrentContentHeight());  // 内容区高度

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
      if (ENABLE_ENCRYPT_LINK) {
        let encrypt: string | null = res.data;
        if (!encrypt) {
          showToast(TOAST_TYPE.ERROR, res.msg, 1.5);
          reject(false);
          return;
        }
        encrypt = encrypt.substring(2);
        let keyPair: SM2KeyPair | null = cryptoStore.getClientKeyPair();
        console.log("客户端密钥: ", keyPair);
        if (!keyPair || !keyPair.privateKey) {
          showToast(TOAST_TYPE.ERROR, "客户端密钥获取失败", 1.5);
          reject(false);
          return;
        }
        const privateKey = keyPair.privateKey;
        const decrypt: string = SM2Util.decrypt(encrypt, privateKey);
        console.log("解码后: ", decrypt);
        if (decrypt) {
          const dec: any = JSON.parse(decrypt);
          recordList = [...dec?.records];
        }
      } else {
        try {
          const data = res.data as MrsPageRecord<PasswordRecord> | null;
          if (data) recordList = [...data.records];
        } catch (ex) {
          showToast(TOAST_TYPE.ERROR, "数据解析失败", 1.5);
        }
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
 * 设置活动的记录
 */
const setActiveRecordById = (id: string) => {
  const idList = new Array(passwordList.value.map(p => p.id));
  const index = idList.indexOf([id]);
  if (index === -1) {
    showToast(TOAST_TYPE.ERROR, "未找到该记录", 1.5);
    return;
  }
  currentRecord.value = passwordList.value[index];
}

/**
 * 查看详情
 * @param id
 */
const showPwdDetails = (id: string): void => {
  setActiveRecordById(id);
  detailVisible.value = !detailVisible.value;
}

/**
 * 保存一条密码记录
 */
const saveRecord = () => {
  saveOrUpdateFlag.value = 0;
}

/**
 * 编辑记录详情
 * @param id
 */
const updateRecord = (id: string): void => {
  saveOrUpdateFlag.value = 1;
  setActiveRecordById(id);
}

/**
 * 新建或修改一条密码记录
 */
const saveOrUpdateRecord = (id: string) => {
  editedVisible.value = !editedVisible.value;
  id ? updateRecord(id) : saveRecord();
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
 * 提交更新
 */
const onSubmit = () => {
  const current: PasswordRecord | null = currentRecord.value;
  if (!current) {
    showToast(TOAST_TYPE.ERROR, "未找到该记录", 1.5);
    return;
  }

  editedVisible.value = !editedVisible.value;

  const serviceKeyPair = cryptoStore.getServiceKeyPair();
  if (!serviceKeyPair || !serviceKeyPair.publicKey) {
    showToast(TOAST_TYPE.ERROR, "服务端公钥不存在", 1.5);
    return;
  }
  let spk: string = serviceKeyPair.publicKey;
  const encrypt = CLIENT_ENCRYPT_PREFIX + SM2Util.encrypt(JSON.stringify(current), spk);
  current.id ? api.editRecordById(encrypt) : api.addRecordsOne(encrypt);
}

/**
 * 搜索
 */
const searchByKeyword = (word: string) => {
  console.log(word);
  alert(word);
}


/**
 * 剪切板操作
 * @param str
 */
const writeToClipboard = async (str: string) => {
  try {
    await navigator.clipboard.writeText(str);
  } catch (err) {
    console.error('Failed to copy text:', err);
  }
}
const router = useRouter();
const showRouter = () => {

  router.push("/password-view/edit");
}

const loadRecordsPage = () => {
  for (let i = 0; i < 10; i++) {
    passwordList.value.push({})
  }

}

defineExpose({
  writeToClipboard, showRouter, loadRecordsPage
});
</script>

<style scoped lang="scss">
@import "../../assets/style/common";

.layout {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;


  .mrs-table {
    overflow: hidden;

    .mrs-content {
      overflow-x: hidden;
      overflow-y: scroll;

      .mrs-items-list {
      }
    }
  }

  .mrs-dialog {
    p {
      span {
        margin-right: 5px;
        font-size: $font-content-size-16;
      }

      span:nth-child(1) {
        font-size: $font-content-size-14;
        font-weight: bold;
      }

      .allow-copy {
        cursor: pointer;
      }

      .allow-copy::after {
        content: "点击复制";
        margin: 0 10px;
        color: $brand-blue;
        font: 11px/100% "Microsoft YaHei";
      }

      .dialog-url {
        color: $brand-blue;
        border-bottom: 1px solid;
        font-size: $font-content-size-16;
      }

      .dialog-url-prevent {
        user-select: none;
        pointer-events: none;
      }
    }
  }

  .mrs-dialog-edited {
    p {
      margin: 10px 0;

      label {
        display: flex;

        span {
          flex: 0.2;
          display: flex;
          justify-content: flex-start;
          font-weight: bold;
          align-items: center;
          font-size: $font-content-size-14;
        }

        .mrs-input {
          flex: 0.7;
          outline: none;
          border: 1px solid $color-gray-light-7;
          padding: 10px;
        }
      }
    }

    .btn-info {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0 0 0;

      input[type='button'] {
        border: 0;
        outline: none;
        margin: 0 10px;
        padding: 5px 30px;
        color: $color-gray-light-9;
        font-size: $font-content-size-16;
      }

      .submit {
        background-color: $brand-blue;
      }
    }
  }
}
</style>
