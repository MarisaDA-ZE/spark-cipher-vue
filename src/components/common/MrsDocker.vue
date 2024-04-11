<template>
  <div class="mrs-docker" :style="{height: height+'px'}">
    <div class="item" v-for="(e, i) in dockers" :key="i" @click="changeIndexHandler(i, e.to)">
      <div class="icon"><i class="iconfont" v-html="e.icon"></i></div>
      <div class="text" v-show="show_text"> {{ e.text }}</div>
    </div>
    <div class="mrs-active-line" :style="'transform: translateX(' + position_x + 'px)'"></div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDockerStore } from "@/store/dockerStore";
import {DOCKER_HEIGHT} from "@/common/constant";

export default {
  name: "Docker",
  props: ["dockers", "show_text"],
  data(){
    return {
      height: DOCKER_HEIGHT,
    };
  },
  setup(props: any) {
    const store = useDockerStore();
    const router = useRouter();
    let ix = store.getIndex();
    store.init(ix, props.dockers.length, 40, window.screen.width);
    const changeIndexHandler = (index: number, path: string) => {
      store.changeIndex(index);
      router.push(path);
    };
    const position_x = ref(store.position_x);
    store.$onAction(() => {
      setTimeout(() => {
        position_x.value = store.position_x;
      }, 100);
    }, false);

    return { position_x, store, changeIndexHandler };
  },

  watch: {
    $route: {
      handler(_new: any, _old: any) {
        const that: any = this;
        const path: string = _new.fullPath;
        that.dockers.forEach((e: any, i: number) => {
          if (e.to === path) {
            that.store.changeIndex(i);
          }
        });
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/common";

.mrs-docker {
  //opacity: 50%;
  //height: 50px;
  width: 100%;
  background: $color-gray-light-9;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .item {
    display: flex;
    width: 40px;
    height: 40px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    user-select: none;
    cursor: pointer;

    .icon {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      color: $brand-blue;

      i {
        font-size: $font-icons-size;
      }
    }

    .text {
      width: 100%;
      text-align: center;
      font: 14px/120% "华文楷体", "Microsoft YaHei UI";
    }
  }

  .mrs-active-line {
    width: 40px;
    height: 4px;
    background: $brand-blue;
    position: absolute;
    left: 0;
    bottom: 2px;
    transition: all 200ms;
  }
}
</style>