import {QueryDocumentSnapshot} from "firebase-functions/lib/v1/providers/firestore";
import {getApp} from "../app-instance";

export default async function removeTargetIdFromWeekSharingOnWeekSharingDelete(snapshot: QueryDocumentSnapshot) {
    const app = getApp();

    const sharingAuthorId = snapshot.get("authorId");
    const sharingTargetId = snapshot.get("targetId");

    const weeksForAuthor = await app.firestore().collection("/weeks").where("user", "==", sharingAuthorId).get();

    await weeksForAuthor.forEach(async (week) => {
        const weekExistingSharing = week.get("sharedWith");

        if (sharingTargetId in week.get("sharedWith")) {
            delete weekExistingSharing[sharingTargetId];

            await app.firestore().doc(`/weeks/${week.id}`).update("sharedWith", weekExistingSharing);
        }
    });
}
