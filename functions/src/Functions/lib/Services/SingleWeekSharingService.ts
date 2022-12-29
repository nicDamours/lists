import {app, firestore} from "firebase-admin";
import {ISingleWeekSharingService} from "../Interfaces/Weeks/ISingleWeekSharingService";
import {WeekSharingPayload} from "../Interfaces/Weeks/WeekSharingPayload";
import {HttpsError} from "../Errors/HttpsError";
import {SharingRequestResponsePayload} from "../Interfaces/ShareRequestResponsePayload";
import App = app.App;
import DocumentReference = firestore.DocumentReference;

/**
 * handle single week sharing operation
 */
export class SingleWeekSharingService implements ISingleWeekSharingService<WeekSharingPayload, SharingRequestResponsePayload> {
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
            dates: payload.dates,
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
            .where("startDate", "==", payload.dates.startDate)
            .where("endDate", "==", payload.dates.endDate)
            .get();

        if (!existingWeekSharing.empty) {
            throw new HttpsError("failed-precondition", "You are already sharing this week with this user");
        }

        const existingWeekSharingRequest = await this.app.firestore()
            .collection("shareRequest")
            .where("authorId", "==", currentUserId)
            .where("targetId", "==", targetUser.uid)
            .where("dates.startDate", "==", payload.dates.startDate)
            .where("dates.endDate", "==", payload.dates.endDate)
            .get();

        if (!existingWeekSharingRequest.empty) {
            throw new HttpsError("failed-precondition", "You already sent a request to this user for this week");
        }
    }

    async applyNewShare(payload: SharingRequestResponsePayload, currentUserId: string): Promise<string> {
        const requestID = payload.requestId;

        const payloadShareRequest = await this.app.firestore().doc(`/shareRequest/${requestID}`).get();

        const shareRequestAuthor = payloadShareRequest.get("authorId");

        const shareRequestStartDate = payloadShareRequest.get("dates.startDate");
        const shareRequestEndDate = payloadShareRequest.get("dates.endDate");

        const results = await this.app.firestore().collection("/weekSharing").add({
            type: "week",
            authorId: shareRequestAuthor,
            startDate: shareRequestStartDate,
            endDate: shareRequestEndDate,
            targetId: currentUserId,
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
