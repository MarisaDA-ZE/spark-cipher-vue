<template>
  <div class="password-edit-wrapper" :style="{'--view-height': contentViewHeight, '--header-height': 45}">
    <!-- 头部 -->
    <mrs-header :show-back="true" class="my-header">
      <template #center>
        新增密码
      </template>
    </mrs-header>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 表单内容区 -->
      <div class="m-form-box">
        <el-form
            ref="ruleFormRef"
            style="max-width: 600px"
            :model="recordForm || ''"
            label-position="top"
            label-width="auto">

          <!-- 标题 -->
          <el-form-item label="标题" prop="title" :rules="recordRules.title" style="width: calc(100% - 10px);">
            <el-input v-model="recordForm.title" placeholder="请输入标题" clearable/>
          </el-form-item>

          <!-- 动态表单项 -->
          <el-form-item :label="e.label" :prop="e.name" :rules="recordRules[e.name]"
                        v-for="(e, i) in dynamicFormItemList" :key="i">
            <!-- 文本框 -->
            <div class="m-form-item">
              <el-input :type="e.type" v-model="recordForm[e.name]" :placeholder="e.placeholder" clearable/>
              <i class="iconfont item-close-icon" @click.prevent="removeRecordItem(e)">&#xe620;</i>
            </div>
          </el-form-item>

          <!-- 添加表单项 -->
          <el-form-item>
            <el-button class="add-btn" size="large" style="width: 100%;" plain text bg
                       @click="addItemDrawer = true">
              <i class="iconfont">&#xe626;</i>
              添加表单项
            </el-button>
          </el-form-item>

          <!-- 表单提交 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              保存
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 抽屉 -->
    <el-drawer v-model="addItemDrawer" :before-close="drawerClose" direction="btt" class="my-drawer"
               :style="{'--content-height': currentItemType.drawerType === ITEM_TYPE.CUSTOM ? 50 : 0}">
      <!-- 抽屉标题 -->
      <template #header>
        <h4>添加表单项</h4>
      </template>

      <!-- 抽屉中间的内容 -->
      <template #default>
        <el-form ref="ruleDrawerRef"
                 style="max-width: 600px"
                 :model="currentItemType"
                 :rules="drawerRules"
                 label-position="top"
                 label-width="auto">
          <!-- 标题 -->
          <el-form-item label="表单项类型" prop="drawerType">
            <!-- 选择器 -->
            <el-select
                v-model="currentItemType.drawerType"
                placeholder="请选择表单类型"
                size="large"
                style="width: 100%"
                clearable>

              <!-- 选择项 -->
              <el-option
                  v-for="item in itemOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                <!-- 内容 -->
                <span style="float: left;">{{ item.label }}</span>
                <!-- 类型 -->
                <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">
                {{ item.type }}
              </span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 选择自定义类型时填写 -->
          <div class="custom-line" v-if="currentItemType.drawerType === ITEM_TYPE.CUSTOM"
               :style="{'--content-height': currentItemType.drawerType === ITEM_TYPE.CUSTOM ? 40 : 0}">

            <!-- 标题 -->
            <el-form-item prop="customTitle">
              <div class="custom-line-title">
                <el-input v-model="currentItemType.customItemTypeName" size="large" style="width: 100px;"
                          placeholder="请输入标题"
                          clearable/>
              </div>
            </el-form-item>

            <!-- 类型选择框 -->

            <div class="custom-line-content">
              <span>类型</span>
              <el-form-item prop="customValue" style="width: 100%;">
                <el-select
                    v-model="currentItemType.formInputType"
                    placeholder="请选择表单类型"
                    size="large"
                    style="width: 100%;">
                  <el-option
                      v-for="item in formInputTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <!-- 确定按钮 -->
          <el-form-item>
            <el-button type="primary" style="width: 100%" size="large" @click="confirmClick(ruleDrawerRef)">确定
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, Ref} from 'vue';
import MrsHeader from "@/components/common/MrsHeader.vue";
import {getCurrentContentHeight, isBlank, isEmpty} from "@/utils/util/util";
import type {FormInstance, FormRules} from 'element-plus';
import {FormItemRule} from "element-plus/es/components/form/src/types";

const contentViewHeight: Ref<number> = ref(getCurrentContentHeight());  // 内容区高度

