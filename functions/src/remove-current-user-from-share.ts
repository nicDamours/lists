import * as functions from "firebase-functions";
import {getApp} from "./app-instance";

const removeCurrentUserFromShare = functions.https.onCall((data: any, context) => {
  const app = getApp();
  const payload = JSON.parse(data.text);
  if (!context.auth) {
    throw new functions.https.HttpsError("failed-precondition",
        "This function must be called while authenticated");
  }

  const currentUserId = context.auth.uid;
  if (currentUserId) {
    const {list} = payload;
    app.firestore().doc(`/lists/${list}`).get().then((documentData) => {
      if (!documentData.exists) {
        throw new functions.https.HttpsError(
            "not-found", "list with this id cannot be found");
      }

      const currentlySharedWithUsers: { [key: string]: string } = documentData.get("sharedWith") ?? {};

      if (!Object.keys(currentlySharedWithUsers).includes(currentUserId)) {
        throw new functions.https.HttpsError("failed-precondition",
            "This list is not shared with you.");
      }

      delete currentlySharedWithUsers[currentUserId];

      app.firestore().doc(`/lists/${list}`).update("sharedWith", currentlySharedWithUsers).then(() => {
        console.log("successfully remove current user from shared list.");
      });
    });
  } else {
    throw new functions.https.HttpsError("failed-precondition",
        "This function must be called while authenticated");
  }
});

export default removeCurrentUserFromShare;
