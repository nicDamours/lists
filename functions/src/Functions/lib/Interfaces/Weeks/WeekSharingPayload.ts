import {WeekSharingDates} from "./WeekSharingDates";
import {SharingPayload} from "../SharingPayload";

export interface WeekSharingPayload extends SharingPayload {
    email: string,
    dates: WeekSharingDates,
    shareAllWeeks: true
}
