export type Record = {
    id: number;
    userId: number;
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
}

type ActiveRecord = {
    name: string;
    account: string;
    password: string;
    remark: string;
    url: string;
    createDateTime: string
};

type MrsPage = {
    current: number;
    size: number;
    total?: number;
}