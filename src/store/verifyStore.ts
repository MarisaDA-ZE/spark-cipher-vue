import { defineStore } from "pinia";
import { encryptStore } from "../services/storeCipher";

export const useVerifyStore = defineStore("verify", {
    state() {
        return {
            token: ""
        };
    },
    actions: {
        /**
         * 设置令牌
         * @param token 令牌
         */
        setToken(token: string): void {
            this.token = token;
        },

        /**
         * 获取token
         * @returns token
         */
        getToken(): string {
            return this.token;
        }
    },
    // persist:true, // 开启持久化 
    persist: {// 开启持久化,并进行加密
        storage: encryptStore
    } 
});