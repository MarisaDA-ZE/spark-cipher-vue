<template>
  <div class="main">
    <div class="layout">
      <!-- 数据列表 -->
      <div class="mrs-table">
        <!-- 表头 -->
        <MrsTableHeader @createRecord="saveOrUpdateRecord"/>
        <!-- 数据显示 -->
        <div class="mrs-content">
          <div class="mrs-item-list">
            <MrsTableItem v-for="(e, i) in passwordList" :item="e" :key="i" :mrsKey="i" @showDetails="showPwdDetails"
                          @editRecord="saveOrUpdateRecord" @deleteRecord="deletePwdRecord" @deleteBatch="deleteBatch"/>
          </div>
        </div>
      </div>

      <!-- 查看信息对话框 -->
      <el-dialog v-model="detailVisible" :title="activeRecord.name" :width="'80%'" :show-close="false">
        <div class="mrs-dialog">
          <p><span>账号: </span><span class="allow-copy" @click="writeToClipboard(activeRecord.account)">{{
              activeRecord.account
            }}</span>
          </p>
          <p><span>密码: </span><span class="allow-copy" @click="writeToClipboard(activeRecord.password)">{{
              activeRecord.password
            }}</span>
          </p>
          <p><span>备注: </span><span>{{ activeRecord.remark }}</span></p>
          <p><span>官网: </span><a :class="activeRecord?.url ? 'dialog-url' : 'dialog-url-prevent'"
                                   :href="activeRecord?.url">{{ activeRecord?.url }}</a></p>
          <p><span>创建时间: </span><span>{{ activeRecord.createDateTime }}</span></p>
        </div>
      </el-dialog>

      <!-- 编辑、新建对话框 -->
      <el-dialog v-model="editedVisible" :title="saveOrUpdateFlag === 1 ? '修改密码' : '新建密码'" :width="'80%'"
                 :beforeClose="editDialogBeforeClose" :show-close="false">
        <div class="mrs-dialog-edited">
          <p><label>
            <span>名称: </span>
            <input type="text" v-model="activeRecord.name" @focus="checkRules(activeRecord.name, 'name-in', $event)"
                   @blur="checkRules(activeRecord.name, 'name-out', $event)" class="mrs-input checked"
                   placeholder="请输入账户名称"/>
          </label></p>
          <p><label>
            <span>账号: </span>
            <input type="text" v-model="activeRecord.account"
                   @focus="checkRules(activeRecord.account, 'account-in', $event)"
                   @blur="checkRules(activeRecord.account, 'account-out', $event)" class="mrs-input checked"
                   placeholder="请输入账号"/>
          </label></p>
          <p><label>
            <span>密码: </span>
            <input type="text" v-model="activeRecord.password"
                   @focus="checkRules(activeRecord.password, 'password-in', $event)"
                   @blur="checkRules(activeRecord.password, 'password-out', $event)" class="mrs-input checked"
                   placeholder="请输入密码"/>
          </label></p>
          <p><label>
            <span>备注: </span>
            <input type="text" v-model="activeRecord.remarks" class="mrs-input" placeholder="请输入备注信息"/>
          </label></p>
          <p><label>
            <span>官网: </span>
            <input type="text" v-model="activeRecord.url" class="mrs-input" placeholder="请输入官网地址"/>
          </label></p>
          <div class="btn-info">
            <input type="button" class="submit" value="保 存" @click="onSubmitChange">
          </div>
        </div>
      </el-dialog>
    </div>
    <Toast/>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs} from "vue";
import {ElDialog} from "element-plus";

import MrsTableHeader from "../../components/password/MrsTableHeader.vue";
import MrsTableItem from "../../components/password/MrsTableItem.vue";
import Toast, {showToast} from "../../components/common/Toast.vue";
import {SM2KeyPair, SM2Util} from "../../utils/sm2/sm2-util";
import {useCryptoStore} from "../../store/cryptoStore";
import {ActiveRecord, Record, usePasswordStore} from "../../store/passwordStore";
import {ENABLE_ENCRYPT_LINK} from "../../common/constant";
import {_delete, get, MrsResult, post} from "../../utils/util/http-util";
import {isEmpty} from "../../utils/util/util";

const cryptoStore = useCryptoStore();
const passwordStore = usePasswordStore();

