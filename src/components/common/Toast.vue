<template>
  <div class="toast" v-show="visible" :style="toastStyle">
    <div class="icon">
      <i class="iconfont">&#xe664;</i><!-- icon图标 -->
    </div>
    <div class="massage">{{ massage }}</div>
  </div>
</template>

<script lang="ts">
import {ref} from 'vue';
import {TOAST_TYPE} from "@/common/constant";
// 数据
let visible = ref(false);
let toastStyle = ref({});
let massage = ref('');

/**
 * 处理提示框相关逻辑
 */
const useToastEffect = () => {

  /**
   * 提示框弹窗
   * @param type 提示框的类型
   * @param msg 提示框信息
   * @param time 提示框显示时间
   */
  const showToast = (type: TOAST_TYPE, msg: string, time: number): void => {
    massage.value = msg;
    toastStyle.value = handlerToastType(type);
    handlerShowToast(time);
  }

  /**
   * 处理显示提示框时的类型
   * @param type 提示框类型
   */
  const handlerToastType = (type: TOAST_TYPE): object => {
    const result = {color: '', background: ''};
    switch (type) {
      case TOAST_TYPE.SUCCESS:
        result.color = '#FFF';
        result.background = '#66CD00';
        break;
      case TOAST_TYPE.INFO:
        result.color = "#FFF";
        result.background = "#409EFF";
        break;
      case TOAST_TYPE.WARNING:
        result.color = "#FFF";
        result.background = "#FFC125";
        break;
      case TOAST_TYPE.ERROR:
        result.color = "#FFF";
        result.background = "#FF6A6A";
        break;
      case TOAST_TYPE.UNKNOWN:
        result.color = "#000";
        result.background = "#FFF";
        break

      default:
        result.color = "#000";
        result.background = "#FFF";
    }
    return result;
  }

  /**
   * 处理显示提示框的逻辑
   * @param time 提示框时间
   */
  const handlerShowToast = (time: number): void => {
    if (visible.value) return;
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, time);
  }
  return {visible, massage, toastStyle, showToast};
};

export const showToast = (type = TOAST_TYPE.INFO, msg = '通知', time = 1): void => {
  const {showToast} = useToastEffect();
  time *= 1000;
  showToast(type, msg, time);
}

export default {
  name: "Toast",
  setup() {
    let {visible, massage, toastStyle} = useToastEffect();
    return {visible, massage, toastStyle};
  }
};

</script>

<style lang="scss" scoped>
@keyframes visibleAnimation {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.toast {
  position: fixed;
  left: 50%;
  top: 0;
  transform: translate(-50%, 20px);
  width: 80%;
  height: 50px;
  z-index: 999;

  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  background: #FFF;
  box-shadow: 0 0 10px #CCC;
  animation: visibleAnimation 200ms;

  user-select: none;
  pointer-events: none;

  .icon {
    width: 50px;
    min-width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      transform: scale(1.6);
    }

  }

  .massage {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

  }
}
</style>
