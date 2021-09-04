import {onAuthStateChanged} from "firebase/auth";
import useAuthentication from "@/composable/use-authentication";
import firebase from "firebase/compat";
import User = firebase.User;
import {isPlatform} from "@ionic/vue";
import {FirebaseAuthentication} from "@ionic-native/firebase-authentication";
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";

export default function useBindAuthentication(): Promise<User> {
    const {showAuthenticationModal} = useAuthentication();
    const auth = Container.get<FirebaseAuthService>('FirebaseAuthService').auth

    const authenticationCallback = (resolve: Function) => async (user: any) => {
        console.log('in callback')
        if (user === null) {
            await showAuthenticationModal()
        }

        user = auth.currentUser
        resolve(user as User);
    };


    console.log('before promise');
    return new Promise(resolve => {
        if (isPlatform('ios') || isPlatform('android')) {
            FirebaseAuthentication.getCurrentUser().then((user) => {
                console.log('user', user);
                return authenticationCallback(resolve)
            });

            FirebaseAuthentication.onAuthStateChanged().toPromise().then(authenticationCallback(resolve));

        } else {
            onAuthStateChanged(auth, authenticationCallback(resolve));
        }
    })
}