enum ITEM_TYPE {
  ACCOUNT = 'account',
  PASSWORD = 'password',
  NICK_NAME = 'nickName',
  PHONE = 'phone',
  EMAIL = 'email',
  URL = 'url',
  REMARK = 'remark',
  CUSTOM = 'custom',
}

// 表单输入框类型
enum FORM_TYPE {
  TEXT = 'text',
  PASSWORD = 'password',
  TEXTAREA = 'textarea'
}

// TODO: 主表单区域

const ruleFormRef = ref<FormInstance>()
const recordForm = reactive<any>({
  title: '',
});

const recordRules = reactive<FormRules<any>>({
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur'
    },
    {min: 2, max: 16, message: '标题长度为2~16字符', trigger: 'blur'},
  ],
});

const labelMap = reactive<any>({
  title: {key: 'title', label: '标题', type: FORM_TYPE.TEXT}
});

/**
 * 提交表单
 * @param formEl
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      console.log('提交...');
      const params: any = {};
      const keys = Object.keys(recordForm);
      const keyMap = new Map<string, number>();
      let index = 0;
      for (let key of keys) {
        const original = key;
        const label = labelMap[original];
        key = key.split('-')[0];
        let count = keyMap.get(key);
        count = (typeof count !== 'undefined') ? ++count : 0;
        keyMap.set(key, count);
        key = count > 0 ? `${key}_${count}` : key;
        params[key] = {
          label: label.label,
          value: recordForm[original],
          type: label.type,
          sort: index
        };
        index++;
      }

      console.log("新对象: ", params);
    }
  });
};

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

/**
 * TODO: 数据回填
 */
const dataBackfill = (data: any) => {
  if (isEmpty(data)) return;

  const sortKeys = Object.keys(data).sort((a, b) => {
    const aSort = data[a].sort;
    const bSort = data[b].sort;
    return aSort - bSort;
  });

  for (let key of sortKeys) {
    const value = data[key];
    labelMap[key] = {key: key, label: value.label, type: value.type};
    recordForm[key] = value.value;

    const roleKey = key.split('_')[0];
    recordRules[key] = rolesMap[roleKey];
    if (key !== 'title') {
      // 创建对象和添加规则
      const dynamicFormItem: DynamicFormItem = {
        type: value.type,
        name: key,
        label: value.label,
        placeholder: `请输入${value.label}`,
      };
      dynamicFormItemList.push(dynamicFormItem);
    }
  }

}

// TODO: 抽屉区域


// 选择器的类型列表
const itemOptions = [
  {
    value: ITEM_TYPE.ACCOUNT,
    label: '账号',
    type: '文本输入框',
  },
  {
    value: ITEM_TYPE.PASSWORD,
    label: '密码',
    type: '文本输入框',
  },
  {
    value: ITEM_TYPE.PHONE,
    label: '手机号',
    type: '文本输入框',
  },
  {
    value: ITEM_TYPE.EMAIL,
    label: '邮箱',
    type: '文本输入框',
  },
  {
    value: ITEM_TYPE.NICK_NAME,
    label: '昵称',
    type: '文本输入框',
  },
  {
    value: ITEM_TYPE.URL,
    label: '网址',
    type: '文本输入框',
  },
  {
    value: ITEM_TYPE.REMARK,
    label: '备注',
    type: '多行文本输入框',
  },
  {
    value: ITEM_TYPE.CUSTOM,
    label: '自定义',
    type: '自行配置类型和提示',
  },
];

// 表单组件类型
const formInputTypes = [
  {
    value: FORM_TYPE.TEXT,
    label: '文本输入框',
  },
  {
    value: FORM_TYPE.PASSWORD,
    label: '密码输入框',
  },
  {
    value: FORM_TYPE.TEXTAREA,
    label: '多行文本输入框',
  },
];

const addItemDrawer = ref(false);
const ruleDrawerRef = ref<FormInstance>();
const currentItemType = reactive({
  drawerType: '',
  customItemTypeName: '',
  formInputType: FORM_TYPE.TEXT,
});
const validateTypeTitle = (rule: any, value: any, callback: any) => {
  if (currentItemType.drawerType === ITEM_TYPE.CUSTOM) {
    if (isBlank(currentItemType.customItemTypeName)) {
      callback(new Error("请输入标题"));
    } else {
      callback();
    }
  } else {
    callback();
  }
}

