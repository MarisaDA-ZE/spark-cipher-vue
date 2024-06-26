import Fingerprint2 from 'fingerprintjs2';
import {C_CONTENT_HEIGHT, MRS_REGEXPS} from "@/common/constant";

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
 * 格式化给定的日期对象为指定格式的字符串。
 *
 * @param {Date} date - 要格式化的日期对象，默认为当前时间。
 * @param {string} format - 输出的日期时间格式，默认为 "yyyy-MM-dd hh:mm:ss"。
 * @returns {string} - 格式化后的日期时间字符串。
 */
export const formatTime = (date = new Date(), format = "yyyy-MM-dd hh:mm:ss"): string => {
    const fullYear = date.getFullYear();
    // 定义日期和时间格式化映射
    const formatMap: any = {
        "YY": fullYear.toString().slice(-2),
        "yyyy": fullYear,
        "MM": String(date.getMonth() + 1).padStart(2, "0"),
        "dd": String(date.getDate()).padStart(2, "0"),
        "hh": String(date.getHours()).padStart(2, "0"),
        "mm": String(date.getMinutes()).padStart(2, "0"),
        "ss": String(date.getSeconds()).padStart(2, "0"),
    };
    // 使用正则表达式替换对应格式占位符
    return format.replace(/YY|yyyy|MM|dd|hh|mm|ss/g, match => formatMap[match]);
}

/**
 * 判断一个字符串是否是一个可访问链接
 * @param url   url字符串
 * @return boolean 是否可访问
 */
export const isURL = (url: string | null | undefined): boolean => {
    if (!url) return false;
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].\S*$/i;
    return urlPattern.test(url);
}

/**
 * 获取当前设备指纹
 * Tips: 设备指纹每次刷新时都会变化
 */
