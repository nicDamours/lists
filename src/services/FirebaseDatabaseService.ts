import {connectFirestoreEmulator, Firestore, getFirestore} from 'firebase/firestore'
import {Container} from "@/utils/Container";
import {FirebaseAppService} from "@/services/FirebaseAppService";

export class FirebaseDatabaseService {
    private readonly _db: Firestore;

    constructor() {
        const app = Container.get<FirebaseAppService>('FirebaseAppService').app;

        this._db = getFirestore(app);

        if (process.env.VUE_APP_RUN_PRODUCTION_FUNCTIONS !== "true") {
            connectFirestoreEmulator(this._db, "localhost", process.env.VUE_APP_FIRESTORE_EMULATOR_PORT)
        }
    }

    get db(): Firestore {
        return this._db;
    }
}
