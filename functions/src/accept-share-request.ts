import * as functions from "firebase-functions";
import {getApp} from "./app-instance";

const acceptShareRequest = functions.https.onCall((data: any, context) => {
  const payload = JSON.parse(data.text);
  if (!context.auth) {
    throw new functions.https.HttpsError("failed-precondition",
        "This function must be called while authenticated");
  }

  const {request} = payload;


  const app = getApp();
  return app.firestore().doc(`/shareRequest/${request}`).get().then((requestDocumentData) => {
    if (!requestDocumentData.exists) {
      throw new functions.https.HttpsError(
          "not-found", "Share request with this id cannot be found");
    }
    const requestTarget = requestDocumentData.get("targetId");

    if (requestTarget !== context.auth?.uid) {
      throw new functions.https.HttpsError("failed-precondition",
          "You don't have access to accept this request");
    }

    const list = requestDocumentData.get("listId");

    return app.firestore().doc(`/lists/${list}`).get().then((listDocumentData) => {
      if (!listDocumentData.exists) {
        throw new functions.https.HttpsError(
            "not-found", "The list associated with this request cannot be found");
      }
      const currentlySharedWithUsers: string[] = listDocumentData.get("sharedWith") ?? [];

      const currentUserId = context.auth?.uid;

      if (currentUserId) {
        currentlySharedWithUsers.push(currentUserId);

        return app.firestore().doc(`/lists/${list}`).update("sharedWith", currentlySharedWithUsers).then(() => {
          return app.firestore().doc(`/shareRequest/${request}`).delete();
        });
      } else {
        throw new functions.https.HttpsError("failed-precondition",
            "This function must be called while authenticated");
      }
    });
  });
});


export default acceptShareRequest;
