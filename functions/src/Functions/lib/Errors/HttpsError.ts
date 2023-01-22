import {FunctionsErrorCode} from "firebase-functions/lib/common/providers/https";

export class HttpsError extends Error {
    public code: FunctionsErrorCode;

    constructor(code: FunctionsErrorCode, message: string) {
        super(message);
        this.code = code;
    }
}
