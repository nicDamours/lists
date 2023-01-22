import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import {computed} from "vue";

export default function useCurrentUser() {
    const {auth} = Container.get<FirebaseAuthService>('FirebaseAuthService')

    const getCurrentUser = () => {
        return auth.currentUser;
    }

    const currentUser = computed(() => {
        return auth.currentUser;
    })

    return {
        currentUser,
        getCurrentUser
    }
}
