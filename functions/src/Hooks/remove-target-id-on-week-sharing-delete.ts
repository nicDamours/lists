import {QueryDocumentSnapshot} from "firebase-functions/lib/v1/providers/firestore";
import {getApp} from "../app-instance";

export default async function removeTargetIdFromWeekSharingOnWeekSharingDelete(snapshot: QueryDocumentSnapshot) {
    const app = getApp();

    const sharingAuthorId = snapshot.get("authorId");

    const weeksForAuthor = await app.firestore().collection("/weeks").where("user", "==", sharingAuthorId).get();

    await weeksForAuthor.forEach(async (week) => {
        const sharingForTargetUser = await app.firestore().collection(`/weeks/${week.id}/sharedWith`).where("userId", "==", snapshot.get("targetId")).get();

        await sharingForTargetUser.forEach(async (sharing) => {
            await app.firestore().doc(`/weeks/${week.id}/sharedWith/${sharing.id}`).delete();
        });
    });
}
