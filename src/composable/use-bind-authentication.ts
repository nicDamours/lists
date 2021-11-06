import {onAuthStateChanged} from "firebase/auth";
import useAuthentication from "@/composable/use-authentication";
import firebase from "firebase/compat";
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import User = firebase.User;

export default function useBindAuthentication(): Promise<User> {
    const {showAuthenticationModal} = useAuthentication();
    const auth = Container.get<FirebaseAuthService>('FirebaseAuthService').auth

    const authenticationCallback = (resolve: Function) => async (user: any) => {
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
