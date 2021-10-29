import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";

export default function useCurrentUser() {
    const { auth } = Container.get<FirebaseAuthService>('FirebaseAuthService')

    const getCurrentUser = () => {
        return auth.currentUser;
    }

    return {
        getCurrentUser
    }
}
