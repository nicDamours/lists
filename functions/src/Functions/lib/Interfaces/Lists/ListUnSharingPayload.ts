import {SharingPayload} from "../SharingPayload";

export interface ListUnSharingPayload extends SharingPayload {
    email: string,
    list?: string
}
