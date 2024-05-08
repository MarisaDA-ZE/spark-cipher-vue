import {get, post, put, deleted} from "@/utils/util/http-util";

const apiService = {
    /**
     * 账号密码登录
     * @param params
     */
    accountLogin(params: AccountLoginParams): Promise<MrsResult<MrsLResp>> {
        return post("/login/accountLogin", params);
    },

    /**
     * 根据手机号发送验证码
     * @param params    手机号
     */
    sendCodeByPhoneNo(params: string) {
        return post("/login/sendCodeByPhoneNo", params);
    },

    /**
     * 手机号登录
     * @param params
     */
    phoneLogin(params: PhoneLoginParams) {
        return post("/login/phoneLogin", params);
    },
    /**
     * 查询记录列表
     * <p>默认规则是根据登录用户的ID进行查询</p>
     * @param params
     */
    getRecordsList(params: any): Promise<MrsResult<MrsPage<PasswordRecord> | null>> {
        return get("/record/getRecordsList", params);
    },

    /**
     * 查询记录列表
     * <p>默认规则是根据登录用户的ID进行查询</p>
     * @param params
     */
    getRecordById(params: any): Promise<MrsResult<PasswordRecord>> {
        return get("/record/getRecordById", params);
    },
    /**
     * 保存一条密码记录到服务器
     * @param params
     */
    addRecordsOne(params: any) {
        return put("/record/add", params);
    },

    /**
     * 保存一条密码记录到服务器
     * @param params
     */
    editRecordById(params: any) {
        return post("/record/edit", params);
    },

    /**
     * 按ID删除一条密码记录
     * @param params
     */
    deletePasswordById(params: any) {
        return deleted("/record/deleteById/" + params);
    },

};
export default apiService;
