// 用户
export type User = {
    id: string;
    userName: string;
    level: number;
    phone: string;
    email: string;
    avatar: string;
};

// 仓库类型
export type StoreType = {
    token?: string | undefined;
    authUser?: User | undefined;
    finger?: string | undefined;
}
