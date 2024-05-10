import axios, {AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {CLIENT_ENCRYPT_PREFIX, ENABLE_ENCRYPT_LINK, HTTP_STATUS} from "@/common/constant";
import {useAuthorizationStore} from "@/store/authorizationStore";
import {useCryptoStore} from "@/store/cryptoStore";
import {SM2Util} from "@/utils/sm2/sm2-util"
import UnauthorizedException from "@/exception/exceptions/UnauthorizedException";
import globalExceptionHandler from "@/exception/globalExceptionHandler";

const {getToken} = useAuthorizationStore();
const {getServicePublicKey, getClientKeyPair} = useCryptoStore();

/**
 * 创建 instance
 */
const instance = axios.create({
    // baseURL: "https://api.kmarisa.icu/v1/",
    baseURL: "https://192.168.2.135:8001/v1/",
    timeout: 60000,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
        const token: string | null = getToken();
        console.log("interceptors: ", token);
        // token
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
            console.log("token: ", token)
        }

        // 是否开启端到端加密
        if (ENABLE_ENCRYPT_LINK && config.method?.toLowerCase() !== 'get' && config.data) {
            const servicePublicKey = getServicePublicKey();
            try {
                const jsonData = JSON.stringify(config.data)
                let encrypted = SM2Util.encrypt(jsonData, servicePublicKey || "");
                encrypted = CLIENT_ENCRYPT_PREFIX + encrypted;
                config.data = encrypted;
            } catch (ex) {
                console.log("出错了...", ex);
            }
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use((config: AxiosResponse) => {
        // 是否开启了端到端加密
        if (ENABLE_ENCRYPT_LINK) {
            if (config.data) {
                const clientKeyPair = getClientKeyPair();
                const clientPrivateKey = clientKeyPair?.privateKey;
                try {
                    const jsonData = SM2Util.decrypt(config.data, clientPrivateKey || "");
                    config.data = JSON.parse(jsonData);
                } catch (ex) {
                    console.log("出错了...", ex);
                }
            }
        }
        return config;
    }, (error) => {
        if (error.response) {
            const {response} = error;
            if (response && response.status === HTTP_STATUS.UNAUTHORIZED) {
                globalExceptionHandler(new UnauthorizedException('用户未授权'));
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

/**
 * 发送get请求
 * @param url   请求地址
 * @param data  请求体
 * @param headers   headers配置信息
 * @returns {Promise<unknown>}  返回Promise
 */
export function get(url: string, data: any = {}, headers: any = null): Promise<MrsResult<any>> {
    setHeaders(headers);
    return new Promise((resolve, reject) => {
        instance
            .get(url, {
                params: data
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch(
                (err) => {
                    reject(err.response.data as MrsResult<any>);
                }
            );
    });
}

/**
 * 发送post请求
 * @param url   请求地址
 * @param data  请求体
 * @param headers   headers配置信息
 * @returns {Promise<unknown>}  返回Promise
 */
export const post = (url: string, data: any = {}, headers: any = null): Promise<MrsResult<any>> => {
    setHeaders(headers);
    return new Promise((resolve, reject) => {
        instance.post(url, data).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {
                reject(err.response.data as MrsResult<any>);
            }
        );
    });
}

/**
 * 发送put请求
 * @param url   请求地址
 * @param data  请求体
 * @param headers   headers配置信息
 * @returns {Promise<unknown>}  返回Promise
 */
export const put = (url: string, data: any = {}, headers: any = null): Promise<MrsResult<any>> => {
    setHeaders(headers);
    return new Promise<MrsResult<any>>((resolve, reject) => {
        instance.put(url, data).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {
                reject(err.response.data as MrsResult<any>);
            }
        );
    });
}


/**
 * 发送delete请求
 * @param url   请求地址
 * @param data  请求体
 * @param headers   headers配置信息
 * @returns {Promise<unknown>}  返回Promise
 */
export function deleted(url: string, data: any = {}, headers: any = null): Promise<MrsResult<any>> {
    setHeaders(headers);
    return new Promise((resolve, reject) => {
        instance.delete(url, data).then(
            response => {
                resolve(response.data);
            },
            (err) => {
                reject(err.response.data as MrsResult<any>);
            }
        );
    });
}

/**
 * 修改请求头参数
 * @param headers   请求头配置参数
 */
const setHeaders = (headers: any = null): void => {
    if (headers !== null) {
        // 使用请求拦截器修改headers的内容
        instance.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
                const configHeader = config.headers;
                for (const key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        if (configHeader) {
                            configHeader[key] = headers[key];
                        }
                    }
                }
                return config;
            }, (error) => {
                return Promise.reject(error);
            }
        );
    }
}
