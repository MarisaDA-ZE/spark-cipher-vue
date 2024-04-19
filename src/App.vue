<template>
  <!-- 这个header没用了，页面中的header都统一在组件中进行插入 -->
  <mrs-header v-if="viewsInfo.headerDisplay" :style="'--header-height: ' + HEADER_HEIGHT" :search_display="true"/>
  <div class="mrs-center" :style="viewsInfo.styleText +';--header-height: ' + HEADER_HEIGHT">
    <router-view :key="$route.fullPath"/>
  </div>
  <mrs-docker v-if="viewsInfo.dockerDisplay" :dockers="dockers" :show_text="false"/>
</template>

<script lang="ts" setup>
import {watch, reactive} from "vue";
import {RouteMeta, useRouter} from "vue-router";
import MrsHeader from "@/components/common/MrsHeader.vue";
import MrsDocker from "@/components/common/MrsDocker.vue";
import {computedHeightByRoute} from "@/utils/util/util";
import {C_CONTENT_HEIGHT, DOCKER_HEIGHT, HEADER_HEIGHT} from "@/common/constant";

const router = useRouter();
const routeMap = router.options.routes;
const keyMap = new Array<string>();
routeMap.forEach((e) => {
  keyMap.push(e.path);
});

// 内容区高度


// Docker栏信息
const dockers = [
  {
    id: 0,
    icon: "&#xe64c;",
    failed: "FILED",
    text: "密 码",
    show_header: false,
    show_docker: false,
    to: "/password-view",
  },
  {
    id: 1,
    icon: "&#xe662;",
    failed: "FILED",
    text: "图 片",
    show_header: false,
    show_docker: false,
    to: "/images-view",
  },
  {
    id: 2,
    icon: "&#xe619;",
    failed: "FILED",
    text: "视 频",
    show_header: false,
    show_docker: false,
    to: "/videos-view",
  },
  {
    id: 3,
    icon: "&#xe656;",
    failed: "FILED",
    text: "文 件",
    show_header: false,
    show_docker: false,
    to: "/files-view",
  },
  {
    id: 4,
    icon: "&#xe654;",
    failed: "FILED",
    text: "我 的",
    show_header: false,
    show_docker: false,
    to: "/mined-view",
  },
];

dockers.forEach((docker) => {
  const index: number = keyMap.indexOf(docker.to);
  const routerInfo = routeMap[index];
  const meta: RouteMeta | undefined = routerInfo?.meta;
  if (meta) {
    docker.show_header = !!meta?.showHeader;
    docker.show_docker = !!meta?.showDocker;
  }
});
const viewsInfo = reactive({
  headersHeight: HEADER_HEIGHT,
  dockersHeight: DOCKER_HEIGHT,
  screensHeight: window.innerHeight,
  height: 0,
  headerDisplay: false,
  dockerDisplay: false,
  styleText: "",
});
/**
 * 计算内容区高度
 */
const computedHeights = () => {
  // console.log("内容区域高度计算");
  viewsInfo.height =
      viewsInfo.screensHeight -
      viewsInfo.headersHeight -
      viewsInfo.dockersHeight;
  viewsInfo.styleText = `
  margin: ${viewsInfo.headersHeight}px 0px ${viewsInfo.dockersHeight}px;
  height: ${viewsInfo.height}px;
  `;
  sessionStorage.setItem(C_CONTENT_HEIGHT, String(viewsInfo.height));
};

const watchRouteHandler = (_new: any, _old: any) => {
  // console.log("fullPath: ", _new.fullPath);
  computedHeightByRoute(_new);

  // 检查router.ts中是否规定了要显示Header
  if (_new.meta?.showHeader) {
    viewsInfo.headerDisplay = true;
    viewsInfo.headersHeight = HEADER_HEIGHT;
  } else {
    viewsInfo.headerDisplay = false;
    viewsInfo.headersHeight = 0;
  }

  // 检查router.ts中是否规定了要显示Docker
  if (_new.meta?.showDocker) {
    viewsInfo.dockerDisplay = true;
    viewsInfo.dockersHeight = DOCKER_HEIGHT;
  } else {
    viewsInfo.dockerDisplay = false;
    viewsInfo.dockersHeight = 0;
  }
  computedHeights();
};


watch(
    () => router.currentRoute.value,
    watchRouteHandler,
    {deep: true}
);

</script>

<style scoped lang="scss">
$header-height: calc(var(--header-height) * -1px);

@keyframes beforeCenterAppear {
  from {
    //transform: translateY(-40px);
    transform: translateY($header-height);
  }

  to {
    transform: translateY(0);
  }
}

.mrs-center {
  width: 100%;
  animation-name: beforeCenterAppear;
  animation-duration: 200ms;
  transition: all 200ms;
}

.icon {
  fill: currentColor;
  overflow: hidden;
}
</style>
