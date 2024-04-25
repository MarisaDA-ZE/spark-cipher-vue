import {deleted, get, post, put} from "@/utils/util/http-util";
import {HTTP_STATUS} from "@/common/constant";


const apiService = {
    /**
     * 查询记录列表
     * <p>默认规则是根据登录用户的ID进行查询</p>
     * @param params
     */
    getRecordsList(params: any): Promise<MrsResult<PasswordRecord[] | null>> {
        if (params) console.log("参数列表: ", params);
        return new Promise<MrsResult<PasswordRecord[]>>((resolve) => {
            const recordList: PasswordRecord[] = [];

            let s = '13714341399374643';
            let ix = 10;

            for (let i = 0; i < 10; i++) {
                const record: PasswordRecord = {
                    id: "1771434139937464320",    // ID
                    userId: "12313212313",        // 用户ID
                    title: {
                        label: '标题',
                        key: 'title',
                        value: '这是一段标题，这是一段十六字的标题',
                        type: 'text',
                        sort: 1
                    },              // 记录标题
                    account: {label: '账号', key: 'account', value: 'MarisaDAZE', type: 'text', sort: 2},          // 账户名
                    userName: {label: '昵称', key: 'userName', value: 'MarisaDA★ZE', type: 'text', sort: 3},       // 昵称
                    password: {label: '密码', key: 'password', value: 'marisa@123', type: 'text', sort: 4},        // 密码
                    phone: {label: '手机号', key: 'phone', value: '18384669885', type: 'text', sort: 5},           // 手机号
                    email: {label: '邮箱', key: 'email', value: '3038488053@qq.com', type: 'text', sort: 6},       // 邮箱号
                    url: {label: '网址', key: 'url', value: 'https://kmarisa.icu/', type: 'textarea', sort: 7},    // 访问网址
                    remark: {label: '网址', key: 'remark', value: '这是一段备注信息>_<', type: 'textarea', sort: 8}, // 备注信息
                    createTime: (new Date()).getTime(), // 创建时间
                    createBy: "Marisa",           // 创建者
                    updateTime: 1710510180932,    // 更新时间
                    updateBy: null,               // 更新者
                }
                ix++;
                record.id = s + ix;
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
     * 根据ID查询记录
     * @param params {id: string} 记录ID
     */
    getRecordById(params: any): Promise<MrsResult<PasswordRecord>> {
        return new Promise<MrsResult<PasswordRecord>>((resolve) => {
            const record: PasswordRecord = {
                id: params.id,    // ID
                userId: "12313212313",        // 用户ID
                title: {label: '标题', key: 'title', value: '这是一段标题', type: 'text', sort: 1},              // 记录标题
                account: {label: '账号', key: 'account', value: 'MarisaDAZE', type: 'text', sort: 2},          // 账户名
                userName: {label: '昵称', key: 'userName', value: 'MarisaDA★ZE', type: 'text', sort: 3},       // 昵称
                password: {label: '密码', key: 'password', value: 'marisa@123', type: 'text', sort: 4},        // 密码
                phone: {label: '手机号', key: 'phone', value: '18384669885', type: 'text', sort: 5},           // 手机号
                email: {label: '邮箱', key: 'email', value: '3038488053@qq.com', type: 'text', sort: 6},       // 邮箱号
                url: {
                    label: '网址',
                    key: 'url',
                    value: `https://kmarisa.icu/jdhfuiewhfwiuhwdkhajkdahjkhwduiadhakjdksacsbajkbcajkdashdjksjkabaks/hkjsachaiuhqqihdqdjkashkjahdjkahwiu`,
                    type: 'textarea',
                    sort: 7
                },    // 访问网址
                remark: {
                    label: '备注',
                    key: 'remark',
                    value: `这是一段备注信息>_<。CSS属性word-break: break-word;用于强制在单词内部进行换行，以避免因长单词或无空格字符串而导致的内容溢出。然而，word-break: break-word;并不是一个标准的CSS3规范中的值，而是早先Webkit浏览器（如Safari和Chrome）引入的一个扩展值。尽管许多现代浏览器仍然支持它，但为了确保最佳的跨浏览器兼容性，建议使用标准的CSS属性来达到类似的效果。\n' +
                        '标准的替代方案是使用overflow-wrap（或其别名word-wrap）属性，并设置其值为break-word。这个属性同样允许在必要时在单词内部换行，以防止内容超出容器边界。`,
                    type: 'textarea',
                    sort: 8
                }, // 备注信息
                createTime: (new Date()).getTime(), // 创建时间
                createBy: "Marisa",           // 创建者
                updateTime: 1713947574947,    // 更新时间
                updateBy: null,               // 更新者
            }

            const result: MrsResult<PasswordRecord> = {
                code: HTTP_STATUS.SUCCESS,
                msg: "查询成功",
                status: true,
                data: record,
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
