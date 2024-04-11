<template>
  <div ref="scrollContainerRef" class="my-scroll" :style="{ height: containerHeight+'px' }">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {debounce} from 'lodash-es';

function isNearBottom(scrollContainer: HTMLDivElement | null): boolean {
  if (!scrollContainer) return false;
  const scrollTop = scrollContainer.scrollTop;
  const scrollHeight = scrollContainer.scrollHeight;
  const clientHeight = scrollContainer.clientHeight;
  // 通常设定一个阈值（例如 10px），距离底部这个阈值以内时认为是接近底部
  const threshold = 10;
  return scrollTop + clientHeight >= scrollHeight - threshold;
}

defineProps({
  containerHeight: {
    type: [String, Number],
    required: true,
  },
});

const emits = defineEmits(['scroll']);

const scrollContainerRef = ref<HTMLDivElement | null>(null);

const handleScroll = debounce(() => {
  if (isNearBottom(scrollContainerRef.value)) {
    emits('scroll');
  }
}, 100);

onMounted(() => {
  if (scrollContainerRef.value) {
    scrollContainerRef.value.addEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
  if (scrollContainerRef.value) {
    scrollContainerRef.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.my-scroll {
  overflow-y: auto;
  position: relative;
  overflow-x: hidden;
}
</style>
