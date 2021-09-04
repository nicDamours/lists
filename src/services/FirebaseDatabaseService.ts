import { getFirestore, Firestore } from 'firebase/firestore'
import {Container} from "@/utils/Container";
import {FirebaseAppService} from "@/services/FirebaseAppService";

export class FirebaseDatabaseService {
    private readonly _db: Firestore;

    constructor() {
        const app = Container.get<FirebaseAppService>('FirebaseAppService').app;

        this._db = getFirestore(app);
    }

    get db(): Firestore {
        return this._db;
    }
}
