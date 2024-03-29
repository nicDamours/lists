import {Auth, connectAuthEmulator, getAuth} from 'firebase/auth'
import {Container} from "@/utils/Container";
import {FirebaseAppService} from "@/services/FirebaseAppService";

export class FirebaseAuthService {
    private readonly _auth: Auth;

    constructor() {
        const app = Container.get<FirebaseAppService>('FirebaseAppService').app;

        this._auth = getAuth(app);

        if (process.env.VUE_APP_RUN_PRODUCTION_FUNCTIONS !== "true") {
            connectAuthEmulator(this._auth, process.env.VUE_APP_AUTH_EMULATOR_URL)
        }
    }

    get auth(): Auth {
        return this._auth;
    }
}
