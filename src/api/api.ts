import {get} from "@/utils/util/http-util";

const apiService = {
    /**
     * 查询记录列表
     * <p>默认规则是根据登录用户的ID进行查询</p>
     * @param params
     */
    getRecordsList(params: any){
        return get("/record/getRecordsList", params);
    }
};
export default apiService;
