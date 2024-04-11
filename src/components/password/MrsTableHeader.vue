<template>
  <div class="mrs-table-header">
    <p>
      <button class="mrs-btn" @click="createRecord"><i class="iconfont mrs-icon">&#xe626;</i></button>
    </p>
  </div>
</template>

<script lang="ts">

import { reactive, toRefs } from "vue";
type Emits = {
  emit: Function
}


export default {
  name: "MrsTableHeader",
  emits: ["createRecord", "searchByKeyword"],
  setup(pops: Readonly<any>, { emit }: Emits) {
    const data = reactive({
      searchStr: ""
    })

    /**
     * 创建一条密码信息
     */
    const createRecord = () => {
      emit("createRecord");
    }
    const beforeSearchHandler = () => {
      emit("searchByKeyword", data.searchStr);
    }
    const { searchStr } = toRefs(data);
    return {
      searchStr,
      createRecord,
      beforeSearchHandler
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/common";

.mrs-table-header {
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  p {
    margin: 0 10px;

    .mrs-btn {
      border: 0;
      width: 30px;
      height: 30px;
      background: $color-primary-light-3;
      cursor: pointer;

      .mrs-icon {
        font-size: $font-content-size-21;
        color: #FFF;
      }
    }
  }


}
</style>
