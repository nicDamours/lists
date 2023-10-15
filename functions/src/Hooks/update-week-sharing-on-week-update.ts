import {getApp} from "../app-instance";
import {DocumentSnapshot} from "firebase-functions/lib/v1/providers/firestore";
import {Change} from "firebase-functions/lib/common/change";

export default async function updateWeekSharingOnWeekUpdate(snapshot: Change<DocumentSnapshot>) {
    const app = getApp();

    const weekAuthor = snapshot.after.get("user");

    const weekSharingCollection = await app.firestore().collection("/weekSharing");

    if (weekSharingCollection.id) {
        const weekSharingForAuthor = await app.firestore().collection("/weekSharing").where("authorId", "==", weekAuthor).get();

        const newWeekSharing: { [key: string]: string } = {};

        weekSharingForAuthor.forEach((weekSharing) => {
            const sharingTargetUserId = weekSharing.get("targetId");
            newWeekSharing[sharingTargetUserId] = weekSharing.get("targetEmail");
        });

        await app.firestore().doc(`/weeks/${snapshot.after.id}`).update("sharedWith", newWeekSharing);
    }
}
