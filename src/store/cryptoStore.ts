import {defineStore} from "pinia";
import {SM2KeyPair, SM2Util} from "../utils/sm2/sm2-util";
import {encryptStore} from "../services/storeCipher";

type STORE_DATA = {
    clientKeyPair: SM2KeyPair    // 客户端密钥对
    serviceKeyPair: SM2KeyPair   // 服务端密钥
}

export const useCryptoStore = defineStore("crypto", {
    state() {
        const data: STORE_DATA = {
            clientKeyPair: {    // 客户端密钥对
                privateKey: null,
                publicKey: null
            },
            serviceKeyPair: {   // 服务端密钥
                publicKey: null,
                privateKey: null
            }
        }
        return data;
    },
    actions: {
        /**
         * 创建客户端密钥
         */
        createClientKeyPair(): Promise<SM2KeyPair> {
            const that: any = this;
            return new Promise(resolve => {
                const keyPair: SM2KeyPair = SM2Util.getKeyPair();
                that.setClientKeyPair(keyPair);
                resolve(keyPair);
            });
        },

        /**
         * 设置服务端密钥对
         * @param keyPair 密钥对
         */
        setServiceKeyPair(keyPair: SM2KeyPair): void {
            console.log("服务器公钥: ", keyPair);
            this.serviceKeyPair.publicKey = keyPair.publicKey;
            this.serviceKeyPair.privateKey = keyPair.privateKey;
        },

        /**
         * 获取服务端公钥
         * @return . 服务端公钥
         */
        getServicePublicKey(): string | null {
            return this.serviceKeyPair.publicKey;
        },
        /**
         * 获取客户端密钥对
         * @return res 密钥对
         */
        getServiceKeyPair(): SM2KeyPair | null {
            if (this.serviceKeyPair.publicKey) return this.serviceKeyPair;
            return null;
        },

        /**
         * 设置客户端密钥对
         * @param keyPair 密钥对
         */
        setClientKeyPair(keyPair: SM2KeyPair): void {
            this.clientKeyPair.publicKey = keyPair.publicKey;
            this.clientKeyPair.privateKey = keyPair.privateKey;
        },

        /**
         * 获取客户端密钥对
         * @return res 密钥对
         */
        getClientKeyPair(): SM2KeyPair | null {
            console.log(this.clientKeyPair.publicKey , this.clientKeyPair.privateKey)
            if (this.clientKeyPair.publicKey && this.clientKeyPair.privateKey) return this.clientKeyPair;
            return null;
        },
    },
    persist: {// 开启持久化,并进行加密
        storage: encryptStore
    }
});
