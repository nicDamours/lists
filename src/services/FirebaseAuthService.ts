import { getAuth, Auth} from 'firebase/auth'
import {Container} from "@/utils/Container";
import {FirebaseAppService} from "@/services/FirebaseAppService";

export class FirebaseAuthService {
    private readonly _auth: Auth;

    constructor() {
        const app = Container.get<FirebaseAppService>('FirebaseAppService').app;

        this._auth = getAuth(app);
    }

    get auth(): Auth {
        return this._auth;
    }
}
