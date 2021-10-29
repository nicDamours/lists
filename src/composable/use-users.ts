import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";
import { fetchSignInMethodsForEmail } from "firebase/auth";


export default function useUsers() {
    const doesUserExists = async (email: string) => {
        try {
            const { auth } = Container.get<FirebaseAuthService>('FirebaseAuthService');

            const signInMethods = await fetchSignInMethodsForEmail(auth, email);

            return signInMethods.length > 0;
        } catch(e) {
            console.error(e);
            return false;
        }
    }

    return {
        doesUserExists
    }
}
