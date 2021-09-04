import {FirebaseAppService} from "@/services/FirebaseAppService";
import {Container} from "@/utils/Container";
import {FirebaseDatabaseService} from "@/services/FirebaseDatabaseService";
import { FirebaseAuthService } from "@/services/FirebaseAuthService";

export default function() {
    Container.getInstance().registerClasses({
        FirebaseAppService,
        FirebaseAuthService,
        FirebaseDatabaseService
    });
}
