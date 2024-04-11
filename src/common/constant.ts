// 登录类型
import {useCryptoStore} from "@/store/cryptoStore";

export enum LOGIN_TYPE {
    ACCOUNT = 0,
    PHONE = 1,
    EMAIL = 2
}


// 是否开启加密传输
export const ENABLE_ENCRYPT_LINK: boolean = true;

// Pinia仓库名称枚举
export enum PINIA_NAMES_ENUM {
    AUTH_STORE = "authorization",
    CRYPTO_STORE = "cryptoStore",
    DOCKER_STORE = "mrs_docker",
    USER_STORE = "user",
}

export enum HTTP_STATUS {
    SUCCESS = 200,
    ERROR = 500,
    UNAUTHORIZED = 501,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405
}


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
