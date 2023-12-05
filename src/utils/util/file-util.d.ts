export declare type FileInfo = {
    name: string,
    type: string,
    size: number,
    count: number,
    nameList: Array<string>
}

export declare type MrsFileList = {
    fileInfo: FileInfo,
    blobList: Array<Blob>
}