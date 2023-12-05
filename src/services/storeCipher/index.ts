import type { StorageLike } from 'pinia-plugin-persistedstate';
import SecureLS from 'secure-ls';

// 定义加密密钥
const ls = new SecureLS({
    isCompression: false,   // 不进行数据压缩
    encodingType: 'aes',    // 加密算法使用AES
    // 密钥
    encryptionSecret: "101534b0ad-304802416e0ef367d67f96836cb5c7-3df15c0ecg"
});

// pinia的密钥对象
export const encryptStore: StorageLike = {
    setItem(key: string, value: string): void {
        ls.set(key, value);
    },
    getItem(key: string): string | null {
        return ls.get(key);
    }
}