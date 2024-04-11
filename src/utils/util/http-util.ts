import axios, {AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {useAuthorizationStore} from "@/store/authorizationStore";

const store = useAuthorizationStore();

/**
 * 创建 instance
 */
const instance = axios.create({
    baseURL: "http://kmarisa.icu:8001",
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
        const token: string | undefined = store.getToken();
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
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
        return config;
    }, (error) => {
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
            .catch((err) => {
                reject(err);
            });
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
                reject(err);
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
                reject(err);
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
export function _delete(url: string, data: any = {}, headers: any = null): Promise<MrsResult<any>> {
    setHeaders(headers);
    return new Promise((resolve, reject) => {
        instance.delete(url, data).then(
            response => {
                resolve(response.data);
            }, (err) => {
                reject(err);
            });
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
