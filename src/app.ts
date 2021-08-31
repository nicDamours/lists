import {initializeApp} from "firebase/app";

export default function getAppInstance() {
    if(!('firebaseApp' in window)) {
        (window as any).firebaseApp = initializeApp({
            apiKey: process.env.VUE_APP_FIRESTORE_API_KEY,
            authDomain: process.env.VUE_APP_FIRESTORE_AUTH_DOMAIN,
            projectId: process.env.VUE_APP_FIRESTORE_PROJECT_ID,
            storageBucket: process.env.VUE_APP_FIRESTORE_PROJECT_BUCKET,
            messagingSenderId: process.env.VUE_APP_FIRESTORE_MESSAGING_SENDER_ID,
            appId: process.env.VUE_APP_FIRESTORE_APP_ID,
            measurementId: process.env.VUE_APP_FIRESTORE_MEASUREMENT_ID
        });
    }

    return (window as any).firebaseApp
}
