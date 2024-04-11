import {defineStore} from "pinia";
import {encryptStore} from "@/services/storeCipher";
import {PINIA_NAMES_ENUM} from "@/common/constant";

/**
 * 权限相关
 */
export const useAuthorizationStore = defineStore(PINIA_NAMES_ENUM.AUTH_STORE, {
    state() {
        const data: AuthStoreType = {
            token: "",
            authUser: null,
            finger: null
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
            const token = this.token;
            if (token) return token;
            return null;
        },

        /**
         * 删除token
         */
        removeToken(): void {
            this.token = null;
        },

        /**
         * 设置登录用户
         * @param user 用户
         */
        setUser(user: MrsUser): void {
            this.authUser = user;
        },

        /**
         * 获取用户
         * @returns 用户
         */
        getUser(): MrsUser | null {
            const authUser = this.authUser;
            if (authUser) return authUser;
            return null;
        },

        /**
         * 删除用户
         */
        removeUser(): void {
            this.authUser = null;
        },

        /**
         * 设置登录用户
         * @param finger 用户
         */
        setFinger(finger: string): void {
            this.finger = finger;
        },

        /**
         * 获取浏览器指纹
         * @returns 指纹信息
         */
        getFinger(): string | null {
            const finger = this.finger;
            if (finger) return finger;
            return null;
        },

        /**
         * 删除指纹
         */
        removeFinger(): void {
            this.finger = null;
        },
    },

    persist: {// 开启持久化,并进行加密
        storage: encryptStore
    }
});
