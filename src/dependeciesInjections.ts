import {FirebaseAppService} from "@/services/FirebaseAppService";
import {Container} from "@/utils/Container";
import {FirebaseDatabaseService} from "@/services/FirebaseDatabaseService";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import {FirebaseFunctionService} from "@/services/FirebaseFunctionService";

export default function () {
    Container.getInstance().registerClasses({
        FirebaseAppService,
        FirebaseAuthService,
        FirebaseDatabaseService,
        FirebaseFunctionService
    });
}
