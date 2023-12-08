import {defineStore} from "pinia";
import {SM2KeyPair, SM2Util} from "../utils/sm2/sm2-util";
import {get, MrsResult} from "../utils/util/http-util";
import {CRYPTO_PATH} from "../common/constant";


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
            const that = this;
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
            this.serviceKeyPair.publicKey = keyPair.publicKey;
            this.serviceKeyPair.privateKey = keyPair.privateKey;
        },

        /**
         * 设置客户端密钥对
         * @param keyPair 密钥对
         */
        setClientKeyPair(keyPair: SM2KeyPair): void {
            this.clientKeyPair.publicKey = keyPair.publicKey;
            this.clientKeyPair.privateKey = keyPair.privateKey;
        }
    }
});
