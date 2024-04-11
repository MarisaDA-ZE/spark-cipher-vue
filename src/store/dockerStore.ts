import { defineStore } from "pinia";
import { encryptStore } from "@/services/storeCipher";
import {PINIA_NAMES_ENUM} from "@/common/constant";

/**
 * 底部docker栏
 */
export const useDockerStore = defineStore(PINIA_NAMES_ENUM.DOCKER_STORE, {
    state() {
        return {
            index: 0,
            total: 0,
            position_x: 0,
            icon_width: 0,
            screen_width: 0,
        };
    },
    actions: {
        /**
         * 初始化
         * @param index 当前索引
         * @param total 总图标数
         * @param iconWidth 图标宽度
         * @param screenWidth 屏幕宽度
         */
        init(index: number, total: number, iconWidth: number, screenWidth: number): void {
            this.index = index;
            this.total = total;
            this.icon_width = iconWidth;
            this.screen_width = screenWidth;
            this.computedPosition();
            
        },

        /**
         * 获取索引
         * @returns 索引
         */
        getIndex():number {
            return this.index;
        },

        /**
         * 改变索引下标
         * @param index 索引下标
         */
        changeIndex(index: number): void {
            this.index = index;
            this.computedPosition();
        },

        /**
         * 计算最终落点
         */
        computedPosition(): void {
            const s_width = this.screen_width;
            const i_width = this.icon_width;
            let fen = (s_width / this.total);
            let bef = (fen - i_width) / 2;
            this.position_x = (fen * this.index) + bef;
        }
    },
    persist: {// 开启持久化,并进行加密
        storage: encryptStore
    }
});
