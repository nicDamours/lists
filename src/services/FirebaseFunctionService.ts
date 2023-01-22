import {Container} from "@/utils/Container";
import {FirebaseAppService} from "@/services/FirebaseAppService";
import {connectFunctionsEmulator, Functions, getFunctions} from "firebase/functions";

export class FirebaseFunctionService {
    private readonly _functions: Functions ;

    constructor() {
        const app = Container.get<FirebaseAppService>('FirebaseAppService').app;

        this._functions = getFunctions(app);

        if (process.env.VUE_APP_RUN_PRODUCTION_FUNCTIONS !== "true") {
            connectFunctionsEmulator(this._functions, "localhost", process.env.VUE_APP_FUNCTIONS_EMULATOR_PORT);
        }
    }

    get functions(): Functions {
        return this._functions;
    }
}
