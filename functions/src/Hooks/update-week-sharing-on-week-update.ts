import {getApp} from "../app-instance";
import {DocumentSnapshot} from "firebase-functions/lib/v1/providers/firestore";
import {Change} from "firebase-functions/lib/common/change";

export default async function updateWeekSharingOnWeekUpdate(snapshot: Change<DocumentSnapshot>) {
    const app = getApp();

    const weekAuthor = snapshot.before.get("user");

    const weekSharingCollection = await app.firestore().collection("/weekSharing");

    if (weekSharingCollection.id) {
        const weekSharingForAuthor = await app.firestore().collection("/weekSharing").where("authorId", "==", weekAuthor).get();

        weekSharingForAuthor.forEach(async (weekSharing) => {
            const existingSharingForTarget = await app.firestore().collection(`/weeks/${snapshot.after.id}/sharedWith`).where("userId", "==", weekSharing.get("targetId")).get();

            if (existingSharingForTarget.empty) {
                await app.firestore().collection(`/weeks/${snapshot.before.id}/sharedWith`).add({
                    userId: weekSharing.get("targetId"),
                });
            }
        });
    }
}
