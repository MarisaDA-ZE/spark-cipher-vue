import { defineStore } from "pinia";
import { SM2KeyPair, SM2Util } from "../utils/sm2/sm2-util";
import { get, MrsResult } from "../utils/util/http-util";
import { CRYPTO_PATH } from "../common/constant";

export const useCryptoStore = defineStore("crypto", {
    state() {
        return {
            initialized: false, // 是否已经初始化过了
            clientKeyPair: {    // 客户端密钥对
                privateKey: "",
                publicKey: ""
            },
            serviceKeyPair: {   // 服务端密钥
                publicKey: "",
                privateKey: ""
            }
        };
    },
    actions: {
        /**
         * 创建客户端密钥
         */
        createServiceKeyPair(): Promise<SM2KeyPair> {
            const that = this;
            return new Promise(resolve => {
                const keyPair: SM2KeyPair = SM2Util.getKeyPair();
                const publicKey: string = keyPair.publicKey;    // 公钥
                const privateKey: string = keyPair.privateKey;  // 私钥
                that.setClientKeyPair(publicKey, privateKey);
                that.initialized = true;
                resolve(keyPair);
            });
        },

        /**
         * 设置服务端公钥
         * @param publicKey 公钥
         * @param privateKey 私钥
         */
        setServicePublicKey(publicKey: string, privateKey: string = ""): void {
            this.serviceKeyPair.publicKey = publicKey;
            this.serviceKeyPair.privateKey = privateKey;
        },

        /**
         * 设置客户端密钥对
         * @param publicKey 公钥
         * @param privateKey 私钥
         */
        setClientKeyPair(publicKey: string, privateKey: string): void {
            this.clientKeyPair.publicKey = publicKey;
            this.clientKeyPair.privateKey = privateKey;
        },

        /**
         * 获取服务端密钥对
         */
        getServiceKeyPair(): Promise<unknown> {
            const that = this;
            return new Promise(resolve => {
                get(CRYPTO_PATH + "/getServicePublicKey").then((res: MrsResult) => {
                    if (res?.data) {
                        const key = res.data;
                        that.setServicePublicKey(key);
                        resolve(key);
                    }
                });
            });
        }
    }
});