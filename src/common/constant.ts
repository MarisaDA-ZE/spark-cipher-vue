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

// 是否开启端到端加密传输（此操作需要服务器端同步开启，否则会出错）
export const ENABLE_ENCRYPT_LINK: boolean = false;  // true

// 客户端加密算法计算完成后，需要在密文开头拼接上一个04后端才能正常解析
export const CLIENT_ENCRYPT_PREFIX: string = "04";
// 浏览器指纹名字
export const WEB_FINGER_NAME: string = "f";


export const HEADER_HEIGHT: number = 40;    // 顶部导航栏的高度, 默认40px
export const DOCKER_HEIGHT: number = 50;    // 底部docker栏的高度, 默认50px

//当前内容高度的键（值在sessionStorage中）
export const C_CONTENT_HEIGHT: string = "CURRENT_CONTENT_HEIGHT";


// 一些正则表达式
export const MRS_REGEXPS = {
    // 账号的正则表达式
    ACCOUNT: /^[a-zA-Z0-9_-]{4,16}$/,

    // 昵称正则表达式
    NICK_NAME: /^[a-zA-Z0-9_-☆★]{4,16}$/,

    // 密码强度的正则表达式
    PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()\-_+{}|:"<>?~\[\]';,./\\=]{6,20}$/,

    // 手机号的正则表达式
    PHONE: /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4(?:(?:10|4[01])\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/,

    // 邮箱的正则表达式
    EMAIL: /[\w'.%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}/,

    // 网址的正则表达式
    URL: /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,
};

/**
 * HTTP状态码枚举
 */
export enum HTTP_STATUS {
    SUCCESS = 200,          // 成功
    ERROR = 500,            // 错误
    UNAUTHORIZED = 401,     // 未授权
    FORBIDDEN = 403,        // 禁止访问
    NOT_FOUND = 404,        // 未找到
    METHOD_NOT_ALLOWED = 405,// 方法不允许
    UNKNOWN = 0,             // 未知
}

/**
 * 提示框的提示类型枚举
 */
export enum TOAST_TYPE {
    SUCCESS = "success",    // 成功消息
    INFO = "info",          // 通知消息
    WARNING = "warning",    // 警告消息
    ERROR = "error",        // 错误消息
    UNKNOWN = "unknown",    // 未知消息
}

// 预埋公钥
export const DEFAULT_SM2_PUBLIC_KEY = `048EA5A585A953117D9854B819E59B75442445C9E84FDB5293F1CC6A9937A20100A08749D1A27A8B8113D2092E56F968D049981999EC44C6C70E1CFB0A5490D143`;
