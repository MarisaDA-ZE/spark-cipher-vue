export type Record = {
    id: string;
    userId: string;
    title: string;
    account: string;
    userName: string;
    password: string;
    view_password?: string;
    phone: string;
    email: string;
    url: string;
    view_url?: string;
    remark: string;
    view_remark?: string;
    createDateTime: string;
    createDate: string;
    createTime: string;
    createBy: number;
    updateDateTime: string;
    updateDate: string;
    updateTime: string;
    updateBy: number;
};

export type MrsPage = {
    current: number;
    size: number;
    total?: number;
};

export type ActiveRecord = {       // 操作中的记录
    name: string;
    account: string;
    password: string;
    remarks: string;
    url: string;
    createDateTime: string;
};
