import {AbstractAppService} from "./AbstractAppService";
import {ISingleWeekUnSharingService} from "../Interfaces/Weeks/ISingleWeekUnSharingService";
import {WeekUnSharingPayload} from "../Interfaces/Weeks/WeekUnSharingPayload";

export class SingleWeekUnSharingService extends AbstractAppService implements ISingleWeekUnSharingService {
    assertUnShareRequestPayloadIsValid(payload: WeekUnSharingPayload, currentUserId: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    revokeShareRequest(payload: WeekUnSharingPayload, currentUserId: string): Promise<void> {
        return Promise.resolve(undefined);
    }
}
