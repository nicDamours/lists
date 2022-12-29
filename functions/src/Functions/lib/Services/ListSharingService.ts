import {ListSharingPayload} from "../Interfaces/Lists/ListSharingPayload";
import {IListServiceSharing} from "../Interfaces/Lists/IListServiceSharing";
import {app} from "firebase-admin";
import {HttpsError} from "../Errors/HttpsError";
import {SharingRequestResponsePayload} from "../Interfaces/ShareRequestResponsePayload";
import App = app.App;

export class ListSharingService implements IListServiceSharing<ListSharingPayload, SharingRequestResponsePayload> {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    async assertShareRequestPayloadIsValid(payload: ListSharingPayload, currentUserId: string): Promise<void> {
        const documentData = await this.app.firestore().doc(`/lists/${payload.list}`).get();
        if (!documentData.exists) {
            throw new HttpsError(
                "not-found", "list with this id cannot be found");
        }

        const listOwner = documentData.get("user");
        if (listOwner !== currentUserId) {
            throw new HttpsError("failed-precondition",
                "You don't have access to this list");
        }

        const relatedUser = await this.app.auth().getUserByEmail(payload.email);

        if (relatedUser.uid === currentUserId) {
            throw new HttpsError("failed-precondition",
                "You cannot share a list with yourself");
        }

        const currentlySharedWithUsers: { [key: string]: string } = documentData.get("sharedWith") ?? {};

        if (Object.keys(currentlySharedWithUsers).includes(relatedUser.uid)) {
            throw new HttpsError("failed-precondition",
                "This list is already shared with this user");
        }
    }

    async createNewSharingRequest(payload: ListSharingPayload, currentUserId: string): Promise<FirebaseFirestore.DocumentReference<unknown>> {
        const currentUserInfo = await this.app.auth().getUser(currentUserId);

        const documentData = await this.app.firestore().doc(`/lists/${payload.list}`).get();

        const relatedUser = await this.app.auth().getUserByEmail(payload.email);

        return this.app.firestore().collection("/shareRequest").add({
            type: "list",
            authorEmail: currentUserInfo.email,
            authorId: currentUserInfo.uid,
            listId: documentData.id,
            listName: documentData.get("name"),
            targetEmail: relatedUser.email,
            targetId: relatedUser.uid,
        });
    }

    async assertShareRequestIsValid(payload: SharingRequestResponsePayload, currentUserId: string): Promise<void> {
        const requestID = payload.requestId;

        const payloadShareRequest = await this.app.firestore().doc(`/shareRequest/${requestID}`).get();

        if (!payloadShareRequest.exists) {
            throw new HttpsError("not-found", "Share request with this id cannot be found");
        }

        const requestType = payloadShareRequest.get("type");

        if (requestType !== "list") {
            throw new HttpsError("not-found", "Share request with this id cannot be found");
        }

        const requestTarget = payloadShareRequest.get("targetId");

        if (requestTarget !== currentUserId) {
            throw new HttpsError("failed-precondition", "You don't have access to accept this request");
        }

        const list = payloadShareRequest.get("listId");

        const listDocumentData = await this.app.firestore().doc(`/lists/${list}`).get();

        if (!listDocumentData.exists) {
            throw new HttpsError("not-found", "The list associated with this request cannot be found");
        }
    }

    async applyNewShare(payload: SharingRequestResponsePayload, currentUserId: string): Promise<string> {
        const requestID = payload.requestId;

        const payloadShareRequest = await this.app.firestore().doc(`/shareRequest/${requestID}`).get();

        const list = payloadShareRequest.get("listId");

        const listDocumentData = await this.app.firestore().doc(`/lists/${list}`).get();

        const currentlySharedWithUsers: { [key: string]: string } = listDocumentData.get("sharedWith") ?? {};

        const currentUserInfo = await this.app.auth().getUser(currentUserId);

        currentlySharedWithUsers[currentUserId] = currentUserInfo.email || "";

        await this.app.firestore().doc(`/lists/${list}`).update("sharedWith", currentlySharedWithUsers);

        return list;
    }
}
