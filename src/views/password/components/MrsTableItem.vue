<template>
  <div class="mrs-item" ref="mrsTableItemRef" data-flag="0">
    <div class="mrs-table-item-mask" v-if="showMask"></div>

    <div class="mrs-table-item">
      <div class="mrs-header">
        <p class="name">{{ currentRecord?.viewTitle }}</p>
        <p class="time">{{ currentRecord?.viewTime }}</p>
      </div>

      <!-- 内容区 -->
      <div class="content">
        <!-- 账号 -->
        <p>
          <span>账号</span>
          <span class="allow-copy" @click.stop="myCopy(currentRecord?.account?.value)">
            {{ currentRecord?.viewAccount }}
          </span>
        </p>

        <!-- 密码 -->
        <p class="pwd-item">
          <span>密码</span>
          <span class="allow-copy" @click.stop="myCopy(currentRecord?.password?.value)">
            {{ currentRecord?.viewPassword }}
          </span>

          <text v-if="currentRecord?.password?.value">
            <span class="is-display iconfont" @click.stop="displayEye" v-if="isDisplayEye">&#xe660;</span>
            <span class="is-display iconfont" @click.stop="displayEye" v-else>&#xe65a;</span>
          </text>

        </p>

        <!-- 备注 -->
        <p>
          <span>备注</span>
          <span>
            {{ currentRecord?.viewRemark }}
          </span>
        </p>
        <!-- 网址 -->
        <p>
          <span>网址</span>
          <a :href="currentRecord?.url?.value" target="_blank"
             v-if="computedIsURL(currentRecord?.url?.value)">{{ currentRecord?.viewURL }}</a>
          <span v-else>{{ currentRecord?.viewURL }}</span>
        </p>
      </div>
    </div>
    <div class="btn-box">
      <input class="mrs-edit-btn" @click.stop="editRecord(item.id)" type="button" value="编 辑">
      <input class="mrs-delete-btn" @click.stop="deleteRecord(item.id)" type="button" value="删 除">
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, defineEmits, defineProps, onMounted, ref, Ref, getCurrentInstance} from "vue";
import {formatTime, isURL, stringReplace} from "@/utils/util/util";
import {TOAST_TYPE} from "@/common/constant";

const props = defineProps({
  showMask: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  },
  mIndex: {
    type: String,
    default: 0
  }
});

const emits = defineEmits<{
  (event: "itemSlided", id: string | null): void;
  (event: "editRecord", id: string): void;
  (event: "showToast", msg: string, type: TOAST_TYPE): void;
  (event: "deleteById", id: string): void;
  (event: "deleteBatch", id: string): void;
}>();

const slided = (id: string | null): void => emits("itemSlided", id);
const editRecord = (id: string): void => emits("editRecord", id);
const deleteRecord = (id: string): void => emits("deleteById", id);
const deleteBatch = (id: string): void => emits("deleteBatch", id);
const showToast = (msg: string, type = TOAST_TYPE.INFO): void => emits("showToast", msg, type);

/**
 * 渲染密码记录（接口）
 */
interface RenderPasswordRecord extends PasswordRecord {
  viewTitle: string; // 显示标题（超出部分会截断）
  viewUserName: string; // 显示用户名（超出部分会截断）
  viewAccount: string; // 显示账号（超出部分会截断）
  viewPassword: string; // 显示密码（显示为*号）
  viewRemark: string;   // 显示的备注（超出部分会截断）
  viewURL: string;      // 官网链接（超出部分会截断）
  viewTime: string;     // 创建时间
}

/**
 * 滑动方向枚举
 */
enum DIRECTION {
  LEFT = "left",
  RIGHT = "right"
}

const instance = getCurrentInstance();
const mrsTableItemRef: Ref<HTMLElement | null> = ref(null);
const isDisplayEye: Ref<boolean> = ref(false);
const currentRecord: Ref<RenderPasswordRecord | null> = ref(null);
const eyesThrottle: Ref<boolean> = ref(true); // 显示的节流
const copyThrottle: Ref<boolean> = ref(true); // 复制的节流

/**
 * 预处理要渲染的数据
 */
const beforeRender = (): void => {
  const item = props.item as PasswordRecord | null;
  if (!item) return;
  const extend = {
    viewTitle: "",
    viewAccount: "",
    viewUserName: "",
    viewPassword: "",
    viewRemark: "",
    viewURL: "",
    viewTime: "",
  }

  extend.viewTitle = stringReplace(item.title?.value, 12, "无标题");       // 标题
  extend.viewUserName = stringReplace(item.userName?.value, 16, "暂无用户");// 用户名
  extend.viewAccount = stringReplace(item.account?.value, 16, "暂无账号"); // 账号
  extend.viewPassword = item.password?.value ? "********" : "无密码";                 // 密码
  extend.viewRemark = stringReplace(item?.remark?.value, 16, "暂无备注"); // 备注
  extend.viewURL = stringReplace(item?.url?.value, 24, "无官网");        // 网址

  // 更新时间或者创建时间
  const time = item?.updateTime || item?.createTime;
  const date = time ? new Date(time) : new Date();
  extend.viewTime = formatTime(date, 'yyyy/MM/dd');
  currentRecord.value = {...item, ...extend};
}
beforeRender();

/**
 * 滑动检测
 * @param target    .
 * @param callback
 */
