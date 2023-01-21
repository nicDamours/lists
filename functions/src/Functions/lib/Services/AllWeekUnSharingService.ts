import {AbstractAppService} from "./AbstractAppService";
import {IAllWeekUnSharingService} from "../Interfaces/Weeks/IAllWeekUnSharingService";
import {HttpsError} from "../Errors/HttpsError";
import {WeekUnSharingPayload} from "../Interfaces/Weeks/WeekUnSharingPayload";

export class AllWeekUnSharingService extends AbstractAppService implements IAllWeekUnSharingService {
    async assertUnShareRequestPayloadIsValid(payload: WeekUnSharingPayload, currentUserId: string): Promise<void> {
        const {id} = payload;

        const documentData = await this.app.firestore().doc(`/weekSharing/${id}`).get();

        if (!documentData.exists) {
            throw new HttpsError("not-found", "Share request with this id cannot be found");
        }

        const requestTarget = documentData.get("targetId");
        const requestAuthor = documentData.get("authorId");

        if (requestAuthor !== currentUserId && requestTarget !== currentUserId) {
            throw new HttpsError("failed-precondition", "You don't have access to revoke this request");
        }
    }

    async revokeShareRequest(payload: WeekUnSharingPayload, currentUserId: string): Promise<void> {
        const {id} = payload;

        await this.app.firestore().doc(`/weekSharing/${id}`).delete();
    }
}
