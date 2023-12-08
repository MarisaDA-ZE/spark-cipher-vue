import {defineStore} from "pinia";
import {encryptStore} from "../services/storeCipher";

type StoreType = {
    token: string | null,
}


export const useTokenStore = defineStore("verify", {
    state() {
        const data: StoreType = {
            token: ""
        };
        return data;
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
        getToken(): string | null {
            return this.token;
        },
        /**
         * 删除token
         */
        removeToken(): void {
            this.token = null;
        }
    },
    // persist:true, // 开启持久化 
    persist: {// 开启持久化,并进行加密
        storage: encryptStore
    }
});
