import * as functions from "firebase-functions";
import {getApp} from "./app-instance";
import {firestore} from "firebase-admin/lib/firestore";
import DocumentSnapshot = firestore.DocumentSnapshot;
import DocumentData = firestore.DocumentData;
import {auth} from "firebase-admin/lib/auth";
import UserRecord = auth.UserRecord;

const shareWithEmail = functions.https.onCall((data: any, context) => {
  const payload = JSON.parse(data.text);
  if (!context.auth) {
    throw new functions.https.HttpsError("failed-precondition",
        "This function must be called while authenticated");
  }

  const {list, email} = payload;

  const app = getApp();

  return app.firestore().doc(`/lists/${list}`).get().then((documentData: DocumentSnapshot<DocumentData>) => {
    if (!documentData.exists) {
      throw new functions.https.HttpsError(
          "not-found", "list with this id cannot be found");
    }

    const listOwner = documentData.get("user");

    if (listOwner !== context.auth?.uid) {
      throw new functions.https.HttpsError("failed-precondition",
          "You don't have access to this list");
    }

    return app.auth().getUserByEmail(email).then((relatedUser:UserRecord) => {
      if (relatedUser.uid === context.auth?.uid) {
        throw new functions.https.HttpsError("failed-precondition",
            "You cannot share a list with yourself");
      }

      const currentlySharedWithUsers: string[] = documentData.get("sharedWith") ?? [];

      if (currentlySharedWithUsers.includes(relatedUser.uid)) {
        throw new functions.https.HttpsError("failed-precondition",
            "This list is already shared with this user");
      }

      const currentUserId = context.auth?.uid;
      if (currentUserId) {
        return app.auth().getUser(currentUserId).then((currentUserInfo) => {
          return app.firestore().collection("/shareRequest").add({
            authorEmail: currentUserInfo.email,
            authorId: currentUserInfo.uid,
            listId: documentData.id,
            listName: documentData.get("name"),
            targetEmail: relatedUser.email,
            targetId: relatedUser.uid,
          });
        });
      } else {
        throw new functions.https.HttpsError("failed-precondition",
            "This function must be called while authenticated");
      }
    });
  });
});

export default shareWithEmail;