const useCryptEffect = () => {
  const arc: ActiveRecord = {
    name: "",
    account: "",
    password: "",
    remark: "",
    url: "",
    createDateTime: "",
  };


  const data = reactive({
    passwordList: Array<Record>(),     // 密码列表
    searchKeyWord: "",    // 搜索关键词
    page: {               // 分页对象
      current: 1,
      size: 10
    },
    detailVisible: false, // 查看弹框
    editedVisible: false, // 编辑弹窗
    saveOrUpdateFlag: 0,  // 操作是新建还是编辑
    activeRecord: arc,
    canSubmit: [false, false, false],     // 是否允许提交
    savePath: 'save',
    servicePublicKey: "",
  });

  /**
   * TODO: 分页查询密码信息
   */
  const getPasswordsByPage = (): Promise<boolean> => {
    return new Promise(resolve => {
      console.log("data分页信息: ", JSON.parse(JSON.stringify(data.page)));
      get("/record/getRecordsList", data.page)
          .then((res: any) => {
            console.log("返回值: ", res);
            let list;
            if (res.code === 200) {
              if (ENABLE_ENCRYPT_LINK) {
                let encrypt = res.data;
                let keyPair: SM2KeyPair | null = cryptoStore.getClientKeyPair();
                encrypt = encrypt.substring(2);
                console.log(keyPair);
                const decrypt = SM2Util.decrypt(encrypt, keyPair?.privateKey + "");
                console.log("解码后: ", decrypt);
                if (decrypt) {
                  const dec = JSON.parse(decrypt);
                  list = dec?.records;
                }
              } else {
                // 直接传的对象
                list = res.data.records;
              }
              console.log(">>>>>", list);
              // 添加数据到仓库
              passwordStore.addPasswordList(list);
              data.passwordList = passwordStore.passwordList;
              resolve(true);
            } else {
              showToast("error", res.msg, 2);
            }
          });
    });

  }

  /**
   * 设置活动的记录
   */
  const setActiveRecordById = (id: number) => {
    data.passwordList.forEach((p: Record) => {
      if (p.id === id) {
        data.activeRecord = {
          name: p.userName,
          account: p.account,
          password: p.password,
          remark: p.remark,
          url: p.url,
          createDateTime: p.createDateTime,
        };
        return 0;
      }
    })
  }

  /**
   * 查看详情
   * @param id
   */
  const showPwdDetails = (id: number): void => {
    setActiveRecordById(id);
    data.detailVisible = !data.detailVisible;
  }

  /**
   * 保存一条密码记录
   */
  const saveRecord = () => {
    data.activeRecord = {
      name: '',
      account: '',
      password: '',
      remark: '',
      url: '',
      createDateTime: ''
    };
    data.saveOrUpdateFlag = 0;
  }

  /**
   * 编辑记录详情
   * @param id
   */
  const updateRecord = (id: number): void => {
    data.saveOrUpdateFlag = 1;
    setActiveRecordById(id);
  }

  /**
   * 新建或修改一条密码记录
   */
  const saveOrUpdateRecord = (id: number) => {
    data.editedVisible = !data.editedVisible;
    if (id != undefined) {
      updateRecord(id);
      data.savePath = "update";
    } else {
      saveRecord();
      data.savePath = "save";
    }
    // getPasswordsByPage();
  }

  /**
   * 删除记录
   * @param id
   */
  const deletePwdRecord = (id: number) => {
    console.log("删除记录", id)
    _delete("/password/deleteById/" + id).then((res: MrsResult) => {
      console.log(res);
      if (res.code === 200) {
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
  const onSubmitChange = () => {
    const nodeList = [].slice.call(document.querySelectorAll(".checked"));
    resetStyle(nodeList, 'out');
    const submitData: Record = JSON.parse(JSON.stringify(data.activeRecord));
    submitData["userId"] = 22;
    if (data.canSubmit.indexOf(false) == -1) {
      data.editedVisible = !data.editedVisible;
      const path = data.savePath === "save" ? "/createPassword" : "/updatePassword";
      const encrypt = SM2Util.encrypt(JSON.stringify(submitData), data.servicePublicKey);
      post("/password" + path + "/22", "04" + encrypt).then(res => {
        console.log(res);
      })
    }
  }

  /**
   * 重置样式
   */
  const resetStyle = (domList: Array<HTMLInputElement>, str: string) => {
    checkRules(data.activeRecord.name, 'name-' + str, null, domList[0]);
    checkRules(data.activeRecord.account, 'account-' + str, null, domList[1]);
    checkRules(data.activeRecord.password, 'password-' + str, null, domList[2]);
  }

  /**
   * 搜索
   */
  const searchByKeyword = (word: string) => {
    console.log(word);
    alert(word);
  }

  /**
   * 弹出框关闭后清除样式
   */
  const editDialogBeforeClose = () => {
    data.editedVisible = !data.editedVisible;
    const nodeList = [].slice.call(document.querySelectorAll(".checked"));
    resetStyle(nodeList, 'in');
  }

  /**
   * TODO: 表单数据校验
   */
  const checkRules = (text: string, type: string, event: Event | null, d: HTMLInputElement | null = null) => {
    let target: HTMLInputElement;
    // @ts-ignore
    if (d == null) target = event.target;
    else target = d;
    const split = type.split('-');
    const checkSuccess = (dom: HTMLInputElement, index: number) => {
      data.canSubmit[index] = true;
      dom.removeAttribute('style');
    }
    const checkFailed = (dom: HTMLInputElement, index: number) => {
      data.canSubmit[index] = false;
      dom.style.border = "1px solid #F00";
    }
    const namePattern = /^.{1,16}$/;
    const accountPattern = /^.{1,32}$/;
    const passwordPattern = /^.{1,32}$/;
    if (split[1] === 'in') {  // 获得焦点
      target.removeAttribute('style');
    } else { // 失去焦点
      if (isEmpty(text)) checkFailed(target, 0);
      switch (split[0]) {
        case 'name':
          namePattern.test(text) ? checkSuccess(target, 0) : checkFailed(target, 0);
          break;
        case 'account':
          accountPattern.test(text) ? checkSuccess(target, 1) : checkFailed(target, 1);
          break;
        case 'password':
          passwordPattern.test(text) ? checkSuccess(target, 2) : checkFailed(target, 2);
          break;
      }
    }
  }

  /**
   * TODO: 滚动监听
   */
  const mrsLazyLoading = () => {
    let timer: any = null;
    const contentBox: HTMLDivElement | null = document.querySelector(".mrs-content");
    const itemListBox: HTMLDivElement | null = document.querySelector(".mrs-item-list");
    // 内外框不为空(将联合类型中的null排除)
    if (itemListBox != null && contentBox != null) {
      // const blowerHeight = document.documentElement.clientHeight;
      // contentBox.style.height = blowerHeight - 50 + "px";// 浏览器高度减去nav的高度
      // 监听滚动事件
      contentBox.addEventListener("scroll", (event: Event) => {
        if (event.target != null) {
          const h = itemListBox.getBoundingClientRect().bottom - window.innerHeight;
          const distance = parseInt(h + "");
          if (distance <= 0) {
            console.log(passwordStore.page);
            const total = passwordStore.page.current * passwordStore.page.size;
            if (timer == null && passwordStore.page.total && total <= passwordStore.page.total) {
              timer = setInterval(() => {
                data.page.current++;
                getPasswordsByPage().then((res: any) => {
                  // data.page.total = res.total;
                });
                clearInterval(timer);
                timer = null;
              }, 1000);
            }
          }
        }
      }, true);
    }
  }
  const {
    passwordList,
    page,
    searchKeyWord,
    detailVisible,
    editedVisible,
    activeRecord,
    saveOrUpdateFlag
  } = toRefs(data);
  return {
    page,
    passwordList,
    searchKeyWord,
    detailVisible,
    editedVisible,
    activeRecord,
    saveOrUpdateFlag,
    getPasswordsByPage,     // 分页查询密码数据
    showPwdDetails,         // 查看详情
    deletePwdRecord,        // 删除记录
    saveOrUpdateRecord,     // 编辑或保存信息
    onSubmitChange,         // 提交更新
    deleteBatch,            // 批量删除
    searchByKeyword,
    editDialogBeforeClose,
    checkRules,
    mrsLazyLoading
  };
}

export default {
  name: "PasswordView",
  components: {MrsTableHeader, MrsTableItem, ElDialog, Toast},
  setup() {

    const {
      page,
      passwordList,
      searchKeyWord,
      detailVisible,
      editedVisible,
      activeRecord,
      saveOrUpdateFlag,
      getPasswordsByPage,     // 分页查询密码数据
      showPwdDetails,
      deletePwdRecord,
      saveOrUpdateRecord,
      onSubmitChange,
      deleteBatch,
      searchByKeyword,
      editDialogBeforeClose,
      checkRules,
      mrsLazyLoading
    } = useCryptEffect();

    passwordStore.cleanStoreList();
    getPasswordsByPage().then(() => {
      mrsLazyLoading();
    });

    return {
      page,
      passwordList,
      searchKeyWord,
      detailVisible,
      editedVisible,
      activeRecord,
      saveOrUpdateFlag,
      showPwdDetails,
      onSubmitChange,
      deletePwdRecord,
      saveOrUpdateRecord,
      deleteBatch,
      searchByKeyword,
      editDialogBeforeClose,
      checkRules
    };
  },

  methods: {

    /**
     * 剪切板操作
     * @param str
     */
    writeToClipboard(str: string) {
      const that: any = this;
      that.$copyText(str);
      that.num = 1;
    },
  }
}
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
