export type MrsResult<T> = {
    code: number;
    msg: string;
    status: boolean;
    time: string;
    data: T;
}