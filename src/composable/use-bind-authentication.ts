import {onAuthStateChanged} from "firebase/auth";
import useAuthentication from "@/composable/use-authentication";
import firebase from "firebase/compat";
import User = firebase.User;
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";

export default function useBindAuthentication(): Promise<User> {
    const {showAuthenticationModal} = useAuthentication();
    const auth = Container.get<FirebaseAuthService>('FirebaseAuthService').auth

    const authenticationCallback = (resolve: (value: any | PromiseLike<any>) => void) => async (user: any) => {
        if (user === null) {
            await showAuthenticationModal()
        }

        user = auth.currentUser
        resolve(user as User);
    };

    return new Promise(resolve => {
        onAuthStateChanged(auth, authenticationCallback(resolve));
    })
}
