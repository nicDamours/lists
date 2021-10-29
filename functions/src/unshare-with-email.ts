import * as functions from "firebase-functions";

import admin = require("firebase-admin");

const unShareWithEmail = functions.https.onCall((data: any, context) => {
  const app = admin.initializeApp();
  const payload = JSON.parse(data.text);
  if (!context.auth) {
    throw new functions.https.HttpsError("failed-precondition",
        "This function must be called while authenticated");
  }

  const {list, email} = payload;
  app.firestore().doc(`/lists/${list}`).get().then((documentData) => {
    const listOwner = documentData.get("user");

    if (listOwner !== context.auth?.uid) {
      throw new functions.https.HttpsError("failed-precondition",
          "You don't have access to this list");
    }

    app.auth().getUserByEmail(email).then((relatedUser) => {
      if (relatedUser.uid === context.auth?.uid) {
        throw new functions.https.HttpsError("failed-precondition",
            "You cannot unshare a list with yourself");
      }

      const currentlySharedWithUsers: string[] = documentData.get("sharedWith") ?? [];

      if (!currentlySharedWithUsers.includes(relatedUser.uid)) {
        throw new functions.https.HttpsError("failed-precondition",
            "this list is not share with this user");
      }

      const updatedSharedWithUsers = currentlySharedWithUsers.filter((value) => value !== relatedUser.uid);

      app.firestore().doc(`/lists/${list}`).update("sharedWith", updatedSharedWithUsers).then(() => {
        console.log("successfully shared list with user");
      });
    }).catch(() => {
      throw new functions.https.HttpsError(
          "not-found", "User with this email cannot be found");
    });
  }).catch(() => {
    throw new functions.https.HttpsError(
        "not-found", "List with this id cannot be found");
  });
});

export default unShareWithEmail;
