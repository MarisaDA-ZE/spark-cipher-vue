<template>
  <div class="password_view">
    <div class="utils_bar">
      <label class="add_btn">
        <i class="iconfont">&#xe626;</i>
        <input
          type="button"
          value="添加"
          @click="createRecord()"
          v-show="false"
        />
      </label>
    </div>
    <div class="items">
      <div class="item">
        <div class="title">名称</div>
        <div class="content">名称</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { cryptoInit } from "../../common/constant";
import { useCryptoStore } from "../../store/cryptoStore";
const usePasswordEffect = () => {
  /**
   * 初始化
   */
  const init = (): void => {
    const store = useCryptoStore();
    if (!store.initialized) {
      // 初始化密钥对
      cryptoInit();
    }
  };

  /**
   * 新建密码信息
   */
  const createRecord = () => {
    console.log("新建密码");
  };

  return { init, createRecord };
};

export default {
  name: "PasswordView",
  setup() {
    const { init, createRecord } = usePasswordEffect();
    init();
    return { createRecord };
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/style/common.scss";
.password_view {
  .utils_bar {
    padding: 5px;
    color: $brand-blue;

    .add_btn {
      border: 1px solid;
      display: flex;
      height: 25px;
      width: 25px;
      justify-content: center;
      align-items: center;
      user-select: none;
      cursor: pointer;
      overflow: hidden;
      border-radius: 2px;

      i {
        font-size: 30px;
      }
    }
  }
}
</style>
