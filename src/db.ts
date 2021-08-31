import { getFirestore} from 'firebase/firestore'
import getAppInstance from "@/app";

// Get a Firestore instance
export default function getDatabaseInstance() {
    if(!('firebaseDB' in window)) {
        (window as any).firebaseDB = getFirestore(getAppInstance())
    }

    return (window as any).firebaseDB
}
