import getAuthInstance from "@/auth"
import { onAuthStateChanged } from "firebase/auth";
import useAuthentication from "@/composable/use-authentication";
import firebase from "firebase/compat";
import User = firebase.User;

export default function useBindAuthentication(): Promise<User> {
    const { showAuthenticationModal } = useAuthentication();

    return new Promise(resolve => {
        onAuthStateChanged(getAuthInstance(), async user => {
            if(!user) {
                await showAuthenticationModal()
            }

            resolve(getAuthInstance().currentUser as User);
        });
    })
}
