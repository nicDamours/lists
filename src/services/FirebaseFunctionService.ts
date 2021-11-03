import {Container} from "@/utils/Container";
import {FirebaseAppService} from "@/services/FirebaseAppService";
import { getFunctions, connectFunctionsEmulator, Functions} from "firebase/functions";

export class FirebaseFunctionService {
    private readonly _functions: Functions ;

    constructor() {
        const app = Container.get<FirebaseAppService>('FirebaseAppService').app;

        this._functions = getFunctions(app);
        console.log('use remote functions', process.env)
        if(!process.env.VUE_APP_RUN_PRODUCTION_FUNCTIONS) {
            connectFunctionsEmulator(this._functions, "localhost", 5001);
        }
    }

    get functions(): Functions {
        return this._functions;
    }
}
