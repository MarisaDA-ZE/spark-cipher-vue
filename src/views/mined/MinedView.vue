<template>
  <div class="mined_view">
    个人页
    <button @click="logout">退出登录</button>
  </div>
</template>

<script lang="ts">
import {useAuthorizationStore} from '../../store/authorizationStore';

const verifyStore = useAuthorizationStore();
export default {
  name: "MinedView",
  components: {},
  setup() {
  },
  methods: {
    logout() {
      verifyStore.removeToken();
    }
  }
}
</script>

<style scoped lang="scss">
.mined_view {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
