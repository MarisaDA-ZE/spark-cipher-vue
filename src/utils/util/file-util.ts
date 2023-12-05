// @ts-ignore
import SparkMD5 from "spark-md5";

import { post, put } from "./http-util";

const chunkSize: number = 5 * 1024 * 1024;  // 分片大小为5MB
type FileInfo = {
    name: string,
    type: string,
    size: number,
    md5: string | null,
    count: number,
    nameList: Array<string>
}

type MrsFileList = {
    fileInfo: FileInfo,
    blobList: Array<Blob>
}

/**
 * 生成文件的MD5值
 * @param file  文件
 * @return Promise<string | null>   返回结果
 */
export const readFileMD5 = (file: File | Blob): Promise<string | null> => {
    return new Promise<string>((resolve, reject) => {
        const fileReader: FileReader = new FileReader();
        const md5: SparkMD5 = new SparkMD5();
        let index: number = 0;
        const loadFile = (): void => {
            const slice = file.slice(index, index + chunkSize);
            fileReader.readAsBinaryString(slice);
        }
        loadFile();
        fileReader.onload = (reader: ProgressEvent<FileReader>) => {
            if (reader?.target) {
                const res: string | ArrayBuffer | null = reader.target.result;
                if (res != null) {
                    md5.appendBinary(res.toString());
                    if (index < file.size) {
                        index += chunkSize;
                        loadFile();
                    } else {
                        const md5Val = md5.end();
                        return resolve(md5Val);
                    }
                }
            }
        }
        fileReader.onerror = () => {
            reject(null);
        }
    });
}

/**
 * 分片上传文件
 * @param file  文件数据
 */
export const zoneUpload = async (file: File) => {
    const fileInfoURL: string = "/videos/upload/fileInfo";
    const fileBlobsURL: string = "/videos/upload/chunkFile";
    // 文件切片
    const fileList: MrsFileList | null = await zoneFile(file);
    if (fileList != null) {
        // 首先上传文件整体信息
        const { fileInfo } = fileList;
        const { blobList } = fileList;
        console.log(fileInfo);
        const fileInfoBase64: string = window.btoa(JSON.stringify(fileInfo));
        post(fileInfoURL, fileInfoBase64).then(res => {
            console.log("文件头信息: ", res);
            if (res.code === 200) {
                const uploadNameList: Array<string> = res.data;
                if (uploadNameList != null) {
                    if (uploadNameList.length > 0) {
                        uploadNameList.forEach(uploadName => {
                            fileInfo.nameList.find((name: string, index: number) => {
                                if (name === uploadName) {
                                    const data = new FormData();
                                    data.append("md5", name);
                                    data.append("file", blobList[index]);
                                    console.log(data);
                                    put(fileBlobsURL, data, { "Content-Type": "text/plain" }).then(result => {
                                        console.log(index, result);
                                    });
                                }
                            });
                        });
                    } else {
                        console.log("文件片段已全部上传!");
                    }
                } else {
                    console.log("错误");
                }
            } else {
                console.log("文件信息有误!");
            }
        });
    }
}

/**
 * 将文件转化为Blob,并切开
 * @param file  文件
 * @return MrsFileList | null   自定义切片集合 | 空
 */
export const zoneFile = async (file: File): Promise<MrsFileList | null> => {
    const fileName = file.name;
    const fileType = file.type;
    const fileSize = file.size;
    const fileMD5: string | null = await readFileMD5(file);
    // 原文件的基本信息
    const fileInfo: FileInfo = {
        name: fileName,
        type: fileType,
        md5: fileMD5,
        size: fileSize,
        count: 0,
        nameList: new Array<string>()
    };
    // 根据文件大小切片总数
    let totalPieces: number = Math.ceil(fileSize / chunkSize);
    fileInfo.count = totalPieces;
    let index: number = 0;
    // 切片列表
    const blobList = new Array<Blob>();
    while (totalPieces) {
        const blob: Blob = file.slice(index, index + chunkSize);
        const blobName = await readFileMD5(blob);
        // Blob切片单体信息
        blobList.push(blob);
        if (blobName) fileInfo.nameList.push(blobName);
        totalPieces -= 1;
        index += chunkSize;
    }
    return {
        fileInfo: fileInfo,
        blobList: blobList
    };
}


