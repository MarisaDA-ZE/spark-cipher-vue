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
        verifyCode: string;    // 验证码
    }

    /**
     * 账号创建Vo对象
     */
    type CreateAccountVo = {
        account?: string;     // 账户
        nickName?: string;    // 昵称
        password?: string;    // 密码
        phoneNo?: string;     // 手机号
        email?: string;       // 邮箱
        verifyCode?: string;  // 验证码
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

    type RecordOptionalName = 'title' | 'account' | 'userName' | 'password' | 'phone' | 'email' | 'url' | 'remark';
    /**
     * 密码记录
     */
    type PasswordRecord = {
        id?: string | null;             // ID
        userId?: string | null;         // 用户ID
        title?: PasswordRecordItem;     // 记录标题
        account?: PasswordRecordItem;   // 账户名
        userName?: PasswordRecordItem;  // 用户名
        password?: PasswordRecordItem;  // 密码
        phone?: PasswordRecordItem;     // 手机号
        email?: PasswordRecordItem;     // 邮箱号
        url?: PasswordRecordItem;       // 访问网址
        remark?: PasswordRecordItem;    // 备注信息
        customs?: PasswordRecordItem[]; // 自定义数据
        createTime?: number | null;  // 创建时间
        createBy?: string | null;    // 创建者
        updateTime?: number | null;  // 更新时间
        updateBy?: string | null;    // 更新者
    }

    /**
     * 数据返回类
     */
    type MrsResult<T> = {
        code: number;       // 状态码
        msg: string;        // 提示信息
        status: boolean;    // 响应状态
        timestamp: number;       // 响应时间(时间戳)
        data: T;            // 响应内容
    }

    type MrsPage<T> = {
        countId?: string | null;
        current: number;
        maxLimit?: number | null;
        optimizeCountSql?: boolean;
        orders?: any[];
        pages?: number;
        records: T[];
        searchCount?: boolean;
        size: number;
        total: number
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
     * 登录响应对象
     */
    type MrsLResp = {
        userVo: MrsUser,
        token: string;
    }

    /**
     * docker栏的数据结构
     */
    type DockerType = {
        icon: string,
        failed: string,
        text: string,
        show_header: boolean,
        show_docker: boolean,
        to: string,
    }
}
