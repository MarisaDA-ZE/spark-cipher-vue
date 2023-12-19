import {defineStore} from "pinia";
import {Record, MrsPage} from "./passwordType";


export const usePasswordStore = defineStore("password", {
    state() {
        const page: MrsPage = {
            current: 1,
            size: 10
        };

        return {
            passwordList: Array<Record>(),
            page: page
        };
    },
    actions: {
        /**
         * 清空仓库中的密码记录
         */
        cleanStoreList() {
            this.passwordList = new Array<Record>();
        },

        /**
         * 添加一组密码
         * @param passwordList
         */
        addPasswordList(passwordList: Array<Record>) {
            this.passwordList.push(...passwordList);
        },

        /**
         * 更新分页信息
         * @param page
         */
        updateMrsPage(page: MrsPage) {
            this.page.current = page.current;
            this.page.size = page.size;
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
        addPasswordOne(password: Record) {
            this.passwordList.push(password);
        },

        /**
         * 修改密码
         * @param password
         */
        updatePasswordList(password: Record) {
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
        removePasswordOne(id: any) {
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
        removePasswordList(ids: Array<any>) {
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

export type {Record, MrsPage};
