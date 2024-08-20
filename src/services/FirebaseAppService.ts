import {FirebaseApp, initializeApp} from "firebase/app";

export class FirebaseAppService {
    private readonly _app: FirebaseApp;

    constructor() {
        this._app = initializeApp({
            apiKey: import.meta.env.VITE_APP_FIRESTORE_API_KEY,
            authDomain: import.meta.env.VITE_APP_FIRESTORE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_APP_FIRESTORE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_APP_FIRESTORE_PROJECT_BUCKET,
            messagingSenderId: import.meta.env.VITE_APP_FIRESTORE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_APP_FIRESTORE_APP_ID,
            measurementId: import.meta.env.VITE_APP_FIRESTORE_MEASUREMENT_ID
        });
    }

    get app(): FirebaseApp {
        return this._app;
    }
}
