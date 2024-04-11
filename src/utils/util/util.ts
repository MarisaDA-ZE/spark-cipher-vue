import Fingerprint2 from 'fingerprintjs2';
import {RouteMeta, useRouter} from "vue-router";
import {C_CONTENT_HEIGHT} from "@/common/constant";

/**
 * 判断空
 * @param val
 * @returns {boolean}
 */
export const isEmpty = (val: any): boolean => {
    if (val === null || val === undefined) return true;
    if (val === "") return true;
    const empty = {};
    if (val === empty) return true;
    return val.length === 0 || val.toString() === "<empty string>";
}

/**
 * 判断非空
 * @param val
 * @returns {boolean}
 */
export const isNotEmpty = (val: any): boolean => {
    return !isEmpty(val);
}

/**
 * 正则校验
 * @param text 被校验的内容
 * @param regExp 正则表达式
 */
export const regVerify = (text: string | undefined, regExp: RegExp): boolean => {
    if (!text) return false;
    const e = new RegExp(regExp);
    return e.test(text);
};

/**
 * 获取当前设备指纹
 * Tips: 设备指纹每次刷新时都会变化
 */
export const getDeviceFingerprint = (): Promise<string | undefined> => {
    return new Promise<string | undefined>(resolve => {
        let excludes = {};
        let options = {
            excludes: excludes
        };
        Fingerprint2.get(options, function (components: any[]) {
            // 参数
            const values: any[] = components.map(function (component) {
                return component.value
            });
            // 指纹
            const murmur: string = Fingerprint2.x64hash128(values.join(''), 31);
            resolve(murmur);
        });
    });
};

/**
 * 计算当前的可用视口高度
 */
export const computedHeightByRoute = (route: RouteMeta): number => {
    const router = useRouter();
    console.log(router);
    return 0;
}

/**
 * 获取当前内容区域的高度
 */
export const getCurrentContentHeight = (): number => {
    const h: string | null = sessionStorage.getItem(C_CONTENT_HEIGHT);
    if (h) {
        return parseFloat(h);
    }
    return 0;
}