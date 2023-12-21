import {defineStore} from "pinia";
import {encryptStore} from "../services/storeCipher";
import {User, StoreType} from "./authorizationStoreType";

export const useAuthorizationStore = defineStore("authorization", {
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
        getToken(): string | undefined {
            return this.token;
        },
        /**
         * 删除token
         */
        removeToken(): void {
            this.token = undefined;
        },

        /**
         * 设置登录用户
         * @param user 用户
         */
        setUser(user: User): void {
            this.authUser = user;
        },

        /**
         * 获取用户
         * @returns 用户
         */
        getUser(): User | undefined {
            return this.authUser;
        },
        /**
         * 删除用户
         */
        removeUser(): void {
            this.authUser = undefined;
        },

        /**
         * 设置登录用户
         * @param finger 用户
         */
        setFinger(finger: string): void {
            this.finger = finger;
        },

        /**
         * 获取用户
         * @returns 用户
         */
        getFinger(): string | undefined {
            return this.finger;
        },
        /**
         * 删除指纹
         */
        removeFinger(): void {
            this.finger = undefined;
        },
    },
    persist: {// 开启持久化,并进行加密
        storage: encryptStore
    }
});

export type {User, StoreType};