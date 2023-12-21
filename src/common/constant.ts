
// 登录类型
export enum LOGIN_TYPE {
    ACCOUNT = 0,
    PHONE = 1,
    EMAIL = 2
}

export enum ROUTE_MAP {
    CRYPTO_PATH = "/crypto",
    PASSWORD_PATH = "/password"
}

// 是否开启加密传输
export const ENABLE_ENCRYPT_LINK: boolean = true;


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