export const getDeviceFingerprint = (): Promise<string | null> => {
    return new Promise<string | null>(resolve => {
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
 * 获取当前内容区域的高度
 */
export const getCurrentContentHeight = (): number => {
    const h: string | null = sessionStorage.getItem(C_CONTENT_HEIGHT);
    if (h) {
        return parseFloat(h);
    }
    return 0;
}


/**
 * 替换超出字符串
 * @param text {string}  要处理的字符串
 * @param size {number}  超出的长度
 * @param defaultVal {string}  如果text为空，则返回的默认值
 * @param overflow {string}  溢出部分显示为
 * @return {string}  处理后的结果
 */
export const stringReplace = (text: string | undefined, size: number = 8, defaultVal: string = '暂无数据', overflow: string = "..."): string => {
    if (isEmpty(text) || !text) return defaultVal;
    if (text.length > size) {
        return text.substring(0, size) + overflow;
    }
    return text;
}

/**
 * 判断字符串是否为空（包括空字符串、null、undefined）
 *
 * @param {string | null | undefined} str 待检查的字符串
 * @returns {boolean} 如果字符串为空返回 true，否则返回 false
 */
export const isBlank = (str: string | null | undefined): boolean => {
    return str === null || str === undefined || str.trim().length === 0;
}

/**
 * 将对象中的键按sort值进行排序
 * @param record{PasswordRecord}    记录
 * @param sort  {string}    排序字段
 */
export const recordKeySortDeep = (record: PasswordRecord | null, sort: string = 'sort'): (string | null) [] => {
    if (record === null) return [];
    const keys = Object.keys(record);
    const recordItems: (PasswordRecordItem | string | number | null) [] = [];
    for (let key of keys) {
        const value = (record as any)[key];
        if (key !== 'customs') {
            recordItems.push(value)
        } else {
            if (value !== null) recordItems.push(...value);
        }
    }
    let sorted = recordItems.sort((a, b) => {
        if (a == null || typeof a === 'string' || typeof a === 'number') return 1;
        if (b == null || typeof b === 'string' || typeof b === 'number') return -1;
        return (a as any)[sort] - (b as any)[sort];
    });
    return sorted.map((e: PasswordRecordItem | string | number | null) => {
        if (e == null || typeof e === 'string' || typeof e === 'number') return null;
        return e.key;
    });
}

interface TimeDifference {
    value: number;
    unit: string;
}

/**
 * 计算当前时间与传入时间之间的时间差
 * @param lastTime  时间差（时间戳）
 */
function computeTimeDifference(lastTime: number): TimeDifference {
    const now = Date.now();
    const differenceMs = now - lastTime;

    if (differenceMs < 60_000) {
        return {value: 0, unit: '分钟'};
    }

    const differenceMinutes = Math.floor(differenceMs / 60_000);
    if (differenceMinutes < 60) {
        return {value: differenceMinutes, unit: '分钟'};
    }

    const differenceHours = Math.floor(differenceMinutes / 60);
    if (differenceHours < 24) {
        return {value: differenceHours, unit: '小时'};
    }

    const differenceDays = Math.floor(differenceHours / 24);
    return {value: differenceDays, unit: '天'};
}

/**
 * 将时间差格式化为可读字符串
 * @param diff  时间差
 */
function formatTimeDifference(diff: TimeDifference): string {
    const {value, unit} = diff;
    if (value === 0) return '刚刚';
    return `${value}${unit}前`;
}

/**
 * 计算时间差
 * <p>计算当前时间和传入时间的时间差</p>
 * @param lastTime  时间戳
 */
export const computedDiffTime = (lastTime: number): string => {
    // console.log(lastTime, new Date().getTime());
    const timeDifference = computeTimeDifference(lastTime);
    return formatTimeDifference(timeDifference);
};

/**
 * 获取[x,y]范围的随机数
 * @param max   最大值
 * @param min   最小值（默认0）
 * @return {number} 随机数
 */
export const getRandomInteger = (max: number, min: number = 0): number => {
    const random: number = Math.random() * (max - min + 1) + min;
    return parseInt(String(random));
}

/**
 * 函数防抖
 * @param func  要实现防抖的函数
 * @param wait  抖动的间隔
 * @return {(function(): void)|*}   .
 */
let debounceTimer: NodeJS.Timeout | null = null;
export const mrsDebounce = <T extends () => void>(func: T, wait: number):Function => {
    return function thisContext(this: ThisType<T>) {
        const context = this as ThisType<T>;
        const args = arguments as unknown as Parameters<T>;
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    }
}

/**
 * 函数节流
 * @param func  要实现节流的函数
 * @param interval  节流间隔
 * @return {function(*=, *=): *}  节流后的函数
 */

let throttleLastExec: number = 0;
let throttleTimerId: NodeJS.Timeout | null = null;

export const mrsThrottle = <T extends () => void>(func: T, interval: number): Function => {
    return function (this: ThisType<T>) {
        const args = arguments as unknown as Parameters<T>;
        const now = Date.now();

        if (now - throttleLastExec >= interval) {
            func.apply(this, args);
            throttleLastExec = now;
        } else {
            if (throttleTimerId) clearTimeout(throttleTimerId);
            throttleTimerId = setTimeout(() => {
                func.apply(this, args);
                throttleLastExec = now;
            }, interval - (now - throttleLastExec));
        }
    };
};


/**
 * 判断一个字符串是否是电话号码
 * @param phone
 */
export const isPhone = (phone: string | null | undefined):boolean => {
    if(!phone || isBlank(phone)) return false;
    if (phone.length != 11) return false;
    return MRS_REGEXPS.PHONE.test(phone);
}

/**
 * 判断一个字符串是否是邮箱
 * @param mail
 */
export const isEmail = (mail: string | null | undefined):boolean => {
    if (!mail || isBlank(mail)) return false;
    if (mail.length > 64) return false;
    return MRS_REGEXPS.EMAIL.test(mail);
}

/**
 * 清除所有缓存
 */
export const clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
}
