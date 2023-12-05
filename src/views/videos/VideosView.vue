<template>
  <div class="videos_view">
    <form action="#" id="video_form" ref="video_form">
      <label class="mrs-upload-label">
        <span>选择文件</span>
        <input type="file" name="file" id="file">
      </label>
      <input class="mrs-button" type="button" value="提交" @click="upload">
    </form>
    <div id="videoDiv" class="video-container"></div>
    <input type="button" value="播放视频" @click="getVideo(service_path + 'videos/22/source')">
  </div>
</template>

<script lang="ts">
// @ts-ignore
import videoJs from 'video.js';
import "video.js/dist/video-js.css"; // 引入video.js的css
import {ref} from 'vue';
import {zoneUpload} from "../../utils/util/file-util";

const useVideoEffect = () => {
  const num = ref(0);  // 因为我这里有很多url也切换，如果用固定的一个id后面会有报错，如果你只有一个视频，这里可以不用n，后面video的id里也不用n来拼

  const getVideo = (url?: string) => {
    const div: any = document.getElementById('videoDiv');
    div.innerHTML = '';
    div.innerHTML = `<video id="videoPlayer-0" class="video-js" style="width: 50vw; height: 32vw;"></video>`;
    const options = {
      autoplay: true, // 设置自动播放
      controls: true, // 显示播放的控件
      errorDisplay: true,
      muted: true,
      sources: [
        // 如果需要切换视频源，src需要动态设置
        {
          src: url,
          type: 'application/x-mpegURL', // 告诉video_js,这是一个m3u8流
        },
      ],
    };
    // video_js的第一个参数表示的是，文档中video的id
    videoJs(`videoPlayer-${num.value}`, options, function onPlayerReady() {
    });
    num.value += 1;
  };

  const upload = (): void => {
    const fileInput: HTMLInputElement | null = document.querySelector("#file");
    if (fileInput !== null) {
      const fileList: FileList | null = fileInput.files;
      if (fileList !== null && fileList.length > 0) {
        const file = fileList[0];
        console.log(file.type);// videos/mp4
        zoneUpload(file);
      } else {
        console.error("格式不支持或文件未选择");
      }
    }
  }

  return {getVideo, upload};
}

export default {
  name: "VideoView",
  components: {},
  setup() {
    const service_path: string = "SERVICE_PATH";
    const {getVideo, upload} = useVideoEffect();
    return {getVideo, upload, service_path};
  },
  mounted() {
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.videos_view {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  .mrs-upload-label {
    border: 1px solid #67C23A;
    width: 200px;
    height: 100px;
    display: flex;
    border-radius: 5px;
    margin: 10px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
  }

  .mrs-upload-label span {
    color: #67C23A;
  }

  .mrs-upload-label input[type="file"] {
    display: none;
  }

  .mrs-button {
    border: 0;
    padding: 10px 30px;
    margin: 0 60px;
  }
}
</style>