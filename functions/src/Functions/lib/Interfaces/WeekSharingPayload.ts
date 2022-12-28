import {WeekSharingDates} from "./WeekSharingDates";

export interface WeekSharingPayload {
    email: string,
    dates: WeekSharingDates,
    shareAllWeeks: true
}
