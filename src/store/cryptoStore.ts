import {defineStore} from "pinia";
import {SM2KeyPair, SM2Util} from "../utils/sm2/sm2-util";

type STORE_DATA = {
    initialized: boolean, // 是否已经初始化过了
    clientKeyPair: SM2KeyPair    // 客户端密钥对
    serviceKeyPair: SM2KeyPair   // 服务端密钥
}

export const useCryptoStore = defineStore("crypto", {
    state() {
        const data: STORE_DATA = {
            initialized: false, // 是否已经初始化过了
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
        createServiceKeyPair(): Promise<SM2KeyPair> {
            const that: any = this;
            return new Promise(resolve => {
                const keyPair: SM2KeyPair = SM2Util.getKeyPair();
                that.setClientKeyPair(keyPair);
                that.initialized = true;
                resolve(keyPair);
            });
        },

        /**
         * 设置服务端公钥
         * @param keyPair 密钥对
         */
        setServicePublicKey(keyPair: SM2KeyPair): void {
            console.log(keyPair);
            this.serviceKeyPair.publicKey = keyPair.publicKey;
            this.serviceKeyPair.privateKey = keyPair.privateKey;
        },
        /**
         * 获取客户端密钥对
         * @return res 密钥对
         */
        getServicePublicKey(): SM2KeyPair | null {
            if (this.serviceKeyPair.publicKey) return this.serviceKeyPair;
            let item: string | null = sessionStorage.getItem("spk");
            console.log(item);
            if (item) return JSON.parse(item);
            return null;
        },

        /**
         * 设置客户端密钥对
         * @param keyPair 密钥对
         */
        setClientKeyPair(keyPair: SM2KeyPair): void {
            this.clientKeyPair.publicKey = keyPair.publicKey;
            this.clientKeyPair.privateKey = keyPair.privateKey;
            let item = sessionStorage.getItem("cpk");
            if (!item) sessionStorage.setItem("cpk", JSON.stringify(keyPair));
        },

        /**
         * 获取客户端密钥对
         * @return res 密钥对
         */
        getClientKeyPair(): SM2KeyPair | null {
            if (this.clientKeyPair.publicKey && this.clientKeyPair.privateKey) return this.clientKeyPair;
            let item: string | null = sessionStorage.getItem("cpk");
            console.log(item);
            if (item) return JSON.parse(item);
            return null;
        },
    }
});
