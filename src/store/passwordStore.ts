import { defineStore } from "pinia";

type Password = {
    id: number;
    userId: number;
    name: string;
    account: string;
    password: string;
    view_password?: string;
    url: string;
    view_url?: string;
    remarks: string;
    view_remarks?: string;
    createDateTime: string;
    createDate: string;
    createTime: string;
    createBy: number;
    updateDateTime: string;
    updateDate: string;
    updateTime: string;
    updateBy: number;
}
type MrsPage = {
    current: number;
    size: number;
    total: number;
}
export const usePasswordStore = defineStore("password", {
    state() {
        return {
            passwordList: Array<Password>(),
            page: {
                current: 1,
                size: 10,
                total: 0
            }
        };
    },
    actions: {
        /**
         * 清空仓库中的密码记录
         */
        cleanStoreList() {
            this.passwordList = new Array<Password>();
        },

        /**
         * 添加一组密码
         * @param passwordList
         */
        addPasswordList(passwordList: Array<Password>) {
            console.log(passwordList);

            this.passwordList.push(...passwordList);
            console.log(JSON.parse(JSON.stringify(this.passwordList)));
        },

        /**
         * 更新分页信息
         * @param page
         */
        updateMrsPage(page: MrsPage) {
            this.page.current = page.current;
            this.page.size = page.size;
            this.page.total = page.total;
        },

        /**
         * 重置分页信息
         */
        resetMrsPage() {
            this.page.current = 0;
            this.page.size = 10;
            this.page.current = 0;
        },

        /**
         * 添加一个密码
         * @param password
         */
        addPasswordOne(password: Password) {
            this.passwordList.push(password);
        },

        /**
         * 修改密码
         * @param password
         */
        updatePasswordList(password: Password) {
            const that = this;
            that.passwordList.forEach((e, i) => {
                if (e.id === password.id) {
                    that.passwordList[i] = password;
                    return 0;
                }
            });
        },

        /**
         * 移除一个密码
         * @param id
         */
        removePasswordOne(id: number) {
            const that = this;
            that.passwordList.forEach((e, i) => {
                if (e.id === id) {
                    that.passwordList.splice(i, 1);
                    return 0;
                }
            });
        },

        /**
         * 移除一组密码
         * @param ids
         */
        removePasswordList(ids: Array<number>) {
            const that = this;
            that.passwordList.forEach((e, i) => {
                for (const id of ids) {
                    if (e.id === id) {
                        ids.splice(ids.indexOf(id), 1);
                        that.passwordList.splice(i, 1);
                    }
                }
            });
        }
    }
});