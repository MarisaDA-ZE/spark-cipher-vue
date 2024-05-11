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
      <div class="mrs-form-wrap">
        <el-form
            label-position="left"
            label-width="auto"
            :model="registerForm"
            :rules="registerRules"
            ref="ruleFormRef"
            size="large"
            style="max-width: 600px"
        >
          <!-- 用户昵称 -->
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="registerForm.nickName" placeholder="请输入昵称"/>
          </el-form-item>

          <!-- 账户名 -->
          <el-form-item label="账号" prop="account">
            <el-input v-model="registerForm.account" placeholder="请输入账号"/>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" placeholder="请输入密码" show-password/>
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" placeholder="请再次输入密码" show-password/>
          </el-form-item>

          <!-- 手机号 -->
          <el-form-item label="手机号" prop="phoneNo">
            <el-input v-model="registerForm.phoneNo" placeholder="请输入手机号"/>
          </el-form-item>

          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入邮箱"/>
          </el-form-item>
        </el-form>

        <!-- 提示文字 -->
        <span class=mrs-tip>
          提示：手机号和邮箱请<text style="color:#F56C6C;">最少填写一项</text>，这是用于将来可能发生的找回密码等安全事件；
          注册时填写的邮箱或手机号为原始数据，享有最高优先级，所以请务必填写您自己的邮箱或手机号。
        </span>

        <!-- 注册按钮 -->
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="toRegister(ruleFormRef)">
            注册
          </el-button>
        </el-form-item>
      </div>
    </div>
    <Toast/>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, Ref} from 'vue';
import {useRouter} from "vue-router";
import {getCurrentContentHeight, isBlank} from "@/utils/util/util";
import MrsHeader from "@/components/common/MrsHeader.vue";
import Toast, {showToast} from "@/components/common/Toast.vue";
import {FormInstance, FormRules} from "element-plus";
import {MRS_REGEXPS, TOAST_TYPE} from "@/common/constant";
import api from "@/api/api";

const contentViewHeight: Ref<number> = ref(0);

const ruleFormRef: Ref<any> = ref(null);

const router = useRouter();

const registerForm = reactive({
  account: '',
  nickName: '',
  password: '',
  confirmPassword: '',
  phoneNo: '',
  email: '',
});

/**
 * 密码强度校验
 * @param rule  规则
 * @param value 值
 * @param callback  通过、不通过的回调函数
 */
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'));
    return;
  }

  if (value.length < 6 || value.length > 20) {
    callback(new Error('密码长度在 6 到 20 个字符'));
    return;
  }

  if (!MRS_REGEXPS.PASSWORD.test(value)) {
    callback(new Error('密码须包含数字、大小写字母'));
    return;
  }
  callback();
}

/**
 * 二次密码校验
 * @param rule  规则
 * @param value 值
 * @param callback  通过、不通过的回调函数
 */
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请重复输入密码'));
    return;
  }

  if (value !== registerForm.password) {
    callback(new Error('两次密码不一致'));
    return;
  }
  callback();
}

/**
 * 手机号校验
 * @param rule  规则
 * @param value 值
 * @param callback  通过、不通过的回调函数
 */
const validatePhoneNo = (rule: any, value: any, callback: any) => {
  if (isBlank(value) && isBlank(registerForm.email)) {
    callback(new Error('请填写手机号或填写下一项的邮箱'));
    return;
  }
  if (!isBlank(value) && !MRS_REGEXPS.PHONE.test(value)) {
    callback(new Error('请输入正确的手机号'));
    return;
  }
  callback();
}

/**
 * 邮箱校验
 * @param rule  规则
 * @param value 值
 * @param callback  通过、不通过的回调函数
 */
const validateEmail = (rule: any, value: any, callback: any) => {
  if (isBlank(value) && isBlank(registerForm.phoneNo)) {
    callback(new Error('请填写邮箱或填写上一项的手机号'));
    return;
  }
  if (!isBlank(value) && !MRS_REGEXPS.EMAIL.test(value)) {
    callback(new Error('请输入正确的邮箱号'));
    return;
  }
  callback();
}

/**
 * 邮箱校验
 * @param key  键名
 * @param msg  错误提示
 * @param rule  规则
 * @param value 值
 * @param callback  通过、不通过的回调函数
 */
const validateValueUnique = (key: string, msg: string, rule: any, value: any, callback: any): void => {
  if (isBlank(value)) {
    callback();
    return;
  }
  api.getCountByUserKey({[key]: value}).then(res => {
    if (res.status) {
      if (res.data > 0) {
        callback(new Error(msg));
      } else {
        callback();
      }
    } else {
      callback(new Error(res.msg));
    }
  }).catch((err: MrsResult<null>) => {
    callback(new Error(err?.msg || "请求错误"));
  });
}

/**
 *  注册表单验证规则
 */
const registerRules = reactive<FormRules<typeof registerForm>>({
  account: [
    {required: true, message: '请输入账号', trigger: 'blur'},
    {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'},
    {validator: (r, v, c) => validateValueUnique("account", "该账号已存在", r, v, c), trigger: 'blur'},
  ],
  nickName: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {validator: validatePass, trigger: 'blur'}
  ],
  confirmPassword: [
    {required: true, message: '请再次输入密码', trigger: 'blur'},
    {validator: validatePass2, trigger: 'blur'}
  ],
  phoneNo: [
    {validator: validatePhoneNo, trigger: 'blur'},
    {validator: (r, v, c) => validateValueUnique("phone", "该手机号已存在", r, v, c), trigger: 'blur'},
  ],
  email: [
    {validator: validateEmail, trigger: 'blur'},
    {validator: (r, v, c) => validateValueUnique("email", "该邮箱已存在", r, v, c), trigger: 'blur'}
  ]
});

const toRegister = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log('提交表单...');
      const params: CreateAccountVo = {
        account: registerForm.account,
        nickName: registerForm.nickName,
        password: registerForm.password,
        phoneNo: registerForm.phoneNo,
        email: registerForm.email
      };
      console.log("注册参数: ", params);
      api.accountCreate(params).then(res => {
        console.log(res);
        if (res.status) {
          router.back();
        } else {
          showToast(TOAST_TYPE.ERROR, res.msg);
        }
      }).catch(err => {
        showToast(TOAST_TYPE.ERROR, err?.msg || "网络错误，请稍后再试");
      });
    } else {
      console.log('表单有误...');
      showToast(TOAST_TYPE.ERROR, "请检查输入");
      return false;
    }
  });
}

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

    .mrs-form-wrap {
      margin: 0 auto;
      width: calc(100% - 50px);

      .mrs-tip {
        font-size: 12px;
        color: $color-gray-light-3;
      }
    }
  }
}
</style>
