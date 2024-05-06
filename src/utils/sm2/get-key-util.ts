import {get} from "@/utils/util/http-util";

export const getPublicKey = (finger: string): Promise<MrsResult<string>> => {
    return get('/crypto/v1/getPublicKey', finger);
}