const slideHandler = (target: HTMLElement, callback: (direction: DIRECTION) => void): void => {
  let timer: any = null;  // 定时器
  let longPressTimer: any = null; // 长按定时器

  const limitX = 10;      // x轴误触范围
  const limitY = 80;      // y轴误触范围
  const data = {
    slide_start_x: 0, // 开始滑动时的x坐标
    slide_start_y: 0, // 开始滑动时的y坐标
    slide_end_y: 0,   // 结束滑动时的x坐标
    slide_end_x: 0    // 结束滑动时的y坐标
  };
  // const langPressLimit = 600;  // 长按等待时间
  // 开始滑动
  target.addEventListener('touchstart', function (e: TouchEvent) {
    const pageXY = e.touches[0];
    data.slide_start_x = parseFloat((pageXY.pageX).toFixed(2));
    data.slide_start_y = parseFloat((pageXY.pageY).toFixed(2));

    // 长按事件
    // longPressTimer = setTimeout(function () {
    //   console.log("长按...");
    //   e.preventDefault();
    // }, langPressLimit);
    e.stopPropagation();
  }, false);

  // 滑动中
  target.addEventListener('touchmove', function (e: TouchEvent) {
    const pageXY = e.changedTouches[0];
    data.slide_end_x = parseFloat((pageXY.pageX).toFixed(2));
    data.slide_end_y = parseFloat((pageXY.pageY).toFixed(2));
    clearInterval(timer);
    clearTimeout(longPressTimer);
    longPressTimer = null;
    timer = setInterval(() => {
      if (
          (data.slide_start_x > data.slide_end_x + limitX)
          &&
          (Math.abs(data.slide_start_y - data.slide_end_y) < limitY)
      ) {
        if (data.slide_start_x > data.slide_end_x) {
          callback(DIRECTION.LEFT);
        } else {
          callback(DIRECTION.RIGHT);
        }
      }
      data.slide_start_x = 0;
      data.slide_end_x = 0;
      clearInterval(timer);
    }, 100);
    e.stopPropagation();
  }, false);
}

/**
 * 挂载滑动检测事件
 */
const detectionSlided = () => {
  const target = mrsTableItemRef.value;
  if (!target) return;
  const id = currentRecord.value?.id ? currentRecord.value.id : '';
  slideHandler(target, (direction) => {
    if (direction === DIRECTION.LEFT) {
      slided(id);
    }
  });
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
const myCopy = (text: string | undefined) => {
  console.log("复制...", text);
  if(!text){
    showToast("无内容可复制", TOAST_TYPE.ERROR);
    return;
  }

  if (copyThrottle.value) {
    copyThrottle.value = false;
    if (instance) {
      const {appContext} = instance;
      appContext.config.globalProperties.$copyText(text)
    }
    showToast("复制成功", TOAST_TYPE.SUCCESS);
    setTimeout(() => {
      copyThrottle.value = true;
    }, 300);
  }
}

/**
 * 显示或隐藏密码
 */
const displayEye = (): void => {
  if (!eyesThrottle.value) return;
  eyesThrottle.value = false;
  isDisplayEye.value = !isDisplayEye.value;
  const record: RenderPasswordRecord | null = currentRecord.value;
  if (record) {
    let pwd = record.password?.value;
    pwd = stringReplace(pwd, 12, "无密码");
    pwd = isDisplayEye.value ? pwd : '********';
    record.viewPassword = pwd;
  }
  setTimeout(() => {
    eyesThrottle.value = true;
  }, 500);
}

onMounted(() => {
  detectionSlided();
});

defineExpose({
  myCopy, displayEye
});
</script>

<style scoped lang="scss">
@import "@/assets/style/common.scss";

$btn-box-width: 120px;

.mrs-item {
  position: relative;
  transition: all 100ms;
  height: 150px;
  //background: #409EFF;

  .mrs-table-item-mask {
    //background: rgba(0, 0, 0, 0.5);
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
  }

  .mrs-table-item {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    background: $color-primary-light-9;
    font-family: "方正黑体", serif;
    color: #333;
    padding: 10px;
    margin-right: 10px;
    border-radius: 5px;

    .mrs-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        font-family: "方正黑体", serif;
        font-weight: bold;
      }

      .time {
        font-size: 14px;
        font-family: "鸿雷行书", serif;
        color: $color-gray-light-2;
      }
    }

    .content {
      //padding-left: 20px;

      $eyes-width: 40px;

      p {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;

        $span-width: 25px;

        span {
          min-width: 45px;
          height: $span-width;
          line-height: $span-width;
        }

        // 标题
        span:first-child {
          margin-right: 10px;
          text-align: justify;
          text-align-last: justify;
          color: $info-gray;
          font-family: "思源柔黑", serif;
          font-size: 14px;
        }

        // 内容
        span:nth-child(2) {
          min-width: 180px;
        }

        .allow-copy::after {
          position: absolute;
          right: $eyes-width;
          content: "点击复制";
          margin: 0 10px;
          color: $brand-blue;
          font: 11px/100% "方正黑体";
          height: $span-width;
          line-height: $span-width;
        }

        a {
          cursor: default;
          color: $brand-blue;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2.9px;
        }
      }

      .pwd-item {
        .is-display {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 10px;
          width: $eyes-width;
          user-select: none;
          font-size: 18px;
        }
      }
    }
  }

  .btn-box {
    position: absolute;
    right: 0;
    top: 0;
    width: $btn-box-width;
    height: 100%;
    transform: translateX($btn-box-width);

    input[type="button"] {
      outline: none;
      border: 0;
      width: 50%;
      height: 100%;
      font-size: $font-content-size-16;
      line-height: $content-line-height;
      color: $classic-white;
    }

    .mrs-edit-btn {
      background: $brand-blue;
    }

    .mrs-delete-btn {
      background: $danger-red;
    }
  }
}
</style>
