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
export const isBank = (val: string| null): boolean => {
    let strLength: number = 0;
    if (val !== null && (strLength = val.length) != 0) {
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
 * @return string | null
 */
export const base64Encode = (str: string): string | null => {
    if (isEmpty(str)) return null;
    return window.btoa(str);
}
