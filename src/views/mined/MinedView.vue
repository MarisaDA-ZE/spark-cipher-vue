<template>
  <div class="mined_view">
    个人页
    <button @click="logout">退出登录</button>
  </div>
</template>

<script lang="ts" setup>
import {useAuthorizationStore} from '../../store/authorizationStore';
import {useRouter} from "vue-router";
import {get} from "../../utils/util/http-util";

const router = useRouter();
const verifyStore = useAuthorizationStore();

/*登出*/
const logout = (): void => {
  verifyStore.removeToken();
  get("/auth/logout").then(res => {
    if (res.code === 200) {
      router.push("/login_view");
    }
  });
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
