import {get, post, put, deleted} from "@/utils/util/http-util";

const apiService = {
    /**
     * 查询记录列表
     * <p>默认规则是根据登录用户的ID进行查询</p>
     * @param params
     */
    getRecordsList(params: any){
        return get("/record/getRecordsList", params);
    },

    /**
     * 保存一条密码记录到服务器
     * @param params
     */
    addRecordsOne(params: any){
        return put("/record/add", params);
    },

    /**
     * 保存一条密码记录到服务器
     * @param params
     */
    editRecordById(params: any){
        return post("/record/edit", params);
    },

    /**
     * 按ID删除一条密码记录
     * @param params
     */
    deletePasswordById(params: any){
        return deleted("/password/deleteById/"+ params);
    },

};
export default apiService;
