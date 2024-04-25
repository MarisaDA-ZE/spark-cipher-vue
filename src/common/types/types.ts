export {};

declare global {


    /**
     * 账号密码登录参数对象
     */
    type AccountLoginParams = {
        account: string;   // 账号
        password: string;   // 密码
    }

    /**
     * 手机号验证码登录参数对象
     */
    type PhoneLoginParams = {
        phoneNo: string; // 手机号
        code: string;    // 验证码
    }
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
     * HTML表单项的类型
     */
    type FormType = "text" | "textarea" | "password" | "button" | "checkbox" | "file" | "number" | "radio";

    /**
     * 单个内容记录项的类型
     */
    type PasswordRecordItem = {
        label: string,
        key: string,
        value: string,
        type: FormType,
        sort: number
    }

    /**
     * 密码记录
     */
    type PasswordRecord = {
        id: string;                 // ID
        userId: string;             // 用户ID
        title?: PasswordRecordItem;     // 记录标题
        account?: PasswordRecordItem;   // 账户名
        userName?: PasswordRecordItem;  // 用户名
        password?: PasswordRecordItem;  // 密码
        phone?: PasswordRecordItem;     // 手机号
        email?: PasswordRecordItem;     // 邮箱号
        url?: PasswordRecordItem;       // 访问网址
        remark?: PasswordRecordItem;    // 备注信息
        customs?: PasswordRecordItem[]; // 自定义数据
        createTime: number;         // 创建时间
        createBy: string;           // 创建者
        updateTime: number | null;  // 更新时间
        updateBy: string | null;    // 更新者
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
        time: number;       // 响应时间(时间戳)
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

}
