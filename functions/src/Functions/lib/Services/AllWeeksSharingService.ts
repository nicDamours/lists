import {app, firestore} from "firebase-admin";
import {WeekSharingPayload} from "../Interfaces/Weeks/WeekSharingPayload";
import {IAllWeeksSharingService} from "../Interfaces/Weeks/IAllWeeksSharingService";
import {HttpsError} from "../Errors/HttpsError";
import {SharingRequestResponsePayload} from "../Interfaces/ShareRequestResponsePayload";
import App = app.App;
import DocumentReference = firestore.DocumentReference;

export class AllWeeksSharingService implements IAllWeeksSharingService<WeekSharingPayload, SharingRequestResponsePayload> {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    async createNewSharingRequest(payload: WeekSharingPayload, currentUserId: string): Promise<DocumentReference<unknown>> {
        const targetUser = await this.app.auth().getUserByEmail(payload.email);

        const currentUser = await this.app.auth().getUser(currentUserId);

        return this.app.firestore().collection("/shareRequest").add({
            type: "week",
            authorEmail: currentUser.email,
            authorId: currentUser.uid,
            allWeeks: true,
            targetEmail: targetUser.email,
            targetId: targetUser.uid,
        });
    }

    async assertShareRequestPayloadIsValid(payload: WeekSharingPayload, currentUserId: string): Promise<void> {
        const targetUser = await this.app.auth().getUserByEmail(payload.email);

        const existingWeekSharing = await this.app.firestore()
            .collection("weekSharing")
            .where("authorId", "==", currentUserId)
            .where("targetId", "==", targetUser.uid)
            .where("allWeeks", "==", true)
            .get();

        if (!existingWeekSharing.empty) {
            throw new HttpsError("failed-precondition",
                "You are already sharing all week with this user");
        }

        const existingWeekSharingRequest = await this.app.firestore()
            .collection("shareRequest")
            .where("authorId", "==", currentUserId)
            .where("targetId", "==", targetUser.uid)
            .where("allWeeks", "==", true)
            .get();

        if (!existingWeekSharingRequest.empty) {
            throw new HttpsError("failed-precondition",
                "You already sent a request to this user");
        }
    }

    async applyNewShare(payload: SharingRequestResponsePayload, currentUserId: string): Promise<string> {
        const requestID = payload.requestId;

        const payloadShareRequest = await this.app.firestore().doc(`/shareRequest/${requestID}`).get();

        const shareRequestAuthor = payloadShareRequest.get("authorId");

        const [authorUser, currentUser] = await Promise.all([
            await this.app.auth().getUser(shareRequestAuthor),
            await this.app.auth().getUser(currentUserId),
        ]);

        const results = await this.app.firestore().collection("/weekSharing").add({
            type: "week",
            authorEmail: authorUser.email,
            authorId: shareRequestAuthor,
            allWeeks: true,
            targetId: currentUserId,
            targetEmail: currentUser.email,
        });

        const insertedData = await results.get();

        return insertedData.id;
    }

    async assertShareRequestIsValid(payload: SharingRequestResponsePayload, currentUserId: string): Promise<void> {
        const requestID = payload.requestId;

        const payloadShareRequest = await this.app.firestore().doc(`/shareRequest/${requestID}`).get();

        if (!payloadShareRequest.exists) {
            throw new HttpsError("not-found", "Share request with this id cannot be found");
        }

        const requestType = payloadShareRequest.get("type");

        if (requestType !== "week") {
            throw new HttpsError("not-found", "Share request with this id cannot be found");
        }

        const requestTarget = payloadShareRequest.get("targetId");

        if (requestTarget !== currentUserId) {
            throw new HttpsError("failed-precondition", "You don't have access to accept this request");
        }
    }
}
