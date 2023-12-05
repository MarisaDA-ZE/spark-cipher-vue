<template>
  <mrs-header v-if="viewsInfo.headerDisplay" :search_display="true"/>
  <div class="mrs-center" :style="viewsInfo.styleText">
    <router-view :key="$route.fullPath"/>
  </div>
  <mrs-docker v-if="viewsInfo.dockerDisplay" :dockers="dockers" :show_text="false"/>
</template>

<script lang="ts">
import {reactive} from "vue";
import {RouteMeta, useRouter} from "vue-router";
import MrsHeader from "./components/common/MrsHeader.vue";
import MrsDocker from "./components/common/MrsDocker.vue";

export default {
  name: "App",
  components: {MrsHeader, MrsDocker},
  setup() {
    const router = useRouter();
    const routeMap = router.options.routes;
    const keyMap = new Array<string>();
    routeMap.forEach((e) => {
      keyMap.push(e.path);
    });

    // 内容区高度
    const viewsInfo = reactive({
      headersHeight: 40,
      dockersHeight: 50,
      screensHeight: window.screen.height,
      height: 0,
      headerDisplay: false,
      dockerDisplay: false,
      styleText: "",
    });

    // Docker栏信息
    const dockers = [
      {
        id: 0,
        icon: "&#xe64c;",
        failed: "FILED",
        text: "密 码",
        show_header: false,
        show_docker: false,
        to: "/password_view",
      },
      {
        id: 1,
        icon: "&#xe662;",
        failed: "FILED",
        text: "图 片",
        show_header: false,
        show_docker: false,
        to: "/images_view",
      },
      {
        id: 2,
        icon: "&#xe619;",
        failed: "FILED",
        text: "视 频",
        show_header: false,
        show_docker: false,
        to: "/videos_view",
      },
      {
        id: 3,
        icon: "&#xe656;",
        failed: "FILED",
        text: "文 件",
        show_header: false,
        show_docker: false,
        to: "/files_view",
      },
      {
        id: 4,
        icon: "&#xe654;",
        failed: "FILED",
        text: "我 的",
        show_header: false,
        show_docker: false,
        to: "/mined_view",
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
    };
    // 路由改变的时候会触发高度计算函数
    // 刷新、变更路由时都算
    return {dockers, viewsInfo, computedHeights};
  },

  watch: {
    $route: {
      handler(_new: any, _old: any) {
        const that: any = this;
        console.log("fullPath: ", _new.fullPath);

        // 检查router.ts中是否规定了要显示Header
        if (_new.meta?.showHeader) {
          that.viewsInfo.headerDisplay = true;
          that.viewsInfo.headersHeight = 40;
        } else {
          that.viewsInfo.headerDisplay = false;
          that.viewsInfo.headersHeight = 0;
        }
        // 检查router.ts中是否规定了要显示Docker
        if (_new.meta?.showDocker) {
          that.viewsInfo.dockerDisplay = true;
          that.viewsInfo.dockersHeight = 50;
        } else {
          that.viewsInfo.dockerDisplay = false;
          that.viewsInfo.dockersHeight = 0;
        }
        that.computedHeights();
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
@keyframes beforeCenterAppear {
  from {
    transform: translateY(-40px);
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
