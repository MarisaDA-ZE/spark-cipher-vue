import {defineStore} from "pinia";
import {PINIA_NAMES_ENUM} from "@/common/constant";

/**
 * 用户信息
 */
export const useUserStore = defineStore(PINIA_NAMES_ENUM.USER_STORE, {
    state() {
        return {};
    },
    actions: {}
});
