import jsrsasign from "jsrsasign";
import JSEncrypt from "jsencrypt";

/**
 * 密钥对类型
 */
type RsaKeyPair = {
    publicKey: string,
    privateKey: string
}

export class RsaUtil {
    /**
     * 客户端生成RSA密钥对
     * @return    密钥对
     */
    static getKeyPair(): RsaKeyPair {
        const rsaKeypair = jsrsasign.KEYUTIL.generateKeypair('RSA', 2048);
        let PUBLIC = jsrsasign.KEYUTIL.getPEM(rsaKeypair.prvKeyObj);  //获取公钥
        let PRIVATE = jsrsasign.KEYUTIL.getPEM(rsaKeypair.prvKeyObj, 'PKCS8PRV');  //获取私钥
        return {
            publicKey: PUBLIC,
            privateKey: PRIVATE
        };
    }

    /**
     * 使用公钥进行加密
     * @param text      加密内容
     * @param publicKey 公钥
     * @return          加密结果
     */
    static encrypt(text: string, publicKey: string): string | false {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        return encrypt.encrypt(text);
    }

    /**
     * 使用私钥进行解密
     * @param text       加密内容
     * @param privateKey 私钥
     * @return           解密结果
     */
    static decrypt(text: string, privateKey: string): string | false {
        const encrypt = new JSEncrypt();
        encrypt.setPrivateKey(privateKey);
        return encrypt.decrypt(text);
    }
}