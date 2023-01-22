import {SharingPayload} from "../SharingPayload";

export interface WeekUnSharingPayload extends SharingPayload {
    id: string,
    shareAllWeeks: true
}