const validateTypeValue = (rule: any, value: any, callback: any) => {
  if (currentItemType.drawerType === ITEM_TYPE.CUSTOM) {
    if (isBlank(currentItemType.formInputType)) {
      callback(new Error("请选择类型"));
    } else {
      callback();
    }
  } else {
    callback();
  }
}

const drawerRules = reactive({
  drawerType: [{
    required: true,
    message: '请选择表单项类型',
    trigger: 'change',
  }],
  customTitle: [{validator: validateTypeTitle, trigger: 'blur'}],
  customValue: [{validator: validateTypeValue, trigger: 'change'}],
});

/**
 * 校验规则映射
 */
const rolesMap = reactive<any>({
  title: [
    {required: true, message: '请输入标题', trigger: 'blur'},
    {min: 2, max: 16, message: '标题长度为2~16字符', trigger: 'blur'},
  ],
  account: [
    {required: true, message: '请输入账号', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
  ],
  nickName: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
  ],
  phone: [
    {required: true, message: '请输入手机号', trigger: 'blur'},
    {
      pattern: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4(?:(?:10|4[01])\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/,
      message: '手机号不符合规范',
      trigger: 'blur'
    },
  ],
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {
      pattern: /[\w'.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}/,
      message: '邮箱号不符合规范',
      trigger: 'blur'
    },
  ],
  url: [
    {required: true, message: '请输入网址', trigger: 'blur'},
    {
      pattern: /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,
      message: '网址不符合规范',
      trigger: 'blur'
    },
  ],
  remark: [
    {required: true, message: `请输入备注`, trigger: 'blur'},
  ],
  custom: [
    {required: true, message: `请输入自定义属性值`, trigger: 'blur'},
  ]
});

/**
 * 添加表单项
 * @param formEl
 */
async function confirmClick(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      let valName = "";
      let currentRole: FormItemRule[] = [];
      addItemDrawer.value = false;
      switch (currentItemType.drawerType) {
          // 账号
        case ITEM_TYPE.ACCOUNT:
          valName = ITEM_TYPE.ACCOUNT + '-';
          currentItemType.customItemTypeName = '账号';
          currentItemType.formInputType = FORM_TYPE.TEXT;
          currentRole = rolesMap.account;
          break;

          // 密码
        case ITEM_TYPE.PASSWORD:
          valName = ITEM_TYPE.PASSWORD + '-';
          currentItemType.customItemTypeName = '密码';
          // currentItemType.formInputType = FORM_TYPE.PASSWORD;
          currentItemType.formInputType = FORM_TYPE.TEXT;
          currentRole = rolesMap.password;
          break;

          // 密码
        case ITEM_TYPE.NICK_NAME:
          valName = ITEM_TYPE.NICK_NAME + '-';
          currentItemType.customItemTypeName = '昵称';
          currentItemType.formInputType = FORM_TYPE.TEXT;
          currentRole = rolesMap.nickName;
          break;
          // 手机号
        case ITEM_TYPE.PHONE:
          valName = ITEM_TYPE.PHONE + '-';
          currentItemType.customItemTypeName = '手机号';
          currentItemType.formInputType = FORM_TYPE.TEXT;
          currentRole = rolesMap.phone;
          break;

          // 邮箱
        case ITEM_TYPE.EMAIL:
          valName = ITEM_TYPE.EMAIL + '-';
          currentItemType.customItemTypeName = '邮箱';
          currentItemType.formInputType = FORM_TYPE.TEXT;
          currentRole = rolesMap.email;
          break;

          // 网址
        case ITEM_TYPE.URL:
          valName = ITEM_TYPE.URL + '-';
          currentItemType.customItemTypeName = '网址';
          currentItemType.formInputType = FORM_TYPE.TEXTAREA;
          currentRole = rolesMap.url;
          break;

          // 备注
        case ITEM_TYPE.REMARK:
          valName = ITEM_TYPE.REMARK + '-';
          currentItemType.customItemTypeName = '备注';
          currentItemType.formInputType = FORM_TYPE.TEXTAREA;
          currentRole = rolesMap.remark
          break;

          // 其它用户自定义
        case ITEM_TYPE.CUSTOM:
          valName = ITEM_TYPE.CUSTOM + '-';
          currentRole = rolesMap.custom;
          break;
      }

      valName += String((new Date()).getTime());
      // 创建对象和添加规则
      const dynamicFormItem: DynamicFormItem = {
        type: currentItemType.formInputType,
        name: valName,
        label: currentItemType.customItemTypeName,
        placeholder: `请输入${currentItemType.customItemTypeName}`,
      };
      dynamicFormItemList.push(dynamicFormItem);
      recordForm[valName] = '';
      recordRules[valName] = currentRole;
      labelMap[valName] = {
        key: valName,
        label: currentItemType.customItemTypeName,
        type: currentItemType.formInputType
      };
      // 清除抽屉表单的内容
      clearDrawerFields();
    }
  });
}

