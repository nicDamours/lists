import {IListUnSharingService} from "../Interfaces/Lists/IListUnSharingService";
import {ListSharingPayload} from "../Interfaces/Lists/ListSharingPayload";
import {HttpsError} from "../Errors/HttpsError";
import {AbstractAppService} from "./AbstractAppService";

export class ListUnSharingService extends AbstractAppService implements IListUnSharingService {
    async revokeShareRequest(payload: ListSharingPayload, currentUserId: string): Promise<void> {
        const {list, email} = payload;

        const [documentData, relatedUser] = await Promise.all([
            this.app.firestore().doc(`/lists/${list}`).get(),
            this.app.auth().getUserByEmail(email),
        ]);

        const currentlySharedWithUsers: { [key: string]: string } = documentData.get("sharedWith") ?? {};

        if (!currentlySharedWithUsers[relatedUser.uid]) {
            throw new HttpsError("failed-precondition", "this list is not share with this user");
        }

        delete currentlySharedWithUsers[relatedUser.uid];

        await this.app.firestore().doc(`/lists/${list}`).update("sharedWith", currentlySharedWithUsers);
    }

    async assertUnShareRequestPayloadIsValid(payload: ListSharingPayload, currentUserId: string): Promise<void> {
        const {list, email} = payload;
        const documentData = await this.app.firestore().doc(`/lists/${list}`).get();
        if (!documentData.exists) {
            throw new HttpsError("not-found", "list with this id cannot be found");
        }

        const listOwner = documentData.get("user");

        if (listOwner !== currentUserId) {
            throw new HttpsError("failed-precondition", "You don't have access to this list");
        }

        const relatedUser = await this.app.auth().getUserByEmail(email);

        if (relatedUser.uid === currentUserId) {
            throw new HttpsError("failed-precondition", "You cannot unshare a list with yourself");
        }
    }
}
