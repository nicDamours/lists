import getAuthInstance from "@/auth"
import { onAuthStateChanged } from "firebase/auth";
import useAuthentication from "@/composable/use-authentication";
import firebase from "firebase/compat";
import User = firebase.User;

export default function useBindAuthentication(): Promise<User> {
    const { showAuthenticationModal } = useAuthentication();
    const authenticationInstance = getAuthInstance();
    return new Promise(resolve => {
        onAuthStateChanged(authenticationInstance, async user => {
            if(user === null) {
                await showAuthenticationModal()
            }

            user = authenticationInstance.currentUser
            resolve(user as User);
        });
    })
}
