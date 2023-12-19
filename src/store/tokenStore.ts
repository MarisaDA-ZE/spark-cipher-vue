import {defineStore} from "pinia";
import {encryptStore} from "../services/storeCipher";

export type User = {
    id: string;
    userName: string;
    level: number;
    phone: string;
    email: string;
    avatar: string;
};

type StoreType = {
    token: string | null,
    authUser?: User | null
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
        getUser(): User | null {
            if (this.authUser) return this.authUser;
            return null;
        },
        /**
         * 删除用户
         */
        removeUser(): void {
            this.authUser = null;
        }
    },
    // persist:true, // 开启持久化 
    persist: {// 开启持久化,并进行加密
        storage: encryptStore
    }
});
