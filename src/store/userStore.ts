import {defineStore} from "pinia";

type User = {}


export const useUserStore = defineStore("user", {
    state() {
        return {
            user: {}
        };
    },
    actions: {}
});