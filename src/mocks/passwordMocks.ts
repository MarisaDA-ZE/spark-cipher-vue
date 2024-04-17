import {deleted, get, post, put} from "@/utils/util/http-util";
import {HTTP_STATUS} from "@/common/constant";


const apiService = {
    /**
     * 查询记录列表
     * <p>默认规则是根据登录用户的ID进行查询</p>
     * @param params
     */
    getRecordsList(params: any): Promise<MrsResult<PasswordRecord[]>> {
        if (params) console.log("参数列表: ", params);
        return new Promise<MrsResult<PasswordRecord[]>>((resolve) => {
            const recordList: PasswordRecord[] = [];
            const record: PasswordRecord = {
                id: "1771434139937464321",    // ID
                userId: "12313212313",        // 用户ID
                title: "这是一段标题",          // 记录标题
                account: "MarisaDAZE",        // 账户名
                userName: "MarisaDAZE",       // 用户名
                password: "marisa@123",       // 密码
                phone: "18384669885",         // 手机号
                email: "3038488053@qq.com",   // 邮箱号
                url: "https://kmarisa.icu",   // 访问网址
                remark: "这是一段备注信息>_<",   // 备注信息
                createTime: (new Date()).getTime(), // 创建时间
                createBy: "string;",          // 创建者
                updateTime: null,             // 更新时间
                updateBy: null,               // 更新者
            }
            for (let i = 0; i < 10; i++) {
                recordList.push(record);
            }

            const result: MrsResult<PasswordRecord[]> = {
                code: HTTP_STATUS.SUCCESS,
                msg: "查询成功",
                status: true,
                data: recordList,
                time: (new Date()).getTime()
            };
            setTimeout(() => {
                resolve(result);
            }, 300);
        });

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
        return deleted("/password/deleteById/" + params);
    },

};
export default apiService;
