import {SharingPayload} from "../SharingPayload";

export interface ListSharingPayload extends SharingPayload {
    email: string,
    list: string
}
