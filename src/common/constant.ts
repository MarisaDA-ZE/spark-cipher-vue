import { useCryptoStore } from "../store/cryptoStore";
import { get, MrsResult, post } from "../utils/util/http-util";

export const CRYPTO_PATH: string = "/crypto";
export const PASSWORD_PATH: string = "/password";

export let USER_TOKEN: string = "";

// /**
//  * 加密数据并发送到服务器
//  * @param text  被加密的内容
//  */
// const encryptAndSend = (text: string): void => {
//     data.clientCipherText = SM2Util.encrypt(text, data.servicePublicKey);
//     post(PASSWORD_PATH + "/createPassword", {
//       text: "04" + data.clientCipherText,
//     });
// }
//
// /**
//  * 获取服务端数据
//  */
// const getPasswordById = (): void => {
//     get(PASSWORD_PATH + "/getPasswordById/1").then((res: any) => {
//       if (res?.data?.data) data.serviceCipherText = res.data.data;
//     });
// }

/**
 * 初始化密钥对
 */
export const cryptoInit = (): void => {
    const store = useCryptoStore();

    // 生成客户端公私钥
    store.createServiceKeyPair();

    // 请求服务端公钥
    get("/crypto/getServicePublicKey").then((res: MrsResult) => {
        if (res.code === 200) {
            store.setServicePublicKey(res.data);
        } else {
            console.log(res);
        }
    });

    // 发送客户端公钥
    post("/crypto/setClientPublicKey",
        { 'publicKey': store.clientKeyPair.publicKey }
    ).then((res: MrsResult) => {
        if (res.code !== 200) console.log(res);
    });
}