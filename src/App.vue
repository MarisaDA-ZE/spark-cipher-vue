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
import {C_CONTENT_HEIGHT, DOCKER_HEIGHT, HEADER_HEIGHT, WEB_FINGER_NAME} from "@/common/constant";

const router = useRouter();
const routeMap = router.options.routes;
const keyMap = new Array<string>();
routeMap.forEach((e) => {
  keyMap.push(e.path);
});

// Docker栏信息
const dockers: DockerType[] = [
  {
    icon: "&#xe64c;",
    failed: "FILED",
    text: "密 码",
    show_header: false,
    show_docker: false,
    to: "/password-view",
  },
  // {
  //   icon: "&#xe662;",
  //   failed: "FILED",
  //   text: "图 片",
  //   show_header: false,
  //   show_docker: false,
  //   to: "/images-view",
  // },
  // {
  //   icon: "&#xe619;",
  //   failed: "FILED",
  //   text: "视 频",
  //   show_header: false,
  //   show_docker: false,
  //   to: "/videos-view",
  // },
  // {
  //   icon: "&#xe656;",
  //   failed: "FILED",
  //   text: "文 件",
  //   show_header: false,
  //   show_docker: false,
  //   to: "/files-view",
  // },
  {
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

console.log("浏览器指纹: ", sessionStorage.getItem(WEB_FINGER_NAME))


/**
 * 路由监听
 * @param _new  .
 * @param _old  .
 */
const watchRouteHandler = (_new: any, _old: any) => {
  // console.log("fullPath: ", _new.fullPath);

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

/* 移动端全局去除点击高亮 */
*, *::before, *::after {
  -webkit-tap-highlight-color: transparent !important;
}

@keyframes beforeCenterAppear {
  from {
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
  overflow: hidden;
}

.icon {
  fill: currentColor;
  overflow: hidden;
}
</style>
