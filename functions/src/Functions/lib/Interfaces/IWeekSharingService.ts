import {WeekSharingPayload} from "./WeekSharingPayload";


export interface IWeekSharingService {

    sharingAlreadyExists(payload: WeekSharingPayload): Promise<boolean>

    createNewSharingRequest(payload: WeekSharingPayload): Promise<boolean>

    getExistingSharingError(): string;
}
