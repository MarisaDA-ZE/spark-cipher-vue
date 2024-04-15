export {};

declare global {
    /**
     * 用户对象
     */
    type MrsUser = {
        id: string;         // 用户ID
        userName: string;   // 用户名
        level: number;      // 用户等级
        phone: string;      // 手机号
        email: string;      // 邮箱
        avatar: string;     // 头像
        gender: string;     // 性别
        createTime: string; // 创建时间
        createBy: string;   // 创建者
        updateTime: string; // 更新时间
        updateBy: string;   // 更新者
    };

    /**
     * 密码记录
     */
    type PasswordRecord = {
        id: string;                 // ID
        userId: string;             // 用户ID
        title: string;              // 记录标题
        account: string;            // 账户名
        userName: string;           // 用户名
        password: string;           // 密码
        phone: string;              // 手机号
        email: string;              // 邮箱号
        url: string;                // 访问网址
        remark: string;             // 备注信息
        createTime: string;         // 创建时间
        createBy: number;           // 创建者
        updateTime: string;         // 更新时间
        updateBy: number;           // 更新者
    }

    /**
     * 分页数据对象
     */
    type MrsPageRecord<T> = {
        current: number;    // 当前页码
        size: number;       // 每页显示条数
        total?: number;     // 总条数
        records: Array<T>;  // 数据集合
    };

    /**
     * 数据返回类
     */
    type MrsResult<T> = {
        code: number;       // 状态码
        msg: string;        // 提示信息
        status: boolean;    // 响应状态
        time: string;       // 响应时间
        data: T;            // 响应内容
    }

    /**
     * 分片文件的信息
     */
    type FileInfo = {
        name: string,
        type: string,
        size: number,
        md5: string | null,
        count: number,
        nameList: Array<string>
    }

    /**
     * 分片文件
     */
    type MrsFileList = {
        fileInfo: FileInfo,
        blobList: Array<Blob>
    }

    /**
     * 权限Pinia仓库的类型
     */
    type AuthStoreType = {
        token?: string | null;     // token
        authUser?: MrsUser | null; // 用户信息
        finger?: string | null;    // 浏览器指纹
    }

    /**
     * SM2密钥对
     */
    type SM2KeyPair = {
        publicKey: string | null,   // 公钥
        privateKey: string | null   // 私钥
    }

    /**
     * 提示框的提示类型枚举
     */
    enum TOAST_TYPE {
        SUCCESS = "success",    // 成功消息
        INFO = "info",          // 通知消息
        WARNING = "warning",    // 警告消息
        ERROR = "error",        // 错误消息
        UNKNOWN = "unknown",    // 未知消息
    }

    /**
     * HTTP状态码枚举
     */
    enum HTTP_STATUS {
        SUCCESS = 200,          // 成功
        ERROR = 500,            // 错误
        UNAUTHORIZED = 501,     // 未授权
        FORBIDDEN = 403,        // 禁止访问
        NOT_FOUND = 404,        // 未找到
        METHOD_NOT_ALLOWED = 405,// 方法不允许
        UNKNOWN = 0,             // 未知
    }
}