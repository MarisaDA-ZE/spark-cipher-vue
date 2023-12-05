<template>
  <div class="demo">
    <div class="items">
      <div class="item">
        <p>
          <label>
            <span>明文: </span>
            <input type="text" v-model="clientPlainText" placeholder="待加密明文">
          </label>
          <input type="button" value="加 密" @click="encryptAndSend(clientPlainText)">
        </p>
        <label>
          <span>密文: </span>
          <textarea cols="30" rows="10" v-model="clientCipherText" placeholder="没有加密数据"></textarea>
        </label>
      </div>

      <input type="button" value="获取加密数据" class="mrs-btn" @click="getPasswordById()">
      <div class="item">
        <p>
          <label>
            <span>密文: </span>
            <input type="text" v-model="serviceCipherText" placeholder="被加密的密文">
          </label>
          <input type="button" value="解 密" @click="decryptByPrivateKey(serviceCipherText)">
        </p>
        <label>
          <span>明文: </span>
          <input type="text" v-model="servicePlainText" placeholder="解密明文">
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs} from "vue";
import {useCryptoStore} from "../../store/cryptoStore";
import {StateTree} from "pinia";
import {get, post} from "../../utils/util/http-util";
import {SM2Util} from "../../utils/sm2/sm2-util";
import {CRYPTO_PATH} from "../../common/constant";


const useCryptEffect = (store: StateTree) => {
  const data = reactive({
    clientPublicKey: "",  // 客户端公钥
    clientPrivateKey: "", // 客户端私钥
    servicePublicKey: "", // 服务端公钥
    clientPlainText: "",  // 客户端明文
    clientCipherText: "", // 客户端密文
    servicePlainText: "", // 服务端明文
    serviceCipherText: "",// 服务端密文
  });

  /**
   * 初始化
   */
  const init = (): void => {
    store.init();
    data.clientPublicKey = store.clientKeyPair.publicKey;
    data.clientPrivateKey = store.clientKeyPair.privateKey;
    data.servicePublicKey = store.serviceKeyPair.publicKey;
  }

  /**
   * 获取服务端加密公钥
   */
  const getServicePublicKey = (): Promise<unknown> => {
    return new Promise(resolve => {
      get(CRYPTO_PATH + "/getServicePublicKey").then((res: any) => {
        if (res?.data?.data) {
          const key = res.data.data;
          store.setServicePublicKey(key);
        }
        resolve(data.clientPublicKey);
      });
    });
  };

  /**
   * 发送客户端公钥到服务器
   */
  const sendClientPublicKey = (): void => {
    const key = store.clientKeyPair.publicKey;
    post("/crypto/setClientPublicKey", {
      'publicKey': key
    });
  }

  /**
   * 加密数据并发送到服务器
   * @param text  被加密的内容
   */
  const encryptAndSend = (text: string): void => {
    data.clientCipherText = SM2Util.encrypt(text, data.servicePublicKey);
    post("/password/createPassword", {
      text: "04" + data.clientCipherText,
    });
  }

  /**
   * 获取服务端数据
   */
  const getPasswordById = (): void => {
    get("/password/getPasswordById/6").then((res: any) => {
      if (res?.data?.data) data.serviceCipherText = res.data.data;
    });
  }

  /**
   * 服务端数据解密
   * @param text  加密数据
   */
  const decryptByPrivateKey = (text: string): void => {
    const privateKey = store.clientKeyPair.privateKey;
    text = text.substring(2, text.length);
    data.servicePlainText = SM2Util.decrypt(text, privateKey);
  }

  /**
   * 测试方法
   */
  const test = (): void => {
    const keyPair = SM2Util.getKeyPair();
    const text = "Marisa";
    const encrypt = SM2Util.encrypt(text, keyPair.publicKey);
    console.log(encrypt);
    const decrypt = SM2Util.decrypt(encrypt, keyPair.privateKey);
    console.log(decrypt);
  }

  const {clientPlainText, clientCipherText, servicePlainText, serviceCipherText} = toRefs(data);

  return {
    clientPlainText,        // 客户端明文
    clientCipherText,       // 客户端密文
    servicePlainText,       // 服务端明文
    serviceCipherText,      // 服务端密文
    init,                   // 初始化
    getServicePublicKey,    // 获取服务端公钥
    sendClientPublicKey,    // 发送客户端公钥
    getPasswordById,        // 根据Id查询对象
    encryptAndSend,         // 加密数据并发送
    decryptByPrivateKey,    // 使用私钥解密
    test                    // 测试方法
  };
}


export default {
  name: "Sm2Demo",
  setup() {
    const store = useCryptoStore();
    const {
      clientPlainText,        // 客户端明文
      clientCipherText,       // 客户端密文
      servicePlainText,       // 服务端明文
      serviceCipherText,      // 服务端密文
      init,                   // 初始化
      getServicePublicKey,    // 获取服务端公钥
      sendClientPublicKey,    // 发送客户端公钥
      getPasswordById,        // 根据Id查询对象
      encryptAndSend,         // 加密数据并发送
      decryptByPrivateKey,    // 使用私钥解密
      test
    } = useCryptEffect(store);

    getServicePublicKey().then(() => {
      init();
      sendClientPublicKey();
      test();
    });

    return {
      clientPlainText,        // 客户端明文
      clientCipherText,       // 客户端密文
      servicePlainText,       // 服务端明文
      serviceCipherText,      // 服务端密文
      getPasswordById,        // 根据Id查询对象
      encryptAndSend,         // 加密数据并发送
      decryptByPrivateKey     // 使用私钥解密
    };
  }
}
</script>

<style scoped lang="scss">
@import "../../style";

.demo {
  .items {
    width: 900px;
    height: 700px;
    overflow-y: auto;

    .item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      margin: 10px 0;

      p {
        width: 100%;
        height: 50px;
        margin: 10px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        label {
          height: 100%;
          width: 80%;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          span {
            display: inline-block;
            width: 10%;
            font: 18px/100% "宋体";
            margin: 0 10px;
            user-select: none;
          }

          input[type="text"] {
            width: 90%;
            height: 100%;
            padding: 0 10px;
            outline: none;
            border: 1px solid #CCC;
            font: 16px/100% "宋体";
          }
        }

        input[type="button"] {
          outline: none;
          width: 20%;
          border: 0;
          cursor: pointer;
          font: 18px/100% "楷体";
          height: 100%;
        }

        textarea {
          outline: none;
          border: 1px solid #CCC;
          border-radius: 5px;
          width: 70%;
          height: 150px;
          font: 16px/100% "Microsoft YaHei UI";
          padding: 10px;
          resize: none;
        }
      }

      label {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        span {
          display: inline-block;
          width: 8%;
          font: 18px/100% "宋体";
          margin: 0 10px;
          user-select: none;
        }

        textarea {
          border: 1px solid #CCC;
          width: 92%;
          height: 200px;
          padding: 10px;
          font: 16px/120% "宋体";
          resize: none;
          outline: none;
        }

        input[type="text"] {
          border: 1px solid #CCC;
          width: 92%;
          padding: 10px;
          font: 16px/120% "宋体";
          resize: none;
          outline: none;
        }

      }
    }

    .mrs-btn {
      border: 0;
      outline: none;
      padding: 15px;
      font: 16px/100% "宋体";
      cursor: pointer;
    }
  }
}
</style>