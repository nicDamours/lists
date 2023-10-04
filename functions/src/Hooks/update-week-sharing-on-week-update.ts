import {getApp} from "../app-instance";
import {DocumentSnapshot} from "firebase-functions/lib/v1/providers/firestore";
import {Change} from "firebase-functions/lib/common/change";

export default async function updateWeekSharingOnWeekUpdate(snapshot: Change<DocumentSnapshot>) {
    const app = getApp();

    const weekAuthor = snapshot.before.get("user");

    const weekSharingForAuthor = await app.firestore().collection("/weekSharing").where("authorId", "==", weekAuthor).get();

    weekSharingForAuthor.forEach(async (weekSharing) => {
        await app.firestore().collection(`/weeks/${snapshot.before.id}/sharedWith`).add({
            userId: weekSharing.get("targetId"),
        });
    });
}
