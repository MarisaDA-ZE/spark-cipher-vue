<template>
  <div class="mrs-docker" :style="{'--d-height': DOCKER_HEIGHT}">
    <div :class="{'item': true, 'active-item': i === (currentIndex -1)}"
         v-for="(e, i) in dockers" :key="i" @click="changeViews(e.to, i)">
      <div class="icon"><i class="iconfont" v-html="e.icon"></i></div>
      <div class="text" v-show="show_text"> {{ e.text }}</div>
    </div>
    <div class="mrs-active-line" :style="{'--cIndex': currentIndex, '--total': dockers?.length}"></div>
  </div>
</template>

<script lang="ts" setup>
import {ref, Ref, defineProps, onMounted, PropType} from "vue";
import {useRoute, useRouter} from "vue-router";
import {DOCKER_HEIGHT} from "@/common/constant";

const {dockers} = defineProps({
  dockers: {
    type: Array as PropType<DockerType[]>,
    default: () => {
      const val: DockerType[] = [];
      return val;
    }
  },
  show_text: {
    type: Boolean,
    default: true
  }
});
const route = useRoute();
const router = useRouter();
const currentIndex: Ref<number> = ref(1);

const changeViews = (path: string, index: number) => {
  router.push(path);
  currentIndex.value = index + 1;
};

onMounted(() => {
  const currentRoute = route.path;
  for (let i = 0; i < dockers.length; i++) {
    if (currentRoute === dockers[i]?.to) {
      currentIndex.value = i + 1;
      break;
    }
  }
});
</script>

<style scoped lang="scss">
@import "src/assets/style/common";

.mrs-docker {
  $currentIndex: var(--cIndex);
  $itemCount: var(--total);
  width: 100%;
  height: calc(var(--d-height) * 1px);
  background: $color-gray-light-9;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;

  $itemWidth: 40px;

  .item {
    display: flex;
    width: $itemWidth;
    height: 40px;
    color: $color-gray-light-2;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    user-select: none;
    cursor: pointer;
    transition: color 200ms;

    .icon {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;

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

  .active-item{
    color: $brand-blue;
  }

  $defaultX: calc((100% - ($itemWidth * $itemCount)) / (2 * $itemCount));

  .mrs-active-line {
    $offsetX: calc(($defaultX * $currentIndex * 2) + ($itemWidth * ($currentIndex - 1)));
    width: 40px;
    height: 4px;
    background: $brand-blue;
    position: absolute;
    left: calc(($defaultX * -1) + $offsetX);
    bottom: 2px;
    transition: all 200ms;
  }
}
</style>