import Fingerprint2 from 'fingerprintjs2';

export const whitespaceArray: Array<number> = [10, 13, 32];

/**
 * 判断空
 * @param val
 * @returns {boolean}
 */
export const isEmpty = (val: any): boolean => {
    if (val === null || val === undefined) return true;
    if (val === "") return true;
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
 * 判断字符串是否为空
 * @returns 是否为空
 */
export const isBank = (val: string | null | undefined): boolean => {
    let strLength: number = 0;
    if (val && (strLength = val.length) != 0) {
        for (let i = 0; i < strLength; ++i) {
            const isSpace: number = whitespaceArray.indexOf(val.charCodeAt(i));
            if (isSpace === -1) {
                return false;
            }
        }
        return true;
    } else {
        return true;
    }
}

/**
 * base64编码
 * @param str
 * @return .
 */
export const base64Encode = (str: string): string | undefined => {
    if (isEmpty(str)) return undefined;
    return window.btoa(str);
}

/**
 * 正则校验
 * @param text 被校验的内容
 * @param regExp 正则表达式
 */
export const regVerify = (text: string | undefined, regExp: RegExp): boolean => {
    if (typeof text === "undefined") return false;
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
