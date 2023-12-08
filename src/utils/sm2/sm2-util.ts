import {sm2} from "sm-crypto";

/**
 * 密钥对类型
 */
export type SM2KeyPair = {
    publicKey: string | null,
    privateKey: string | null
}

export class SM2Util {

    /**
     * 客户端生成RSA密钥对
     * @return    密钥对
     */
    static getKeyPair(): SM2KeyPair {
        const keyPairHex = sm2.generateKeyPairHex();
        const publicKey: string = (keyPairHex.publicKey).toUpperCase();
        const privateKey: string = (keyPairHex.privateKey).toUpperCase();
        return {
            publicKey: publicKey,
            privateKey: privateKey
        };
    }

    /**
     * 使用公钥进行加密
     * @param text      加密内容
     * @param publicKey 公钥
     * @return          加密结果
     */
    static encrypt(text: string, publicKey: string): string {
        return sm2.doEncrypt(text, publicKey, 1);
    }

    /**
     * 使用私钥进行解密
     * @param text       加密内容
     * @param privateKey 私钥
     * @return           解密结果
     */
    static decrypt(text: string, privateKey: string): string {
        return sm2.doDecrypt(text, privateKey, 1);
    }
}
