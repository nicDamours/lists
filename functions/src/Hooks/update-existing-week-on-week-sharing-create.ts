import {getApp} from "../app-instance";
import {QueryDocumentSnapshot} from "firebase-functions/lib/v1/providers/firestore";

export default async function updateExistingWeekOnWeekSharingCreate(snapshot: QueryDocumentSnapshot) {
    const app = getApp();

    const sharingAuthorId = snapshot.get("authorId");


    const weeksForAuthor = await app.firestore().collection("/weeks").where("user", "==", sharingAuthorId).get();

    weeksForAuthor.forEach(async (week) => {
        const existingSharingForTarget = await app.firestore().collection(`/weeks/${week.id}/sharedWith`).where("userId", "==", snapshot.get("targetId")).get();

        if (existingSharingForTarget.empty) {
            await app.firestore().collection(`/weeks/${week.id}/sharedWith`).add({
                userId: snapshot.get("targetId"),
            });
        }
    });
}