/**
 * 关闭下拉框
 */
const drawerClose = () => {
  addItemDrawer.value = false;
  clearDrawerFields();
}

const clearDrawerFields = (): void => {
  currentItemType.customItemTypeName = '';
  currentItemType.formInputType = FORM_TYPE.TEXT;
  if (!ruleDrawerRef.value) return
  ruleDrawerRef.value.resetFields();
}

// TODO: 动态表单
interface DynamicFormItem {
  type: FORM_TYPE,      // 类型
  name: string,         // 名称
  label: string,        // 提示文字
  placeholder: string,  // 提示
}

const dynamicFormItemList = reactive<DynamicFormItem[] | any[]>([]);

const removeRecordItem = (item: DynamicFormItem) => {
  console.log(item);
  const index = dynamicFormItemList.indexOf(item);
  if (index !== -1) {
    dynamicFormItemList.splice(index, 1);
    delete recordForm[item.name];
    delete recordRules[item.name];
    delete labelMap[item.name];
  }
}

onMounted(() => {
  console.log("mounted...");
//   dataBackfill({
//     account: {label: "账号", value: "测试账号", type: 'textarea', sort: 1},
//     password: {label: "密码", value: "测试密码", type: 'text', sort: 2},
//     custom: {label: "测试", value: "测试值", type: 'text', sort: 3},
//     custom_1: {label: "测试2", value: "测试值2", type: 'text', sort: 4},
//     title: {label: "标题", value: "测试标题", type: 'text', sort: 0}
//   });
});
</script>

<style lang="scss" scoped>
@import "@/assets/style/common.scss";

.my-header {
  background: $classic-white;
}

.add-btn {
  color: $color-primary-light-3;

  i {
    font-size: 24px;
  }
}

.custom-line {
  $height: calc(var(--content-height) * 1px);
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;

  // 行内容
  .custom-line-content {
    display: flex;
    width: 100%;

    span {
      display: flex;
      height: 40px;
      color: $color-gray-light-3;
      justify-content: flex-end;
      align-items: center;
      width: 60px;
      padding-right: 8px;
    }
  }
}

.m-form-item {
  width: calc(100% - 10px);
  position: relative;

  .item-close-icon {
    position: absolute;
    top: 7.5px;
    right: -23px;
    width: 20px;
    height: 20px;
    background: $color-gray-light-8;
    color: $info-gray;
    font-size: 16px;
    text-align: center;
    line-height: 125%;
    border-radius: 50%;
    user-select: none;
  }
}

.password-edit-wrapper {
  $header-height: calc(var(--header-height) * 1px);
  $view-height: calc(var(--view-height) * 1px);
  background: $color-gray-light-9;

  // 内容区域
  .content {
    padding-top: calc($header-height + 10px);
    width: 100%;
    height: $view-height;
    overflow-y: scroll;

    .m-form-box {
      width: calc(100% - 20px);
      margin: 0 auto;
      background: #FFF;
      padding: 20px;
      border-radius: 10px;
      overflow: hidden;
    }
  }
}
</style>

<style lang="scss">
.my-drawer {
  $current-height: calc(var(--content-height) * 1px);
  height: calc(30% + $current-height) !important;

  .el-drawer__header {
    margin-bottom: 0;
  }

  .el-drawer__body {
    padding-bottom: 0;
  }

  .el-drawer__footer {
    padding-top: 0;
  }
}
</style>
