import {getApp} from "../app-instance";
import {QueryDocumentSnapshot} from "firebase-functions/lib/v1/providers/firestore";

export default async function updateExistingWeekOnWeekSharingCreate(snapshot: QueryDocumentSnapshot) {
    const app = getApp();

    const sharingAuthorId = snapshot.get("authorId");

    const weeksForAuthor = await app.firestore().collection("/weeks").where("user", "==", sharingAuthorId).get();

    const weekSharingTargetId = snapshot.get("targetId");
    const weekSharingTargetEmail = snapshot.get("targetEmail");

    await weeksForAuthor.forEach(async (week) => {
        const existingSharingForTarget = week.get("sharedWith");

        if (!(weekSharingTargetId in existingSharingForTarget)) {
            existingSharingForTarget[weekSharingTargetId] = weekSharingTargetEmail;

            await app.firestore().doc(`/weeks/${week.id}`).update("sharedWith", existingSharingForTarget);
        }
    });
}
