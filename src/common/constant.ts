// 登录类型
export enum LOGIN_TYPE {
    ACCOUNT = 0,
    PHONE = 1,
    EMAIL = 2
}

/**
 * Pinia仓库名称枚举
 */
export enum PINIA_NAMES_ENUM {
    AUTH_STORE = "authorization",
    CRYPTO_STORE = "cryptoStore",
    DOCKER_STORE = "mrs_docker",
    USER_STORE = "user",
}

// 是否开启自定义加密传输（此操作需要服务器端同步开启）
export const ENABLE_ENCRYPT_LINK: boolean = true;

// 客户端加密算法计算完成后，需要在密文开头拼接上一个04后端才能正常解析
export const CLIENT_ENCRYPT_PREFIX: string = "04";


export const HEADER_HEIGHT: number = 40;    // 顶部导航栏的高度, 默认40px
export const DOCKER_HEIGHT: number = 50;    // 底部docker栏的高度, 默认50px

//当前内容高度的键（值在sessionStorage中）
export const C_CONTENT_HEIGHT: string = "CURRENT_CONTENT_HEIGHT";
