<template>
  <div class="mined_view">
    个人页
    <button class="logout" @click="logout">退出登录</button>
  </div>
</template>

<script lang="ts" setup>
import {useAuthorizationStore} from '@/store/authorizationStore';
import {useRouter} from "vue-router";
import {get} from "@/utils/util/http-util";

const router = useRouter();
const authorizationStore = useAuthorizationStore();

/*登出*/
const logout = (): void => {
  get("/auth/logout").then(res => {
    if (res.code === 200) {
      router.push("/login");
      authorizationStore.removeToken();
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
  .logout{
    margin: 0 auto;
    width: 100px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    background: rgba(0,135,227,0.7);
    color: #FFF;
    font: 16px/100% "";

  }
}
</style>
