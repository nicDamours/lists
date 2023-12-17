import {QueryDocumentSnapshot} from "firebase-functions/lib/v1/providers/firestore";
import {getApp} from "../app-instance";

export default async function addParticipantOnBillGroupCreate(snapshot: QueryDocumentSnapshot) {
    const app = getApp();

    const currentUser = await app.auth().getUser(snapshot.get("participants")[0]);

    await app.firestore().doc(snapshot.ref.path).update("participants", {
        [currentUser.uid]: {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            balances: [],
        },
    });

    await app.firestore().doc(snapshot.ref.path).update("created_by", currentUser.uid);

    await app.firestore().doc(snapshot.ref.path).update("participants_uids", [
        currentUser.uid,
    ]);
}
